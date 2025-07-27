import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { slugField } from '../fields/slug'
import { populatePublishedAt } from '../hooks/populatePublishedAt'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { revalidateArtwork, revalidateArtworkDelete } from '../hooks/revalidateArtwork'

export const Artwork: CollectionConfig = {
  slug: 'artwork',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public access for portfolio
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'series', 'year', 'updatedAt'],
    useAsTitle: 'title',
    preview: (data) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'artwork',
        req: {} as Parameters<typeof generatePreviewPath>[0]['req'],
      }),
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
      name: 'series',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'medium',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'dimensions',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'camera',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lens',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'settings',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'aperture',
          type: 'text',
        },
        {
          name: 'shutter',
          type: 'text',
        },
        {
          name: 'iso',
          type: 'number',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateArtwork],
    afterDelete: [revalidateArtworkDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}