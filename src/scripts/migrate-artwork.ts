#!/usr/bin/env node

/**
 * Portfolio Migration Script
 *
 * Migrates Artwork collection from old database to new database using Payload API.
 * Ensures referential integrity by using Payload's create methods instead of direct DB writes.
 *
 * Usage:
 *   1. Set OLD_DATABASE_URI in .env
 *   2. Run: pnpm migrate:artwork
 *   3. Review output for any errors
 *   4. Manually re-upload images and link to artwork
 *
 * Features:
 *   - Dry-run mode (set DRY_RUN=true)
 *   - Detailed logging
 *   - Error handling
 *   - Progress tracking
 */

import { MongoClient } from 'mongodb'
import { getPayload } from 'payload'
import config from '@payload-config'
import * as dotenv from 'dotenv'

// Load environment variables
// Load .env.local first (takes priority), then .env as fallback
dotenv.config({ path: '.env.local' })
dotenv.config() // This won't override existing variables

// Configuration
const OLD_DATABASE_URI = process.env.OLD_DATABASE_URI
const NEW_DATABASE_URI = process.env.DATABASE_URI
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET
const DRY_RUN = process.env.DRY_RUN === 'true'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

interface OldArtwork {
  _id: string
  title: string
  description?: any
  series?: string
  year?: number
  medium?: string
  dimensions?: string
  camera?: string
  lens?: string
  location?: string
  aperture?: string
  shutter?: string
  iso?: number
  featured?: boolean
  publishedAt?: string | Date
  slug?: string
  _status?: 'draft' | 'published'
  createdAt?: string | Date
  updatedAt?: string | Date
}

interface MigrationStats {
  total: number
  success: number
  failed: number
  skipped: number
  errors: Array<{ title: string; error: string }>
}

async function connectToOldDatabase() {
  if (!OLD_DATABASE_URI) {
    throw new Error('OLD_DATABASE_URI environment variable is not set')
  }

  log('\n📡 Connecting to old database...', 'cyan')
  const client = new MongoClient(OLD_DATABASE_URI)
  await client.connect()
  log('✓ Connected to old database', 'green')

  return client
}

async function fetchOldArtwork(client: MongoClient): Promise<OldArtwork[]> {
  log('\n📥 Fetching artwork from old database...', 'cyan')

  const db = client.db()
  // Note: Old database used 'artworks' (plural), new uses 'artwork' (singular)
  const artwork = await db.collection('artworks').find({}).toArray()

  log(`✓ Found ${artwork.length} artwork documents`, 'green')

  return artwork as unknown as OldArtwork[]
}

