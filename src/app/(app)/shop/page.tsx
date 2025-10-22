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
  const { q: searchValue, sort, category } = await searchParams
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
    },
    ...(sort ? { sort } : { sort: 'title' }),
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        ...(searchValue
          ? [
              {
                or: [
                  {
                    title: {
                      like: searchValue,
                    },
                  },
                  {
                    description: {
                      like: searchValue,
                    },
                  },
                ],
              },
            ]
          : []),
        ...(category
          ? [
              {
                categories: {
                  contains: category,
                },
              },
            ]
          : []),
      ],
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

  const resultsText = sortedProducts.length > 1 ? 'results' : 'result'

  return (
    <div>
      {searchValue ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {sortedProducts.length === 0
            ? 'There are no products that match '
            : `Showing ${sortedProducts.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && sortedProducts.length === 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          No products found. Please try different filters.
        </p>
      )}

      {sortedProducts.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => {
            const soldOut = isSoldOut(product)
            return <ProductGridItem key={product.id} product={product} soldOut={soldOut} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}
