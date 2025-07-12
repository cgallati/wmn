import { Metadata } from 'next'
import { ServiceBooking } from '@/components/ServiceBooking'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Book Service | WMN Photo',
  description: 'Book professional photography services',
  openGraph: {
    title: 'Book Service | WMN Photo',
    description: 'Book professional photography services',
    siteName: 'WMN Photo',
    type: 'website',
  },
}

interface ServiceBookingPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function ServiceBookingPage({ searchParams }: ServiceBookingPageProps) {
  const { type } = await searchParams
  
  const validTypes = ['session', 'brand-campaign', 'creative-direction']
  
  if (!type || !validTypes.includes(type)) {
    notFound()
  }

  return <ServiceBooking serviceType={type} />
}