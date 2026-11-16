---
name: Will M Nichols Photography
description: A white-cube portfolio and print shop for conceptual queer self-portraiture.
colors:
  gallery-white: "hsl(0 0% 100%)"
  ink: "hsl(222.2 84% 4.9%)"
  graphite: "hsl(222.2 47.4% 11.2%)"
  hairline: "hsl(240 6% 90%)"
  plinth: "hsl(210 40% 96.1%)"
  label-gray: "#525252"
  caption-gray: "#404040"
  warning-red: "#dc2626"
typography:
  display:
    fontFamily: "neue-haas-grotesk-display, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.11
    letterSpacing: "-0.025em"
  title:
    fontFamily: "neue-haas-grotesk-display, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.56
  body:
    fontFamily: "neue-haas-grotesk-display, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "neue-haas-grotesk-display, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "neue-haas-grotesk-display, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.1em"
  badge:
    fontFamily: "neue-haas-grotesk-display, sans-serif"
    fontSize: "0.5rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  gutter-mobile: "16px"
  sidebar-pad: "24px"
  container-pad: "32px"
  section: "64px"
  sidebar: "256px"
  container-max: "1218px"
components:
  nav-link:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    padding: "8px 0 24px"
  nav-link-active:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
  badge-explicit:
    backgroundColor: "{colors.warning-red}"
    textColor: "{colors.gallery-white}"
    typography: "{typography.badge}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  metadata-row:
    typography: "{typography.caption}"
    padding: "0"
---

# Design System: Will M Nichols Photography

## Overview

**Creative North Star: "The White Cube"**

The site is a gallery. The walls are white, each work hangs with room around it, and the only text is a small wall label. Everything that isn't the photograph either recedes to a 12px uppercase whisper or disappears entirely. The visitor is in the room with the work: the fullscreen home carousel fills the viewport, and navigating it means clicking the left or right half of the image itself. Nothing in the chrome competes.

The shop is the same room with a front desk. A print page is a wall label that happens to include a price and one way to buy. Controls stay invisible until they're needed. Facts (edition, size, paper, number) are stated plainly. Nothing is styled to sell.

The confirmed anti-references are: a generic Shopify storefront (badged cards, ratings, big colored buttons); anything left over from the stock Payload ecommerce template (rounded shadcn cards, Geist, gray filled buttons); and dark mode. The site is light-only by decision.

**Key Characteristics:**
- White ground and near-black ink, with no accent color. The only chromatic mark is the red explicit-content badge.
- One typeface, Neue Haas Grotesk Display, set mostly very small and very large.
- Images always at their true aspect ratio: never cropped, never watermarked.
- Hairline dividers in place of boxes, and almost no radius or shadow.
- Fixed left rail on desktop (256px) holding the handwritten "wmn" logotype and the nav.

## Colors

The palette is achromatic gallery white and ink, with one warning red that is reserved for a single job.

