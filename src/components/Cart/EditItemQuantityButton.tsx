'use client'

import { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import React, { useMemo } from 'react'

export function EditItemQuantityButton({ type, item }: { item: CartItem; type: 'minus' | 'plus' }) {
  const { decrementItem, incrementItem, isLoading } = useCart()

  const disabled = useMemo(() => {
    if (!item.id) return true

    const target =
      item.variant && typeof item.variant === 'object'
        ? item.variant
        : item.product && typeof item.product === 'object'
          ? item.product
          : null

    if (
      target &&
      typeof target === 'object' &&
      target.inventory !== undefined &&
      target.inventory !== null
    ) {
      if (type === 'plus' && item.quantity !== undefined && item.quantity !== null) {
        return item.quantity >= target.inventory
      }
    }

    return false
  }, [item, type])

  return (
    <button
      disabled={disabled || isLoading}
      aria-label={type === 'plus' ? 'Increase quantity' : 'Decrease quantity'}
      className="flex h-11 w-8 items-center justify-center text-sm text-primary/50 outline-none hover:text-primary focus-visible:text-primary focus-visible:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-primary/50"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (item.id) {
          if (type === 'plus') {
            incrementItem(item.id)
          } else {
            decrementItem(item.id)
          }
        }
      }}
      type="button"
    >
      <span aria-hidden="true">{type === 'plus' ? '+' : '\u2212'}</span>
    </button>
  )
}
