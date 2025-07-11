'use client'

import React from 'react'
import Link from 'next/link'
import { Artwork, Product } from '@/payload-types'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/Cart'
import { formatCurrency } from '@/utilities/stripe'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

interface ArtworkDetailProps {
  artwork: Artwork
  products: Product[]
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork, products }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="p-4 border-b border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="w-full">
            <div className="aspect-square bg-gray-100 mb-4">
              {artwork.image && typeof artwork.image === 'object' && (
                <Media
                  resource={artwork.image}
                  className="object-cover w-full h-full"
                  imgClassName="object-cover w-full h-full"
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-light text-black mb-2">{artwork.title}</h1>
              {artwork.series && (
                <p className="text-gray-600 text-lg mb-4">
                  From the series &ldquo;{artwork.series}&rdquo;
                </p>
              )}
              {artwork.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {artwork.description}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-black border-b border-gray-200 pb-2">
                Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {artwork.year && (
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <span className="ml-2 text-black">{artwork.year}</span>
                  </div>
                )}
                {artwork.medium && (
                  <div>
                    <span className="text-gray-600">Medium:</span>
                    <span className="ml-2 text-black">{artwork.medium}</span>
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="ml-2 text-black">{artwork.dimensions}</span>
                  </div>
                )}
                {artwork.location && (
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 text-black">{artwork.location}</span>
                  </div>
                )}
                {artwork.camera && (
                  <div>
                    <span className="text-gray-600">Camera:</span>
                    <span className="ml-2 text-black">{artwork.camera}</span>
                  </div>
                )}
                {artwork.lens && (
                  <div>
                    <span className="text-gray-600">Lens:</span>
                    <span className="ml-2 text-black">{artwork.lens}</span>
                  </div>
                )}
                {artwork.settings && (
                  <>
                    {artwork.settings.aperture && (
                      <div>
                        <span className="text-gray-600">Aperture:</span>
                        <span className="ml-2 text-black">{artwork.settings.aperture}</span>
                      </div>
                    )}
                    {artwork.settings.shutter && (
                      <div>
                        <span className="text-gray-600">Shutter:</span>
                        <span className="ml-2 text-black">{artwork.settings.shutter}</span>
                      </div>
                    )}
                    {artwork.settings.iso && (
                      <div>
                        <span className="text-gray-600">ISO:</span>
                        <span className="ml-2 text-black">{artwork.settings.iso}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Available Prints */}
            {products.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-light text-black border-b border-gray-200 pb-2">
                  Available Prints
                </h2>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50"
                    >
                      <div>
                        <h3 className="font-medium text-black">{product.title}</h3>
                        <p className="text-sm text-gray-600">
                          {product.size} • {product.material.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        {product.edition && product.edition.total && product.edition.total > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Edition of {product.edition.total} • {product.edition.current} sold
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-light text-black">
                          {formatCurrency(product.price)}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="bg-black text-white hover:bg-gray-800 rounded-none px-6 py-2 disabled:opacity-50"
                        >
                          {product.stock === 0 ? 'Sold Out' : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link
                    href="/shop"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    View all prints in shop →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}