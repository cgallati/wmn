import * as migration_20250711_022531_initial from './20250711_022531_initial';
import * as migration_20250727_210737 from './20250727_210737';
import * as migration_20250727_220000_create_about_table from './20250727_220000_create_about_table';

export const migrations = [
  {
    up: migration_20250711_022531_initial.up,
    down: migration_20250711_022531_initial.down,
    name: '20250711_022531_initial',
  },
  {
    up: migration_20250727_210737.up,
    down: migration_20250727_210737.down,
    name: '20250727_210737'
  },
  {
    up: migration_20250727_220000_create_about_table.up,
    down: migration_20250727_220000_create_about_table.down,
    name: '20250727_220000_create_about_table'
  },
];
