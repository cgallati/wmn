import type { PaymentAdapter } from "@payloadcms/plugin-ecommerce/types";
import type Stripe from "stripe";

import {
  PRINT_TAX_CODE,
  getStripe,
  relationID,
  requestOrigin,
  toShippingOptions,
  type SnapshotItem,
} from "./shared";

type Props = { secretKey?: string };

/**
 * Creates a Checkout Session (ui_mode: elements) for the cart and a pending Transaction that
 * points at it. The plugin's /initiate endpoint has already loaded the cart and checked prices
 * and inventory before this runs.
 */
export const initiatePayment =
  ({ secretKey }: Props): PaymentAdapter["initiatePayment"] =>
  async ({ data, req, transactionsSlug = "transactions" }) => {
    const { payload } = req;
    const stripe = getStripe(secretKey);
    const { cart, currency, customerEmail } = data;

    if (!currency) throw new Error("Currency is required.");
    if (!cart?.items?.length) throw new Error("Cart is empty or not provided.");
    if (!customerEmail || typeof customerEmail !== "string") {
      throw new Error("A valid customer email is required to make a purchase.");
    }

    const snapshot: SnapshotItem[] = [];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cart.items) {
      const productID = relationID(item.product);
      const variantID = relationID(item.variant);
      if (
        !productID ||
        typeof item.quantity !== "number" ||
        item.quantity < 1
      ) {
        throw new Error("Cart item is invalid.");
      }

      const product = await payload.findByID({
        collection: "products",
        id: productID,
        depth: 0,
        req,
        select: { title: true, priceInUSD: true },
      });
      const variant = variantID
        ? await payload.findByID({
            collection: "variants",
            id: variantID,
            depth: 1,
            req,
            select: { priceInUSD: true, options: true },
          })
        : undefined;

      const unitAmount = variant ? variant.priceInUSD : product.priceInUSD;
      if (typeof unitAmount !== "number" || unitAmount <= 0) {
        throw new Error(`No price is set for ${product.title}.`);
      }

      const optionLabels = (variant?.options ?? [])
        .map((o) => (typeof o === "object" && o ? o.label : null))
        .filter(Boolean)
        .join(", ");

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: unitAmount,
          tax_behavior: "exclusive",
          product_data: {
            name: optionLabels
              ? `${product.title}, ${optionLabels}`
              : product.title,
            tax_code: PRINT_TAX_CODE,
            metadata: { productID, ...(variantID ? { variantID } : {}) },
          },
        },
      });
      snapshot.push({
        product: productID,
        ...(variantID ? { variant: variantID } : {}),
        quantity: item.quantity,
      });
    }

    const subtotal = lineItems.reduce(
      (sum, li) => sum + (li.price_data?.unit_amount ?? 0) * (li.quantity ?? 0),
      0,
    );
    if (typeof cart.subtotal === "number" && subtotal !== cart.subtotal) {
      throw new Error("Cart prices changed. Refresh the page and try again.");
    }

    const settings = await payload.findGlobal({
      slug: "shopSettings",
      depth: 0,
      overrideAccess: true,
      req,
    });
    const shippingOptions = toShippingOptions(settings.shippingRates);
    const shippingCountries = (settings.shippingCountries ??
      []) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];
    if (!shippingCountries.length)
      throw new Error("No shipping countries are set in Shop settings.");

    // Return the buyer to the deployment they are on (preview or production).
    const serverURL = requestOrigin(req);
    const cartID = String(cart.id);

    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "elements",
        mode: "payment",
        customer_email: customerEmail,
        line_items: lineItems,
        automatic_tax: { enabled: true },
        shipping_address_collection: { allowed_countries: shippingCountries },
        shipping_options: shippingOptions,
        return_url: `${serverURL}/checkout/confirm-order?session_id={CHECKOUT_SESSION_ID}`,
        metadata: { cartID },
        payment_intent_data: {
          metadata: { cartID },
          // The buyer's only email is Stripe's receipt; receipt_email makes Stripe send it.
          receipt_email: customerEmail,
        },
      });

      if (!session.client_secret)
        throw new Error("Stripe did not return a client secret.");

      await payload.create({
        collection: transactionsSlug as "transactions",
        data: {
          ...(req.user ? { customer: req.user.id } : { customerEmail }),
          // Pre-tax, pre-shipping. confirmOrder replaces this with the settled amount_total.
          amount: session.amount_total ?? subtotal,
          cart: cartID,
          currency: currency.toUpperCase() as "USD",
          items: snapshot,
          paymentMethod: "stripe",
          status: "pending",
          stripe: { checkoutSessionID: session.id },
        },
        req,
      });

      return {
        clientSecret: session.client_secret,
        checkoutSessionID: session.id,
        message: "Checkout session created",
      };
    } catch (error) {
      payload.logger.error({
        err: error,
        msg: "Error creating Stripe Checkout Session",
      });
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unknown error initiating payment",
      );
    }
  };
