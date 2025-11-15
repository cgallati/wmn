import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateGlobal } from './hooks/revalidateGlobal'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: false,
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'link',
          options: [
            {
              label: 'Link',
              value: 'link',
            },
            {
              label: 'Dropdown',
              value: 'dropdown',
            },
          ],
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_data: any, siblingData: any) => siblingData?.type === 'link',
            },
          },
        }),
        {
          name: 'showExplicitBadge',
          type: 'checkbox',
          label: 'Show Explicit Content Badge',
          defaultValue: false,
          admin: {
            condition: (_data: any, siblingData: any) => siblingData?.type === 'link',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Dropdown Label',
          required: true,
          admin: {
            condition: (_data: any, siblingData: any) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'subItems',
          type: 'array',
          label: 'Dropdown Items',
          maxRows: 10,
          admin: {
            condition: (_data: any, siblingData: any) => siblingData?.type === 'dropdown',
          },
          fields: [
            link({
              appearances: false,
            }),
            {
              name: 'showExplicitBadge',
              type: 'checkbox',
              label: 'Show Explicit Content Badge',
              defaultValue: false,
            },
          ],
        },
      ],
      maxRows: 6,
    },
  ],
}
