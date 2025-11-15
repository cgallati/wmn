import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateGlobal: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating homepage due to global change`)

    // Revalidate homepage when header/footer changes
    revalidatePath('/')
  }
  return doc
}
