import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const payload = await getPayload({ config })

    // Create booking in Payload
    const booking = await payload.create({
      collection: 'bookings',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: data.eventDate ? new Date(data.eventDate).toISOString() : undefined,
        eventTime: data.eventTime,
        location: data.location,
        guestCount: data.guestCount ? parseInt(data.guestCount) : undefined,
        duration: data.duration,
        budget: data.budget,
        message: data.message,
        specialRequests: data.specialRequests,
        status: 'new',
      },
    })

    // TODO: Send email notifications here
    console.log('New booking created:', booking.id)

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}