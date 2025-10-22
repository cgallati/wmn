import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Artwork as ArtworkType } from '@/payload-types'

interface PortfolioProps {
  artwork: ArtworkType[]
}

export function Portfolio({ artwork }: PortfolioProps) {
  if (!artwork || artwork.length === 0) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <p className="text-muted-foreground">No artwork available yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 lg:py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artwork.map((item) => {
          const image = typeof item.image === 'object' ? item.image : null

          return (
            <Link
              key={item.id}
              href={`/artwork/${item.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {image && (
                <Media
                  resource={image}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                  priority={false}
                />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="text-white">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.year && <p className="text-sm opacity-90">{item.year}</p>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
