import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/cn'

export type ContentFilterValue = 'all' | 'hide-explicit' | 'explicit'

/** Reads `?content=` from the shop URL; anything unrecognised means All. */
export const parseContentFilter = (value: string | string[] | undefined): ContentFilterValue => {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'hide-explicit' || v === 'explicit' ? v : 'all'
}

/** Whether a print belongs in the selected view. */
export const matchesContentFilter = (
  filter: ContentFilterValue,
  explicit: boolean | null | undefined,
): boolean => {
  if (filter === 'hide-explicit') return !explicit
  if (filter === 'explicit') return Boolean(explicit)
  return true
}

const OPTIONS: { value: ContentFilterValue; label: string; href: string }[] = [
  { value: 'all', label: 'All', href: '/shop' },
  { value: 'hide-explicit', label: 'Hide explicit', href: '/shop?content=hide-explicit' },
  { value: 'explicit', label: 'Explicit only', href: '/shop?content=explicit' },
]

/**
 * Three-way filter on the shop index, as plain links so the view lives in the URL and is
 * server-rendered. Quiet Label style like the other shop controls; "Explicit only" carries the
 * portfolio's red explicit badge, the one place red appears (DESIGN.md, One Red Rule). It only
 * narrows the list: explicit prints still sit behind the content notice.
 */
export function ContentFilter({ value }: { value: ContentFilterValue }) {
  return (
    <nav aria-label="Filter prints by content">
      <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {OPTIONS.map((option) => {
          const active = option.value === value
          return (
            <li key={option.value}>
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center border-b-2 pb-1 pt-2 text-xs font-medium uppercase tracking-[0.1em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 motion-reduce:transition-none',
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-primary/50 hover:text-primary',
                )}
                href={option.href}
                scroll={false}
              >
                {option.value === 'explicit' ? (
                  <span className="bg-red-600 px-1.5 py-0.5 text-[0.5rem] font-bold uppercase leading-none tracking-[0.05em] text-white">
                    {option.label}
                  </span>
                ) : (
                  option.label
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
