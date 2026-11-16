import type { Payload } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export type ShopStatus = {
  /** True when visitors can see and buy from the shop. */
  open: boolean
  /** At least one shipping rate is set in Shop settings. */
  hasShipping: boolean
  /** At least one published print has an edition left. */
  hasPrintForSale: boolean
}

/**
 * The shop is dark until Will has set at least one shipping rate and published at least one
 * print with an edition left. Read on every request (the shop routes are dynamic), so it opens
 * the moment the data qualifies, with no flag or redeploy. Deduplicated per request.
 */
export const getShopStatus = cache(async (): Promise<ShopStatus> => {
  const payload = await getPayload({ config: configPromise })

  const [settings, hasPrintForSale] = await Promise.all([
    payload.findGlobal({ slug: 'shopSettings', depth: 0, overrideAccess: true }),
    printForSaleExists(payload),
  ])

  const hasShipping = (settings.shippingRates?.length ?? 0) > 0
  return { open: hasShipping && hasPrintForSale, hasShipping, hasPrintForSale }
})

const printForSaleExists = async (payload: Payload): Promise<boolean> => {
  // Prints without sizes carry inventory on the product itself.
  const simple = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    select: { slug: true },
    where: {
      and: [
        { _status: { equals: 'published' } },
        { enableVariants: { not_equals: true } },
        { inventory: { greater_than: 0 } },
      ],
    },
  })
  if (simple.docs.length) return true

  // Prints with sizes: any in-stock size whose print is published.
  const sizes = await payload.find({
    collection: 'variants',
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true,
    select: { product: true },
    where: { inventory: { greater_than: 0 } },
  })
  const productIDs = [
    ...new Set(
      sizes.docs.map((v) => (typeof v.product === 'object' ? v.product.id : v.product)),
    ),
  ]
  if (!productIDs.length) return false

  const published = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    select: { slug: true },
    where: {
      and: [{ id: { in: productIDs } }, { _status: { equals: 'published' } }],
    },
  })
  return published.docs.length > 0
}
