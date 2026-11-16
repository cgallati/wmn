# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Will M Nichols is a fine art photographer. The site serves two buyers, split into price tiers:

- **Collectors and the art world:** people who know his MFA and exhibition work. They buy limited editions and care about edition size, paper, process and provenance.
- **Fans and followers:** friends, followers and first-time art buyers who want a piece of his work at an accessible price.

Both buyers arrive through the portfolio. They have usually seen the work there first, and they come to the shop to own it.

The second user is **Will himself**. He runs the shop from the Payload admin: he adds prints, sets editions and prices, and fulfills orders from Atlanta, Georgia.

## Product Purpose

willmnicholsphoto.com is Will's portfolio: conceptual self-portraiture about queer experience, plus his CV, MFA work and About page. The shop lets visitors buy prints of that work directly from the artist, while the portfolio stays exactly as it is.

Success means the following:

- A buyer can go from a work they love to a confirmed order without friction.
- They know exactly what they're getting: size, paper, edition and number.
- Will can run it alone.

## Positioning

The prints are sold directly by the artist, as authenticated editions of his own conceptual self-portraits. That is something a print-on-demand storefront or a reseller can't truthfully offer.

## Operating Context

- Will sells as an individual artist based in Atlanta, Georgia. He is finishing an MFA in Photography at SCAD.
- He prints, signs, packs and ships the orders himself or through a lab (still undecided). His operations checklist is in `docs/selling-prints-operations.md`.
- Payments go through Stripe, with sales tax handled by Stripe Tax using Checkout Sessions + Elements. The site runs on Payload CMS and Next.js on Vercel.

## Capabilities and Constraints

**Confirmed:**

- **Limited editions with tracked inventory.** Sold-out editions stay listed at the end of the shop in a sold-out state.
- **Guest checkout only.** Nobody needs an account to buy.
- **Explicit content.** Explicit work is for sale, but sits behind a content notice, consistent with how the portfolio flags explicit work.
- **Portfolio pages are frozen.** The portfolio, CV, MFA, About and homepage carousel must not change as part of shop work.

**Undecided** (do not invent these):

- Sizes, papers and framing.
- Edition size per size, and artist's proofs.
- Prices and how they split into tiers.
- Shipping regions (US-only at launch is proposed, not confirmed).
- Return and damage terms.

## Brand Commitments

- The name is "Will M Nichols" / "WMN". The handwritten "wmn" logotype and the portfolio's visual world are the existing identity. The shop extends that look; it does not replace it.
- **No discounts, sales, countdowns or "only N left!" pressure.** Edition counts are stated plainly as facts.
- **No cropping and no watermarks.** Images always appear at their true aspect ratio, as in the portfolio.

## Evidence on Hand

- **About text** (live /about): a gay male photographer from New England whose practice centers on conceptual self-portraiture about queer experience and the reconstruction of self-image.
- **Featured in:** Sensitive Content Magazine Vol. 5, The Space in Between Gallery, QUEER Gallery, and SCAD group exhibitions.
- **Artwork records** in the Payload `artwork` collection, with title, year, series, medium, dimensions and camera details.
- **Not available:** testimonials, sales history, collector quotes and press quotes about the prints. Do not fabricate any of these.

## Product Principles

1. **The work leads.** Commerce is quiet and factual, and never competes with the image.
2. **Tell buyers exactly what they're getting.** Edition, size, paper, process, signature and what ships are always stated.
3. **Respect the buyer.** No pressure tactics, no forced accounts, and no surprise costs at the last step.
4. **Will can run it alone.** Every flow has to be operable by one person from the admin.

## Accessibility & Inclusion

Aim for WCAG 2.2 AA on the shop and checkout. The content notice on explicit work must work by keyboard and with a screen reader, and must not trap focus.
