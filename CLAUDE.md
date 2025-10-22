# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a photography portfolio and ecommerce site built on Payload CMS 3.0 with Next.js 15. The project is a second iteration, migrating from a custom implementation to using Payload's native ecommerce plugin. The goal is to recreate the portfolio functionality from the archived project (`../archive/wmn`) while leveraging the framework's built-in ecommerce capabilities for selling limited edition prints.

**Key requirement**: Products (limited edition prints) should display sold-out items at the end of the shop in a sold-out state when their inventory count reaches zero.

## Tech Stack

- **CMS**: Payload CMS 3.0 with ecommerce plugin
- **Frontend**: Next.js 15 with App Router, React 19
- **Database**: MongoDB Atlas (via `@payloadcms/db-mongodb`)
- **Storage**: Vercel Blob Storage for media
- **Styling**: Tailwind CSS 4.x with shadcn/ui components
- **Payments**: Stripe integration via `@payloadcms/plugin-ecommerce`
- **Rich Text**: Lexical editor
- **Type Safety**: TypeScript with strict mode

## Development Commands

```bash
# Install dependencies
pnpm install

# Development (DON'T RUN - user manages dev server)
# pnpm dev

# Build for production
pnpm build

# Type generation (run after schema changes)
pnpm generate:types

# Import map generation (run after adding imports)
pnpm generate:importmap

# Linting
pnpm lint
pnpm lint:fix

# Testing
pnpm test        # Run all tests
pnpm test:int    # Integration tests (Vitest)
pnpm test:e2e    # E2E tests (Playwright)

# Stripe webhook testing (separate terminal)
pnpm stripe-webhooks
```

## Important Development Notes

### DO NOT Run Dev Servers
The user often has their own dev server running. DO NOT run `pnpm dev` or any dev server commands. Instead, instruct the user to run/restart their dev server when needed and test changes themselves.

### Port Conflicts
Always check which ports are in use before suggesting any server commands, as the user's dev server may already be running on port 3000.

### Payload Migrations
DO NOT attempt to create Payload migration files programmatically. Instead:
1. Stop and instruct the user to run: `pnpm payload migrate:create`
2. Let the user run the migration CLI themselves
3. Resume work after the migration is created

### Documentation First
When working with unfamiliar CLIs or libraries, DO NOT proceed blindly. If you encounter errors fetching docs (like HTTP 429), stop and ask the user to provide the documentation before continuing. This prevents introducing errors from incorrect assumptions.

### Commit Messages
- DO NOT mention Claude or co-authors in commit messages
- DO NOT reference "Claude Code" in commits
- Keep messages focused and professional

## Architecture

### Collections

**Products** (`src/collections/Products/`)
- Core ecommerce collection added by the ecommerce plugin
- Override configuration in `src/collections/Products/index.ts`
- Fields include:
  - `title`, `slug`, `description` (Lexical rich text)
  - `gallery` (array of images with optional variant associations)
  - `layout` blocks (CallToAction, Content, MediaBlock)
  - Pricing per currency (`priceInUSD`)
  - `inventory` tracking for limited editions
  - `enableVariants` with variant options/types
  - `categories` relationship
  - SEO meta fields
  - `relatedProducts` relationship
- Versioning with drafts enabled
- Live preview and draft preview support

**Users** (`src/collections/Users/`)
- Auth-enabled with two roles: `admin` and `customer`
- Admins: Full access to admin panel and content management
- Customers: Frontend-only access, can view their own orders/addresses/carts
- First user automatically becomes admin (hook: `ensureFirstUserIsAdmin.ts`)

**Pages** (`src/collections/Pages/`)
- Layout builder with blocks: CallToAction, Content, MediaBlock, Archive, Carousel, ThreeItemGrid, Banner, FormBlock
- Hero configuration via `src/fields/hero.ts`
- SEO fields from `@payloadcms/plugin-seo`
- Versioning with drafts and autosave
- Revalidation hooks for on-demand ISR

**Categories** (`src/collections/Categories.ts`)
- Taxonomy for organizing products
- Simple title-based categorization

**Media** (`src/collections/Media.ts`)
- Upload collection for images, videos, and other assets
- Configured with Vercel Blob Storage adapter

