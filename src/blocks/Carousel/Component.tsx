import type { Product, Artwork, CarouselBlock as CarouselBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { DefaultDocumentIDType, getPayload } from 'payload'
import React from 'react'

import { CarouselClient } from './Component.client'

export const CarouselBlock: React.FC<
  CarouselBlockProps & {
    id?: DefaultDocumentIDType
  }
> = async (props) => {
  const { id, categories, limit = 3, populateBy, selectedDocs, relationTo, displayMode = 'standard' } = props

  let items: (Product | Artwork)[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const collection = relationTo || 'products'

    if (collection === 'products') {
      const flattenedCategories = categories?.length
        ? categories.map((category) => {
            if (typeof category === 'object') return category.id
            else return category
          })
        : null

      const fetchedProducts = await payload.find({
        collection: 'products',
        depth: 1,
        limit: limit || undefined,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? {
              where: {
                categories: {
                  in: flattenedCategories,
                },
              },
            }
          : {}),
      })

      items = fetchedProducts.docs
    } else if (collection === 'artwork') {
      const fetchedArtwork = await payload.find({
        collection: 'artwork',
        depth: 1,
        limit: limit || undefined,
        where: {
          _status: {
            equals: 'published',
          },
        },
        sort: '-publishedAt',
      })

      items = fetchedArtwork.docs
    }
  } else if (selectedDocs?.length) {
    items = selectedDocs.map((doc) => {
      if (typeof doc.value !== 'string') return doc.value
    }).filter(Boolean) as (Product | Artwork)[]
  }

  if (!items?.length) return null

  // For fullscreen mode, don't wrap in a container
  if (displayMode === 'fullscreen') {
    return <CarouselClient items={items} displayMode="fullscreen" />
  }

  return (
    <div className="w-full pb-6 pt-1">
      <CarouselClient items={items} displayMode="standard" />
    </div>
  )
}
