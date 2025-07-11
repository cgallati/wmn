'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Artwork } from '@/payload-types'
import { Media } from '@/components/Media'

interface PortfolioProps {
  artwork: Artwork[]
}

export const Portfolio: React.FC<PortfolioProps> = ({ artwork }) => {
  return (
    <div className="bg-white">
      {/* Image Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artwork.map((item) => (
            <Link
              key={item.id}
              href={`/artwork/${item.slug}`}
              className="group block aspect-square overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
            >
              <div className="relative h-full">
                {item.image && typeof item.image === 'object' && (
                  <Media
                    resource={item.image}
                    className="object-cover w-full h-full"
                    imgClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  {item.year && (
                    <p className="text-white/80 text-xs">{item.year}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {artwork.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No artwork found</p>
            <p className="text-gray-400 text-sm mt-2">
              No artwork has been published yet.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}