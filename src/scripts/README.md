# Portfolio Migration Guide

This guide will help you migrate your artwork/portfolio data from your old database to the new database environment.

## Prerequisites

- ✅ Both database URLs (old and new)
- ✅ Node.js and pnpm installed
- ✅ Project dependencies installed (`pnpm install`)
- ✅ Access to both databases

## What Gets Migrated

### ✅ Migrated Data
The following artwork fields will be migrated:
- **Basic Info**: title, description, series, year
- **Medium & Dimensions**: medium, dimensions
- **Photography Details**: camera, lens, location, aperture, shutter, ISO
- **Publishing**: featured status, published date, slug, publish status

### ❌ Not Migrated
- **Images**: You'll manually re-upload these afterward
- **Product Links**: availablePrints field will be empty (add later if needed)
- **Users**: Create new admin/customer accounts in new environment
- **Shop Data**: Products, orders, carts, etc. (not needed)

## Step-by-Step Migration

### Step 1: Configure Environment Variables

Add your old database URL to your `.env` file:

```bash
# Your existing new database (keep this)
DATABASE_URI=mongodb+srv://your-new-database-url

# Add this temporarily for migration
OLD_DATABASE_URI=mongodb+srv://your-old-database-url
```

### Step 2: Test with Dry Run (Recommended)

First, run a dry run to see what will be migrated without actually writing data:

```bash
DRY_RUN=true pnpm migrate:artwork
```

This will show you:
- How many artworks will be migrated
- Their titles and data
- Any potential issues

### Step 3: Run the Migration

Once you're confident, run the actual migration:

```bash
pnpm migrate:artwork
```

The script will:
1. Connect to both databases
2. Fetch all artwork from old database
3. Create new artwork documents via Payload API
4. Show progress for each piece
5. Print a summary when complete

**Output Example:**
```
============================================================
🎨 ARTWORK MIGRATION SCRIPT
============================================================

📡 Connecting to old database...
✓ Connected to old database

📥 Fetching artwork from old database...
✓ Found 42 artwork documents

🚀 Starting migration...
📦 Initializing Payload...
✓ Payload initialized

[1/42] Migrating: "Sunset Over Mountains"
  ✓ Created with ID: 675c3d8e9f3a2b0012345678

[2/42] Migrating: "Urban Architecture"
  ✓ Created with ID: 675c3d8e9f3a2b0012345679

...

============================================================
MIGRATION SUMMARY
============================================================

Total artwork:         42
Successfully migrated: 42
Failed:                0

============================================================

✨ Next steps:
  1. Log into your admin panel
  2. Manually upload images to Media collection
  3. Edit each artwork and link the uploaded image
  4. (Optional) Link artwork to print products

🔌 Disconnected from old database
```

### Step 4: Handle Errors (if any)

If some artworks fail to migrate, the script will show:
- Which pieces failed
- The error message for each
- Continue migrating the rest

You can fix the issues and re-run the script. Already migrated pieces will create duplicates, so you may want to either:
- Delete successfully migrated artwork first, OR
- Manually create the failed pieces in admin panel

### Step 5: Post-Migration Tasks

After migration completes:

#### A. Upload Images
1. Go to your admin panel: `http://localhost:3000/admin`
2. Navigate to Media collection
3. Upload all your artwork images
4. Note the image filenames for the next step

#### B. Link Images to Artwork
1. Go to Artwork collection
2. For each artwork piece:
   - Click to edit
   - In the "Image" field, select the corresponding media file
   - Save

#### C. Link to Products (Optional)
If you want to sell prints later:
1. Create your Products
2. Go back to each Artwork
3. In "Available Prints" field, select related products
4. Save

#### D. Clean Up
Remove the old database URL from `.env`:
```bash
# Remove this line:
OLD_DATABASE_URI=mongodb+srv://your-old-database-url
```

## Troubleshooting

### Error: "OLD_DATABASE_URI is not set"
Make sure you added `OLD_DATABASE_URI` to your `.env` file.

### Error: "Cannot connect to database"
- Check your database URLs are correct
- Verify you have network access to both databases
- Check if IP is whitelisted (for MongoDB Atlas)

### Error: "Authentication failed"
- Verify database credentials are correct
- Check user permissions on both databases

### Some fields are missing
The script only migrates fields that exist in the Artwork schema. If you have custom fields in the old database that aren't in the new schema, you'll need to either:
- Add those fields to the new Artwork collection first
- Update the migration script to include them

### Duplicate artworks
If you run the migration multiple times, you'll get duplicates. Delete them manually in the admin panel or clear the new database and re-run.

## Advanced Options

### Migrate as Drafts
To import all artwork as drafts (for review before publishing), modify line 148 in the script:
```typescript
_status: 'draft', // Change from: artwork._status || 'draft'
```

### Skip Certain Artwork
To skip specific pieces, add a filter in the `fetchOldArtwork` function (line 93):
```typescript
const artwork = await db.collection('artwork').find({
  // Add your filter here
  year: { $gte: 2020 } // Example: only artwork from 2020 or later
}).toArray()
```

### Custom Field Mapping
If your old database uses different field names, update the `newArtworkData` object starting at line 135.

## Need Help?

If you encounter issues not covered here:
1. Check the error message carefully
2. Verify your database connections
3. Try a dry run first
4. Check the script logs for details

## Safety Notes

✅ **Safe Operations:**
- Script only **reads** from old database (no modifications)
- Uses Payload API (not direct DB writes) for data integrity
- Validation runs on all created documents
- Fresh IDs generated (no conflicts)

⚠️ **Important:**
- Always test with dry run first
- Keep a backup of your old database
- Don't delete old database until you've verified migration
- Media files need manual handling
