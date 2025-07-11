import { Metadata } from 'next'
import { Cart } from '@/components/Cart'

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
  return <Cart />
}