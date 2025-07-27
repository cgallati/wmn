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
      name: 'bio',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short biographical information (plain text)',
        rows: 4,
      },
    },
    {
      name: 'artistStatement',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Artist statement describing your work and approach (plain text)',
        rows: 6,
      },
    },
    {
      name: 'cv',
      type: 'richText',
      required: false,
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
        description: 'Curriculum Vitae with rich text formatting',
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
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 10,
  },
}