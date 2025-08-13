import Link from 'next/link'
import React from 'react'
import { Instagram, Mail, Phone } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Footer as FooterType } from '@/payload-types'

export async function Footer() {
  const payload = await getPayload({ config })
  
  let footerData: FooterType | null = null
  
  try {
    footerData = await payload.findGlobal({
      slug: 'footer',
    })
  } catch (error) {
    console.log('Footer global not found:', error)
  }

  // Default values (current hardcoded content)
  const defaultNavItems = [
    { label: 'Portfolio', url: '/' },
    { label: 'Shop Prints', url: '/shop' },
    { label: 'Services', url: '/services' }
  ]
  // Extract data with fallbacks
  const email = footerData?.contactInfo?.email || 'hello@wmn.photo'
  const phone = footerData?.contactInfo?.phone || '(123) 456-7890'
  const phoneHref = footerData?.contactInfo?.phoneHref || '+1234567890'
  const instagram = footerData?.contactInfo?.instagram || '@wmn.photo'
  const instagramUrl = footerData?.contactInfo?.instagramUrl || 'https://instagram.com/wmn.photo'
  const copyrightText = footerData?.copyrightText || 'WMN Photography. All rights reserved.'
  
  // Use CMS nav items if available, otherwise fall back to defaults
  const navItems = footerData?.navItems?.length ? footerData.navItems : defaultNavItems
  const legalLinks = footerData?.legalLinks || []

  return (
    <footer className="mt-16 lg:mt-auto bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-black uppercase tracking-wide">Navigation</h3>
            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const href = typeof item === 'object' && item.url ? item.url : (item as any)?.url || '/'
                const label = typeof item === 'object' && item.label ? item.label : (item as any)?.label || 'Link'
                
                // Skip shop link if shop is disabled
                if (href === '/shop' && process.env.NEXT_PUBLIC_ENABLE_SHOP !== 'true') {
                  return null
                }
                
                return (
                  <Link 
                    key={index}
                    href={href} 
                    className="block text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-black uppercase tracking-wide">Contact</h3>
            <div className="space-y-3">
              {email && (
                <a 
                  href={`mailto:${email}`} 
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  {email}
                </a>
              )}
              {phone && (
                <a 
                  href={`tel:${phoneHref}`} 
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {phone}
                </a>
              )}
              {instagram && instagramUrl && (
                <a 
                  href={instagramUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
                >
                  <Instagram className="w-4 h-4" />
                  {instagram}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} {copyrightText}
            </p>
            {legalLinks.length > 0 && (
              <div className="flex gap-6">
                {legalLinks.map((link, index) => (
                  <Link 
                    key={index}
                    href={link.url} 
                    className="text-gray-500 hover:text-black transition-colors text-xs"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
