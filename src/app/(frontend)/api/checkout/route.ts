import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/utilities/stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isShopEnabled } from '@/utilities/featureFlags'

export async function POST(request: NextRequest) {
  if (!isShopEnabled()) {
    return NextResponse.json({ error: 'Shop functionality is disabled' }, { status: 404 })
  }

  try {
    const { items, customerInfo } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Validate products and calculate total
    const lineItems = []
    
    for (const item of items) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.productId,
      })

      if (!product || !product.available || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Product ${product?.title || item.productId} is not available` },
          { status: 400 }
        )
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: product.artwork && typeof product.artwork === 'object' && product.artwork.image && typeof product.artwork.image === 'object' && product.artwork.image.url
              ? [product.artwork.image.url] 
              : [],
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/shop/cart`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || '',
        orderItems: JSON.stringify(items),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}