import { getPayload } from 'payload'
import config from '@payload-config'
import React from 'react'
import type { About } from '@/payload-types'
import { Media } from '@/components/Media'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function AboutPage() {
  const payload = await getPayload({ config })
  
  // Get the first about entry (there should only be one)
  const aboutData = await payload.find({
    collection: 'about',
    limit: 1,
  })

  const about: About | null = aboutData.docs[0] || null

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
        
        {/* Content */}
        <div className={`${about.profilePhoto ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-8`}>
          {/* Bio */}
          {about.bio && (
            <div>
              <h2 className="text-2xl font-light mb-4">Biography</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {about.bio}
              </div>
            </div>
          )}
          
          {/* Artist Statement */}
          {about.artistStatement && (
            <div>
              <h2 className="text-2xl font-light mb-4">Artist Statement</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {about.artistStatement}
              </div>
            </div>
          )}
          
          {/* CV */}
          {about.cv && (
            <div>
              <h2 className="text-2xl font-light mb-4">Curriculum Vitae</h2>
              <div className="prose prose-lg max-w-none">
                <RichText data={about.cv} />
              </div>
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