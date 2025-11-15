import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Artwork } from '../../../payload-types'

export const revalidateArtwork: CollectionAfterChangeHook<Artwork> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/artwork/${doc.slug}`

      payload.logger.info(`Revalidating artwork at path: ${path}`)

      revalidatePath(path)
      // Also revalidate homepage portfolio
      revalidatePath('/')
    }

    // If the artwork was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/artwork/${previousDoc.slug}`

      payload.logger.info(`Revalidating old artwork at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Artwork> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/artwork/${doc?.slug}`
    revalidatePath(path)
    // Also revalidate homepage portfolio
    revalidatePath('/')
  }

  return doc
}
