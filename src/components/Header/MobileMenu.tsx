'use client'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'

interface Props {
  menu: Header['navItems']
}

export function MobileMenu({ menu }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  // Close all dropdowns when menu opens/closes
  useEffect(() => {
    if (!isOpen) {
      setOpenDropdowns({})
    }
  }, [isOpen])

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:bg-black dark:text-white">
        <MenuIcon className="h-4" />
      </SheetTrigger>

      <SheetContent side="right" className="px-4">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigation menu</SheetDescription>
        </SheetHeader>

        <div className="py-8">
          {menu?.length ? (
            <ul className="flex w-full flex-col gap-4">
              {menu.map((item) => {
                // Skip home links
                if (item.link?.url === '/' || item.link?.url === '/home') {
                  return null
                }

                if (item.type === 'dropdown' && item.id) {
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => toggleDropdown(item.id!)}
                        className={cn('relative navLink block w-full text-left uppercase font-sans tracking-[0.1em] text-xs text-primary/50 hover:text-primary/100 p-0 pb-2', {
                          'text-primary/100': openDropdowns[item.id!]
                        })}
                      >
                        {item.label}
                      </button>
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-300 ease-in-out',
                          openDropdowns[item.id!] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        )}
                      >
                        <ul className="flex flex-col gap-3 mt-2 pl-4">
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

                return (
                  <li className="flex items-start gap-2" key={item.id}>
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
