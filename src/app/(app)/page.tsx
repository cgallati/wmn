import type { Metadata } from 'next'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug: 'home',
  })

  if (!page) {
    return {
      title: 'Home',
      description: 'Photography Portfolio',
    }
  }

  return generateMeta({ doc: page })
}

// Revalidate every hour to ensure fresh data
export const revalidate = 3600

export default async function HomePage() {
  const page = await queryPageBySlug({
    slug: 'home',
  })

  if (!page) {
    return notFound()
  }

  const { layout } = page

  return <RenderBlocks blocks={layout} />
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}
