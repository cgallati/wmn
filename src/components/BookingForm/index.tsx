'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    location: '',
    guestCount: '',
    duration: '',
    budget: '',
    message: '',
    specialRequests: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          eventTime: '',
          location: '',
          guestCount: '',
          duration: '',
          budget: '',
          message: '',
          specialRequests: '',
        })
      } else {
        throw new Error('Failed to submit booking')
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      alert('There was an error submitting your booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-light text-green-800 mb-4">Thank You!</h2>
          <p className="text-green-700 mb-6">
            Your booking inquiry has been submitted successfully. I'll get back to you within 24 hours.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            className="bg-green-600 text-white hover:bg-green-700 rounded-none"
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-light text-black border-b border-gray-200 pb-2">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 rounded-none"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 rounded-none"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 rounded-none"
          />
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-light text-black border-b border-gray-200 pb-2">Event Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventType">Event Type *</Label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Event Type</option>
              <option value="wedding">Wedding</option>
              <option value="engagement">Engagement</option>
              <option value="portrait">Portrait</option>
              <option value="family">Family</option>
              <option value="corporate">Corporate</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleChange}
              className="mt-1 rounded-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventTime">Preferred Time</Label>
            <Input
              id="eventTime"
              name="eventTime"
              type="text"
              value={formData.eventTime}
              onChange={handleChange}
              placeholder="e.g., 2:00 PM - 6:00 PM"
              className="mt-1 rounded-none"
            />
          </div>
          <div>
            <Label htmlFor="guestCount">Number of Guests</Label>
            <Input
              id="guestCount"
              name="guestCount"
              type="number"
              value={formData.guestCount}
              onChange={handleChange}
              className="mt-1 rounded-none"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event location or preferred location"
            className="mt-1 rounded-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Duration</option>
              <option value="1-hour">1 hour</option>
              <option value="2-hours">2 hours</option>
              <option value="3-hours">3 hours</option>
              <option value="4-hours">4 hours</option>
              <option value="6-hours">6 hours</option>
              <option value="8-hours">8 hours</option>
              <option value="full-day">Full day</option>
              <option value="multiple-days">Multiple days</option>
            </select>
          </div>
          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Budget</option>
              <option value="under-500">Under $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-2500">$1,000 - $2,500</option>
              <option value="2500-5000">$2,500 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="over-10000">Over $10,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-4">
        <h2 className="text-xl font-light text-black border-b border-gray-200 pb-2">Additional Information</h2>
        
        <div>
          <Label htmlFor="message">Tell me about your vision *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Describe your event, style preferences, and what you're looking for..."
            className="mt-1 rounded-none"
          />
        </div>

        <div>
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={3}
            placeholder="Any special requirements or requests..."
            className="mt-1 rounded-none"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white hover:bg-gray-800 rounded-none py-3 text-lg disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Booking Inquiry'}
      </Button>
    </form>
  )
}