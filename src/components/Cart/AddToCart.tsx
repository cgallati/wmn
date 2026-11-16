'use client'

import type { Product, Variant } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
export const OPEN_CART_EVENT = 'wmn:open-cart'

type Props = {
  product: Product
}

export function AddToCart({ product }: Props) {
  const { addItem, cart, isLoading } = useCart()
  const searchParams = useSearchParams()

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')

      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }
        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const addToCart = useCallback(
    (e: React.SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
      }).then(() => {
        // The cart panel in the rail opens to show what was added.
        window.dispatchEvent(new CustomEvent(OPEN_CART_EVENT))
      })
    },
    [addItem, product, selectedVariant],
  )

  const disabled = useMemo<boolean>(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (!selectedVariant) {
        return true
      }

      if (selectedVariant.inventory === 0) {
        return true
      }
    } else {
      if (product.inventory === 0) {
        return true
      }
    }

    return false
  }, [selectedVariant, cart?.items, product])

  const needsSelection = Boolean(product.enableVariants && variants.length && !selectedVariant)
  const typeLabel = String(
    product.variantTypes?.find((t): t is Exclude<typeof t, string | number> => typeof t === 'object')
      ?.label ?? 'option',
  ).toLowerCase()

  // Disabled only when nothing more can be bought; a missing size is a prompt, not a dead button.
  const atLimit = !needsSelection && disabled
  const [prompted, setPrompted] = useState(false)
  // The prompt disappears on its own once a size is chosen.
  const prompt = prompted && needsSelection

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (needsSelection) {
      e.preventDefault()
      setPrompted(true)
      document.querySelector<HTMLButtonElement>('[data-size-option]:not([disabled])')?.focus()
      return
    }
    addToCart(e)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        aria-describedby={prompt ? 'add-to-cart-prompt' : undefined}
        className="w-full bg-foreground px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-background outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
        disabled={atLimit || isLoading}
        onClick={onClick}
        type="submit"
      >
        Add to cart
      </button>
      {prompt && (
        <p className="text-sm" id="add-to-cart-prompt" role="alert">
          Choose a {typeLabel} above.
        </p>
      )}
      {atLimit && (
        <p className="text-sm text-[#404040]">
          {product.enableVariants
            ? `All remaining editions in this ${typeLabel} are in your cart.`
            : 'All remaining editions are in your cart.'}
        </p>
      )}
    </div>
  )
}
