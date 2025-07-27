import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Portfolio } from '@/components/Portfolio'

// Cache homepage for 30 minutes - artwork changes trigger revalidation
export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Portfolio | WMN Photo',
  description: 'A curated collection of photographic work by WMN',
  openGraph: {
    title: 'Portfolio | WMN Photo',
    description: 'A curated collection of photographic work by WMN',
    siteName: 'WMN Photo',
    type: 'website',
  },
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const artwork = await payload.find({
    collection: 'artwork',
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 50,
  })

  return <Portfolio artwork={artwork.docs} />
}
