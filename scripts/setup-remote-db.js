#!/usr/bin/env node

/**
 * Setup script for remote database development
 * Run with: node scripts/setup-remote-db.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const envPath = path.join(rootDir, '.env')

console.log('🌐 Setting up remote development services...')

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please copy .env.example to .env first.')
  process.exit(1)
}

// Read current .env
let envContent = fs.readFileSync(envPath, 'utf8')

// Update toggles for remote development
envContent = envContent.replace(/USE_LOCAL_DB=.*/g, 'USE_LOCAL_DB=false')
envContent = envContent.replace(/USE_LOCAL_STORAGE=.*/g, 'USE_LOCAL_STORAGE=false')

// Uncomment remote database settings if they exist
envContent = envContent.replace(/#DATABASE_URI=/g, 'DATABASE_URI=')
envContent = envContent.replace(/#DATABASE_AUTH_TOKEN=/g, 'DATABASE_AUTH_TOKEN=')

// Write back to .env
fs.writeFileSync(envPath, envContent)

console.log('✅ Updated .env for remote development:')
console.log('   - USE_LOCAL_DB=false (using Turso database)')
console.log('   - USE_LOCAL_STORAGE=false (using Vercel Blob storage)')
console.log('')
console.log('⚠️  Make sure you have:')
console.log('   - DATABASE_URI and DATABASE_AUTH_TOKEN configured')
console.log('   - BLOB_READ_WRITE_TOKEN configured')
console.log('')
console.log('🚀 Now run: pnpm dev')