import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { slugField } from 'payload'
import { revalidateArtwork, revalidateDelete } from './Artwork/hooks/revalidateArtwork'

export const Artwork: CollectionConfig = {
  slug: 'artwork',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'year', 'featured', '_status', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'series',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'year',
          type: 'number',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'medium',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'dimensions',
          type: 'text',
          admin: {
            width: '50%',
            placeholder: 'e.g., 24 x 36 inches',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Photography Details',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'camera',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'lens',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'aperture',
              type: 'text',
              admin: {
                width: '33.33%',
                placeholder: 'e.g., f/2.8',
              },
            },
            {
              name: 'shutter',
              type: 'text',
              admin: {
                width: '33.33%',
                placeholder: 'e.g., 1/250s',
              },
            },
            {
              name: 'iso',
              type: 'number',
              admin: {
                width: '33.33%',
                placeholder: 'e.g., 400',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'availablePrints',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Link available print products to this artwork',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '33.33%',
          },
        },
        {
          name: 'darkBackground',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '33.33%',
            description: 'Enable if image has a dark background (for carousel UI)',
          },
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '33.33%',
          },
          hooks: {
            beforeChange: [
              ({ siblingData, value }) => {
                if (siblingData._status === 'published' && !value) {
                  return new Date()
                }
                return value
              },
            ],
          },
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date()
        }
        return data
      },
    ],
    afterChange: [revalidateArtwork],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}
