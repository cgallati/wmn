import type { Metadata } from 'next'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getShopStatus } from '@/utilities/shopStatus'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

export default async function Checkout() {
  if (!(await getShopStatus()).open) notFound()

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
