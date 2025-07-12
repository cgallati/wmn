import { Metadata } from 'next'
import { Cart } from '@/components/Cart'
import { isShopEnabled } from '@/utilities/featureFlags'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Cart | WMN Photo',
  description: 'Your shopping cart',
  openGraph: {
    title: 'Cart | WMN Photo',
    description: 'Your shopping cart',
    siteName: 'WMN Photo',
    type: 'website',
  },
}

export default function CartPage() {
  if (!isShopEnabled()) {
    notFound()
  }

  return <Cart />
}