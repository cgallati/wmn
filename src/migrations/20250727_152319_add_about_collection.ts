import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log('🚀 Starting About collection migration...')
  
  console.log('📊 Creating about table...')
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS \`about\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`title\` text NOT NULL,
      \`profile_photo_id\` integer,
      \`bio\` text,
      \`artist_statement\` text,
      \`cv\` text,
      \`published_at\` text,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`_status\` text DEFAULT 'draft'
    );
  `)
  console.log('✅ About table created')

  console.log('📊 Creating about versions table...')
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS \`_about_v\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`parent_id\` integer,
      \`version_title\` text,
      \`version_profile_photo_id\` integer,
      \`version_bio\` text,
      \`version_artist_statement\` text,
      \`version_cv\` text,
      \`version_published_at\` text,
      \`version_updated_at\` text,
      \`version_created_at\` text,
      \`version__status\` text,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`latest\` integer,
      \`autosave\` integer,
      FOREIGN KEY (\`parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE set null
    );
  `)
  console.log('✅ About versions table created')

  console.log('🔗 Adding about_id column to payload_locked_documents_rels...')
  try {
    await db.run(sql`
      ALTER TABLE \`payload_locked_documents_rels\` 
      ADD COLUMN \`about_id\` integer;
    `)
    console.log('✅ about_id column added successfully')
  } catch (error) {
    console.log('ℹ️ about_id column may already exist:', error.message)
  }

  console.log('📇 Creating index for about_id...')
  await db.run(sql`
    CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_about_id_idx\` 
    ON \`payload_locked_documents_rels\` (\`about_id\`);
  `)
  console.log('✅ Index created')

  console.log('✅ About collection migration completed successfully!')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop about tables and relations
  await db.run(sql`DROP TABLE IF EXISTS \`_about_v\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`about\`;`)
  
  // Note: SQLite doesn't support DROP COLUMN easily
  // In production, you would need to recreate the table without the about_id column
  console.warn('Rolling back about_id column from payload_locked_documents_rels requires table recreation in SQLite')
  console.log('✅ About collection tables dropped successfully')
}