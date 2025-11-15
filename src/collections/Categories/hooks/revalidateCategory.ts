import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Category } from '../../../payload-types'

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating shop page due to category change: ${doc.title}`)

    // Revalidate shop page when categories change
    revalidatePath('/shop')
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Category> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    // Revalidate shop page when category is deleted
    revalidatePath('/shop')
  }

  return doc
}