async function migrateArtwork(oldArtwork: OldArtwork[], stats: MigrationStats) {
  log('\n🚀 Starting migration...', 'cyan')

  if (DRY_RUN) {
    log('⚠️  DRY RUN MODE - No data will be written', 'yellow')
  }

  if (!NEW_DATABASE_URI) {
    throw new Error('DATABASE_URI environment variable is not set')
  }

  // Initialize Payload
  log('📦 Initializing Payload...', 'cyan')
  const payload = await getPayload({ config })
  log('✓ Payload initialized', 'green')

  // Migrate each artwork
  for (let i = 0; i < oldArtwork.length; i++) {
    const artwork = oldArtwork[i]
    const progress = `[${i + 1}/${oldArtwork.length}]`

    try {
      log(`\n${progress} Migrating: "${artwork.title}"`, 'blue')

      // Prepare artwork data (exclude image and availablePrints)
      const newArtworkData = {
        title: artwork.title,
        description: artwork.description || undefined,
        series: artwork.series || undefined,
        year: artwork.year || undefined,
        medium: artwork.medium || undefined,
        dimensions: artwork.dimensions || undefined,
        camera: artwork.camera || undefined,
        lens: artwork.lens || undefined,
        location: artwork.location || undefined,
        aperture: artwork.aperture || undefined,
        shutter: artwork.shutter || undefined,
        iso: artwork.iso || undefined,
        featured: artwork.featured || false,
        publishedAt: artwork.publishedAt ? new Date(artwork.publishedAt) : undefined,
        slug: artwork.slug || undefined,
        _status: artwork._status || 'draft',
      }

      if (DRY_RUN) {
        log(`  ✓ Would create: ${artwork.title}`, 'yellow')
        stats.skipped++
      } else {
        // Create via Payload API as draft with validation bypassed
        const created = await payload.create({
          collection: 'artwork',
          data: {
            ...newArtworkData,
            _status: 'draft', // Always create as draft for review
          },
          overrideAccess: true, // Bypass access control
          draft: true, // Create as draft
        })

        log(`  ✓ Created with ID: ${created.id} (draft)`, 'green')
        stats.success++
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      log(`  ✗ Failed: ${errorMessage}`, 'red')
      stats.failed++
      stats.errors.push({
        title: artwork.title,
        error: errorMessage,
      })
    }
  }
}

function printSummary(stats: MigrationStats) {
  log('\n' + '='.repeat(60), 'bright')
  log('MIGRATION SUMMARY', 'bright')
  log('='.repeat(60), 'bright')

  log(`\nTotal artwork:     ${stats.total}`, 'cyan')
  log(`Successfully migrated: ${stats.success}`, 'green')

  if (stats.skipped > 0) {
    log(`Skipped (dry run):     ${stats.skipped}`, 'yellow')
  }

  if (stats.failed > 0) {
    log(`Failed:                ${stats.failed}`, 'red')
    log('\nErrors:', 'red')
    stats.errors.forEach((err, i) => {
      log(`  ${i + 1}. "${err.title}": ${err.error}`, 'red')
    })
  }

  log('\n' + '='.repeat(60), 'bright')

  if (!DRY_RUN && stats.success > 0) {
    log('\n✨ Next steps:', 'magenta')
    log('  1. Log into your admin panel', 'reset')
    log('  2. Manually upload images to Media collection', 'reset')
    log('  3. Edit each artwork and link the uploaded image', 'reset')
    log('  4. (Optional) Link artwork to print products', 'reset')
  }

  if (DRY_RUN) {
    log('\n💡 To run migration for real, remove DRY_RUN=true', 'yellow')
  }
}

async function main() {
  const stats: MigrationStats = {
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  let oldDbClient: MongoClient | null = null

  try {
    // Banner
    log('\n' + '='.repeat(60), 'bright')
    log('🎨 ARTWORK MIGRATION SCRIPT', 'bright')
    log('='.repeat(60), 'bright')

    // Validate environment
    if (!OLD_DATABASE_URI) {
      throw new Error(
        'OLD_DATABASE_URI is not set. Please add it to your .env.local file:\nOLD_DATABASE_URI=mongodb://...',
      )
    }

    if (!NEW_DATABASE_URI) {
      throw new Error('DATABASE_URI is not set. Please check your .env.local file.')
    }

    if (!PAYLOAD_SECRET) {
      throw new Error(
        'PAYLOAD_SECRET is not set. Please check your .env.local file.\nMake sure you are using the production secret when migrating to production database.',
      )
    }

    // Connect to old database
    oldDbClient = await connectToOldDatabase()

    // Fetch old artwork
    const oldArtwork = await fetchOldArtwork(oldDbClient)
    stats.total = oldArtwork.length

    if (stats.total === 0) {
      log('\n⚠️  No artwork found in old database. Nothing to migrate.', 'yellow')
      return
    }

    // Migrate artwork
    await migrateArtwork(oldArtwork, stats)

    // Print summary
    printSummary(stats)

    // Exit with appropriate code
    process.exit(stats.failed > 0 ? 1 : 0)
  } catch (error) {
    log('\n❌ Migration failed:', 'red')
    log(error instanceof Error ? error.message : String(error), 'red')
    process.exit(1)
  } finally {
    // Clean up
    if (oldDbClient) {
      await oldDbClient.close()
      log('\n🔌 Disconnected from old database', 'cyan')
    }
  }
}

// Run the migration
main()
