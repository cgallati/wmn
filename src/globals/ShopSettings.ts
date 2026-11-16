import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/** Countries Will can ship to. Codes are ISO 3166-1 alpha-2, as Stripe expects. */
export const SHIPPING_COUNTRY_OPTIONS = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Australia', value: 'AU' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Spain', value: 'ES' },
  { label: 'Italy', value: 'IT' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Austria', value: 'AT' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Norway', value: 'NO' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Finland', value: 'FI' },
  { label: 'Japan', value: 'JP' },
  { label: 'Mexico', value: 'MX' },
] as const

/**
 * Shop settings Will controls from the admin. The shop stays dark until at least one
 * shipping rate exists here and at least one published print has an edition left.
 */
export const ShopSettings: GlobalConfig = {
  slug: 'shopSettings',
  label: 'Shop settings',
  admin: {
    group: 'Ecommerce',
    description:
      'The shop opens on the site once there is at least one shipping rate here and at least one published print with editions left.',
  },
  access: {
    read: adminOnly,
    update: adminOnly,
  },
  fields: [
    {
      name: 'shippingRates',
      type: 'array',
      label: 'Shipping rates',
      labels: { singular: 'Shipping rate', plural: 'Shipping rates' },
      admin: {
        description:
          'Buyers choose one of these at checkout. Shipping is taxed where required; Stripe Tax decides per address.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '50%', placeholder: 'e.g., Flat mailer, tracked' },
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              admin: { width: '50%', step: 0.01, description: 'In US dollars.' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'minDays',
              type: 'number',
              min: 1,
              admin: { width: '50%', description: 'Shortest delivery estimate, business days.' },
            },
            {
              name: 'maxDays',
              type: 'number',
              min: 1,
              admin: { width: '50%', description: 'Longest delivery estimate, business days.' },
            },
          ],
        },
      ],
    },
    {
      name: 'shippingCountries',
      type: 'select',
      label: 'Ship to',
      hasMany: true,
      required: true,
      defaultValue: ['US'],
      options: SHIPPING_COUNTRY_OPTIONS.map((o) => ({ ...o })),
    },
  ],
}
