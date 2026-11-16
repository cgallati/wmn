import type { Product } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { ExplicitGate } from '@/components/product/ExplicitGate'
import { getFirstImage, getPriceRange, isSoldOut } from '@/components/product/utils'
import { cn } from '@/utilities/cn'

type Props = {
  product: Partial<Product>
  soldOut?: boolean
  /** Load eagerly; for tiles above the fold. */
  priority?: boolean
}

/**
 * One print in the shop. The photograph sits at its true aspect ratio with a single
 * label line beneath it. Nothing is cropped, badged or overlaid, except the content
 * notice on explicit work.
 */
export const ProductGridItem: React.FC<Props> = ({ product, soldOut: soldOutProp, priority = false }) => {
  const soldOut = soldOutProp ?? isSoldOut(product)
  const image = getFirstImage(product)
  const { low, high } = getPriceRange(product)
  const href = `/products/${product.slug}`
  const title = product.title ?? ''

  return (
    <div className="group">
      {image ? (
        <ExplicitGate explicit={product.explicitContent} id={product.id ?? title} title={title}>
          <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
            <Media
              className="relative w-full bg-[hsl(210_40%_96.1%)]"
              imgClassName="h-auto w-full object-contain"
              priority={priority}
              resource={image}
              size="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 100vw"
            />
          </Link>
        </ExplicitGate>
      ) : null}

      <Link
        href={href}
        className={cn(
          // Title and price are what a buyer scans for: full ink at caption size, not chrome.
          'mt-4 flex items-baseline justify-between gap-4 text-sm text-foreground outline-none underline-offset-4 group-hover:underline focus-visible:underline',
        )}
      >
        <span>{title}</span>
        {soldOut ? (
          <span className="whitespace-nowrap text-[#525252]">Sold out</span>
        ) : typeof low === 'number' ? (
          <span className="whitespace-nowrap tabular-nums">
            {typeof high === 'number' && high !== low ? 'From ' : null}
            <Price as="span" amount={low} />
          </span>
        ) : null}
      </Link>
    </div>
  )
}
