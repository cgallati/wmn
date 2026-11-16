"use client";

import { Price } from "@/components/Price";
import { useCart } from "@payloadcms/plugin-ecommerce/client/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import { DeleteItemButton } from "./DeleteItemButton";
import { EditItemQuantityButton } from "./EditItemQuantityButton";
import { OPEN_CART_EVENT } from "./AddToCart";
import { OpenCartButton } from "./OpenCart";
import type { CartItem } from "@/components/Cart";

const labelClass = "text-xs font-medium uppercase tracking-[0.1em]";

/**
 * The cart lives in the left rail. Opening it slides a flat panel out beside the rail on
 * desktop (full width under the top bar on mobile). It is not a modal: the page stays
 * visible and reachable, Escape closes it, and focus returns to the trigger.
 */
export function CartModal({ iconOnly = false }: { iconOnly?: boolean }) {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Close the cart when the route changes.
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_CART_EVENT, open);
    return () => window.removeEventListener(OPEN_CART_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined;
    return cart.items.reduce(
      (quantity, item) => (item.quantity || 0) + quantity,
      0,
    );
  }, [cart]);

  const items = cart?.items ?? [];

  // While the shop is dark (see Shop settings), the cart stays out of the rail.
  const shopOpen = useShopOpen();
  if (shopOpen !== true && !items.length) return null;

  return (
    <>
      <OpenCartButton
        aria-controls={panelId}
        aria-expanded={isOpen}
        iconOnly={iconOnly}
        onClick={() => setIsOpen((open) => !open)}
        quantity={totalQuantity}
        ref={triggerRef}
      />

      {isOpen && (
        <aside
          aria-label="Cart"
          className="fixed bottom-0 left-0 right-0 top-16 z-30 flex flex-col overflow-y-auto border-t bg-background lg:left-64 lg:right-auto lg:top-0 lg:w-[22rem] lg:border-r lg:border-t-0"
          id={panelId}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <h2 className={`${labelClass} text-primary`}>Cart</h2>
            <button
              className={`${labelClass} -mr-2 flex h-11 items-center px-2 text-primary/50 outline-none hover:text-primary focus-visible:text-primary focus-visible:underline focus-visible:underline-offset-4`}
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              type="button"
            >
              Close
            </button>
          </div>

          {items.length === 0 ? (
            <p className={`${labelClass} px-6 text-primary/50`}>
              Your cart is empty.
            </p>
          ) : (
            <div className="flex grow flex-col justify-between px-6 pb-6">
              <ul className="flex flex-col">
                {items.map((item: CartItem, i) => {
                  const product = item.product;
                  const variant = item.variant;

                  if (
                    typeof product !== "object" ||
                    !item ||
                    !product ||
                    !product.slug
                  )
                    return <React.Fragment key={i} />;

                  const metaImage =
                    product.meta?.image &&
                    typeof product.meta?.image === "object"
                      ? product.meta.image
                      : undefined;

                  const firstGalleryImage =
                    typeof product.gallery?.[0]?.image === "object"
                      ? product.gallery?.[0]?.image
                      : undefined;

                  const image = firstGalleryImage || metaImage;
                  const isVariant =
                    Boolean(variant) && typeof variant === "object";
                  const price =
                    isVariant && variant
                      ? variant.priceInUSD
                      : product.priceInUSD;
                  const options =
                    isVariant && variant
                      ? (variant.options ?? [])
                          .map((option) =>
                            typeof option === "object" ? option.label : null,
                          )
                          .filter(Boolean)
                          .join(", ")
                      : "";

                  return (
                    <li className="flex gap-4 border-t py-6" key={item.id ?? i}>
                      <Link
                        aria-hidden="true"
                        className="block w-20 shrink-0 self-start"
                        href={`/products/${product.slug}`}
                        tabIndex={-1}
                      >
                        {image?.url && image.width && image.height ? (
                          <Image
                            alt=""
                            className="h-auto w-full object-contain"
                            height={image.height}
                            sizes="80px"
                            src={image.url}
                            width={image.width}
                          />
                        ) : null}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col gap-3 text-sm">
                        <div className="flex items-baseline justify-between gap-4">
                          <Link
                            className="leading-snug hover:underline"
                            href={`/products/${product.slug}`}
                          >
                            {product.title}
                          </Link>
                          {typeof price === "number" && (
                            <Price
                              as="span"
                              amount={price}
                              className="whitespace-nowrap"
                            />
                          )}
                        </div>
                        {options ? (
                          <p className="text-[#404040]">{options}</p>
                        ) : null}

                        <div className="mt-auto flex items-center justify-between">
                          <div className="-ml-2 flex items-center">
                            <EditItemQuantityButton item={item} type="minus" />
                            <span
                              aria-label={`Quantity ${item.quantity}`}
                              className="w-5 text-center"
                            >
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                          <DeleteItemButton item={item} label={product.title} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-6 border-t pt-6">
                {typeof cart?.subtotal === "number" && (
                  <div className="flex items-baseline justify-between text-sm">
                    <p>Subtotal</p>
                    <Price as="p" amount={cart.subtotal} />
                  </div>
                )}
                <p className="text-sm text-[#404040]">
                  Shipping and tax are calculated at checkout.
                </p>
                <Link
                  className="bg-foreground px-8 py-4 text-center text-xs font-medium uppercase tracking-[0.1em] text-background outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4"
                  href="/checkout"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  );
}

/** Whether the shop is open; undefined until known. Shared by both cart triggers. */
let shopOpenRequest: Promise<boolean> | undefined;
function useShopOpen(): boolean | undefined {
  const [open, setOpen] = useState<boolean>();
  useEffect(() => {
    shopOpenRequest ??= fetch("/shop/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { open: false }))
      .then((d: { open?: boolean }) => Boolean(d.open))
      .catch(() => false);
    let active = true;
    shopOpenRequest.then((value) => {
      if (active) setOpen(value);
    });
    return () => {
      active = false;
    };
  }, []);
  return open;
}
