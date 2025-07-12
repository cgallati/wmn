#!/usr/bin/env node

/**
 * Toggle shop functionality on/off
 * Run with: node scripts/toggle-shop.js [on|off]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const envPath = path.join(rootDir, '.env')

const action = process.argv[2]

if (!action || !['on', 'off'].includes(action)) {
  console.error('Usage: node scripts/toggle-shop.js [on|off]')
  process.exit(1)
}

console.log(`🛍️  ${action === 'on' ? 'Enabling' : 'Disabling'} shop functionality...`)

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please copy .env.example to .env first.')
  process.exit(1)
}

// Read current .env
let envContent = fs.readFileSync(envPath, 'utf8')

// Update shop setting
const newValue = action === 'on' ? 'true' : 'false'
envContent = envContent.replace(/ENABLE_SHOP=.*/g, `ENABLE_SHOP=${newValue}`)

// Write back to .env
fs.writeFileSync(envPath, envContent)

console.log(`✅ Shop functionality ${action === 'on' ? 'enabled' : 'disabled'}`)
console.log(`   ENABLE_SHOP=${newValue}`)
console.log('')

if (action === 'on') {
  console.log('🛍️  Shop features now available:')
  console.log('   - Shop navigation links visible')
  console.log('   - Shopping cart accessible')
  console.log('   - /shop, /shop/cart, /shop/success pages accessible')
  console.log('   - Checkout and Stripe webhook APIs enabled')
} else {
  console.log('🚫 Shop features now disabled:')
  console.log('   - Shop navigation links hidden')
  console.log('   - Shopping cart hidden')
  console.log('   - /shop/* pages return 404')
  console.log('   - Checkout and Stripe APIs return 404')
}

console.log('')
console.log('🔄 Restart your development server to see changes:')