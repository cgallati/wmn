'use client'
import type { Product } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useMemo } from 'react'

import { VariantSelector } from './VariantSelector'
import { getPriceRange, getVariants, hasVariants as productHasVariants, isSoldOut } from './utils'

type ArtworkRef = { year?: number | null; series?: string | null } | null

type Row = { label: string; value: React.ReactNode }

function WallLabelRows({ rows }: { rows: Row[] }) {
  if (!rows.length) return null
  return (
    <dl className="flex flex-col gap-3 border-y py-6 text-sm">
      {rows.map((row) => (
        <div className="grid grid-cols-3 gap-4" key={row.label}>
          <dt className="text-[#525252]">{row.label}</dt>
          <dd className="col-span-2">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Buy({ product }: { product: Product }) {
  const searchParams = useSearchParams()
  const variants = getVariants(product)
  const hasVariants = productHasVariants(product)
  const soldOut = isSoldOut(product)
  const { low, high } = getPriceRange(product)

  const selected = useMemo(() => {
    if (!hasVariants) return undefined
    const id = searchParams.get('variant')
    return variants.find((v) => String(v.id) === id)
  }, [hasVariants, searchParams, variants])

  const remaining = hasVariants ? selected?.inventory : product.inventory
  const edition = product.editionSize

  // Remaining editions, stated plainly (no urgency styling), once there is a count to give.
  const editionLine = (() => {
    if (soldOut) return null
    if (typeof remaining === 'number' && edition) {
      return `${remaining} of ${edition} remaining${hasVariants ? ' in this size' : ''}`
    }
    if (typeof remaining === 'number') return `${remaining} remaining`
    // Before a size is chosen the wall label below already states the edition.
    return null
  })()

  const price = hasVariants ? selected?.priceInUSD : product.priceInUSD

  // Supporting detail, below the buying decision.
  const rows = (
    [
      edition
        ? {
            label: 'Edition',
            value: `${edition}${hasVariants ? ' per size' : ''}${
              product.artistProofs ? `, plus ${product.artistProofs} artist's proofs` : ''
            }`,
          }
        : null,
      product.paper ? { label: 'Paper', value: product.paper } : null,
      product.printProcess ? { label: 'Process', value: product.printProcess } : null,
      product.signed ? { label: 'Signed', value: 'Signed by the artist' } : null,
      typeof product.productionTime === 'number'
        ? {
            label: 'Ships in',
            value: `${product.productionTime} ${product.productionTime === 1 ? 'day' : 'days'}`,
          }
        : null,
    ] as (Row | null)[]
  ).filter((r): r is Row => Boolean(r))

  return (
    <>
      {/* Price leads the buy box: the second thing read after the title. */}
      <p className="text-2xl tabular-nums" aria-live="polite">
        {soldOut ? (
          'Sold out'
        ) : typeof price === 'number' ? (
          <Price as="span" amount={price} />
        ) : typeof low === 'number' ? (
          <>
            {typeof high === 'number' && high !== low ? 'From ' : null}
            <Price as="span" amount={low} />
          </>
        ) : null}
      </p>

      {soldOut ? (
        <p className="text-sm text-[#404040]">
          Every edition of this print has sold. It stays here as part of the archive.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {hasVariants && <VariantSelector product={product} />}

          {editionLine ? (
            <p className="text-sm" aria-live="polite">
              {editionLine}
            </p>
          ) : null}

          <AddToCart product={product} />

          <p className="text-sm text-[#404040]">Shipping and tax are calculated at checkout.</p>
        </div>
      )}

      <WallLabelRows rows={rows} />
    </>
  )
}

export function ProductDescription({
  product,
  artwork,
}: {
  product: Product
  artwork?: ArtworkRef
}) {
  const meta = [artwork?.series, artwork?.year].filter(Boolean).join(', ')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {product.title}
        </h1>
        {meta ? <p className="text-lg text-[#404040]">{meta}</p> : null}
      </div>

      <Suspense fallback={null}>
        <Buy product={product} />
      </Suspense>

      {product.description ? (
        <RichText className="prose-sm" data={product.description} enableGutter={false} />
      ) : null}
    </div>
  )
}
