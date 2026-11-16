'use client'

import type { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import React from 'react'

export function DeleteItemButton({ item, label }: { item: CartItem; label?: string }) {
  const { isLoading, removeItem } = useCart()
  const itemId = item.id

  return (
    <button
      aria-label={label ? `Remove ${label} from cart` : 'Remove from cart'}
      className="text-xs font-medium uppercase tracking-[0.1em] text-primary/50 outline-none hover:text-primary focus-visible:text-primary focus-visible:underline focus-visible:underline-offset-4 disabled:cursor-not-allowed"
      disabled={!itemId || isLoading}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (itemId) removeItem(itemId)
      }}
      type="button"
    >
      Remove
    </button>
  )
}
