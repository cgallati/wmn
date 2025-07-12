'use client'

import React from 'react'
import Link from 'next/link'
import { Clock, Briefcase, Zap } from 'lucide-react'

interface ServiceTile {
  id: string
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
  cta: string
  href: string
}

const services: ServiceTile[] = [
  {
    id: 'session',
    title: 'Photography Sessions',
    description: 'Hourly photography sessions for portraits, events, and creative projects',
    features: [
      'Flexible hourly rates',
      'Location or studio shooting',
      'High-resolution digital delivery',
      'Quick turnaround (3-5 days)',
    ],
    icon: <Clock className="w-8 h-8" />,
    cta: 'Book Session',
    href: '/services/book?type=session',
  },
  {
    id: 'brand-campaign',
    title: 'Brand Campaigns',
    description: 'Complete brand photography projects with creative direction and strategy',
    features: [
      'Brand strategy consultation',
      'Creative concept development',
      'Multi-shoot campaigns',
      'Content library creation',
    ],
    icon: <Briefcase className="w-8 h-8" />,
    cta: 'Start Campaign',
    href: '/services/book?type=brand-campaign',
  },
  {
    id: 'creative-direction',
    title: 'Creative Direction',
    description: 'End-to-end creative direction and campaign management for ongoing partnerships',
    features: [
      'Monthly retainer model',
      'Full campaign oversight',
      'Team coordination',
      'Performance optimization',
    ],
    icon: <Zap className="w-8 h-8" />,
    cta: 'Discuss Partnership',
    href: '/services/book?type=creative-direction',
  },
]

export const Services: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6">Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Professional photography services tailored to your creative and commercial needs.
            From intimate sessions to comprehensive brand campaigns.
          </p>
        </div>

        {/* Service Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="border border-black p-8 hover:bg-gray-50 transition-colors duration-200 group"
            >
              {/* Icon */}
              <div className="text-black mb-6 group-hover:scale-110 transition-transform duration-200">
                {service.icon}
              </div>

              {/* Content */}
              <div className="mb-8">
                <h3 className="text-xl font-medium text-black mb-4">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-500 flex items-start">
                      <span className="w-1 h-1 bg-black rounded-full mt-2 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                href={service.href}
                className="inline-block w-full text-center bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                {service.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-16 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-4">
            Not sure which service fits your needs?
          </p>
          <Link
            href="mailto:hello@wmn.photo"
            className="text-black hover:text-gray-600 transition-colors text-sm font-medium"
          >
            Get in touch for a consultation
          </Link>
        </div>
      </div>
    </div>
  )
}