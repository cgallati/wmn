'use client'
import type { Media, Product, Artwork } from '@/payload-types'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { GridTileImage } from '@/components/Grid/tile'
import { Media as MediaComponent } from '@/components/Media'
import type { EmblaCarouselType } from 'embla-carousel'

type CarouselItem = Product | Artwork

function isProduct(item: CarouselItem): item is Product {
  return 'priceInUSD' in item
}

function isArtwork(item: CarouselItem): item is Artwork {
  return 'image' in item && !('priceInUSD' in item)
}

type CarouselClientProps = {
  items: CarouselItem[]
  displayMode?: 'standard' | 'fullscreen'
}

export const CarouselClient: React.FC<CarouselClientProps> = ({ items, displayMode = 'standard' }) => {
  if (!items?.length) return null

  if (displayMode === 'fullscreen') {
    return <FullscreenCarousel items={items} />
  }

  // Standard mode - purposefully duplicating items to make the carousel loop
  const carouselItems = [...items, ...items, ...items]

  return (
    <Carousel
      className="w-full"
      opts={{ align: 'start', loop: true }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          speed: 1,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {carouselItems.map((item, i) => {
          const isProductItem = isProduct(item)
          const href = isProductItem ? `/products/${item.slug}` : `/artwork/${item.slug}`

          return (
            <CarouselItem
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
              key={`${item.slug}${i}`}
            >
              <Link className="relative h-full w-full" href={href}>
                {isProductItem ? (
                  <GridTileImage
                    label={{
                      amount: item.priceInUSD!,
                      title: item.title,
                    }}
                    media={item.meta?.image as Media}
                  />
                ) : (
                  <GridTileImage
                    label={{
                      title: item.title,
                    }}
                    media={item.image as Media}
                  />
                )}
              </Link>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}

function FullscreenCarousel({ items }: { items: CarouselItem[] }) {
  const [api, setApi] = useState<EmblaCarouselType>()
  const [current, setCurrent] = useState(0)
  const [isDarkBackground, setIsDarkBackground] = useState(false)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Detect if current image has dark background
  useEffect(() => {
    const currentItem = items[current]
    if (!currentItem) return

    // Check if artwork has darkBackground field set
    if (isArtwork(currentItem)) {
      setIsDarkBackground(currentItem.darkBackground || false)
    } else {
      // For products, default to light background
      setIsDarkBackground(false)
    }
  }, [current, items])

  const scrollPrev = useCallback(() => {
    if (api) api.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    if (api) api.scrollNext()
  }, [api])

  const scrollTo = useCallback((index: number) => {
    if (api) api.scrollTo(index)
  }, [api])

  return (
    <div className="relative w-full -mt-16 sm:-mt-0">
      <Carousel
        className="w-full h-full"
        opts={{ align: 'center', loop: true }}
        setApi={setApi}
      >
        <CarouselContent className="h-[calc(100vh-4rem)] sm:h-screen ml-0">
          {items.map((item, index) => {
            const media = isProduct(item) ? (item.meta?.image as Media) : (item.image as Media)

            // Determine if image is portrait or landscape
            const isPortrait = typeof media === 'object' && media?.width && media?.height
              ? media.height > media.width
              : false

            return (
              <CarouselItem key={item.slug || index} className="relative h-full pl-0 basis-full">
                <div className="relative h-full w-full flex items-center justify-center bg-background">
                  {/* Image */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {typeof media === 'object' && media?.url && (
                      <MediaComponent
                        resource={media}
                        imgClassName={isPortrait ? "h-full w-auto max-w-full object-contain" : "w-full h-auto max-h-full object-contain"}
                      />
                    )}
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* Click zones for navigation - persistent across all images */}
      <button
        onClick={scrollPrev}
        className="group/prev absolute left-0 top-0 h-full w-1/2 z-10 cursor-pointer"
        aria-label="Previous image"
      >
        {/* Chevron indicator */}
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-6xl font-thin pointer-events-none ${
          isDarkBackground
            ? 'text-white/40 group-hover/prev:text-white/70'
            : 'text-black/40 group-hover/prev:text-black/70'
        }`}>
          ‹
        </span>
      </button>
      <button
        onClick={scrollNext}
        className="group/next absolute right-0 top-0 h-full w-1/2 z-10 cursor-pointer"
        aria-label="Next image"
      >
        {/* Chevron indicator */}
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors text-6xl font-thin pointer-events-none ${
          isDarkBackground
            ? 'text-white/40 group-hover/next:text-white/70'
            : 'text-black/40 group-hover/next:text-black/70'
        }`}>
          ›
        </span>
      </button>

      {/* Artwork title and year - Below carousel on mobile, overlaid on desktop */}
      {items[current] && (
        <>
          {/* Mobile: Below carousel */}
          <div className="block sm:hidden px-4 py-2 text-left text-sm">
            <span className="italic">{items[current].title}</span>
            {isArtwork(items[current]) && (items[current] as Artwork).year && (
              <>, {(items[current] as Artwork).year}</>
            )}
          </div>

          {/* Desktop: Overlaid on carousel */}
          <div className={`hidden sm:block absolute bottom-8 left-8 z-20 transition-colors ${
            isDarkBackground ? 'text-white' : 'text-black'
          }`}>
            <span className="italic">{items[current].title}</span>
            {isArtwork(items[current]) && (items[current] as Artwork).year && (
              <>, {(items[current] as Artwork).year}</>
            )}
          </div>
        </>
      )}
    </div>
  )
}
