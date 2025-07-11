import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Shop } from '@/components/Shop'

export const metadata: Metadata = {
  title: 'Shop | WMN Photo',
  description: 'Fine art prints and limited editions by WMN',
  openGraph: {
    title: 'Shop | WMN Photo',
    description: 'Fine art prints and limited editions by WMN',
    siteName: 'WMN Photo',
    type: 'website',
  },
}

export default async function ShopPage() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      available: {
        equals: true,
      },
    },
    sort: '-createdAt',
    limit: 50,
  })

  return <Shop products={products.docs} />
}