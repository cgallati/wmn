import * as migration_20250711_022531_initial from './20250711_022531_initial';
import * as migration_20250713_215400_update_bookings_for_services from './20250713_215400_update_bookings_for_services';

export const migrations = [
  {
    up: migration_20250711_022531_initial.up,
    down: migration_20250711_022531_initial.down,
    name: '20250711_022531_initial'
  },
  {
    up: migration_20250713_215400_update_bookings_for_services.up,
    down: migration_20250713_215400_update_bookings_for_services.down,
    name: '20250713_215400_update_bookings_for_services'
  },
];
