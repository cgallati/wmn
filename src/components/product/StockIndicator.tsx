'use client'
import { Product, Variant } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'

type Props = {
  product: Product
}

export const StockIndicator: React.FC<Props> = ({ product }) => {
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

  const stockQuantity = useMemo(() => {
    if (product.enableVariants) {
      if (selectedVariant) {
        return selectedVariant.inventory || 0
      }
      // If variants enabled but none selected, show total stock
      return variants.reduce((total, v) => {
        if (typeof v === 'object' && v.inventory) {
          return total + v.inventory
        }
        return total
      }, 0)
    }
    return product.inventory || 0
  }, [product.enableVariants, selectedVariant, product.inventory, variants])

  const isOutOfStock = stockQuantity === 0 || !stockQuantity
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5
  const isInStock = stockQuantity > 5

  return (
    <div className="flex items-center gap-2">
      {isOutOfStock && (
        <span className="inline-block bg-red-600 text-white px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider leading-none">
          Out of Stock
        </span>
      )}
      {isLowStock && (
        <span className="inline-block bg-orange-600 text-white px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider leading-none">
          Only {stockQuantity} Left
        </span>
      )}
      {isInStock && (
        <span className="inline-block bg-green-600 text-white px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider leading-none">
          In Stock
        </span>
      )}
    </div>
  )
}