### Neutral
- **Gallery White** (hsl(0 0% 100%)): the page, the carousel stage, the mobile header bar. Every image sits on it.
- **Ink** (hsl(222.2 84% 4.9%)): body text and headings. A near-black with a trace of navy.
- **Graphite** (hsl(222.2 47.4% 11.2%)): nav text and the nav underline. At rest the nav uses Graphite at 50% opacity; hovered or active, at 100%.
- **Hairline** (hsl(240 6% 90%)): every divider. The sidebar's right edge, the mobile bar's bottom edge, the rules above and below the artwork metadata.
- **Plinth** (hsl(210 40% 96.1%)): the placeholder behind an image while it loads. Never used as a surface for content.
- **Label Gray** (#525252): metadata labels ("Medium", "Dimensions").
- **Caption Gray** (#404040): secondary lines such as series and year.

### Tertiary
- **Warning Red** (#dc2626): the EXPLICIT CONTENT badge, and nothing else.

### Named Rules
**The No Accent Rule.** No brand color exists. Hierarchy comes from size, weight, opacity and space. Do not introduce blue links, green "in stock" chips or colored buttons.

**The One Red Rule.** Warning Red means explicit content. Using it for errors, sale prices or "sold out" would dilute the one signal it carries; errors use Ink with plain copy.

## Typography

**Display Font:** neue-haas-grotesk-display (Adobe Fonts kit `who5iig`), with a sans-serif fallback
**Label/Mono Font:** none. The one Geist Mono use (the "Back to Portfolio" ghost button) is a template leftover, not part of the system.

**Character:** a neo-grotesk display cut used at its extremes. Tracked 12px uppercase labels sit against bold, tightly set titles, so the photograph owns the middle of the scale.

### Hierarchy
- **Display** (700, 1.875rem mobile / 2.25rem desktop, tracking -0.025em): the artwork title on detail pages. One per page.
- **Title** (400, 1.125rem): the series and year line under a title.
- **Body** (400, 1rem, prose measure): artwork descriptions, About text and the italic caption on the fullscreen carousel ("*Self portrait with veil*, 2026").
- **Caption** (400, 0.875rem): metadata values and the mobile carousel caption.
- **Label** (500, 0.75rem, uppercase, tracking 0.1em): navigation, and every control that should read as quiet chrome.
- **Badge** (700, 0.5rem, uppercase, tracking 0.05em): the explicit-content badge only.

### Named Rules
**The Wall Label Rule.** Facts about a work (year, medium, dimensions, edition, paper) are set in Caption, as a two-column label/value list between Hairline rules. They are never shown as chips, cards or icons.

**The Whisper Rule.** Anything that is chrome rather than content (nav, filters, quantity, cart, "back") uses the Label style at 50% Graphite and rises to 100% on hover or focus.

**The Decision Rule.** What a buyer must read or choose to buy is content, not chrome: the price, the size choice, print titles and prices on shop tiles, and the cart and checkout totals. These are set in full Ink at Caption size or larger, never at 50%. The size choice is a row of square, Hairline-bordered tiles (min 56px tall) showing each size's price; the chosen tile takes an Ink border. The single filled Ink button stays the one action on each surface (Add to cart, Checkout, Pay), and it is never disabled just because a size is missing: it prompts for one instead.

## Layout

On desktop (≥1024px) a fixed left rail sits beside the content. The rail is 256px wide, with 24px padding, a 32px gap between the logo and the nav, and a 1px Hairline right edge, and it stays sticky at full height. Content fills the rest of the width. Below 1024px the rail collapses to a fixed 64px top bar (logo left, menu right), and the menu opens as a right-side sheet.

The content container is centered with 32px side padding and a 1218px maximum width. CMS pages get 64px top and 96px bottom padding, except when they open with a fullscreen carousel, which runs edge to edge at full viewport height (minus 120px on mobile, where the caption sits below the image).

Artwork detail pages switch layout by orientation:
- **Landscape works** stack: title, image, then metadata held to a 768px measure.
- **Portrait works** sit in two columns from 1024px, with the image on the left and the label on the right (48px gap).

The responsive steps are 768 / 1024 / 1280 / 1536px, and 1024 is the one that matters.

**The Room To Breathe Rule.** Space is the main material. When a layout feels empty, leave it; don't fill it.

## Elevation & Depth

Flat. Depth comes only from the photograph. No surface on a portfolio path carries a shadow. The one exception is the mobile menu sheet, which sits over a black scrim at 80% opacity.

**The Flat Wall Rule.** Content never floats. Cards, product tiles and the cart don't lift, glow or cast shadows. Panels separate from the page with a Hairline, not elevation.

## Shapes

Square. The rail, the mobile bar, the nav, the badge and the images all have hard corners, and `.navLink` explicitly unsets radius. The rounded corners still in the code (the artwork image frame at 8px, MediaBlock images at 0.8rem, the shadcn button's 6px) are template residue and are not part of the system. New work uses 0px.

## Components

### Navigation
- **Style:** Label typography, 50% Graphite, 8px top and 24px bottom padding, stacked 16px apart in the rail.
- **Hover:** text rises to 100%, and a 2px Graphite underline slides up into view from below the clipped box (transform, 300ms).
- **Active:** underline fixed in view, text at 100%.
- **Dropdown:** groups expand in place (max-height and opacity, 300ms ease-in-out) with a 16px indent.
- **Mobile:** hamburger (44px target, 1.5px stroke) opens a right sheet, half the width up to 320px, that closes on navigation.

### Explicit Content Badge
Warning Red block, white Badge type, 2×6px padding, square, sitting beside the nav item it qualifies. It is the system's only label on a filled background.

### Wall Label (Artwork Metadata)
- Hairline rules above and below, 24px vertical padding, and 12px between rows.
- Each row is a three-column grid: a Label Gray caption label in the first column, an Ink caption value spanning the other two.
- Rows appear only when the field has a value.

### Fullscreen Carousel
- Navigation is the left or right half of the image itself.
- 60px thin chevrons sit at 40% Ink, rising to 70% on hover.
- The caption sits bottom-left at 32px from the edges: the italic title, then the year.
- When a work is flagged `darkBackground`, the caption and chevrons flip to white.
- No dots, no counters.

## Do's and Don'ts

### Do:
- **Do** keep every image at its true aspect ratio with `object-contain`, on Gallery White or Plinth.
- **Do** set shop chrome (quantity, filters, "back", remove) in Label style at 50% Graphite, and purchase decisions (price, size tiles, tile titles and prices, totals) in full Ink per the Decision Rule. Reserve a single filled Ink button for the one buy action on each surface.
- **Do** present edition, size, paper and number as a wall label: Caption type, label/value rows, Hairline rules.
- **Do** use Hairline (1px hsl(240 6% 90%)) for every separation, and 0px corners on new elements.
- **Do** keep sold-out works visible, quietly labeled in Label style, at the end of the list.

### Don't:
- **Don't** add an accent color, colored status chips, or blue or green links.
- **Don't** use rounded cards, drop shadows, Geist, or the shadcn default button look. Those belong to the template, not this system.
- **Don't** build product grids with ratings, "sale" or "bestseller" badges, or urgency counters.
- **Don't** add dark mode or dark-surface panels. The site is white-ground only.
- **Don't** crop, watermark or overlay text on a photograph, except the carousel's own caption.
- **Don't** use Warning Red for anything except explicit content.
