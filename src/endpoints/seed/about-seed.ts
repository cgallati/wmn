import type { Payload } from 'payload'

export const seedAbout = async (payload: Payload): Promise<void> => {
  try {
    // Check if about content already exists
    const existingAbout = await payload.find({
      collection: 'about',
      limit: 1,
    })

    if (existingAbout.docs.length > 0) {
      payload.logger.info('About content already exists, skipping seed')
      return
    }

    // Create sample about content
    await payload.create({
      collection: 'about',
      data: {
        title: 'About',
        bio: `Will M. Nichols is a contemporary photographer based in the Pacific Northwest, specializing in fine art landscape and architectural photography. His work explores the relationship between natural and built environments, capturing moments of quiet beauty in both urban and wilderness settings.

With over a decade of experience in the field, Will's photographs have been featured in galleries across the region and collected by private clients worldwide. His minimalist approach emphasizes composition, light, and the subtle interplay between shadow and form.`,
        artistStatement: `My photography seeks to find the extraordinary within the ordinary, revealing the hidden poetry in everyday scenes. I am drawn to moments of transition—the interplay between light and shadow, the meeting of natural and constructed spaces, the quiet drama of changing weather.

Working primarily with medium format cameras, I employ a deliberate, contemplative approach that allows me to fully engage with each scene. My process is meditative, requiring patience and careful observation to capture not just what I see, but what I feel in these spaces.

Through my work, I hope to encourage viewers to slow down and notice the subtle beauty that surrounds us daily. Each photograph is an invitation to pause, observe, and find meaning in the quiet moments that too often pass unnoticed.`,
        cv: null, // Will be manually entered through the admin interface
        publishedAt: new Date().toISOString(),
      },
    })

    payload.logger.info('✅ About content seeded successfully')
  } catch (error) {
    payload.logger.error('Error seeding about content:')
    payload.logger.error(error)
  }
}