**Ecommerce Plugin Collections** (automatically added):
- **Carts**: Track user and guest shopping carts
- **Addresses**: Store customer shipping addresses
- **Orders**: Created after successful transactions
- **Transactions**: Track payment lifecycle from initiation to completion
- **Variants** & **VariantOptions**: Product variation management

### Globals

**Header** (`src/globals/Header.ts`)
- Navigation links array (`navItems`)
- Uses `src/fields/link.ts` for flexible link configuration

**Footer** (`src/globals/Footer.ts`)
- Footer navigation links
- Similar structure to Header

### Access Control (`src/access/`)

The project uses granular access control functions:

- `adminOnly.ts`: Restricts to admin users only
- `adminOnlyFieldAccess.ts`: Field-level admin restriction
- `adminOrPublishedStatus.ts`: Admins or published content only
- `adminOrCustomerOwner.ts`: Admins or customers who own the resource
- `adminOrSelf.ts`: Admins or the user themselves
- `customerOnlyFieldAccess.ts`: Field-level customer restriction
- `publicAccess.ts`: Public read access
- `utilities.ts`: Helper functions for access control logic

**Access patterns**:
- Products/Pages: Everyone can read published, admins can CRUD
- Carts: Customers can access their own, guests can access by ID
- Addresses: Customers can access their own
- Transactions: Admin-only
- Orders: Admins and order owners

### Plugins Configuration (`src/plugins/index.ts`)

1. **SEO Plugin** (`@payloadcms/plugin-seo`)
   - Auto-generates titles and URLs
   - Integrated into Products and Pages

2. **Form Builder Plugin** (`@payloadcms/plugin-form-builder`)
   - Payment disabled
   - Lexical editor for confirmation messages
   - Forms grouped under "Content" in admin

3. **Ecommerce Plugin** (`@payloadcms/plugin-ecommerce`)
   - Stripe payment adapter configured
   - Customer collection: `users`
   - Products collection override: `ProductsCollection`
   - Access control functions configured
   - Requires env vars: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOKS_SIGNING_SECRET`

### Blocks System

The project uses a flexible blocks system for page layouts:

- **Archive** (`src/blocks/ArchiveBlock/`): Display collections of content
- **Banner** (`src/blocks/Banner/`): Promotional banners
- **CallToAction** (`src/blocks/CallToAction/`): CTA buttons/sections
- **Carousel** (`src/blocks/Carousel/`): Image/content carousels with auto-scroll
- **Code** (`src/blocks/Code/`): Code snippets with syntax highlighting
- **Content** (`src/blocks/Content/`): Rich text content blocks
- **Form** (`src/blocks/Form/`): Dynamic forms with validation
- **MediaBlock** (`src/blocks/MediaBlock/`): Image/video display
- **ThreeItemGrid** (`src/blocks/ThreeItemGrid/`): 3-column grid layout

Blocks are rendered via `src/blocks/RenderBlocks.tsx`.

### Frontend Structure (`src/app/`)

**App Router Organization**:
- `(app)/`: Main frontend routes
  - `/page.tsx`: Homepage
  - `/[slug]/page.tsx`: Dynamic pages (from Pages collection)
  - `/products/[slug]/page.tsx`: Product detail pages
  - `/shop/page.tsx`: Shop/catalog page
  - `/checkout/page.tsx`: Checkout flow
  - `/checkout/confirm-order/page.tsx`: Order confirmation
  - `/(account)/`: Authenticated user routes
    - `/account/page.tsx`: Account dashboard
    - `/orders/page.tsx`: Order history
    - `/orders/[id]/page.tsx`: Order details
    - `/account/addresses/page.tsx`: Address management
  - `/login`, `/create-account`, `/logout`, `/forgot-password`: Auth pages
  - `/find-order/page.tsx`: Guest order lookup

- `(payload)/`: Payload admin panel
  - `/admin/[[...segments]]/`: Admin routes

### Components

**UI Components** (`src/components/ui/`)
- shadcn/ui components: button, card, checkbox, input, label, pagination, select, textarea, accordion, carousel, dialog, sheet, sonner (toast notifications)

**Feature Components** (`src/components/`)
- `Cart/`: Cart management (AddToCart, CartModal, DeleteItem, EditQuantity, OpenCart, CloseCart)
- `CategoryTabs/`: Product category filtering
- `Header/`: Site navigation
- `Footer/`: Site footer
- `Media/`: Image and video rendering with Next.js optimization
- `ProductGridItem/`: Product display in grids
- `ProductItem/`: Product detail view
- `Search/`: Search functionality
- `RichText/`: Lexical rich text renderer
- `AdminBar/`: Admin editing bar for logged-in users
- `Link/`: Smart link component (internal/external)
- `checkout/`: Checkout flow components
- `forms/`: Form components
- `addresses/`: Address management
- `OrderItem/`, `OrderStatus/`: Order display components

### Utilities (`src/utilities/`)

- `generateMeta.ts`: Meta tag generation for SEO
- `generatePreviewPath.ts`: Draft preview URL generation
- `getGlobals.ts`: Fetch global data (header, footer)
- `getURL.ts`: Server-side URL utilities
- `formatDateTime.ts`: Date formatting with date-fns
- `cn.ts`: Tailwind class name utility (clsx + tailwind-merge)
- `useClickableCard.ts`: Hook for making cards clickable
- `createUrl.ts`: URL construction helper

### Environment Variables

Required variables (see `.env.example`):

```bash
# Payload
PAYLOAD_SECRET=                    # Encryption secret
DATABASE_URI=                      # MongoDB connection string
PAYLOAD_PUBLIC_SERVER_URL=         # Public URL
NEXT_PUBLIC_SERVER_URL=            # Client-side URL

