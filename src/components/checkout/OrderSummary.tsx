'use client'

import type { CartItem } from '@/components/Cart'

import { Price } from '@/components/Price'
import { cn } from '@/utilities/cn'
import Image from 'next/image'
import React from 'react'

/** Formatted strings straight from the Checkout Session; undefined until Stripe knows them. */
export type SessionTotals = {
  subtotal: string
  shipping?: string
  tax?: string
  total: string
}

/**
 * The order as a wall label: each print, then label/value rows between hairlines. Before a
 * session exists only the cart subtotal is known; shipping and tax say so plainly.
 */
export function OrderSummary({
  className,
  items,
  totals,
}: {
  className?: string
  items: CartItem[]
  totals: SessionTotals | undefined
}) {
  return (
    <section aria-labelledby="order-summary" className={cn('flex flex-col gap-6', className)}>
      <h2
        className="text-xs font-medium uppercase tracking-[0.1em] text-[#525252]"
        id="order-summary"
      >
        Your order
      </h2>

      <ul className="flex flex-col">
        {items.map((item, i) => {
          const product = typeof item.product === 'object' ? item.product : undefined
          const variant = typeof item.variant === 'object' ? item.variant : undefined
          if (!product) return null
          const image =
            typeof product.gallery?.[0]?.image === 'object' ? product.gallery[0].image : undefined
          const options = (variant?.options ?? [])
            .map((o) => (typeof o === 'object' ? o.label : null))
            .filter(Boolean)
            .join(', ')
          const price = variant ? variant.priceInUSD : product.priceInUSD

          return (
            <li className="flex gap-4 border-t py-4" key={item.id ?? i}>
              {image?.url && image.width && image.height ? (
                <Image
                  alt=""
                  className="h-auto w-16 shrink-0 self-start object-contain"
                  height={image.height}
                  sizes="64px"
                  src={image.url}
                  width={image.width}
                />
              ) : (
                <span className="w-16 shrink-0" />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <span>{product.title}</span>
                  {typeof price === 'number' && (
                    <Price
                      as="span"
                      amount={price * (item.quantity ?? 1)}
                      className="whitespace-nowrap tabular-nums"
                    />
                  )}
                </div>
                {options ? <span className="text-[#404040]">{options}</span> : null}
                {(item.quantity ?? 1) > 1 ? (
                  <span className="text-[#404040]">Quantity {item.quantity}</span>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      <dl className="flex flex-col gap-3 border-y py-6 text-sm tabular-nums">
        <Row label="Subtotal">
          {totals ? totals.subtotal : <CartSubtotal items={items} />}
        </Row>
        <Row label="Shipping">{totals?.shipping ?? <Pending />}</Row>
        <Row label="Tax">{totals?.tax ?? <Pending />}</Row>
        <Row emphasis label="Total">
          {totals?.shipping && totals?.tax ? totals.total : <Pending />}
        </Row>
      </dl>
    </section>
  )
}

function Row({
  children,
  emphasis,
  label,
}: {
  children: React.ReactNode
  emphasis?: boolean
  label: string
}) {
  return (
    <div className={cn('flex justify-between gap-4', emphasis && 'pt-3 text-base')}>
      <dt className={emphasis ? undefined : 'text-[#525252]'}>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function Pending() {
  return <span className="text-[#525252]">After address</span>
}

function CartSubtotal({ items }: { items: CartItem[] }) {
  const amount = items.reduce((sum, item) => {
    const product = typeof item.product === 'object' ? item.product : undefined
    const variant = typeof item.variant === 'object' ? item.variant : undefined
    const price = variant ? variant.priceInUSD : product?.priceInUSD
    return sum + (typeof price === 'number' ? price * (item.quantity ?? 1) : 0)
  }, 0)
  return <Price as="span" amount={amount} />
}
