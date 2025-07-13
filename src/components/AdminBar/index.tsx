'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/ui'
import { useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  artwork: {
    plural: 'Artwork',
    singular: 'Artwork',
  },
  products: {
    plural: 'Products',
    singular: 'Product',
  },
  orders: {
    plural: 'Orders',
    singular: 'Order',
  },
  bookings: {
    plural: 'Bookings',
    singular: 'Booking',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const [hasError, setHasError] = useState(false)
  const collection = React.useMemo(() => {
    const segmentKey = segments?.[1] as keyof typeof collectionLabels
    return collectionLabels[segmentKey] ? segmentKey : 'pages'
  }, [segments]) as keyof typeof collectionLabels
  const router = useRouter()

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    try {
      setShow(Boolean(user?.id))
      setHasError(false)
    } catch (error) {
      console.warn('AdminBar auth change error:', error)
      setHasError(true)
    }
  }, [])

  const handleError = React.useCallback((error: any) => {
    console.warn('AdminBar load error:', error)
    setHasError(true)
  }, [])

  if (hasError) {
    return null // Hide admin bar if there's an error
  }

  return (
    <div
      className={cn(baseClass, 'py-2 bg-black text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            try {
              fetch('/next/exit-preview').then(() => {
                router.push('/')
                router.refresh()
              }).catch(handleError)
            } catch (error) {
              handleError(error)
            }
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