# Preview
PREVIEW_SECRET=                    # Draft preview secret

# Stripe
STRIPE_SECRET_KEY=                 # Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Stripe public key
STRIPE_WEBHOOKS_SIGNING_SECRET=    # Webhook verification

# Branding (optional)
COMPANY_NAME=
TWITTER_CREATOR=
TWITTER_SITE=
SITE_NAME=
```

## Key Project Goals

### Portfolio Implementation
Recreate the portfolio functionality from `../archive/wmn`:
- **Artwork Collection**: Display photography work with metadata (year, medium, dimensions, camera settings, location)
- **Portfolio Grid**: Responsive grid layout with hover effects
- **Artwork Detail Pages**: Full image view with complete metadata
- **Integration**: Link artwork to available print products

### Ecommerce Requirements
Use Payload's native ecommerce plugin for:
- **Limited Edition Prints**: Each product has inventory count
- **Sold Out Handling**: Products with zero inventory should display at the end of shop in a sold-out state
- **Product Variants**: Support different sizes/materials via variant system
- **Stripe Integration**: Secure payment processing
- **Order Management**: Track orders and transactions
- **Customer Accounts**: Allow customers to view order history

## Database Migrations

This project uses MongoDB, which doesn't require strict migrations like SQL databases. However, when making schema changes:

1. Update collection/field definitions in code
2. Run `pnpm generate:types` to update TypeScript types
3. Payload will handle schema synchronization automatically in development

For production deployments, review schema changes carefully as MongoDB is flexible but changes can affect existing data.

## Testing

- **Integration Tests**: Vitest configuration in `vitest.config.mts`
- **E2E Tests**: Playwright configuration in `playwright.config.ts`
- Tests validate frontend functionality, ecommerce flows, and admin panel operations
- Run tests before committing significant changes

## Deployment

The project is configured for Vercel deployment:
- MongoDB Atlas for database (connection string in env)
- Vercel Blob Storage for media uploads
- Stripe webhooks need to be configured in Stripe dashboard
- Set all environment variables in Vercel project settings
- Jobs/scheduled publishing may be limited to daily cron on certain Vercel tiers

## Seeding Data

A seed endpoint exists at `/api/seed` (accessible via admin panel "Seed Database" button):
- Creates demo products, pages, and orders
- Creates demo customer: `customer@example.com` / `password`
- **WARNING**: Seeding is destructive and drops existing data
- Only use when starting fresh or in development

## Documentation References

- Payload CMS: https://payloadcms.com/docs
- Payload Ecommerce: https://payloadcms.com/docs/ecommerce/overview
- Next.js: https://nextjs.org/docs
- Stripe: https://docs.stripe.com
