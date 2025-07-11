import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { slugField } from '../fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public access for shop
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'price', 'stock', 'available', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'artwork',
      type: 'relationship',
      relationTo: 'artwork',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'size',
      type: 'select',
      options: [
        { label: '8x10', value: '8x10' },
        { label: '11x14', value: '11x14' },
        { label: '16x20', value: '16x20' },
        { label: '20x24', value: '20x24' },
        { label: '24x30', value: '24x30' },
        { label: '30x40', value: '30x40' },
      ],
      required: true,
    },
    {
      name: 'material',
      type: 'select',
      options: [
        { label: 'Archival Matte', value: 'archival-matte' },
        { label: 'Glossy', value: 'glossy' },
        { label: 'Canvas', value: 'canvas' },
        { label: 'Metal', value: 'metal' },
      ],
      required: true,
    },
    {
      name: 'edition',
      type: 'group',
      fields: [
        {
          name: 'total',
          type: 'number',
          admin: {
            description: 'Total number in edition (0 for unlimited)',
          },
          defaultValue: 0,
        },
        {
          name: 'current',
          type: 'number',
          admin: {
            description: 'Current number sold',
          },
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Current stock available',
      },
    },
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe product ID',
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe price ID',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      defaultValue: false,
    },
    ...slugField(),
  ],
}