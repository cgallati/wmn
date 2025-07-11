import { Metadata } from 'next'
import { BookingForm } from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Book | WMN Photo',
  description: 'Book a photography session with WMN',
  openGraph: {
    title: 'Book | WMN Photo',
    description: 'Book a photography session with WMN',
    siteName: 'WMN Photo',
    type: 'website',
  },
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-black mb-4">Book a Session</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            I&apos;d love to work with you to capture your special moments. 
            Please fill out the form below and I&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <BookingForm />
      </div>
    </div>
  )
}