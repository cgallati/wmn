import type { Metadata } from 'next'
import { Portfolio } from '@/components/Portfolio'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Photography Portfolio',
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artwork',
    depth: 1,
    draft,
    limit: 100,
    overrideAccess: draft,
    sort: '-publishedAt',
    where: {
      ...(draft ? {} : { _status: { equals: 'published' } }),
    },
  })

  return (
    <main className="min-h-screen">
      <div className="py-8">
        <div className="container">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Portfolio</h1>
        </div>
      </div>
      <Portfolio artwork={result.docs} />
    </main>
  )
}
