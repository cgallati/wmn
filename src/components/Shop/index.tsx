'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/payload-types'
import { Media } from '@/components/Media'
import { useCart } from '@/providers/Cart'
import { formatCurrency } from '@/utilities/stripe'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

interface ShopProps {
  products: Product[]
}

export const Shop: React.FC<ShopProps> = ({ products }) => {
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all')
  const { addToCart, totalItems } = useCart()

  // Get unique sizes and materials for filtering
  const sizes = Array.from(new Set(products.map(p => p.size).filter(Boolean)))
  const materials = Array.from(new Set(products.map(p => p.material).filter(Boolean)))

  // Filter products
  const filteredProducts = products.filter(product => {
    const sizeMatch = selectedSize === 'all' || product.size === selectedSize
    const materialMatch = selectedMaterial === 'all' || product.material === selectedMaterial
    return sizeMatch && materialMatch
  })

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-light text-black">Shop</h1>
              <p className="text-gray-600 mt-2">Fine art prints and limited editions</p>
            </div>
            <Link
              href="/shop/cart"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-none hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({totalItems})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Material:</label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Materials</option>
                {materials.map(material => (
                  <option key={material} value={material}>
                    {material.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                {product.artwork && typeof product.artwork === 'object' && product.artwork.image && typeof product.artwork.image === 'object' && (
                  <Media
                    resource={product.artwork.image}
                    className="object-cover w-full h-full"
                    imgClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-black">{product.title}</h3>
                <p className="text-sm text-gray-600">
                  {product.size} • {product.material.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                {product.edition && product.edition.total && product.edition.total > 0 && (
                  <p className="text-xs text-gray-500">
                    Edition of {product.edition.total} • {product.edition.current} sold
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-light text-black">
                    {formatCurrency(product.price)}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-black text-white hover:bg-gray-800 rounded-none px-6 py-2 disabled:opacity-50"
                  >
                    {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-xs text-orange-600">Only {product.stock} left in stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters or check back later for new releases.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}