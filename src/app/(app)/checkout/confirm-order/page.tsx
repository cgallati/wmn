import type { Metadata } from 'next'

import { ConfirmOrder } from '@/components/checkout/ConfirmOrder'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React, { Suspense } from 'react'

export default function ConfirmOrderPage() {
  return (
    <div className="container min-h-[90vh]">
      <Suspense fallback={null}>
        <ConfirmOrder />
      </Suspense>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Confirming your order.',
  openGraph: mergeOpenGraph({ title: 'Confirming order', url: '/checkout/confirm-order' }),
  robots: { index: false },
  title: 'Confirming order',
}
