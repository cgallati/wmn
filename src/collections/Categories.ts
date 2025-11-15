import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'
import { revalidateCategory, revalidateDelete } from './Categories/hooks/revalidateCategory'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    afterChange: [revalidateCategory],
    afterDelete: [revalidateDelete],
  },
}
