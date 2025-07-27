import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN "event_type" TO "service_type";`)
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN "event_date" TO "preferred_date";`)
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN "event_time" TO "start_date";`)
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
  );
  `)
  await db.run(sql`CREATE INDEX \`about_profile_photo_idx\` ON \`about\` (\`profile_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`about_updated_at_idx\` ON \`about\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`about_created_at_idx\` ON \`about\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`about__status_idx\` ON \`about\` (\`_status\`);`)
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
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_v_parent_idx\` ON \`_about_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version_profile_photo_idx\` ON \`_about_v\` (\`version_profile_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version_updated_at_idx\` ON \`_about_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version_created_at_idx\` ON \`_about_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_version_version__status_idx\` ON \`_about_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_created_at_idx\` ON \`_about_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_updated_at_idx\` ON \`_about_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_latest_idx\` ON \`_about_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_about_v_autosave_idx\` ON \`_about_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`company\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`industry\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`details\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`form_data\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`guest_count\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`message\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`special_requests\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`about_id\` integer REFERENCES about(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_about_id_idx\` ON \`payload_locked_documents_rels\` (\`about_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about\`;`)
  await db.run(sql`DROP TABLE \`_about_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`artwork_id\` integer,
  	\`products_id\` integer,
  	\`orders_id\` integer,
  	\`bookings_id\` integer,
  	\`pages_id\` integer,
  	\`posts_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`users_id\` integer,
  	\`redirects_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`search_id\` integer,
  	\`payload_jobs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artwork_id\`) REFERENCES \`artwork\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bookings_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_jobs_id\`) REFERENCES \`payload_jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "artwork_id", "products_id", "orders_id", "bookings_id", "pages_id", "posts_id", "media_id", "categories_id", "users_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_jobs_id") SELECT "id", "order", "parent_id", "path", "artwork_id", "products_id", "orders_id", "bookings_id", "pages_id", "posts_id", "media_id", "categories_id", "users_id", "redirects_id", "forms_id", "form_submissions_id", "search_id", "payload_jobs_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_artwork_id_idx\` ON \`payload_locked_documents_rels\` (\`artwork_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_jobs_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_jobs_id\`);`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`event_type\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`event_date\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`event_time\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`guest_count\` numeric;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`message\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`special_requests\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`service_type\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`company\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`industry\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`preferred_date\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`start_date\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`details\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`form_data\`;`)
}
