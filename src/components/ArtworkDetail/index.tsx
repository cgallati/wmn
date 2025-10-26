import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { ProductGridItem } from '@/components/ProductGridItem'
import type { Artwork, Product } from '@/payload-types'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArtworkDetailProps {
  artwork: Artwork
}

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const image = typeof artwork.image === 'object' ? artwork.image : null
  const availablePrints =
    artwork.availablePrints?.filter((p): p is Product => typeof p === 'object') || []

  // Determine if image is landscape (width > height) or portrait/square
  const isLandscape = image?.width && image?.height && image.width > image.height

  // Metadata component used in both layouts
  const MetadataSection = () => (
    <>
      {(artwork.year ||
        artwork.medium ||
        artwork.dimensions ||
        artwork.location ||
        artwork.camera ||
        artwork.lens ||
        artwork.aperture ||
        artwork.shutter ||
        artwork.iso) && (
        <div className="space-y-3 border-t border-b py-6">
          {artwork.year && (
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm font-medium text-muted-foreground">Year</span>
              <span className="col-span-2 text-sm">{artwork.year}</span>
            </div>
          )}
          {artwork.medium && (
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm font-medium text-muted-foreground">Medium</span>
              <span className="col-span-2 text-sm">{artwork.medium}</span>
            </div>
          )}
          {artwork.dimensions && (
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm font-medium text-muted-foreground">Dimensions</span>
              <span className="col-span-2 text-sm">{artwork.dimensions}</span>
            </div>
          )}
          {artwork.location && (
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm font-medium text-muted-foreground">Location</span>
              <span className="col-span-2 text-sm">{artwork.location}</span>
            </div>
          )}

          {/* Camera Details */}
          {(artwork.camera ||
            artwork.lens ||
            artwork.aperture ||
            artwork.shutter ||
            artwork.iso) && (
            <>
              {artwork.camera && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Camera</span>
                  <span className="col-span-2 text-sm">{artwork.camera}</span>
                </div>
              )}
              {artwork.lens && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Lens</span>
                  <span className="col-span-2 text-sm">{artwork.lens}</span>
                </div>
              )}
              {(artwork.aperture || artwork.shutter || artwork.iso) && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Settings</span>
                  <span className="col-span-2 text-sm">
                    {[
                      artwork.aperture,
                      artwork.shutter,
                      artwork.iso ? `ISO ${artwork.iso}` : null,
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Description */}
      {artwork.description && (
        <div className="prose prose-sm max-w-none">
          <RichText data={artwork.description} enableGutter={false} />
        </div>
      )}
    </>
  )

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>
      </div>

      {isLandscape ? (
        /* Landscape Layout: Title/Series/Year at top, image, then metadata below */
        <div className="space-y-8">
          {/* Title Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{artwork.title}</h1>
            <div className="flex gap-4 text-muted-foreground">
              {artwork.series && <span className="text-lg">{artwork.series}</span>}
              {artwork.year && artwork.series && <span className="text-lg">•</span>}
              {artwork.year && <span className="text-lg">{artwork.year}</span>}
            </div>
          </div>

          {/* Image */}
          <div className="relative overflow-hidden rounded-lg bg-muted"
            style={{
              aspectRatio: image?.width && image?.height
                ? `${image.width} / ${image.height}`
                : '16 / 9'
            }}
          >
            {image && (
              <Media resource={image} className="h-full w-full object-contain" priority={true} />
            )}
          </div>

          {/* Metadata below image */}
          <div className="mx-auto max-w-3xl space-y-6">
            <MetadataSection />
          </div>
        </div>
      ) : (
        /* Portrait Layout: Side-by-side on large screens */
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg bg-muted"
            style={{
              aspectRatio: image?.width && image?.height
                ? `${image.width} / ${image.height}`
                : '3 / 4'
            }}
          >
            {image && (
              <Media resource={image} className="h-full w-full object-contain" priority={true} />
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{artwork.title}</h1>
              {artwork.series && (
                <p className="mt-2 text-lg text-muted-foreground">{artwork.series}</p>
              )}
            </div>

            <MetadataSection />
          </div>
        </div>
      )}

      {/* Available Prints */}
      {availablePrints.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Available Prints</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {availablePrints.map((product) => (
              <ProductGridItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
