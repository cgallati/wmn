import type { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'

/**
 * Client half of the Checkout Sessions adapter. Same shape as the plugin's
 * stripeAdapterClient, defined here so the client bundle never imports the plugin's stock
 * Stripe module (which pulls in the server-side `stripe` package).
 */
export const stripeCheckoutAdapterClient = (): PaymentAdapterClient => ({
  name: 'stripe',
  label: 'Card',
  initiatePayment: true,
  confirmOrder: true,
})
