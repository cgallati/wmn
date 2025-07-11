import Link from 'next/link'
import React from 'react'
import { Instagram, Mail, Phone } from 'lucide-react'

export async function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-light text-black">
              WMN
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fine art photography capturing moments that tell stories. 
              Available for commissions, exhibitions, and private collections.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-black uppercase tracking-wide">Navigation</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-gray-600 hover:text-black transition-colors text-sm">
                Portfolio
              </Link>
              <Link href="/shop" className="block text-gray-600 hover:text-black transition-colors text-sm">
                Shop Prints
              </Link>
              <Link href="/book" className="block text-gray-600 hover:text-black transition-colors text-sm">
                Book Session
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-black uppercase tracking-wide">Contact</h3>
            <div className="space-y-3">
              <a 
                href="mailto:hello@wmn.photo" 
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                hello@wmn.photo
              </a>
              <a 
                href="tel:+1234567890" 
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                (123) 456-7890
              </a>
              <a 
                href="https://instagram.com/wmn.photo" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
              >
                <Instagram className="w-4 h-4" />
                @wmn.photo
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} WMN Photography. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-black transition-colors text-xs">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-black transition-colors text-xs">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
