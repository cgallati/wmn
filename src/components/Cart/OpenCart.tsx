import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  quantity,
  iconOnly = false,
  ...rest
}: {
  quantity?: number
  iconOnly?: boolean
}) {
  if (iconOnly) {
    return (
      <Button
        variant="nav"
        size="clear"
        className="navLink relative hover:cursor-pointer p-2"
        {...rest}
      >
        <ShoppingBag className="h-5 w-5" />
        {quantity && quantity > 0 ? (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {quantity}
          </span>
        ) : null}
      </Button>
    )
  }

  return (
    <Button
      variant="nav"
      size="clear"
      className="navLink relative items-end hover:cursor-pointer"
      {...rest}
    >
      <span>Cart</span>

      {quantity ? (
        <>
          <span>•</span>
          <span>{quantity}</span>
        </>
      ) : null}
    </Button>
  )
}
