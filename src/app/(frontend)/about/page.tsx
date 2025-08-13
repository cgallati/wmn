import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import type { About } from '@/payload-types'
import { Media } from '@/components/Media'
import { RichText } from '@payloadcms/richtext-lexical/react'

// Cache about page for 1 hour - content changes trigger revalidation
export const revalidate = 3600

export default async function AboutPage() {
  const payload = await getPayload({ config })
  
  let about: About | null = null
  
  try {
    // Get the first about entry (there should only be one)
    const aboutData = await payload.find({
      collection: 'about',
      limit: 1,
    })
    about = aboutData.docs[0] || null
  } catch (error) {
    // Handle case where collection doesn't exist yet or other database errors
    console.log('About collection not found or database error:', error)
    about = null
  }

  if (!about) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-light mb-8">About</h1>
        <p className="text-gray-600">About content is being updated. Please check back soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-light mb-12">About</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Photo */}
        {about.profilePhoto && (
          <div className="lg:col-span-1">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Media
                resource={about.profilePhoto}
                className="object-cover w-full h-full"
                alt="Profile photo"
              />
            </div>
          </div>
        )}
        
        {/* Content Sections */}
        <div className={`${about.profilePhoto ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-8`}>
          {about.sections && about.sections.length > 0 ? (
            about.sections
              .filter(section => section.isVisible)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section, index) => {
                const sectionTitles = {
                  bio: 'Biography',
                  artistStatement: 'Artist Statement',
                  cv: 'Curriculum Vitae',
                  custom: section.title || 'About'
                }
                
                const sectionTitle = sectionTitles[section.sectionType as keyof typeof sectionTitles] || 'About'
                
                return (
                  <div key={`${section.sectionType}-${index}`}>
                    <h2 className="text-2xl font-light mb-4">{sectionTitle}</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <RichText data={section.content} />
                    </div>
                  </div>
                )
              })
          ) : (
            <div className="text-gray-500">
              <p>About content is being updated. Please check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'About | WMN Photo',
    description: 'Learn about the photographer behind WMN Photo',
  }
}