import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Rename columns to match new service-based schema
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN \`event_type\` TO \`service_type\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN \`event_date\` TO \`preferred_date\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN \`message\` TO \`details\`;`)

  // Add new columns for service-based bookings
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`company\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`industry\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`start_date\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`budget\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`form_data\` text;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`status\` text DEFAULT 'new';`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`quote\` numeric;`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD COLUMN \`notes\` text;`)

  // Update existing service_type values to match new enum
  await db.run(sql`UPDATE \`bookings\` SET \`service_type\` = 'session' WHERE \`service_type\` IS NOT NULL;`)
  
  // Ensure all existing bookings have a status
  await db.run(sql`UPDATE \`bookings\` SET \`status\` = 'new' WHERE \`status\` IS NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Rename columns back to original schema
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN \`service_type\` TO \`event_type\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN \`preferred_date\` TO \`event_date\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` RENAME COLUMN \`details\` TO \`message\`;`)

  // Remove new columns (Note: SQLite doesn't support DROP COLUMN easily, 
  // this would require recreating the table in a real rollback scenario)
  // For now, just document what would need to be done
  console.warn('Rolling back new columns requires table recreation in SQLite')
}