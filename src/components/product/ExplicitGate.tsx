'use client'

import React, { useEffect, useState } from 'react'

import { cn } from '@/utilities/cn'

const storageKey = (id: string) => `wmn-explicit-shown:${id}`

type Props = {
  /** When false, children render untouched. */
  explicit?: boolean | null
  /** Stable id for remembering the choice for this browser session. */
  id: string | number
  /** Name of the print, used in the button's accessible name. */
  title: string
  children: React.ReactNode
  className?: string
}

/**
 * Content notice for explicit prints. The image is blurred and made inert, and a real
 * button sits over it. There is no modal and no focus trap: the rest of the page stays
 * reachable, and the choice lasts for the browser session.
 */
export function ExplicitGate({ explicit, id, title, children, className }: Props) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(storageKey(String(id))) === '1') setShown(true)
    } catch {
      // storage unavailable: the notice simply shows again
    }
  }, [id])

  if (!explicit) return <>{children}</>

  const reveal = () => {
    setShown(true)
    try {
      window.sessionStorage.setItem(storageKey(String(id)), '1')
    } catch {
      // ignore
    }
  }

  const hidden = !shown

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        aria-hidden={hidden || undefined}
        // `inert` keeps the blurred image out of tab order and the accessibility tree
        inert={hidden}
        className={cn(
          'transition-[filter] duration-300 ease-out motion-reduce:transition-none',
          hidden && 'pointer-events-none select-none blur-2xl',
        )}
      >
        {children}
      </div>
      {hidden && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={reveal}
            // Will's explicit-content badge (Warning Red block, white type), scaled up to a
            // readable, tappable control. Red is reserved for exactly this meaning.
            className="bg-red-600 px-4 py-2.5 text-center text-xs uppercase leading-none text-white outline-none transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <span className="block font-bold tracking-[0.05em]">Explicit content</span>
            <span className="mt-1.5 block font-medium tracking-[0.1em]">
              Show image<span className="sr-only"> of {title}</span>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
