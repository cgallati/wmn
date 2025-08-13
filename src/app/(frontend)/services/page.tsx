import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Services } from '@/components/Services'

export const metadata: Metadata = {
  title: 'Services | WMN Photo',
  description: 'Professional photography services - sessions, brand campaigns, and creative direction',
  openGraph: {
    title: 'Services | WMN Photo',
    description: 'Professional photography services - sessions, brand campaigns, and creative direction',
    siteName: 'WMN Photo',
    type: 'website',
  },
}

export default async function ServicesPage() {
  const payload = await getPayload({ config })
  
  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 10,
    sort: 'order',
  })

  // Fetch services page content
  let servicesPageData = null
  try {
    const servicesPageResult = await payload.find({
      collection: 'services-page',
      limit: 1,
    })
    servicesPageData = servicesPageResult.docs[0] || null
  } catch (error) {
    console.log('Services page collection not found:', error)
  }

  return <Services services={services} servicesPageData={servicesPageData} />
}