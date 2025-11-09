import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { Product } from '@/payload-types'

export const metadata = {
  description: 'Search for products in the store.',
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

  // Helper function to check if a product is sold out
  const isSoldOut = (product: Product): boolean => {
    if (product.enableVariants && product.variants?.docs) {
      // If using variants, check if all variants are sold out
      return product.variants.docs.every((variant) => {
        if (typeof variant === 'object') {
          return !variant.inventory || variant.inventory === 0
        }
        return true
      })
    }
    // If not using variants, check product inventory
    return !product.inventory || product.inventory === 0
  }

  // Sort products: in-stock first, sold-out last
  const sortedProducts = [...products.docs].sort((a, b) => {
    const aIsSoldOut = isSoldOut(a)
    const bIsSoldOut = isSoldOut(b)

    if (aIsSoldOut === bIsSoldOut) return 0
    return aIsSoldOut ? 1 : -1
  })

  return (
    <div>
      {sortedProducts.length === 0 ? (
        <p className="text-sm uppercase tracking-wider text-primary/50">No prints available.</p>
      ) : (
        <Grid className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sortedProducts.map((product) => {
            const soldOut = isSoldOut(product)
            return <ProductGridItem key={product.id} product={product} soldOut={soldOut} />
          })}
        </Grid>
      )}
    </div>
  )
}
