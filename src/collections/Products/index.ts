/**
 * Products Collection Configuration
 *
 * SETTING UP FRAMING VARIANTS:
 * To add framing options (Framed/Unframed) to your prints, follow these steps in the Payload Admin:
 *
 * 1. Navigate to: Ecommerce → Variant Types
 *    - Click "Create New"
 *    - Name: "Framing"
 *    - Save the variant type
 *
 * 2. Navigate to: Ecommerce → Variant Options
 *    - Create first option:
 *      • Name: "Framed"
 *      • Variant Type: Select "Framing"
 *      • Save
 *    - Create second option:
 *      • Name: "Unframed"
 *      • Variant Type: Select "Framing"
 *      • Save
 *
 * 3. Edit each Product:
 *    - In "Product Details" tab:
 *      • Check "Enable Variants"
 *      • Under "Variant Types", select "Framing"
 *      • Save the product
 *
 * 4. Configure pricing for each variant:
 *    - Navigate to: Ecommerce → Variants
 *    - Find the variants for your product (auto-generated after step 3)
 *    - Edit each variant and set:
 *      • Price in USD (e.g., Framed: $150, Unframed: $100)
 *      • Save
 *
 * Note: Editions are tracked per size. Each size variant carries its own
 * inventory, set equal to the edition size for that size (artist's proofs are
 * not sold and are not counted). Products without variants fall back to the
 * product-level inventory.
 */

import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { DefaultDocumentIDType, Where } from 'payload'
import { revalidateProduct, revalidateDelete } from './hooks/revalidateProduct'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'enableVariants', '_status', 'variants.variants'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [revalidateDelete],
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInUSD: true,
    inventory: true,
    explicitContent: true,
    meta: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  admin: {
                    condition: (data) => {
                      return data?.enableVariants === true && data?.variantTypes?.length > 0
                    },
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) => {
                        if (typeof item === 'object' && item?.id) {
                          return item.id
                        }
                        return item
                      }) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0)
                        return {
                          variantType: {
                            in: [],
                          },
                        }

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs,
                        },
                      }

                      return query
                    }

                    return {
                      variantType: {
                        in: [],
                      },
                    }
                  },
                },
              ],
            },

            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock],
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            ...defaultCollection.fields,
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                // ID comes back as undefined during seeding so we need to handle that case
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
          ],
          label: 'Product Details',
        },
        {
          label: 'Print Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'editionSize',
                  type: 'number',
                  min: 1,
                  admin: {
                    width: '50%',
                    description:
                      'Edition size for each size. Set each size variant\'s inventory to this number.',
                  },
                },
                {
                  name: 'artistProofs',
                  type: 'number',
                  min: 0,
                  admin: { width: '50%', description: 'Artist\'s proofs, not offered for sale.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'paper',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'Paper name and weight' },
                },
                {
                  name: 'printProcess',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'e.g., archival pigment print' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'signed',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%', description: 'Each print is signed by the artist.' },
                },
                {
                  name: 'productionTime',
                  type: 'number',
                  min: 0,
                  admin: { width: '50%', description: 'Days from order to shipment.' },
                },
              ],
            },
            {
              name: 'explicitContent',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Blur this print behind a content notice in the shop until the visitor chooses to view it.',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    slugField(),
  ],
})
