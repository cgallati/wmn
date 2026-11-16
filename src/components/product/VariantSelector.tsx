'use client'

import type { Product } from '@/payload-types'

import { Price } from '@/components/Price'
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
          className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-[#525252]"
          id={`variant-type-${type.id}`}
        >
          {type.label}
        </p>
        {/* The purchase decision: full-ink tiles with their price, not quiet chrome. */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
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
              let optionPrice: number | null | undefined

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
                  optionPrice = matchingVariant.priceInUSD
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
                  className={cn(
                    'flex min-h-14 min-w-[8.5rem] flex-col items-start justify-center gap-0.5 border px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none',
                    isActive
                      ? 'border-foreground ring-1 ring-inset ring-foreground'
                      : 'border-[hsl(240_6%_90%)] hover:border-foreground',
                    !isAvailableForSale &&
                      'cursor-not-allowed border-[hsl(240_6%_90%)] text-primary/50 hover:border-[hsl(240_6%_90%)]',
                  )}
                  data-size-option
                  disabled={!isAvailableForSale}
                  key={option.id}
                  onClick={() => {
                    router.replace(`${optionUrl}`, {
                      scroll: false,
                    })
                  }}
                  type="button"
                >
                  <span className="text-base font-medium">{option.label}</span>
                  <span className="text-sm tabular-nums text-[#404040]">
                    {!isAvailableForSale ? (
                      'Sold out'
                    ) : typeof optionPrice === 'number' ? (
                      <Price as="span" amount={optionPrice} />
                    ) : null}
                  </span>
                </button>
              )
            })}
        </div>
      </div>
    )
  })
}
