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

  const editionText = (() => {
    if (soldOut) return 'Sold out'
    if (typeof remaining === 'number' && edition) return `${remaining} of ${edition} remaining`
    if (typeof remaining === 'number') return `${remaining} remaining`
    if (edition) return `Edition of ${edition}`
    return null
  })()

  const price = hasVariants ? selected?.priceInUSD : product.priceInUSD

  const rows = ([
    editionText ? { label: 'Edition', value: <span aria-live="polite">{editionText}</span> } : null,
    product.paper ? { label: 'Paper', value: product.paper } : null,
    product.printProcess ? { label: 'Process', value: product.printProcess } : null,
    product.signed ? { label: 'Signed', value: 'Signed by the artist' } : null,
    typeof product.productionTime === 'number'
      ? {
          label: 'Production',
          value: `${product.productionTime} ${product.productionTime === 1 ? 'day' : 'days'}`,
        }
      : null,
  ] as (Row | null)[]).filter((r): r is Row => Boolean(r))

  return (
    <>
      {hasVariants && !soldOut && (
        <div className="flex flex-col gap-8">
          <VariantSelector product={product} />
        </div>
      )}

      <WallLabelRows rows={rows} />

      <div className="flex flex-col gap-6">
        {typeof price === 'number' ? (
          <Price as="p" amount={price} className="text-lg" />
        ) : typeof low === 'number' ? (
          <p className="text-lg">
            {typeof high === 'number' && high !== low ? 'From ' : null}
            <Price as="span" amount={low} />
          </p>
        ) : null}

        {soldOut ? (
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-primary/50">
            This edition is sold out.
          </p>
        ) : (
          <AddToCart product={product} />
        )}
      </div>
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
    <div className="flex flex-col gap-8">
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
