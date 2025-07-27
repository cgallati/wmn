import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await request.json() // Still parse the request to avoid errors
    
    // Temporarily disabled - bookings collection removed
    return NextResponse.json(
      { error: 'Booking functionality is temporarily disabled. Please contact directly.' },
      { status: 503 }
    )
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}