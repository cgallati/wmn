import React from 'react'

export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 items-start gap-x-12 gap-y-16 md:grid-cols-2 xl:grid-cols-3"
    >
      {[4 / 5, 3 / 2, 4 / 5, 1, 3 / 2, 4 / 5].map((ratio, index) => (
        <div
          className="w-full bg-[hsl(210_40%_96.1%)] motion-safe:animate-pulse"
          key={index}
          style={{ aspectRatio: ratio }}
        />
      ))}
    </div>
  )
}
