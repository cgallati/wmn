/**
 * Utility functions for feature flags
 */

export const isShopEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_SHOP === 'true'
}

export const requireShopEnabled = () => {
  if (!isShopEnabled()) {
    throw new Error('Shop feature is disabled')
  }
}