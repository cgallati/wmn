import * as migration_20250711_022531_initial from './20250711_022531_initial';

export const migrations = [
  {
    up: migration_20250711_022531_initial.up,
    down: migration_20250711_022531_initial.down,
    name: '20250711_022531_initial'
  },
];
