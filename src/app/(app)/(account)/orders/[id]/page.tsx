import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import React from 'react'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string; accessToken?: string }>
}

export default async function Order({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id } = await params
  const { email = '', accessToken = '' } = await searchParams

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !Boolean(user),
      depth: 2,
      where: {
        and: [
          {
            id: {
              equals: id,
            },
          },
          ...(user
            ? [
                {
                  customer: {
                    equals: user.id,
                  },
                },
              ]
            : [
                {
                  accessToken: {
                    equals: accessToken,
                  },
                },
                ...(email
                  ? [
                      {
                        customerEmail: {
                          equals: email,
                        },
                      },
                    ]
                  : []),
              ]),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    })

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      orderResult &&
      orderResult.customerEmail &&
      orderResult.customerEmail === email
    const canAccessAsUser =
      user &&
      orderResult &&
      orderResult.customer &&
      (typeof orderResult.customer === 'object'
        ? orderResult.customer.id
        : orderResult.customer) === user.id

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
      order = orderResult
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) {
    notFound()
  }

  const address = order.shippingAddress
  const addressLines = address
    ? [
        [address.firstName, address.lastName].filter(Boolean).join(' '),
        address.addressLine1,
        address.addressLine2,
        [[address.city, address.state].filter(Boolean).join(', '), address.postalCode]
          .filter(Boolean)
          .join(' '),
        address.country,
      ].filter(Boolean)
    : []

  return (
    <div className="flex max-w-3xl flex-col gap-12">
      {user ? (
        <Link className={quietAction} href="/orders">
          All orders
        </Link>
      ) : null}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your order</h1>
        <p className="text-lg text-[#404040]">
          {order.status === 'processing'
            ? 'Paid. Your prints are being prepared.'
            : `Status: ${statusLabel(order.status)}.`}
        </p>
      </div>

      <dl className="flex flex-col gap-3 border-y py-6 text-sm">
        <LabelRow label="Order">
          <span className="break-all">{order.id}</span>
        </LabelRow>
        <LabelRow label="Date">
          <time dateTime={order.createdAt}>
            {formatDateTime({ date: order.createdAt, format: 'MMMM dd, yyyy' })}
          </time>
        </LabelRow>
        {order.status ? <LabelRow label="Status">{statusLabel(order.status)}</LabelRow> : null}
        {typeof order.amount === 'number' ? (
          <LabelRow label="Total paid">
            <Price as="span" amount={order.amount} />
          </LabelRow>
        ) : null}
        {order.customerEmail ? <LabelRow label="Email">{order.customerEmail}</LabelRow> : null}
      </dl>

      {order.items?.length ? (
        <section aria-labelledby="order-items" className="flex flex-col gap-4">
          <h2 className={label} id="order-items">
            Prints
          </h2>
          <ul className="flex flex-col">
            {order.items.map((item, index) => {
              const product = typeof item.product === 'object' ? item.product : undefined
              if (!product) {
                return (
                  <li className="border-t py-4 text-sm text-[#404040]" key={index}>
                    This print is no longer listed.
                  </li>
                )
              }
              const variant = typeof item.variant === 'object' ? item.variant : undefined
              const options = (variant?.options ?? [])
                .map((o) => (typeof o === 'object' ? o.label : null))
                .filter(Boolean)
                .join(', ')
              const image =
                typeof product.gallery?.[0]?.image === 'object'
                  ? product.gallery[0].image
                  : undefined

              return (
                <li className="flex gap-4 border-t py-4" key={item.id ?? index}>
                  {image?.url && image.width && image.height ? (
                    <Image
                      alt=""
                      className="h-auto w-16 shrink-0 self-start object-contain"
                      height={image.height}
                      sizes="64px"
                      src={image.url}
                      width={image.width}
                    />
                  ) : null}
                  <div className="flex flex-col gap-1 text-sm">
                    <span>{product.title}</span>
                    {options ? <span className="text-[#404040]">{options}</span> : null}
                    {item.quantity && item.quantity > 1 ? (
                      <span className="text-[#404040]">Quantity {item.quantity}</span>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {addressLines.length ? (
        <section aria-labelledby="order-shipping" className="flex flex-col gap-4">
          <h2 className={label} id="order-shipping">
            Shipping to
          </h2>
          <address className="text-sm not-italic leading-relaxed">
            {addressLines.map((line, i) => (
              <span className="block" key={i}>
                {line}
              </span>
            ))}
          </address>
        </section>
      ) : null}
    </div>
  )
}

const label = 'text-xs font-medium uppercase tracking-[0.1em] text-[#525252]'
const quietAction =
  'text-xs font-medium uppercase tracking-[0.1em] text-primary/50 outline-none hover:text-primary focus-visible:text-primary focus-visible:underline focus-visible:underline-offset-4'

const statusLabel = (status: Order['status']) =>
  ({
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  })[status ?? 'processing'] ?? 'Processing'

function LabelRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-[#525252]">{label}</dt>
      <dd className="col-span-2">{children}</dd>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `Order details for order ${id}.`,
    robots: { index: false },
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
    title: `Order ${id}`,
  }
}
