import { Button } from '@/components/ui/button'
import React from 'react'

type Props = React.ComponentProps<typeof Button> & {
  quantity?: number
  iconOnly?: boolean
}

/** The cart trigger: "Cart" in the nav label style, with the item count when there is one. */
export function OpenCartButton({ quantity, iconOnly = false, className, ...rest }: Props) {
  return (
    <Button
      variant="nav"
      size="clear"
      className={
        iconOnly
          ? 'navLink relative h-11 items-center gap-1.5 px-2 py-0 hover:cursor-pointer'
          : 'navLink relative items-end gap-1.5 hover:cursor-pointer'
      }
      {...rest}
    >
      <span>Cart</span>
      {quantity ? (
        <span aria-label={`${quantity} ${quantity === 1 ? 'item' : 'items'}`}>{quantity}</span>
      ) : null}
    </Button>
  )
}
