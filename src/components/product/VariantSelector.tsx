'use client'

import type { Product } from '@/payload-types'

import { createUrl } from '@/utilities/createUrl'
import { cn } from '@/utilities/cn'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export function VariantSelector({ product }: { product: Product }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const variants = product.variants?.docs
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants?.length && variantTypes?.length)

  if (!hasVariants) {
    return null
  }

  return variantTypes?.map((type) => {
    if (!type || typeof type !== 'object') {
      return <></>
    }

    const options = type.options?.docs

    if (!options || !Array.isArray(options) || !options.length) {
      return <></>
    }

    return (
      <div role="group" aria-labelledby={`variant-type-${type.id}`} key={type.id}>
        <p
          className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-primary/50"
          id={`variant-type-${type.id}`}
        >
          {type.label}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {options?.map((option) => {
              if (!option || typeof option !== 'object') {
                return <></>
              }

              const optionID = option.id
              const optionKeyLowerCase = type.name

              // Base option params on current params so we can preserve any other param state in the url.
              const optionSearchParams = new URLSearchParams(searchParams.toString())

              // Remove image and variant ID from this search params so we can loop over it safely.
              optionSearchParams.delete('variant')
              optionSearchParams.delete('image')

              // Update the option params using the current option to reflect how the url *would* change,
              // if the option was clicked.
              optionSearchParams.set(optionKeyLowerCase, String(optionID))

              const currentOptions = Array.from(optionSearchParams.values())

              let isAvailableForSale = true

              // Find a matching variant
              if (variants) {
                const matchingVariant = variants
                  .filter((variant) => typeof variant === 'object')
                  .find((variant) => {
                    if (!variant.options || !Array.isArray(variant.options)) return false

                    // Check if all variant options match the current options in the URL
                    return variant.options.every((variantOption) => {
                      if (typeof variantOption !== 'object')
                        return currentOptions.includes(String(variantOption))

                      return currentOptions.includes(String(variantOption.id))
                    })
                  })

                if (matchingVariant) {
                  // If we found a matching variant, set the variant ID in the search params.
                  optionSearchParams.set('variant', String(matchingVariant.id))

                  if (matchingVariant.inventory && matchingVariant.inventory > 0) {
                    isAvailableForSale = true
                  } else {
                    isAvailableForSale = false
                  }
                }
              }

              const optionUrl = createUrl(pathname, optionSearchParams)

              // The option is active if it's in the url params.
              const isActive =
                Boolean(isAvailableForSale) &&
                searchParams.get(optionKeyLowerCase) === String(optionID)

              return (
                <button
                  aria-pressed={isActive}
                  aria-disabled={!isAvailableForSale}
                  className={cn(
                    'border-b-2 pb-1 text-xs font-medium uppercase tracking-[0.1em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-primary/50 hover:text-primary',
                    !isAvailableForSale && 'cursor-not-allowed text-primary/50 line-through hover:text-primary/50',
                  )}
                  disabled={!isAvailableForSale}
                  key={option.id}
                  onClick={() => {
                    router.replace(`${optionUrl}`, {
                      scroll: false,
                    })
                  }}
                  type="button"
                >
                  {option.label}
                  {!isAvailableForSale && <span className="sr-only"> (sold out)</span>}
                </button>
              )
            })}
        </div>
      </div>
    )
  })
}
