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
    defaultColumns: ['name', 'email', 'eventType', 'eventDate', 'status', 'createdAt'],
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
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Wedding', value: 'wedding' },
        { label: 'Engagement', value: 'engagement' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Family', value: 'family' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Event', value: 'event' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'eventTime',
      type: 'text',
      admin: {
        description: 'Preferred time for the event',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Event location or preferred location',
      },
    },
    {
      name: 'guestCount',
      type: 'number',
      admin: {
        description: 'Approximate number of guests/participants',
      },
    },
    {
      name: 'duration',
      type: 'select',
      options: [
        { label: '1 hour', value: '1-hour' },
        { label: '2 hours', value: '2-hours' },
        { label: '3 hours', value: '3-hours' },
        { label: '4 hours', value: '4-hours' },
        { label: '6 hours', value: '6-hours' },
        { label: '8 hours', value: '8-hours' },
        { label: 'Full day', value: 'full-day' },
        { label: 'Multiple days', value: 'multiple-days' },
      ],
    },
    {
      name: 'budget',
      type: 'select',
      options: [
        { label: 'Under $500', value: 'under-500' },
        { label: '$500 - $1,000', value: '500-1000' },
        { label: '$1,000 - $2,500', value: '1000-2500' },
        { label: '$2,500 - $5,000', value: '2500-5000' },
        { label: '$5,000 - $10,000', value: '5000-10000' },
        { label: 'Over $10,000', value: 'over-10000' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'specialRequests',
      type: 'textarea',
      admin: {
        description: 'Any special requests or requirements',
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