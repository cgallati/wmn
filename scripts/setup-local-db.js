#!/usr/bin/env node

/**
 * Setup script for local database development
 * Run with: node scripts/setup-local-db.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const envPath = path.join(rootDir, '.env')

console.log('🔧 Setting up local development database...')

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please copy .env.example to .env first.')
  process.exit(1)
}

// Read current .env
let envContent = fs.readFileSync(envPath, 'utf8')

// Update toggles for local development
envContent = envContent.replace(/USE_LOCAL_DB=.*/g, 'USE_LOCAL_DB=true')
envContent = envContent.replace(/USE_LOCAL_STORAGE=.*/g, 'USE_LOCAL_STORAGE=true')

// Write back to .env
fs.writeFileSync(envPath, envContent)

console.log('✅ Updated .env for local development:')
console.log('   - USE_LOCAL_DB=true (using local dev.db file)')
console.log('   - USE_LOCAL_STORAGE=true (using local file storage)')
console.log('')
console.log('🚀 Now run: pnpm dev')
console.log('   The local database will be created automatically on first run.')
console.log('')
console.log('💡 To switch back to remote services:')
console.log('   - Set USE_LOCAL_DB=false and uncomment DATABASE_URI/DATABASE_AUTH_TOKEN')
console.log('   - Set USE_LOCAL_STORAGE=false and ensure BLOB_READ_WRITE_TOKEN is set')