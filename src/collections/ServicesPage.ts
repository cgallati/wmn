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

export const ServicesPage: CollectionConfig<'services-page'> = {
  slug: 'services-page',
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
    singular: 'Services Page',
    plural: 'Services Page',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Services Page Content',
      admin: {
        description: 'Internal title for this services page content (not displayed on the page)',
      },
    },
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      defaultValue: 'Services',
      admin: {
        description: 'Main heading displayed on the services page',
      },
    },
    {
      name: 'pageDescription',
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
        description: 'Description text that appears below the main heading',
      },
    },
    {
      name: 'consultationText',
      type: 'text',
      required: true,
      defaultValue: 'Not sure which service fits your needs?',
      admin: {
        description: 'Text that appears above the consultation link',
      },
    },
    {
      name: 'consultationLinkText',
      type: 'text',
      required: true,
      defaultValue: 'Get in touch for a consultation',
      admin: {
        description: 'Text for the consultation link',
      },
    },
    {
      name: 'consultationEmail',
      type: 'email',
      required: true,
      defaultValue: 'hello@wmn.photo',
      admin: {
        description: 'Email address for the consultation link',
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