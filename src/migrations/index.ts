import * as migration_20250711_022531_initial from './20250711_022531_initial';
import * as migration_20250727_210737 from './20250727_210737';

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
];
