import type { PaymentAdapter } from "@payloadcms/plugin-ecommerce/types";
import type Stripe from "stripe";

import {
  type SnapshotItem,
  getStripe,
  normalizeEmail,
  relationID,
  serializeItems,
  toOrderAddress,
} from "./shared";

type Props = { secretKey?: string };

/**
 * Verifies a paid Checkout Session against its pending Transaction, then hands settlement to
 * the plugin's finalizeOrder (atomic transaction claim, order creation, inventory decrement).
 *
 * Called by the plugin's /confirm-order endpoint, both from the return page and from the
 * webhook. finalizeOrder is idempotent across concurrent callers, so either may arrive first.
 */
export const confirmOrder =
  ({ secretKey }: Props): PaymentAdapter["confirmOrder"] =>
  async ({ data, finalizeOrder, req, transactionsSlug = "transactions" }) => {
    const { payload } = req;
    const stripe = getStripe(secretKey);
    const checkoutSessionID = data.checkoutSessionID;

    if (
      typeof checkoutSessionID !== "string" ||
      !checkoutSessionID.startsWith("cs_")
    ) {
      throw new Error("Checkout Session ID is required.");
    }

    try {
      const found = await payload.find({
        collection: transactionsSlug as "transactions",
        depth: 0,
        limit: 2,
        pagination: false,
        req,
        where: { "stripe.checkoutSessionID": { equals: checkoutSessionID } },
      });
      const transaction = found.docs.length === 1 ? found.docs[0] : undefined;
      if (!transaction) {
        throw new Error(
          "Expected exactly one transaction for this Checkout Session.",
        );
      }

      const session =
        await stripe.checkout.sessions.retrieve(checkoutSessionID);
      const lineItems = await stripe.checkout.sessions.listLineItems(
        checkoutSessionID,
        {
          limit: 100,
          expand: ["data.price.product"],
        },
      );

      verify({
        data,
        lineItems: lineItems.data,
        session,
        transaction,
        user: req.user,
      });

      const amount = session.amount_total as number;
      const purchaser = req.user
        ? { customer: req.user.id }
        : { customerEmail: normalizeEmail(data.customerEmail) };

      // The pending amount was pre-tax and pre-shipping; record what was actually charged.
      if (transaction.amount !== amount) {
        await payload.update({
          collection: transactionsSlug as "transactions",
          id: transaction.id,
          data: { amount },
          req,
        });
      }

      const order = await finalizeOrder({
        orderData: {
          amount,
          currency: transaction.currency,
          ...purchaser,
          items: transaction.items,
          shippingAddress: toOrderAddress(
            session.collected_information?.shipping_details,
          ),
          status: "processing",
        },
        transactionID: transaction.id,
      });

      return {
        message: "Order confirmed",
        orderID: order.id as string,
        transactionID: transaction.id,
        ...(typeof order.accessToken === "string"
          ? { accessToken: order.accessToken }
          : {}),
      };
    } catch (error) {
      payload.logger.error({
        err: error,
        msg: "Error confirming Stripe Checkout Session order",
      });
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unknown error confirming order",
      );
    }
  };

type VerifyArgs = {
  data: Record<string, unknown>;
  lineItems: Stripe.LineItem[];
  session: Stripe.Checkout.Session;
  transaction: {
    cart?: unknown;
    currency?: string | null;
    customer?: unknown;
    customerEmail?: string | null;
    items?: unknown;
    status?: string | null;
  };
  user: { id: unknown } | null | undefined;
};

const verify = ({
  data,
  lineItems,
  session,
  transaction,
  user,
}: VerifyArgs) => {
  if (session.status !== "complete" || session.payment_status !== "paid") {
    throw new Error("Payment not completed.");
  }
  if (typeof session.amount_total !== "number" || session.amount_total <= 0) {
    throw new Error("Checkout Session has no settled amount.");
  }

  const cartID = relationID(data.cartID);
  if (
    !cartID ||
    cartID !== relationID(transaction.cart) ||
    cartID !== session.metadata?.cartID
  ) {
    throw new Error("Cart does not match the transaction.");
  }

  if (
    !session.currency ||
    session.currency.toUpperCase() !== transaction.currency
  ) {
    throw new Error("Currency does not match the transaction.");
  }

  const transactionCustomer = relationID(transaction.customer);
  if (user) {
    if (transactionCustomer !== relationID(user.id)) {
      throw new Error("Customer does not match the transaction.");
    }
  } else {
    if (transactionCustomer)
      throw new Error("Guest confirmation for a customer transaction.");
    const email = normalizeEmail(data.customerEmail);
    if (!email || email !== normalizeEmail(transaction.customerEmail)) {
      throw new Error("Email does not match the transaction.");
    }
    if (
      email !==
      normalizeEmail(session.customer_details?.email ?? session.customer_email)
    ) {
      throw new Error("Email does not match the Checkout Session.");
    }
  }

  const charged: SnapshotItem[] = lineItems.map((li) => {
    const product = li.price?.product;
    const meta =
      product && typeof product === "object" && "metadata" in product
        ? product.metadata
        : {};
    if (!meta.productID || typeof li.quantity !== "number") {
      throw new Error(
        "Checkout Session line item is missing product metadata.",
      );
    }
    return {
      product: meta.productID,
      ...(meta.variantID ? { variant: meta.variantID } : {}),
      quantity: li.quantity,
    };
  });

  const recorded = (
    Array.isArray(transaction.items) ? transaction.items : []
  ).map((i: Record<string, unknown>) => ({
    product: relationID(i.product) as string,
    ...(relationID(i.variant) ? { variant: relationID(i.variant) } : {}),
    quantity: i.quantity as number,
  }));

  if (serializeItems(charged) !== serializeItems(recorded)) {
    throw new Error("Charged items do not match the transaction items.");
  }
};
