import Stripe from "stripe";

/** Pinned to the version this integration was written against (stripe-node 23.1.0). */
export const STRIPE_API_VERSION = "2026-10-28.endive" as const;

export const getStripe = (secretKey: string | undefined) => {
  if (!secretKey) throw new Error("Stripe secret key is required.");
  return new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
    appInfo: { name: "wmn-print-shop" },
  });
};

type ShippingRate = {
  label: string;
  price: number;
  minDays?: number | null;
  maxDays?: number | null;
};

/** Shipping tax code: Stripe Tax decides per destination whether shipping is taxable. */
const SHIPPING_TAX_CODE = "txcd_92010001";

/**
 * Shipping options for a Checkout Session, from the Shop settings global Will edits in the
 * admin. Throws if none are set; the shop stays dark in that case, so buyers never reach it.
 */
export const toShippingOptions = (
  rates: ShippingRate[] | null | undefined,
): Stripe.Checkout.SessionCreateParams.ShippingOption[] => {
  if (!rates?.length)
    throw new Error("No shipping rates are set in Shop settings.");
  return rates.map((rate) => {
    const estimate =
      rate.minDays || rate.maxDays
        ? {
            delivery_estimate: {
              ...(rate.minDays
                ? {
                    minimum: {
                      unit: "business_day" as const,
                      value: rate.minDays,
                    },
                  }
                : {}),
              ...(rate.maxDays
                ? {
                    maximum: {
                      unit: "business_day" as const,
                      value: rate.maxDays,
                    },
                  }
                : {}),
            },
          }
        : {};
    return {
      shipping_rate_data: {
        type: "fixed_amount",
        display_name: rate.label,
        fixed_amount: { amount: Math.round(rate.price * 100), currency: "usd" },
        tax_behavior: "exclusive",
        tax_code: SHIPPING_TAX_CODE,
        ...estimate,
      },
    };
  });
};

/** Stripe Tax code for general tangible goods; prints are sold unframed or framed. */
export const PRINT_TAX_CODE = "txcd_99999999";

export const normalizeEmail = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export const relationID = (value: unknown): string | undefined => {
  const id =
    value && typeof value === "object" && "id" in value
      ? (value as { id: unknown }).id
      : value;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  if (typeof id === "string" && id.trim()) return id;
  return undefined;
};

export type SnapshotItem = {
  product: string;
  variant?: string;
  quantity: number;
};

/** Order-independent, comparable form of cart or line items. */
export const serializeItems = (items: SnapshotItem[]): string =>
  JSON.stringify(
    [...items]
      .map((i) => ({
        product: i.product,
        variant: i.variant ?? null,
        quantity: i.quantity,
      }))
      .sort((a, b) =>
        `${a.product}:${a.variant}`.localeCompare(`${b.product}:${b.variant}`),
      ),
  );

/** Stripe's collected shipping details mapped onto the Orders collection's address group. */
export const toOrderAddress = (
  details:
    | Stripe.Checkout.Session.CollectedInformation.ShippingDetails
    | null
    | undefined,
) => {
  if (!details) return undefined;
  const [firstName, ...rest] = (details.name ?? "").trim().split(/\s+/);
  const a = details.address;
  return {
    firstName: firstName || null,
    lastName: rest.join(" ") || null,
    addressLine1: a?.line1 ?? null,
    addressLine2: a?.line2 ?? null,
    city: a?.city ?? null,
    state: a?.state ?? null,
    postalCode: a?.postal_code ?? null,
    country: a?.country ?? null,
  };
};

/**
 * The origin this request was served from, so a deployment links back to itself: a preview
 * returns buyers to that preview, production to the live domain. NEXT_PUBLIC_SERVER_URL is
 * shared across environments and would send preview buyers to production. On Vercel the
 * host header is the domain that routed the request, so it is not caller-controlled.
 */
export const requestOrigin = (req: { headers: Headers }): string => {
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))
    ?.split(",")[0]
    ?.trim();
  if (host) {
    const forwardedProto = req.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const local = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
    const proto = forwardedProto || (local ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SERVER_URL || "";
};
