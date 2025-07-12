import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { serviceType, name, email, phone } = data

    const payload = await getPayload({ config })

    // Create booking in Payload with flexible structure
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        name,
        email,
        phone,
        serviceType,
        company: data.company,
        industry: data.industry,
        preferredDate: data.preferredDate ? new Date(data.preferredDate).toISOString() : undefined,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        location: data.location,
        duration: data.duration,
        budget: data.budget || data.monthlyBudget,
        details: data.details || data.message,
        formData: data, // Store complete form data as JSON
        status: 'new',
      },
    })

    // TODO: Send email notifications here
    console.log('New service inquiry created:', booking.id, 'Type:', serviceType)

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('Service booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create service inquiry' },
      { status: 500 }
    )
  }
}