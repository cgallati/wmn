'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useCart } from '@/providers/Cart'
import { ShoppingCart } from 'lucide-react'

import type { Header } from '@/payload-types'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data: _data }) => {
  const pathname = usePathname()
  const { totalItems } = useCart()

  const navItems = [
    { label: 'Portfolio', href: '/' },
    ...(process.env.NEXT_PUBLIC_ENABLE_SHOP === 'true' ? [{ label: 'Shop', href: '/shop' }] : []),
    { label: 'Book', href: '/book' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-4xl font-light text-black">
            WMN
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {process.env.NEXT_PUBLIC_ENABLE_SHOP === 'true' && (
              <Link
                href="/shop/cart"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            {process.env.NEXT_PUBLIC_ENABLE_SHOP === 'true' && (
              <Link
                href="/shop/cart"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden border-t border-gray-200 py-4">
          <nav className="flex justify-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
