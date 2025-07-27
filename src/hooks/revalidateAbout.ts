import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { About } from '../payload-types'

export const revalidateAbout: CollectionAfterChangeHook<About> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating about page`)
      revalidatePath('/about')
    }

    // If the about content was previously published and is now unpublished
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      payload.logger.info(`Revalidating about page (unpublished)`)
      revalidatePath('/about')
    }
  }
  return doc
}

export const revalidateAboutDelete: CollectionAfterDeleteHook<About> = ({ doc, req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating about page (deleted)`)
    revalidatePath('/about')
  }

  return doc
}