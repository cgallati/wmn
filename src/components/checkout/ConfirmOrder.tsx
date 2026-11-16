'use client'

import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { CHECKOUT_EMAIL_KEY } from './storage'

type State =
  | { type: 'confirming' }
  | { type: 'paid-pending' }
  | { type: 'error'; message: string }

const quietAction =
  'text-xs font-medium uppercase tracking-[0.1em] text-primary/50 outline-none hover:text-primary focus-visible:text-primary focus-visible:underline focus-visible:underline-offset-4'

/**
 * Stripe returns here with ?session_id=cs_… after a successful payment. Confirm the order
 * through the plugin, clear the cart, and go to the order page. If this tab cannot confirm
 * (no stored email, or the cart is gone), the payment still stands and the webhook settles it.
 */
export const ConfirmOrder: React.FC = () => {
  const { confirmOrder } = usePayments()
  const { cart, clearCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const started = useRef(false)
  const [state, setState] = useState<State>({ type: 'confirming' })

  const checkoutSessionID = searchParams.get('session_id')

  // A tab with no stored cart never gets one; don't wait forever.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!started.current) {
        started.current = true
        setState({ type: 'paid-pending' })
      }
    }, 4000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (started.current) return
    if (!checkoutSessionID) {
      router.replace('/shop')
      return
    }
    // Wait for the cart provider to restore the cart from storage.
    if (cart === undefined) return

    started.current = true

    let email = ''
    try {
      email = window.sessionStorage.getItem(CHECKOUT_EMAIL_KEY) ?? ''
    } catch {
      // ignore
    }
    if (!email || !cart?.items?.length) {
      // Stripe only returns here after payment, so this cart is paid for even if this tab
      // cannot confirm it. The webhook records the order; empty the cart so it is not bought
      // twice.
      if (cart?.items?.length) void clearCart().catch(() => undefined)
      setState({ type: 'paid-pending' })
      return
    }

    confirmOrder('stripe', { additionalData: { checkoutSessionID, customerEmail: email } })
      .then(async (result) => {
        const { orderID, accessToken } = (result ?? {}) as {
          orderID?: string
          accessToken?: string
        }
        if (!orderID) throw new Error('No order was returned.')
        try {
          window.sessionStorage.removeItem(CHECKOUT_EMAIL_KEY)
        } catch {
          // ignore
        }
        await clearCart()
        const query = new URLSearchParams({ email, ...(accessToken ? { accessToken } : {}) })
        router.replace(`/orders/${orderID}?${query.toString()}`)
      })
      .catch(() => {
        void clearCart().catch(() => undefined)
        setState({
          type: 'error',
          message:
            'Your payment went through, but this page could not show your order. It is being recorded and Stripe emails your receipt; you don\u2019t need to pay again.',
        })
      })
  }, [cart, checkoutSessionID, clearCart, confirmOrder, router])

  return (
    <div className="flex max-w-xl flex-col items-start gap-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        {state.type === 'confirming' ? 'Confirming your order' : 'Payment received'}
      </h1>
      {state.type === 'confirming' && (
        <p className="text-[#404040]" role="status">
          One moment.
        </p>
      )}
      {state.type === 'paid-pending' && (
        <p className="text-[#404040]">
          Your payment went through and your order is being recorded. Stripe emails your
          receipt; you don&rsquo;t need to pay again.
        </p>
      )}
      {state.type === 'error' && (
        <p className="text-[#404040]" role="alert">
          {state.message}
        </p>
      )}
      {state.type !== 'confirming' && (
        <Link className={quietAction} href="/shop">
          Back to prints
        </Link>
      )}
    </div>
  )
}
