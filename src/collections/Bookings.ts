import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    create: () => true, // Allow booking creation from frontend
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'serviceType', 'status', 'createdAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Photography Session', value: 'session' },
        { label: 'Brand Campaign', value: 'brand-campaign' },
        { label: 'Creative Direction', value: 'creative-direction' },
      ],
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        condition: (data) => data?.serviceType !== 'session',
      },
    },
    {
      name: 'industry',
      type: 'text',
      admin: {
        condition: (data) => data?.serviceType !== 'session',
      },
    },
    {
      name: 'preferredDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Preferred start date or event date',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Ideal start date for partnership',
        condition: (data) => data?.serviceType === 'creative-direction',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Venue, studio, or general area',
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Session duration, project timeline, or partnership type',
      },
    },
    {
      name: 'budget',
      type: 'text',
      admin: {
        description: 'Budget range or monthly budget',
      },
    },
    {
      name: 'details',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Project details, campaign overview, or partnership vision',
      },
    },
    {
      name: 'formData',
      type: 'json',
      admin: {
        description: 'Complete form submission data',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      required: true,
      defaultValue: 'new',
    },
    {
      name: 'quote',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Quoted price for the booking',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Internal notes about the booking',
      },
    },
  ],
}