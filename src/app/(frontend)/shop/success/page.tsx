import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Confirmed | WMN Photo',
  description: 'Your order has been confirmed',
  openGraph: {
    title: 'Order Confirmed | WMN Photo',
    description: 'Your order has been confirmed',
    siteName: 'WMN Photo',
    type: 'website',
  },
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-light text-black mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed and you will receive 
            an email confirmation shortly.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Your prints will be carefully prepared and shipped within 5-7 business days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-3">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-black text-black hover:bg-gray-50 rounded-none px-8 py-3">
                Back to Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}