import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'description', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the service (e.g., "Photography Sessions")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description of the service',
      },
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Key features or benefits of this service',
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: [
        { label: 'Clock (Sessions)', value: 'clock' },
        { label: 'Briefcase (Business)', value: 'briefcase' },
        { label: 'Zap (Creative)', value: 'zap' },
        { label: 'Camera (Photography)', value: 'camera' },
        { label: 'Users (Group)', value: 'users' },
        { label: 'Star (Premium)', value: 'star' },
      ],
      admin: {
        description: 'Icon to display for this service',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      required: true,
      defaultValue: 'Learn More',
      admin: {
        description: 'Text for the call-to-action button',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      required: true,
      admin: {
        description: 'URL or path for the CTA button (e.g., "/services/book?type=session")',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: {
        description: 'Display order (1 = first, 2 = second, etc.)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show/hide this service on the website',
      },
    },
  ],
}