import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateGlobal: GlobalAfterChangeHook = ({
  doc,
  global,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating global_${global.slug} and homepage`)

    // Header and Footer are read through getCachedGlobal, which caches under this tag on
    // every page. Without this, CMS nav changes only appear after a redeploy.
    revalidateTag(`global_${global.slug}`, 'max')
    revalidatePath('/')
  }
  return doc
}
