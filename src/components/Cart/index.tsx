'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/providers/Cart'
import { Media } from '@/components/Media'
import { formatCurrency } from '@/utilities/stripe'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X, ArrowLeft } from 'lucide-react'

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (cart.length === 0) return

    setIsCheckingOut(true)

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.product.id.toString(),
            quantity: item.quantity,
            price: item.product.price,
          })),
          customerInfo: {
            // These will be collected by Stripe Checkout
          },
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your checkout. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </div>
          
          <div className="text-center py-16">
            <h1 className="text-3xl font-light text-black mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some beautiful prints to your collection</p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-light text-black">Shopping Cart</h1>
              <button
                onClick={clearCart}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b border-gray-200 pb-6">
                  <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                    {item.product.artwork && typeof item.product.artwork === 'object' && item.product.artwork.image && typeof item.product.artwork.image === 'object' && (
                      <Media
                        resource={item.product.artwork.image}
                        className="object-cover w-full h-full"
                        imgClassName="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-black">{item.product.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.product.size} • {item.product.material.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-lg font-light text-black mt-2">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id.toString())}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id.toString(), item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id.toString(), item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 h-fit">
              <h2 className="text-xl font-light text-black mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({totalItems})</span>
                  <span className="text-black">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-black">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-black">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-black">Total</span>
                    <span className="text-lg font-medium text-black">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-none py-3 text-lg disabled:opacity-50"
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}