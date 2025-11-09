import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import React from 'react'
import './globals.css'

/* const { SITE_NAME, TWITTER_CREATOR, TWITTER_SITE } = process.env
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined
 */
/* export const metadata = {
  metadataBase: new URL(baseUrl),
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite,
      },
    }),
} */

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={GeistMono.variable}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link rel="stylesheet" href="https://use.typekit.net/who5iig.css" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="WMN Photo" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Desktop: vertical sidebar (>= 1024px) */}
            <div className="hidden lg:block">
              <Header vertical />
            </div>

            {/* Mobile: horizontal header (< 1024px) */}
            <div className="block lg:hidden">
              <Header vertical={false} />
            </div>

            <main className="flex-1 pt-16 lg:pt-0">{children}</main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
