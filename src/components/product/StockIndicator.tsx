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
        <Badge variant="destructive" className="uppercase font-mono text-xs">
          Out of Stock
        </Badge>
      )}
      {isLowStock && (
        <Badge className="uppercase font-mono text-xs bg-orange-500 hover:bg-orange-600">
          Only {stockQuantity} Left
        </Badge>
      )}
      {isInStock && (
        <Badge variant="outline" className="uppercase font-mono text-xs text-green-600 border-green-600">
          In Stock
        </Badge>
      )}
    </div>
  )
}
