import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArtworkDetail } from '@/components/ArtworkDetail'

interface ArtworkPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const artwork = await payload.find({
    collection: 'artwork',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!artwork.docs.length) {
    return {
      title: 'Artwork Not Found',
    }
  }

  const art = artwork.docs[0]

  return {
    title: `${art.title} | WMN Photo`,
    description: art.description || `${art.title} - A photographic work by WMN`,
    openGraph: {
      title: `${art.title} | WMN Photo`,
      description: art.description || `${art.title} - A photographic work by WMN`,
      siteName: 'WMN Photo',
      type: 'website',
      images: art.image && typeof art.image === 'object' && art.image.url ? [art.image.url] : [],
    },
  }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const artwork = await payload.find({
    collection: 'artwork',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!artwork.docs.length) {
    notFound()
  }

  const art = artwork.docs[0]

  // Get available products for this artwork
  const products = await payload.find({
    collection: 'products',
    where: {
      artwork: {
        equals: art.id,
      },
      available: {
        equals: true,
      },
    },
    limit: 50,
  })

  return <ArtworkDetail artwork={art} products={products.docs} />
}