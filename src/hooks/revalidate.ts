import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const revalidate: CollectionAfterChangeHook = async ({ doc, previousDoc, operation }) => {
  if (operation === 'create' || operation === 'update') {
    // Only trigger revalidation if the document status changed to/from published
    const wasPublished = previousDoc?._status === 'published'
    const isPublished = doc._status === 'published'
    
    if (wasPublished !== isPublished) {
      await triggerRevalidation()
    }
  }
}

const revalidateDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  // Always revalidate on delete if the document was published
  if (doc._status === 'published') {
    await triggerRevalidation()
  }
}

const triggerRevalidation = async (): Promise<void> => {
  try {
    const revalidateUrl = process.env.VERCEL_DEPLOY_HOOK_URL
    
    if (!revalidateUrl) {
      console.log('No VERCEL_DEPLOY_HOOK_URL configured')
      return
    }

    const response = await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      console.log('Successfully triggered Vercel redeployment')
    } else {
      console.error('Failed to trigger Vercel redeployment:', response.status)
    }
  } catch (error) {
    console.error('Error triggering Vercel redeployment:', error)
  }
}

export { revalidate, revalidateDelete }