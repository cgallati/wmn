# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `pnpm dev` - Start development server (Next.js app with Payload CMS)
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm test` - Run all tests (integration + e2e)
- `pnpm test:int` - Run integration tests (Vitest)
- `pnpm test:e2e` - Run end-to-end tests (Playwright)

### Payload CMS Commands
- `pnpm payload` - Access Payload CLI
- `pnpm generate:types` - Generate TypeScript types from Payload config
- `pnpm generate:importmap` - Generate import map for admin panel

### Database Commands
- `pnpm payload migrate:create` - Create new database migration
- `pnpm payload migrate` - Run pending migrations

## Architecture Overview

This is a **Photographer's Website** built with Payload CMS 3.0 and Next.js, featuring:

### Core Stack
- **Next.js 15** with App Router (React 19)
- **Payload CMS v3** for content management
- **SQLite** database (configurable to PostgreSQL for production)
- **TypeScript** throughout
- **TailwindCSS** for styling with minimal, B&W aesthetic
- **Stripe** for payment processing
- **Cart** context for shopping functionality

### Key Features

#### Portfolio System
- Full-width responsive image grid on homepage
- Series-based filtering for artwork organization
- Individual artwork detail pages with metadata
- Large hero images maximizing screen real estate

#### E-commerce Shop
- Product catalog with print sales
- Shopping cart with local storage persistence
- Stripe checkout integration
- Inventory management and edition tracking
- Order fulfillment tracking

#### Booking System
- Contact/booking form for photography services
- Comprehensive inquiry capture (event details, budget, etc.)
- Status tracking for bookings

#### Collections Structure
- `Artwork` - Portfolio pieces with detailed metadata (camera settings, location, etc.)
- `Products` - Print sales with pricing, sizes, materials, and editions
- `Orders` - Purchase tracking with customer and shipping info
- `Bookings` - Photography service inquiries and bookings
- `Media` - File uploads and assets
- `Users` - Admin authentication only (no public user accounts)

#### Payment Integration
- **Stripe Checkout**: Secure payment processing
- **Webhook Handling**: Order creation and inventory updates
- **Cart Management**: Persistent shopping cart with React context
- **Order Tracking**: Complete order lifecycle management

#### Design Aesthetic
- **Minimal Design**: Clean, white background with black text
- **Typography**: Light font weights throughout
- **Navigation**: Fixed header with simple navigation
- **Mobile-first**: Responsive design using Tailwind CSS

### File Structure

#### Core Configuration
- `src/payload.config.ts` - Main Payload configuration
- `next.config.js` - Next.js configuration with Payload integration
- `src/collections/` - Payload collection definitions
- `src/globals/` - Global configurations (Header, Footer)

#### Frontend Components
- `src/app/` - Next.js App Router pages and API routes
- `src/blocks/` - Reusable content blocks for layout builder
- `src/components/` - Shared React components
- `src/heros/` - Hero section components

#### Content Management
- `src/fields/` - Reusable Payload field configurations
- `src/hooks/` - Payload hooks for data manipulation
- `src/access/` - Access control functions
- `src/plugins/` - Plugin configurations

#### Utilities
- `src/utilities/` - Helper functions for URLs, metadata, etc.
- `src/search/` - Search functionality
- `src/endpoints/` - API endpoints and seed data

### Site Structure

#### Public Routes
- `/` - Portfolio page with image grid
- `/shop` - Product catalog and shopping
- `/shop/cart` - Shopping cart
- `/shop/success` - Order confirmation
- `/book` - Booking/contact form
- `/artwork/[slug]` - Individual artwork detail pages

#### API Routes
- `/api/checkout` - Stripe checkout session creation
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/booking` - Booking form submission

#### Admin Routes
- `/admin` - Payload CMS admin panel (admin users only)

### Development Workflow

1. **Content Management**: Use Payload admin panel to manage artwork, products, orders, and bookings
2. **Artwork**: Upload images and add metadata through the Artwork collection
3. **Products**: Create print products linked to artwork with pricing and edition info
4. **Orders**: Track and manage orders created through Stripe checkout
5. **Bookings**: Review and manage photography service inquiries
6. **Type Generation**: Run `pnpm generate:types` after schema changes
7. **Testing**: Run integration and E2E tests before deployment

### Environment Configuration

Required environment variables:
- `DATABASE_URI` - Database connection (SQLite for dev, PostgreSQL for prod)
- `PAYLOAD_SECRET` - JWT token encryption
- `STRIPE_SECRET_KEY` - Stripe server-side key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe client-side key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook validation
- `NEXT_PUBLIC_SERVER_URL` - Site URL for CORS and links

### Deployment Considerations

- **Vercel**: Optimized for Vercel deployment
- **Database**: Configure PostgreSQL for production
- **Stripe**: Set up webhooks and configure keys
- **Images**: Ensure proper image optimization settings
- **Analytics**: Vercel Analytics integration ready

### Common Patterns

- **Cart Management**: Use the `useCart()` hook for shopping functionality
- **Type Safety**: Leverage generated types from `payload-types.ts`
- **Image Display**: Use the `Media` component for artwork images
- **Form Handling**: Follow patterns in `BookingForm` component
- **API Integration**: Use Next.js API routes for backend operations