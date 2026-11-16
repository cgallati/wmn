import type { Media, Product, Variant } from '@/payload-types'

/** Variants that have been populated (objects, not ids). */
export function getVariants(product: Partial<Product>): Variant[] {
  const docs = product.variants?.docs
  if (!docs) return []
  return docs.filter((v): v is Variant => typeof v === 'object' && v !== null)
}

export function hasVariants(product: Partial<Product>): boolean {
  return Boolean(product.enableVariants) && getVariants(product).length > 0
}

/** A print is sold out when nothing is left to buy. Undefined inventory counts as sold out. */
export function isSoldOut(product: Partial<Product>): boolean {
  if (product.enableVariants) {
    return getVariants(product).every((v) => !v.inventory || v.inventory <= 0)
  }
  return !product.inventory || product.inventory <= 0
}

/** Lowest and highest price (in the smallest currency unit) across variants, or the product price. */
export function getPriceRange(product: Partial<Product>): { low?: number; high?: number } {
  const prices = hasVariants(product)
    ? getVariants(product)
        .map((v) => v.priceInUSD)
        .filter((p): p is number => typeof p === 'number')
    : typeof product.priceInUSD === 'number'
      ? [product.priceInUSD]
      : []

  if (!prices.length) return {}
  return { low: Math.min(...prices), high: Math.max(...prices) }
}

export function getFirstImage(product: Partial<Product>): Media | undefined {
  const image = product.gallery?.[0]?.image
  return image && typeof image === 'object' ? image : undefined
}

export function isPortrait(image?: Media): boolean {
  return Boolean(image?.width && image?.height && image.height > image.width)
}
