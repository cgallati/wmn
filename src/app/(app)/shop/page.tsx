import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { isSoldOut } from '@/components/product/utils'

export const metadata = {
  description: 'Limited edition prints by Will M Nichols.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    draft: false,
    overrideAccess: false,
    limit: 100,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
      inventory: true,
      explicitContent: true,
      enableVariants: true,
      variants: true,
      updatedAt: true,
      createdAt: true,
    },
    sort: 'title',
    where: {
      _status: {
        equals: 'published',
      },
    },
    populate: {
      variants: {
        inventory: true,
        priceInUSD: true,
      },
    },
  })

  // In stock first, sold out last. Array.sort is stable, so the title order holds within each group.
  const available = products.docs.filter((product) => !isSoldOut(product))
  const soldOut = products.docs.filter((product) => isSoldOut(product))

  const gridClass = 'grid grid-cols-1 items-start gap-x-12 gap-y-16 md:grid-cols-2 xl:grid-cols-3'

  if (products.docs.length === 0) {
    return <p className="text-xs uppercase tracking-[0.1em] text-primary/50">No prints available.</p>
  }

  return (
    <div className="flex flex-col gap-24">
      {available.length > 0 && (
        <ul className={gridClass}>
          {available.map((product) => (
            <li key={product.id}>
              <ProductGridItem product={product} soldOut={false} />
            </li>
          ))}
        </ul>
      )}

      {soldOut.length > 0 && (
        <section aria-labelledby="shop-archive" className="border-t pt-8">
          <h2 id="shop-archive" className="mb-12 text-xs font-medium uppercase tracking-[0.1em] text-primary/50">
            Sold out
          </h2>
          <ul className={gridClass}>
            {soldOut.map((product) => (
              <li key={product.id}>
                <ProductGridItem product={product} soldOut />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
