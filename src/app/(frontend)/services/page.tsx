import { Metadata } from 'next'
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

export default function ServicesPage() {
  return <Services />
}