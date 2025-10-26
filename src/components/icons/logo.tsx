import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

export function LogoIcon(props: React.ComponentProps<'div'>) {
  return (
    <div {...props} className={clsx('relative', props.className)}>
      <Image
        src="/logo.png"
        alt="WMN Logo"
        width={200}
        height={90}
        className="h-auto w-full object-contain"
        priority
      />
    </div>
  )
}
