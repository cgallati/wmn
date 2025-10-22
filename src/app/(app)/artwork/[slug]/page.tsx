import type { Artwork, Media } from '@/payload-types'
import { ArtworkDetail } from '@/components/ArtworkDetail'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import { Metadata } from 'next'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const artwork = await queryArtworkBySlug({ slug })

  if (!artwork) return notFound()

  const image = typeof artwork.image === 'object' ? artwork.image : undefined
  const canIndex = artwork._status === 'published'

  return {
    description: artwork.title,
    openGraph: image?.url
      ? {
          images: [
            {
              alt: image?.alt || artwork.title,
              height: image.height!,
              url: image?.url,
              width: image.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: `${artwork.title}${artwork.year ? ` (${artwork.year})` : ''} | Portfolio`,
  }
}

export default async function ArtworkPage({ params }: Args) {
  const { slug } = await params
  const artwork = await queryArtworkBySlug({ slug })

  if (!artwork) return notFound()

  const artworkJsonLd = {
    name: artwork.title,
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    creator: {
      '@type': 'Person',
      name: process.env.COMPANY_NAME || 'Artist',
    },
    ...(artwork.year && { dateCreated: artwork.year.toString() }),
    ...(artwork.medium && { artMedium: artwork.medium }),
    ...(typeof artwork.image === 'object' && artwork.image.url && { image: artwork.image.url }),
  }

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(artworkJsonLd),
        }}
        type="application/ld+json"
      />
      <ArtworkDetail artwork={artwork} />
    </React.Fragment>
  )
}

const queryArtworkBySlug = async ({ slug }: { slug: string }): Promise<Artwork | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artwork',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const artwork = await payload.find({
    collection: 'artwork',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const params = artwork.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}
