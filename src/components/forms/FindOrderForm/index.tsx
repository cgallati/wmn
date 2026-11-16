'use client'

import { useAuth } from '@/providers/Auth'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { sendOrderAccessEmail } from './sendOrderAccessEmail'

type FormData = {
  email: string
  orderID: string
}

type Props = {
  initialEmail?: string
}

export const FindOrderForm: React.FC<Props> = ({ initialEmail }) => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    defaultValues: {
      email: initialEmail || user?.email,
    },
  })

  const onSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await sendOrderAccessEmail({
        email: data.email,
        orderID: data.orderID,
      })

      if (result.success) {
        setSuccess(true)
      } else {
        setSubmitError(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  if (success) {
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Check your email</h1>
        <p className="text-[#404040]">
          If an order matches that email and order number, a link to it is on its way.
        </p>
      </div>
    )
  }

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Find your order</h1>
        <p className="text-[#404040]">
          Enter the email you used at checkout and your order number. We&rsquo;ll email you a
          link to the order.
        </p>
      </div>
      <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Field error={errors.email?.message} id="email" label="Email">
          <input
            autoComplete="email"
            className={inputClass}
            id="email"
            {...register('email', { required: 'Enter your email.' })}
            aria-invalid={Boolean(errors.email)}
            type="email"
          />
        </Field>
        <Field error={errors.orderID?.message} id="orderID" label="Order number">
          <input
            className={inputClass}
            id="orderID"
            {...register('orderID', { required: 'Enter your order number.' })}
            aria-invalid={Boolean(errors.orderID)}
            type="text"
          />
        </Field>
        {submitError && (
          <p className="text-sm" role="alert">
            {submitError}
          </p>
        )}
        <button
          className="w-full bg-foreground px-8 py-4 text-xs font-medium uppercase tracking-[0.1em] text-background outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto md:self-start"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Sending' : 'Email me the link'}
        </button>
      </form>
    </div>
  )
}

const inputClass =
  'border border-[hsl(240_6%_90%)] bg-background px-3 py-3 text-base outline-none focus:border-foreground aria-[invalid=true]:border-foreground'

function Field({
  children,
  error,
  id,
  label,
}: {
  children: React.ReactNode
  error?: string
  id: string
  label: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="text-xs font-medium uppercase tracking-[0.1em] text-[#525252]"
        htmlFor={id}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
