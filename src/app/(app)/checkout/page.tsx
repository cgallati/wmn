import type { Metadata } from 'next'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

export default function Checkout() {
  return (
    <div className="container min-h-[90vh]">
      <CheckoutPage />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({ title: 'Checkout', url: '/checkout' }),
  robots: { index: false },
  title: 'Checkout',
}
