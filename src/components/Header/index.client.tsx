'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense, useState } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header, Media } from 'src/payload-types'

import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { Media as MediaComponent } from '@/components/Media'

type Props = {
  header: Header
  vertical?: boolean
}

export function HeaderClient({ header, vertical = false }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const logo = header.logo as Media | null
  const isShopEnabled = process.env.NEXT_PUBLIC_ENABLE_SHOP !== 'false'

  if (vertical) {
    return (
      <div className="relative z-20 w-64 border-r flex-shrink-0">
        <nav className="flex flex-col h-full p-6 gap-8 sticky top-0">
          <Link className="flex items-center justify-center" href="/">
            {logo && typeof logo === 'object' ? (
              <MediaComponent resource={logo} imgClassName="w-32 h-auto object-contain" />
            ) : (
              <LogoIcon className="w-32 h-auto" />
            )}
          </Link>

          {menu.length ? (
            <ul className="flex flex-col gap-4 text-base">
              {menu.map((item) => {
                // Skip rendering if this is a home link
                if (item.link?.url === '/' || item.link?.url === '/home') {
                  return null
                }

                if (item.type === 'dropdown') {
                  return <NavDropdown key={item.id} item={item} pathname={pathname} />
                }

                return (
                  <li key={item.id} className="flex items-start gap-2">
                    <CMSLink
                      {...item.link}
                      size={'clear'}
                      className={cn('relative navLink block', {
                        active:
                          item.link?.url && item.link.url !== '/'
                            ? pathname.includes(item.link.url)
                            : false,
                      })}
                      appearance="nav"
                    />
                    {item.showExplicitBadge && (
                      <span className="inline-block bg-red-600 text-white text-[0.5rem] font-bold tracking-wider px-1.5 py-0.5 leading-none mt-2">
                        EXPLICIT CONTENT
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : null}

          {isShopEnabled && (
            <div className="pt-4 border-t">
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            </div>
          )}
        </nav>
      </div>
    )
  }

  return (
    <div className="relative z-20 border-b">
      <nav className="flex items-center md:items-end justify-between container pt-2">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex w-full items-end gap-6 md:w-1/3">
            <Link className="flex w-full items-center justify-center pt-4 pb-4 md:w-auto" href="/">
              {logo && typeof logo === 'object' ? (
                <MediaComponent resource={logo} imgClassName="w-24 h-auto object-contain" />
              ) : (
                <LogoIcon className="w-24 h-auto" />
              )}
            </Link>
            {menu.length ? (
              <ul className="hidden gap-4 text-sm md:flex md:items-center">
                {menu.map((item) => {
                  // Skip rendering if this is a home link
                  if (item.link?.url === '/' || item.link?.url === '/home') {
                    return null
                  }

                  return (
                    <li key={item.id} className="flex items-start gap-2">
                      <CMSLink
                        {...item.link}
                        size={'clear'}
                        className={cn('relative navLink', {
                          active:
                            item.link?.url && item.link.url !== '/'
                              ? pathname.includes(item.link.url)
                              : false,
                        })}
                        appearance="nav"
                      />
                      {item.showExplicitBadge && (
                        <span className="inline-block bg-red-600 text-white text-[0.5rem] font-bold tracking-wider px-1.5 py-0.5 leading-none mt-2">
                          EXPLICIT CONTENT
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>

          {isShopEnabled && (
            <div className="flex justify-end md:w-1/3 gap-4">
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

function NavDropdown({ item, pathname }: { item: any; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn('relative navLink block w-full text-left uppercase font-mono tracking-[0.1em] text-xs text-primary/50 hover:text-primary/100 p-0 pt-2 pb-6', {
          'text-primary/100': isOpen
        })}
      >
        {item.label}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="flex flex-col gap-3 mt-3 pl-4">
          {item.subItems?.map((subItem: any) => (
            <li key={subItem.id} className="flex items-start gap-2">
              <CMSLink
                {...subItem.link}
                size={'clear'}
                className={cn('relative navLink block', {
                  active:
                    subItem.link?.url && subItem.link.url !== '/'
                      ? pathname.includes(subItem.link.url)
                      : false,
                })}
                appearance="nav"
              />
              {subItem.showExplicitBadge && (
                <span className="inline-block bg-red-600 text-white text-[0.5rem] font-bold tracking-wider px-1.5 py-0.5 leading-none mt-2">
                  EXPLICIT CONTENT
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
