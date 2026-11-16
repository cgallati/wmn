import { getShopStatus } from '@/utilities/shopStatus'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  // Dark until Will has a shipping rate and a print for sale (see Shop settings). Checked
  // here, above loading.tsx, so a closed shop answers with a real 404 status.
  if (!(await getShopStatus()).open) notFound()

  return <div className="container my-16 pb-4">{children}</div>
}
