'use client'

import type { CartItem } from '@/components/Cart'

import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import {
  CheckoutElementsProvider,
  PaymentElement,
  ShippingAddressElement,
  useCheckoutElements,
} from '@stripe/react-stripe-js/checkout'
import { loadStripe, type StripeCheckoutDeliveryEstimate } from '@stripe/stripe-js'
import Link from 'next/link'
import React, { useEffect, useId, useMemo, useState } from 'react'

import { OrderSummary, type SessionTotals } from './OrderSummary'
import { stripeAppearance, stripeFonts } from './stripeAppearance'
import { CHECKOUT_EMAIL_KEY } from './storage'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const label = 'text-xs font-medium uppercase tracking-[0.1em] text-[#525252]'
const quietAction =
  'text-xs font-medium uppercase tracking-[0.1em] text-primary/50 outline-none hover:text-primary focus-visible:text-primary focus-visible:underline focus-visible:underline-offset-4'
const filledButton =
  'w-full bg-foreground px-8 py-4 text-xs font-medium uppercase tracking-[0.1em] text-background outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-40'

/**
 * Guest checkout on a Stripe Checkout Session (ui_mode: elements). Email first, because the
 * session and its pending Transaction are created for that email; then shipping address,
 * shipping, payment. Stripe recalculates tax and shipping as the address changes.
 */
export function CheckoutPage() {
  const { cart } = useCart()
  const { initiatePayment } = usePayments()
  const emailId = useId()

  const [email, setEmail] = useState('')
  const [clientSecret, setClientSecret] = useState<string>()
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string>()
  const [cartChanged, setCartChanged] = useState(false)

  const items = useMemo(() => (cart?.items ?? []) as CartItem[], [cart?.items])
  // A session is priced for the cart it was created from; any cart edit invalidates it.
  const cartKey = items.map((i) => `${i.id}:${i.quantity}`).join('|')
  const [sessionCartKey, setSessionCartKey] = useState<string>()

  useEffect(() => {
    if (clientSecret && sessionCartKey !== undefined && cartKey !== sessionCartKey) {
      setClientSecret(undefined)
      setCartChanged(true)
    }
  }, [cartKey, clientSecret, sessionCartKey])

  if (!items.length) {
    return (
      <div className="flex flex-col items-start gap-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-[#404040]">Your cart is empty.</p>
        <Link className={quietAction} href="/shop">
          Back to prints
        </Link>
      </div>
    )
  }

  const start = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(undefined)
    setCartChanged(false)
    setStarting(true)
    try {
      const result = (await initiatePayment('stripe', {
        additionalData: { customerEmail: email.trim() },
      })) as { clientSecret?: string }
      if (!result?.clientSecret) throw new Error('missing client secret')
      try {
        // The return page needs the email to confirm a guest order. Kept out of the URL.
        window.sessionStorage.setItem(CHECKOUT_EMAIL_KEY, email.trim())
      } catch {
        // Without storage, the webhook still settles the order.
      }
      setSessionCartKey(cartKey)
      setClientSecret(result.clientSecret)
    } catch (err) {
      setError(describeInitiateError(err))
    } finally {
      setStarting(false)
    }
  }

  if (clientSecret) {
    return (
      <CheckoutElementsProvider
        key={clientSecret}
        options={{
          clientSecret,
          elementsOptions: { appearance: stripeAppearance, fonts: stripeFonts },
        }}
        stripe={stripePromise}
      >
        <PaymentSteps
          email={email}
          emailLabelId={`${emailId}-label`}
          items={items}
          onChangeEmail={() => setClientSecret(undefined)}
        />
      </CheckoutElementsProvider>
    )
  }

  return (
    <Shell summary={<OrderSummary items={items} totals={undefined} />}>
      <form className="flex flex-col gap-6" onSubmit={start}>
        <div className="flex flex-col gap-3">
          <label className={label} htmlFor={emailId}>
            Email
          </label>
          <input
            autoComplete="email"
            className="border border-[hsl(240_6%_90%)] bg-background px-3 py-3 text-base outline-none focus:border-foreground"
            id={emailId}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            value={email}
          />
          <p className="text-sm text-[#404040]">Used for your receipt and to look up your order.</p>
        </div>
        {cartChanged && (
          <p className="text-sm" role="status">
            Your cart changed. Continue again to update the total.
          </p>
        )}
        {error && (
          <p className="text-sm" role="alert">
            {error}
          </p>
        )}
        <button className={filledButton} disabled={starting} type="submit">
          {starting ? 'One moment' : 'Continue to shipping'}
        </button>
      </form>
    </Shell>
  )
}

