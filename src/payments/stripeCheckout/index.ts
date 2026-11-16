import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import type { Field, GroupField } from 'payload'

import { confirmOrder } from './confirmOrder'
import { initiatePayment } from './initiatePayment'
import { webhooksEndpoint } from './webhooks'

type Props = {
  secretKey?: string
  webhookSecret?: string
}

/**
 * Stripe Checkout Sessions (ui_mode: elements) payment adapter for the Payload ecommerce
 * plugin. It replaces the stock PaymentIntents adapter so Stripe computes tax
 * (automatic_tax) and shipping, while the plugin keeps carts, inventory, orders and
 * transactions.
 *
 * It is named `stripe`, so the endpoints stay at /api/payments/stripe/{initiate,
 * confirm-order,webhooks} and the client keeps using stripeAdapterClient.
 */
export const stripeCheckoutAdapter = ({ secretKey, webhookSecret }: Props): PaymentAdapter => {
  const fields: Field[] = [
    { name: 'checkoutSessionID', type: 'text', label: 'Stripe Checkout Session ID', index: true },
    // Kept so transactions created by the previous PaymentIntents adapter still display.
    { name: 'customerID', type: 'text', label: 'Stripe Customer ID' },
    { name: 'paymentIntentID', type: 'text', label: 'Stripe PaymentIntent ID' },
  ]

  const group: GroupField = {
    name: 'stripe',
    type: 'group',
    admin: { condition: (data) => data?.paymentMethod === 'stripe' },
    fields,
  }

  return {
    name: 'stripe',
    label: 'Stripe',
    group,
    initiatePayment: initiatePayment({ secretKey }),
    confirmOrder: confirmOrder({ secretKey }),
    endpoints: [webhooksEndpoint({ secretKey, webhookSecret })],
  }
}
