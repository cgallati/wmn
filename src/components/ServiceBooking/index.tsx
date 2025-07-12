'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ServiceBookingProps {
  serviceType: string
}

interface ServiceConfig {
  title: string
  description: string
  fields: FormField[]
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date' | 'number'
  required?: boolean
  placeholder?: string
  options?: string[]
}

const serviceConfigs: Record<string, ServiceConfig> = {
  session: {
    title: 'Book Photography Session',
    description: 'Let&apos;s discuss your photography session needs',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'sessionType', label: 'Session Type', type: 'select', required: true, options: [
        'Portrait Session',
        'Event Photography',
        'Product Photography',
        'Creative/Editorial',
        'Other'
      ]},
      { name: 'duration', label: 'Expected Duration', type: 'select', required: true, options: [
        '1-2 hours',
        '3-4 hours',
        'Half day (4-6 hours)',
        'Full day (8+ hours)'
      ]},
      { name: 'preferredDate', label: 'Preferred Date', type: 'date' },
      { name: 'location', label: 'Location/Venue', type: 'text', placeholder: 'Studio, specific venue, or general area' },
      { name: 'budget', label: 'Budget Range', type: 'select', options: [
        '$500-$1,000',
        '$1,000-$2,500',
        '$2,500-$5,000',
        '$5,000+'
      ]},
      { name: 'details', label: 'Project Details', type: 'textarea', required: true, placeholder: 'Tell us about your vision, style preferences, deliverables needed, etc.' }
    ]
  },
  'brand-campaign': {
    title: 'Brand Campaign Inquiry',
    description: 'Let&apos;s create something impactful for your brand',
    fields: [
      { name: 'name', label: 'Contact Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'company', label: 'Company/Brand', type: 'text', required: true },
      { name: 'industry', label: 'Industry', type: 'text', placeholder: 'Fashion, tech, hospitality, etc.' },
      { name: 'campaignType', label: 'Campaign Type', type: 'select', required: true, options: [
        'Product Launch',
        'Brand Refresh',
        'Social Media Campaign',
        'Website/E-commerce',
        'Marketing Campaign',
        'Other'
      ]},
      { name: 'timeline', label: 'Project Timeline', type: 'select', required: true, options: [
        'Rush (1-2 weeks)',
        'Standard (3-4 weeks)',
        'Extended (1-2 months)',
        'Ongoing'
      ]},
      { name: 'deliverables', label: 'Expected Deliverables', type: 'textarea', placeholder: 'Number of final images, usage rights, video content, etc.' },
      { name: 'budget', label: 'Project Budget', type: 'select', required: true, options: [
        '$5,000-$15,000',
        '$15,000-$35,000',
        '$35,000-$75,000',
        '$75,000+'
      ]},
      { name: 'details', label: 'Campaign Overview', type: 'textarea', required: true, placeholder: 'Campaign goals, target audience, brand guidelines, creative direction ideas, etc.' }
    ]
  },
  'creative-direction': {
    title: 'Creative Direction Partnership',
    description: 'Let&apos;s discuss a long-term creative partnership',
    fields: [
      { name: 'name', label: 'Contact Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'company', label: 'Company/Brand', type: 'text', required: true },
      { name: 'companySize', label: 'Company Size', type: 'select', options: [
        'Startup (1-10 employees)',
        'Small Business (11-50 employees)',
        'Medium Business (51-200 employees)',
        'Enterprise (200+ employees)'
      ]},
      { name: 'partnershipType', label: 'Partnership Type', type: 'select', required: true, options: [
        'Monthly Retainer',
        'Quarterly Projects',
        'Annual Partnership',
        'Project-Based Series'
      ]},
      { name: 'scope', label: 'Creative Scope', type: 'textarea', required: true, placeholder: 'Creative direction, campaign oversight, team management, strategy, etc.' },
      { name: 'currentNeeds', label: 'Current Creative Needs', type: 'textarea', placeholder: 'What creative challenges are you facing? What gaps need filling?' },
      { name: 'monthlyBudget', label: 'Monthly Budget Range', type: 'select', required: true, options: [
        '$10,000-$25,000',
        '$25,000-$50,000',
        '$50,000-$100,000',
        '$100,000+'
      ]},
      { name: 'startDate', label: 'Ideal Start Date', type: 'date' },
      { name: 'details', label: 'Partnership Vision', type: 'textarea', required: true, placeholder: 'Long-term goals, creative vision, team dynamics, success metrics, etc.' }
    ]
  }
}

export const ServiceBooking: React.FC<ServiceBookingProps> = ({ serviceType }) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const config = serviceConfigs[serviceType]

  if (!config) {
    return <div>Service type not found</div>
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
        body: JSON.stringify({
          serviceType,
          ...formData,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-light text-black mb-6">Thank You!</h1>
          <p className="text-gray-600 text-lg mb-8">
            Your inquiry has been received. We&apos;ll get back to you within 24 hours to discuss your project.
          </p>
          <Link
            href="/services"
            className="inline-block bg-black text-white py-3 px-8 hover:bg-gray-800 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/services"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
          
          <h1 className="text-3xl font-light text-black mb-4">{config.title}</h1>
          <p className="text-gray-600">{config.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {config.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-black mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:ring-black focus:ring-1 focus:outline-none transition-colors"
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:ring-black focus:ring-1 focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:ring-black focus:ring-1 focus:outline-none transition-colors"
                />
              )}
            </div>
          ))}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 px-8 hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}