/** Two columns from 1024px: the form, and the order summary (first on small screens). */
function Shell({ children, summary }: { children: React.ReactNode; summary: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-24">
      <div className="flex flex-col gap-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Checkout</h1>
        {children}
      </div>
      <div className="order-first lg:order-none lg:sticky lg:top-12 lg:self-start">{summary}</div>
    </div>
  )
}

/** Everything that needs the live Checkout Session. Rendered inside CheckoutElementsProvider. */
function PaymentSteps({
  email,
  emailLabelId,
  items,
  onChangeEmail,
}: {
  email: string
  emailLabelId: string
  items: CartItem[]
  onChangeEmail: () => void
}) {
  const state = useCheckoutElements()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string>()

  if (state.type === 'loading') {
    return (
      <Shell summary={<OrderSummary items={items} totals={undefined} />}>
        <p className={label} role="status">
          Loading payment
        </p>
      </Shell>
    )
  }
  if (state.type === 'error') {
    return (
      <Shell summary={<OrderSummary items={items} totals={undefined} />}>
        <p className="text-sm" role="alert">
          Checkout could not load: {state.error.message}
        </p>
      </Shell>
    )
  }

  const { checkout } = state
  const totals: SessionTotals = {
    subtotal: checkout.total.subtotal.amount,
    shipping: checkout.shipping ? checkout.total.shippingRate.amount : undefined,
    tax: checkout.tax.status === 'ready' ? checkout.total.taxExclusive.amount : undefined,
    total: checkout.total.total.amount,
  }

  const pay = async () => {
    setError(undefined)
    setPaying(true)
    // On success Stripe redirects to the session's return_url (the confirmation page).
    const result = await checkout.confirm()
    if (result.type === 'error') {
      setError(result.error.message)
      setPaying(false)
    }
  }

  return (
    <Shell summary={<OrderSummary items={items} totals={totals} />}>
      <section aria-labelledby={emailLabelId} className="flex flex-col gap-3">
        <h2 className={label} id={emailLabelId}>
          Email
        </h2>
        <div className="flex items-baseline justify-between gap-4 border-b pb-3">
          <p className="truncate">{email}</p>
          <button className={quietAction} onClick={onChangeEmail} type="button">
            Change
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={label}>Shipping address</h2>
        <ShippingAddressElement />
      </section>

      {checkout.shippingOptions.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className={label}>Shipping</h2>
          {checkout.shippingOptions.length === 1 ? (
            <p className="flex justify-between border-b pb-3">
              <span>
                {checkout.shippingOptions[0].displayName}
                <Estimate estimate={checkout.shippingOptions[0].deliveryEstimate} />
              </span>
              <span>{checkout.shippingOptions[0].amount}</span>
            </p>
          ) : (
            <fieldset className="flex flex-col">
              <legend className="sr-only">Shipping method</legend>
              {checkout.shippingOptions.map((option) => (
                <label className="flex cursor-pointer items-center gap-3 border-b py-3" key={option.id}>
                  <input
                    checked={checkout.shipping?.shippingOption.id === option.id}
                    className="accent-foreground"
                    name="shipping-option"
                    onChange={() => checkout.updateShippingOption(option.id)}
                    type="radio"
                  />
                  <span className="flex-1">
                    {option.displayName}
                    <Estimate estimate={option.deliveryEstimate} />
                  </span>
                  <span>{option.amount}</span>
                </label>
              ))}
            </fieldset>
          )}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className={label}>Payment</h2>
        <PaymentElement options={{ layout: 'tabs' }} />
      </section>

      <div className="flex flex-col gap-3">
        {error && (
          <p className="text-sm" role="alert">
            {error}
          </p>
        )}
        <button
          className={filledButton}
          disabled={!checkout.canConfirm || paying}
          onClick={pay}
          type="button"
        >
          {paying ? 'Processing' : `Pay ${totals.total}`}
        </button>
      </div>
    </Shell>
  )
}

/** "5–8 business days" under a shipping option, when Will set an estimate. */
function Estimate({ estimate }: { estimate: StripeCheckoutDeliveryEstimate | null }) {
  const min = estimate?.minimum?.value
  const max = estimate?.maximum?.value
  if (!min && !max) return null
  const range = min && max && min !== max ? `${min}\u2013${max}` : String(max ?? min)
  return (
    <span className="block text-sm text-[#404040]">{range} business days</span>
  )
}

function describeInitiateError(err: unknown): string {
  const raw = err instanceof Error ? err.message : ''
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.cause?.code === 'OutOfStock') {
      return 'An edition in your cart has just sold out. Remove it from your cart to continue.'
    }
    if (typeof parsed?.message === 'string') return parsed.message
  } catch {
    // not JSON
  }
  return 'Checkout could not start. Check your email address and try again.'
}
