import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Artwork } from '../payload-types'

export const revalidateArtwork: CollectionAfterChangeHook<Artwork> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      // Revalidate the homepage (portfolio grid)
      payload.logger.info(`Revalidating homepage for artwork: ${doc.title}`)
      revalidatePath('/')
      
      // Revalidate the individual artwork page
      const path = `/artwork/${doc.slug}`
      payload.logger.info(`Revalidating artwork page at path: ${path}`)
      revalidatePath(path)
      
      // Revalidate sitemap
      revalidateTag('artwork-sitemap')
    }

    // If the artwork was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/artwork/${previousDoc.slug}`
      payload.logger.info(`Revalidating old artwork page at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidatePath('/') // Homepage may need update too
      revalidateTag('artwork-sitemap')
    }

    // If slug changed, revalidate old path
    if (previousDoc?.slug && previousDoc.slug !== doc.slug && doc._status === 'published') {
      const oldPath = `/artwork/${previousDoc.slug}`
      payload.logger.info(`Artwork slug changed, revalidating old path: ${oldPath}`)
      revalidatePath(oldPath)
    }
  }
  return doc
}

export const revalidateArtworkDelete: CollectionAfterDeleteHook<Artwork> = ({ doc, req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    // Revalidate homepage and individual artwork page
    revalidatePath('/')
    if (doc?.slug) {
      const path = `/artwork/${doc.slug}`
      payload.logger.info(`Revalidating deleted artwork page at path: ${path}`)
      revalidatePath(path)
    }
    revalidateTag('artwork-sitemap')
  }

  return doc
}