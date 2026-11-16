import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateGlobal } from './hooks/revalidateGlobal'
import { adminOnly } from '@/access/adminOnly'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
}
