import type { Product } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'

type Props = {
  product: Partial<Product>
  soldOut?: boolean
}

export const ProductGridItem: React.FC<Props> = ({ product, soldOut = false }) => {
  const { gallery, priceInUSD, title, inventory, enableVariants } = product

  let price = priceInUSD
  let availableStock = inventory || 0

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInUSD &&
      typeof variant.priceInUSD === 'number'
    ) {
      price = variant.priceInUSD
    }

    // Calculate total available stock from variants
    if (enableVariants) {
      availableStock = variants.reduce((total, v) => {
        if (typeof v === 'object' && v.inventory) {
          return total + v.inventory
        }
        return total
      }, 0)
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  // Show low stock warning when stock is between 1 and 5
  const isLowStock = !soldOut && availableStock > 0 && availableStock <= 5

  return (
    <Link
      className={clsx('relative inline-block h-full w-full group', {
        'opacity-60': soldOut,
      })}
      href={`/products/${product.slug}`}
    >
      <div className="relative">
        {image ? (
          <Media
            className="relative w-full"
            imgClassName={clsx('w-full h-auto object-contain transition duration-300 ease-in-out', {
              'group-hover:opacity-90': !soldOut,
              'grayscale': soldOut,
            })}
            resource={image}
          />
        ) : null}

        {/* Sold Out Badge */}
        {soldOut && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider leading-none">
            Sold Out
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && (
          <div className="absolute top-4 right-4 bg-orange-600 text-white px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider leading-none">
            Only {availableStock} left
          </div>
        )}
      </div>

      <div
        className={clsx(
          'font-sans flex justify-between items-center mt-4 text-xs uppercase tracking-wider',
          soldOut
            ? 'text-primary/30'
            : 'text-primary/50 group-hover:text-primary/100',
        )}
      >
        <div>{title}</div>

        {typeof price === 'number' && (
          <div>
            <Price amount={price} />
          </div>
        )}
      </div>
    </Link>
  )
}
