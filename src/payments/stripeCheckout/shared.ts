import Stripe from 'stripe'

/** Pinned to the version this integration was written against (stripe-node 23.1.0). */
export const STRIPE_API_VERSION = '2026-10-28.endive' as const

export const getStripe = (secretKey: string | undefined) => {
  if (!secretKey) throw new Error('Stripe secret key is required.')
  return new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
    appInfo: { name: 'wmn-print-shop' },
  })
}

/**
 * Shipping offered at checkout.
 *
 * PLACEHOLDER: Will has not set shipping rates or regions yet (see PRODUCT.md, "Undecided").
 * The amount and label below exist only so test-mode checkout can run end to end. Replace
 * them before launch. Shipping is taxable in Georgia, so the rate carries the shipping tax
 * code and Stripe Tax decides per destination.
 */
export const SHIPPING_OPTIONS: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      display_name: 'Shipping (placeholder rate)',
      fixed_amount: { amount: 1500, currency: 'usd' },
      tax_behavior: 'exclusive',
      tax_code: 'txcd_92010001',
    },
  },
]

/** PLACEHOLDER: US-only at launch is proposed, not confirmed. */
export const ALLOWED_SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ['US']

/** Stripe Tax code for general tangible goods; prints are sold unframed or framed. */
export const PRINT_TAX_CODE = 'txcd_99999999'

export const normalizeEmail = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : ''

export const relationID = (value: unknown): string | undefined => {
  const id =
    value && typeof value === 'object' && 'id' in value ? (value as { id: unknown }).id : value
  if (typeof id === 'number' && Number.isFinite(id)) return String(id)
  if (typeof id === 'string' && id.trim()) return id
  return undefined
}

export type SnapshotItem = { product: string; variant?: string; quantity: number }

/** Order-independent, comparable form of cart or line items. */
export const serializeItems = (items: SnapshotItem[]): string =>
  JSON.stringify(
    [...items]
      .map((i) => ({ product: i.product, variant: i.variant ?? null, quantity: i.quantity }))
      .sort((a, b) =>
        `${a.product}:${a.variant}`.localeCompare(`${b.product}:${b.variant}`),
      ),
  )

/** Stripe's collected shipping details mapped onto the Orders collection's address group. */
export const toOrderAddress = (
  details: Stripe.Checkout.Session.CollectedInformation.ShippingDetails | null | undefined,
) => {
  if (!details) return undefined
  const [firstName, ...rest] = (details.name ?? '').trim().split(/\s+/)
  const a = details.address
  return {
    firstName: firstName || null,
    lastName: rest.join(' ') || null,
    addressLine1: a?.line1 ?? null,
    addressLine2: a?.line2 ?? null,
    city: a?.city ?? null,
    state: a?.state ?? null,
    postalCode: a?.postal_code ?? null,
    country: a?.country ?? null,
  }
}
