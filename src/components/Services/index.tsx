import React from 'react'
import Link from 'next/link'
import { Clock, Briefcase, Zap, Camera, Users, Star } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Service, ServicesPage } from '@/payload-types'

interface ServicesProps {
  services: Service[]
  servicesPageData?: ServicesPage
}

const iconMap = {
  clock: Clock,
  briefcase: Briefcase,
  zap: Zap,
  camera: Camera,
  users: Users,
  star: Star,
}

const getGridCols = (count: number) => {
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2'
  if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
}

const getMaxWidth = (count: number) => {
  if (count === 1) return 'max-w-md mx-auto'
  if (count === 2) return 'max-w-4xl mx-auto'
  return ''
}

export const Services: React.FC<ServicesProps> = ({ services, servicesPageData }) => {
  // Sort services by order and filter active ones
  const activeServices = services
    .filter(service => service.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const gridCols = getGridCols(activeServices.length)
  const maxWidth = getMaxWidth(activeServices.length)
  
  // Get page content with fallbacks
  const pageTitle = servicesPageData?.pageTitle || 'Services'
  const consultationText = servicesPageData?.consultationText || 'Not sure which service fits your needs?'
  const consultationLinkText = servicesPageData?.consultationLinkText || 'Get in touch for a consultation'
  const consultationEmail = servicesPageData?.consultationEmail || 'hello@wmn.photo'

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6">{pageTitle}</h1>
          <div className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {servicesPageData?.pageDescription ? (
              <RichText data={servicesPageData.pageDescription} />
            ) : (
              <p>
                Professional photography services tailored to your creative and commercial needs.
                From business headshots to comprehensive brand campaigns.
              </p>
            )}
          </div>
        </div>

        {/* Service Tiles */}
        {activeServices.length > 0 ? (
          <div className={`grid ${gridCols} gap-8 ${maxWidth}`}>
            {activeServices.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap]

              return (
                <div
                  key={service.id}
                  className="border border-black p-8 hover:bg-gray-50 transition-colors duration-200 group flex flex-col h-full"
                >
                  {/* Icon */}
                  <div className="text-black mb-6 group-hover:scale-110 transition-transform duration-200">
                    {IconComponent && <IconComponent className="w-8 h-8" />}
                  </div>

                  {/* Content */}
                  <div className="flex-grow mb-8">
                    <h3 className="text-xl font-medium text-black mb-4">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {service.features?.map((featureItem, index) => {
                        const featureText = typeof featureItem === 'object' && featureItem?.feature 
                          ? featureItem.feature 
                          : String(featureItem)
                        
                        return (
                          <li key={index} className="text-sm text-gray-500 flex items-start">
                            <span className="w-1 h-1 bg-black rounded-full mt-2 mr-3 flex-shrink-0" />
                            {featureText}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link
                    href={service.ctaLink || '/services/book'}
                    className="inline-block w-full text-center bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors duration-200 text-sm font-medium tracking-wide mt-auto"
                  >
                    {service.ctaText || 'Learn More'}
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-16">
          <p className="text-gray-500 text-sm mb-4">
            {consultationText}
          </p>
          <Link
            href={`mailto:${consultationEmail}`}
            className="text-black hover:text-gray-600 transition-colors text-sm font-medium"
          >
            {consultationLinkText}
          </Link>
        </div>
      </div>
    </div>
  )
}
