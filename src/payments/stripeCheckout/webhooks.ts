import type { Endpoint, PayloadRequest } from 'payload'
import type Stripe from 'stripe'

import { getStripe } from './shared'

type Props = { secretKey?: string; webhookSecret?: string }

/**
 * POST /api/payments/stripe/webhooks
 *
 * The return page normally confirms the order. This is the fallback for a buyer who pays and
 * then closes the tab, and for payment methods that settle later. It goes through the
 * plugin's own /confirm-order endpoint, so there is one settlement path; the plugin's atomic
 * transaction claim makes a race with the return page safe.
 *
 * Subscribe the Stripe endpoint to: checkout.session.completed,
 * checkout.session.async_payment_succeeded, checkout.session.async_payment_failed,
 * checkout.session.expired.
 */
export const webhooksEndpoint = ({ secretKey, webhookSecret }: Props): Endpoint => ({
  method: 'post',
  path: '/webhooks',
  handler: async (req) => {
    const { payload } = req

    if (!webhookSecret || !req.text) {
      payload.logger.error('Stripe webhook received but STRIPE_WEBHOOKS_SIGNING_SECRET is not set.')
      return Response.json({ received: false }, { status: 400 })
    }

    const stripe = getStripe(secretKey)
    const signature = req.headers.get('stripe-signature')
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(await req.text(), signature ?? '', webhookSecret)
    } catch (err) {
      payload.logger.error({ err, msg: 'Stripe webhook signature verification failed' })
      return Response.json({ received: false }, { status: 400 })
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded':
          if (event.data.object.payment_status === 'paid') {
            await settle(req, event.data.object)
          }
          break
        case 'checkout.session.async_payment_failed':
          await markTransaction(req, event.data.object.id, 'failed')
          break
        case 'checkout.session.expired':
          await markTransaction(req, event.data.object.id, 'expired')
          break
      }
    } catch (err) {
      // A non-2xx response makes Stripe retry with backoff.
      payload.logger.error({ err, msg: `Error handling Stripe webhook ${event.type}` })
      return Response.json({ received: false }, { status: 500 })
    }

    return Response.json({ received: true })
  },
})

const findTransaction = async (req: PayloadRequest, checkoutSessionID: string) => {
  const result = await req.payload.find({
    collection: 'transactions',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: { 'stripe.checkoutSessionID': { equals: checkoutSessionID } },
  })
  return result.docs[0]
}

const markTransaction = async (
  req: PayloadRequest,
  checkoutSessionID: string,
  status: 'failed' | 'expired',
) => {
  const transaction = await findTransaction(req, checkoutSessionID)
  if (transaction?.status === 'pending') {
    await req.payload.update({
      collection: 'transactions',
      id: transaction.id,
      data: { status },
      overrideAccess: true,
    })
  }
}

const settle = async (req: PayloadRequest, session: Stripe.Checkout.Session) => {
  const { payload } = req
  const transaction = await findTransaction(req, session.id)

  // Not ours, or already settled by the return page.
  if (!transaction || transaction.status === 'succeeded' || transaction.order) return

  const cartID = session.metadata?.cartID
  if (!cartID) throw new Error(`Checkout Session ${session.id} has no cartID metadata.`)

  if (transaction.customer) {
    // Checkout is guest-only by product decision. A signed-in buyer's order is confirmed by
    // the return page under their session; the webhook cannot act as that user.
    payload.logger.warn(
      `Paid Checkout Session ${session.id} belongs to a signed-in customer; confirm it from the admin if the return page did not.`,
    )
    return
  }

  // Guest carts are read with their secret. It is a hidden field, so read it server-side.
  const cart = await payload.findByID({
    collection: 'carts',
    id: cartID,
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
    select: { secret: true },
  })

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || payload.config.serverURL
  const response = await fetch(`${serverURL}/api/payments/stripe/confirm-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartID,
      secret: (cart as { secret?: string }).secret,
      currency: transaction.currency,
      customerEmail: transaction.customerEmail,
      checkoutSessionID: session.id,
    }),
  })

  if (!response.ok) {
    throw new Error(`confirm-order returned ${response.status}: ${await response.text()}`)
  }
}
