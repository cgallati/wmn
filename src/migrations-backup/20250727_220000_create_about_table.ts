import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create about table (missing from previous migration)
  await db.run(sql`CREATE TABLE \`about\` (
  \`id\` integer PRIMARY KEY NOT NULL,
  \`title\` text DEFAULT 'About',
  \`profile_photo_id\` integer,
  \`bio\` text,
  \`artist_statement\` text,
  \`cv\` text,
  \`published_at\` text,
  \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  \`_status\` text DEFAULT 'draft',
  FOREIGN KEY (\`profile_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
);`)
  
  await db.run(sql`CREATE INDEX \`about_profile_photo_idx\` ON \`about\` (\`profile_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`about_updated_at_idx\` ON \`about\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`about_created_at_idx\` ON \`about\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`about__status_idx\` ON \`about\` (\`_status\`);`)
  
  // Create about versions table
  await db.run(sql`CREATE TABLE \`_about_v\` (
  \`id\` integer PRIMARY KEY NOT NULL,
  \`parent_id\` integer,
  \`version_title\` text DEFAULT 'About',
  \`version_profile_photo_id\` integer,
  \`version_bio\` text,
  \`version_artist_statement\` text,
  \`version_cv\` text,
  \`version_published_at\` text,
  \`version_updated_at\` text,
  \`version_created_at\` text,
  \`version__status\` text DEFAULT 'draft',
  \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  \`latest\` integer,
  \`autosave\` integer,
  FOREIGN KEY (\`parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (\`version_profile_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
);`)
  
  await db.run(sql`CREATE INDEX \`_about_v_parent_idx\` ON \`_about_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version_profile_photo_idx\` ON \`_about_v\` (\`version_profile_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version_updated_at_idx\` ON \`_about_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version_created_at_idx\` ON \`_about_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version__status_idx\` ON \`_about_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_created_at_idx\` ON \`_about_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_updated_at_idx\` ON \`_about_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_latest_idx\` ON \`_about_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_autosave_idx\` ON \`_about_v\` (\`autosave\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`about\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_about_v\`;`)
}