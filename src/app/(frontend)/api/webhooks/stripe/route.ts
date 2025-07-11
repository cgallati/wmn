import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/utilities/stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }

    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session

        // Get session with line items and shipping details
        const sessionWithDetails = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'shipping_details'],
        })

        // Parse order items from metadata
        const orderItems = JSON.parse(session.metadata?.orderItems || '[]')

        // Create order in Payload
        const order = await payload.create({
          collection: 'orders',
          data: {
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            stripePaymentIntentId: session.payment_intent as string,
            customer: {
              name: session.metadata?.customerName || session.customer_details?.name || '',
              email: session.metadata?.customerEmail || session.customer_details?.email || '',
              phone: session.metadata?.customerPhone || session.customer_details?.phone || '',
            },
            shipping: {
              address1: (sessionWithDetails as any).shipping_details?.address?.line1 || '',
              address2: (sessionWithDetails as any).shipping_details?.address?.line2 || '',
              city: (sessionWithDetails as any).shipping_details?.address?.city || '',
              state: (sessionWithDetails as any).shipping_details?.address?.state || '',
              zipCode: (sessionWithDetails as any).shipping_details?.address?.postal_code || '',
              country: (sessionWithDetails as any).shipping_details?.address?.country || '',
            },
            items: orderItems.map((item: { productId: string; quantity: number; price: number }) => ({
              product: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            total: (session.amount_total || 0) / 100, // Convert from cents
            status: 'paid',
          },
        })

        // Update product stock
        for (const item of orderItems as { productId: string; quantity: number; price: number }[]) {
          const product = await payload.findByID({
            collection: 'products',
            id: item.productId,
          })

          if (product) {
            await payload.update({
              collection: 'products',
              id: item.productId,
              data: {
                stock: product.stock - item.quantity,
                edition: {
                  ...product.edition,
                  current: product.edition?.current 
                    ? product.edition.current + item.quantity 
                    : item.quantity,
                },
              },
            })
          }
        }

        console.log('Order created successfully:', order.id)
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}