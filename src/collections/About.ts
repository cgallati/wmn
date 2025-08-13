import type { CollectionConfig } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  ParagraphFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { populatePublishedAt } from '../hooks/populatePublishedAt'
import { revalidateAbout, revalidateAboutDelete } from '../hooks/revalidateAbout'

export const About: CollectionConfig<'about'> = {
  slug: 'about',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  labels: {
    singular: 'About Page',
    plural: 'About Page',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'About',
      admin: {
        description: 'Internal title for this about page content (not displayed on the page)',
      },
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Professional profile photograph',
      },
    },
    {
      name: 'sections',
      type: 'array',
      required: false,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'sectionType',
          type: 'select',
          required: true,
          options: [
            { label: 'Biography', value: 'bio' },
            { label: 'Artist Statement', value: 'artistStatement' },
            { label: 'Curriculum Vitae', value: 'cv' },
            { label: 'Custom Section', value: 'custom' },
          ],
          admin: {
            description: 'Type of content section',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: false,
          admin: {
            description: 'Section title (optional - leave blank to use default titles)',
            condition: (data, siblingData) => siblingData.sectionType === 'custom',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: [
              ParagraphFeature(),
              HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
              BoldFeature(),
              ItalicFeature(),
              UnderlineFeature(),
            ],
          }),
          admin: {
            description: 'Rich text content for this section',
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
          name: 'isVisible',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show/hide this section on the website',
          },
        },
      ],
      admin: {
        description: 'Content sections that will appear on the About page',
        initCollapsed: true,
        components: {
          RowLabel: ({ data, index }) => {
            const sectionTypeLabels = {
              bio: 'Biography',
              artistStatement: 'Artist Statement', 
              cv: 'Curriculum Vitae',
              custom: data?.title || 'Custom Section'
            }
            return sectionTypeLabels[data?.sectionType] || `Section ${index + 1}`
          }
        }
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateAbout],
    afterDelete: [revalidateAboutDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 10,
  },
}