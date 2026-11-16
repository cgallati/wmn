import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { ExplicitGate } from '@/components/product/ExplicitGate'
import React from 'react'

type Props = {
  gallery: NonNullable<Product['gallery']>
  explicit?: boolean | null
  productId: string | number
  title: string
  /** Responsive `sizes` hint for the main image. */
  sizes?: string
}

/** The print at its true aspect ratio. Any additional images follow, stacked, never cropped. */
export const Gallery: React.FC<Props> = ({ gallery, explicit, productId, title, sizes }) => {
  const images = gallery
    .map((item) => item.image)
    .filter((image): image is MediaType => typeof image === 'object' && image !== null)

  return (
    <ExplicitGate explicit={explicit} id={productId} title={title}>
      <div className="flex flex-col gap-8">
        {images.map((image, i) => (
          <Media
            key={`${image.id}-${i}`}
            className="w-full"
            imgClassName="h-auto w-full object-contain"
            priority={i === 0}
            resource={image}
            size={sizes}
          />
        ))}
      </div>
    </ExplicitGate>
  )
}
