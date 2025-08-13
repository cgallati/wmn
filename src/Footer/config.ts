import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: false,
          defaultValue: 'hello@wmn.photo',
          admin: {
            description: 'Contact email address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: false,
          defaultValue: '(123) 456-7890',
          admin: {
            description: 'Phone number for display',
          },
        },
        {
          name: 'phoneHref',
          type: 'text',
          required: false,
          defaultValue: '+1234567890',
          admin: {
            description: 'Phone number for tel: link (no spaces/formatting)',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          required: false,
          defaultValue: '@wmn.photo',
          admin: {
            description: 'Instagram handle for display',
          },
        },
        {
          name: 'instagramUrl',
          type: 'text',
          required: false,
          defaultValue: 'https://instagram.com/wmn.photo',
          admin: {
            description: 'Full Instagram URL',
          },
        },
      ],
      admin: {
        description: 'Contact information displayed in footer',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
        description: 'Navigation links in footer (leave empty to use default links)',
      },
    },
    {
      name: 'copyrightText',
      type: 'text',
      required: false,
      defaultValue: 'WMN Photography. All rights reserved.',
      admin: {
        description: 'Copyright text (year will be added automatically)',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { text: 'Privacy Policy', url: '/privacy' },
        { text: 'Terms of Service', url: '/terms' }
      ],
      admin: {
        description: 'Legal/policy links in footer',
        initCollapsed: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
