# WMN Print Shop — Launch Plan

_Drafted 2026-11-15. Repo: `cgallati/wmn` · Live: willmnicholsphoto.com (Vercel project `wmn`)_

**Goal:** launch a print shop for limited-edition prints on willmnicholsphoto.com. The portfolio, CV, MFA, About pages and the homepage carousel stay exactly as they are. Only the commerce surfaces get reworked: `/shop`, `/products/*`, cart, checkout, order/account pages.

Will's business and legal checklist is in [selling-prints-operations.md](./selling-prints-operations.md).

---

## 0. Fix first: security and exposure problems on the live site

Fix these before any other work. All of them affect production today.

| # | Problem | Where | Fix |
|---|---|---|---|
| 0.1 | **Any logged-in user can wipe the production database.** `POST /next/seed` only checks that *some* user is logged in, not that the user is an admin, and `/create-account` is public. Seeding runs `deleteMany` on every content collection and replaces it with template demo data (hat, t-shirt). | `src/app/(app)/next/seed/route.ts`, `src/endpoints/seed/*`, `src/components/BeforeDashboard/SeedButton` | **Delete the seed route, the seed endpoint and the SeedButton.** The site holds real content now and has no use for template demo data. (The admin button is already hidden, because `BeforeDashboard` returns `null`.) Keep or inline `home-static.ts`, because `[slug]/page.tsx` imports it as the home-page fallback. Update CLAUDE.md's "Seeding Data" section. |
| 0.2 | `/shop` is reachable but unlinked, showing a test "PRINT $300 SOLD OUT" product. | — | **Leave it.** It has been live like this for a while. Upgrade it in place. |
| 0.3 | The same Stripe keys are set for Development, Preview **and** Production. | Vercel env | Production gets live keys at launch; Preview and Development keep test keys. Use a separate Stripe sandbox per environment. |
| 0.4 | SEO titles still read "Payload Ecommerce Template". | `src/plugins/index.ts` `generateTitle` | Use "Will M Nichols". This also affects portfolio page titles, so check it with Will. It's a metadata-only change. |

---

## 1. Platform decision: Payload 3.93 now, 4.0 when it's GA

Status as of 2026-11-15:

- **The repo is on Payload 3.60.0** with Next 15.5.9 and MongoDB Atlas + Vercel Blob.
- **Latest stable is 3.93.0** (Nov 4).
- **4.0 is in public beta.** It's at `4.0.0-beta.9` (Nov 13), with roughly two betas a week since beta.0 on Oct 9, and no announced GA date.
- Payload has been part of Figma since mid-2025. v4 brings an admin redesign, TanStack support, upload versions and transforms, a rewritten MCP, and an agent-assisted codemod (`npx @payloadcms/codemod@beta upgrade`).

**Branch:** all shop work, including the §0 fixes, goes on `feat/shop-rework`. The seed route was removed there.

**Recommendation:** upgrade to **3.93** and build the shop on it. In parallel, run the v4 codemod on a throwaway branch to measure the work. Adopt v4 only once it reaches RC/GA, ideally before launch if the timing works out, otherwise as the first post-launch project.

Why not build on the v4 beta:

- The ecommerce plugin is itself still labeled beta. Stacking a beta framework under a beta payments plugin for real money is the risk to avoid.
- v4 raises the minimums to **Node 24.22.3, Next 16.4.1 and TypeScript 6.0.3**, so that's three major upgrades at once.
- v4 changes defaults this app depends on:
  - Local API `overrideAccess` now defaults to false.
  - Versions are on by default everywhere.
  - Default query depth is lower.
  - Storage adapters move to top-level config.
  - Sharp becomes an optional transformer.
  - Upload `sizes` becomes `variants`, which needs a Mongo `$rename` migration.
  - The Stripe confirmation now uses an atomic transaction claim, and the Stripe REST proxy needs an explicit method allowlist.

What 3.61 → 3.93 gives the shop:

- **3.67:** guest carts, so customers can buy without making an account.
- **3.71:** cart logic moves to the server with REST endpoints, plus `onLogin` guest-cart merge, `refreshCart`, and an atomic `$inc` for quantities.
- **3.78:** missing access control added on ecommerce collections, the Stripe webhooks URL fixed, and find-my-order by email.
- **3.79:** `req` passed through the Stripe adapter (transaction safety).
- **3.84:** **PaymentIntent verified as succeeded before an order is created**, and locale-aware currency formatting.

### Upgrade steps (on `feat/shop-rework`)

1. Bump all `@payloadcms/*` and `payload` packages to 3.93.0 together. Then update Next to the latest 15.x patch, run `pnpm generate:types` and `pnpm generate:importmap`, and build.
2. **Spot-check the portfolio on the Preview deploy** against production: home carousel, `/mfa`, `/cv`, `/about`, one artwork page, desktop and phone. The upgrade is the one step that changes code under every page, so it gets a manual look.
3. **Payload 4.0: deferred indefinitely** (decided 2026-11-15). Revisit after GA; the codemod spike is not scheduled.

**Done 2026-11-15:** upgraded to Payload 3.93.0 and Next 16.3.3 (Turbopack). Ported the template's security fixes: ecommerce access rework, admin-only form submissions, order `accessToken` for guest order links, safe preview/login redirects. Made Media and the Header/Footer globals admin-write-only. Stripe webhook path is now `/api/payments/stripe/webhooks`. Find-order emails need an email adapter before launch.

### Agent tooling

The official Payload Claude Code plugin is installed at project scope (`.claude/settings.json`). It tracks Payload's `main` branch, which is v4-flavoured guidance. When working on 3.93, cross-check against `llm-resources/payload-docs/` (already in the repo).

Once the app is on v4, switch to the version-matched skill that ships in the package: add an `AGENTS.md` pointing to `node_modules/payload/skills/payload/SKILL.md`, then disable the plugin. Never enable both at once.

---

## 2. Design: Impeccable, extending the live portfolio's look

The shop is a **Persuade / Operate hybrid** that lives inside an **Experience** site (the portfolio). The portfolio's visual world is the reference and **must not be replaced**: we extend it into commerce, we don't redesign the site.

What the live site's look consists of today:

- White ground and near-black ink (`rgb(2 8 23)`).
- `neue-haas-grotesk-display` (Adobe Fonts).
- Fixed left vertical nav with a handwritten "wmn" logotype.
- 12px uppercase nav at 0.1em tracking and 50% opacity.
- Images at their true aspect ratios, small captions ("Self portrait with veil, 2026"), and a lot of empty space.

The current shop is the stock Payload ecommerce template with light restyling. It needs real design work.

| Step | Impeccable command | Output |
|---|---|---|
| 1 | `/impeccable init` | `PRODUCT.md`: who buys Will's prints, price band, edition philosophy, tone. **Needs Will's input** (one 20-minute interview). |
| 2 | `/impeccable document` | `DESIGN.md` derived from the **live portfolio code**: tokens, type scale, nav, image handling. This makes the incumbent world the authority. |
| 3 | `/impeccable shape shop` | UX plan for these flows: shop index → print detail (size/edition selector, edition count remaining, framing) → cart drawer → checkout → confirmation/order lookup. It also covers sold-out treatment at the end of the grid and the artwork↔print links. |
| 4 | Build (new-work, **extension** path) | The commerce surfaces only. Shared components the portfolio uses (`Header`, `Media`, `Grid`) get **forked or extended**, never restyled in place. |
| 5 | `/impeccable critique` → `audit` → `harden` → `clarify` → `polish` | Heuristic review, plus accessibility, performance and responsive checks. Covers error, empty and loading states, payment failure copy, and final pass. Run `impeccable detect` on the changed files. |

Ideas to explore in `shape`:

- The print page reads like a wall label (title, year, medium, paper, dimensions, edition "7 / 25 remaining").
- A "View on the wall" scale reference.
- Sold-out editions stay visible as an archive.
- The cart lives in the left rail instead of a generic slide-over.

### Scope guard

- PRs touch only `src/app/(app)/{shop,products,checkout,find-order,orders,account}/**`, `src/components/{Cart,checkout,product,ProductGridItem,…}`, and new shop-only components.
- **Rule:** any diff to `Header`, `Footer`, `Portfolio`, `ArtworkDetail`, `blocks/*`, or `[slug]` is out of scope for shop work. If one is unavoidable, call it out in the PR and spot-check the affected pages.
- Adding a "Shop" nav item is the **one** intentional public-site change. It happens at launch, done by Will in the CMS (Header global), not in code.

---

## 3. Commerce build

### Catalog model

- **Artwork** (exists) → `availablePrints` → **Product** (one per image you can buy).
- **Variants by size**, and by paper/framing if offered. **Inventory per variant = edition size for that size.** The current comment in `Products/index.ts` says inventory is tracked per product. Decide this with Will, because per-size editions are the norm for fine-art photography.
- Add product fields:
  - `editionSize`, `artistProofs`
  - `paper`, `printProcess` (e.g. archival pigment)
  - `printedBy`, `signed` (bool)
  - `certificateOfAuthenticity` (bool)
  - `productionTime` (days)

  These drive the Georgia/California disclosure text (see the ops doc).
- **Edition numbering:** an `afterChange` hook on Orders assigns the next edition number per variant and stores it on the order line. The number appears on the packing slip and COA, and in Will's admin view.
- **Sold-out logic** (`shop/page.tsx`) treats a variant with `inventory` undefined as sold out. Make that explicit, and handle the last edition when two buyers check out at once. The 3.71 atomic `$inc` plus the 3.84 PaymentIntent verification help here; add a test.

### Checkout, tax, shipping, email

The current adapter is PaymentIntents + Payment Element. Three pieces are **missing**:

1. **Sales tax.** Georgia sources tax by destination and shipping is taxable (see the ops doc).
2. **Shipping rates.**
3. **Order emails.** No email adapter is configured (`email:` is commented out).

**Options.** Each would be a custom `paymentMethods` adapter, or an extension of the stock one. In every case Payload keeps cart, inventory, orders and transactions.

- **A. Checkout Sessions + Elements (custom UI mode).** Payment Element and Address Element are rendered in our own checkout UI, while the session handles `automatic_tax`, `shipping_options`, shipping address collection, and receipts. This gives full design control for the Impeccable pass, with tax and shipping done by Stripe.
- **B. Embedded Checkout.** Least code. Tax, shipping, wallets and receipts all come for free, but the checkout look is limited to Stripe's branding settings.
- **C. PaymentIntents (current adapter) + Tax Calculation API.** Create a tax calculation from the cart and destination in `initiatePayment`, add it to the amount, and record a tax transaction on success. Shipping is our own rate table. This is the most custom code.

**Decided: A** (2026-11-15). Spike it first to confirm that the plugin's adapter contract (`initiatePayment` / `confirmOrder`, and how the transaction is reconciled by webhook) maps cleanly onto a Checkout Session instead of a PaymentIntent.

**Built 2026-11-15** (option A, on the shop branch):

- `src/payments/stripeCheckout/` is a custom payment adapter named `stripe`, so it replaces the stock PaymentIntents adapter without forking the plugin, and the endpoints stay at `/api/payments/stripe/{initiate,confirm-order,webhooks}`.
  - `initiatePayment` creates a Checkout Session (`ui_mode: 'elements'`) with `automatic_tax`, US shipping address collection and one **placeholder** flat shipping rate. It also records a pending Transaction.
  - `confirmOrder` checks that the session is paid and matches the transaction, then calls the plugin's `finalizeOrder`, which does the atomic claim, inventory decrement and order creation.
- **Webhook:** it verifies the signature and settles paid sessions through the plugin's own `/confirm-order` (one settlement path, race-safe). It also marks failed or expired sessions. Subscribe the endpoint to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` and `checkout.session.expired`. A paid session from a signed-in customer is logged, not settled, because checkout is guest-only.
- **Checkout page:** email first, then the Shipping Address Element, the shipping option, the Payment Element and Pay. A live summary shows subtotal, shipping, tax and total. The confirmation page confirms, clears the cart and opens the order page.
- **Packages:** `stripe` 23.1 (API `2026-10-28.endive`), `@stripe/stripe-js` 10.3, `@stripe/react-stripe-js` 7.1.
- **Still open before launch:**
  - Real shipping rates and regions (`SHIPPING_OPTIONS` and `ALLOWED_SHIPPING_COUNTRIES` in `shared.ts`).
  - A Georgia registration in Stripe Tax; until then tax is $0.
  - A registered webhook endpoint and its signing secret.
  - An email adapter for receipts and find-order.
  - Whether to keep Link and the BNPL methods shown by the Payment Element (a Dashboard setting).

Other checkout pieces:

- **Shipping:** US-only at launch, with flat rates by package type (flat mailer vs. tube vs. framed crate). International later.
- **Email:** add `@payloadcms/email-resend` (or nodemailer + Postmark). Send an order confirmation to the buyer, a "new order" alert to Will, and shipped/tracking emails. Add a `trackingNumber` and `carrier` field on Orders, plus a "Mark shipped" admin action that sends the email.
- **Guest checkout by default.** Accounts stay optional, since find-order works by email.
- **Webhooks:**
  - Confirm the endpoint path after the upgrade. The 3.78 fix changed it, and `package.json`'s `stripe-webhooks` script points to `/api/stripe/webhooks`.
  - Register separate test and live endpoints in Stripe.
  - Subscribe only to the events the adapter handles.
- **Policies:** Shipping, Returns/Damage, Privacy, Terms, and the Print Disclosure. Shop-scoped pages linked from the shop/checkout footer area, **not** the global Footer, until launch.

### Ops in the admin (for Will)

- Orders list view with a fulfillment status (`paid → printing → shipped → delivered`).
- A printable packing slip / COA template per order line.
- Low-edition alert email when a variant has ≤ 2 left.

---

## 4. Verification

- **E2E with Playwright, in Stripe test mode:**
  - Guest purchase with a card.
  - Declined card.
  - 3DS card.
  - Webhook arrives late.
  - Last edition, two buyers.
  - Sold-out sorting.
  - Tax computed for an Atlanta address vs. an out-of-state address.
- **Manual:** real phone checkout (Apple Pay) on a Preview deploy with test keys.
- **Lighthouse/a11y:** run `/impeccable audit` on the shop routes.

---

## 5. Launch sequence

1. Will finishes the ops checklist: Stripe activated, Georgia sales tax number, policies approved, first batch of prints and packaging on hand.
2. Add live keys to Production only, register the live webhook, add the Georgia registration in Stripe Tax, and set `NEXT_PUBLIC_ENABLE_SHOP=true`. Keep the Shop nav link off.
3. **Soft launch:** share the `/shop` URL privately and run 2–3 real orders, including one refund end to end.
4. **Public launch:** Will adds "Shop" to the Header global in the CMS, then submit the sitemap.
5. Post-launch: v4 upgrade (if not already done), international shipping, discount codes (not built into the plugin as of 3.93), and an email list.

## Production readiness (as of 2026-11-15)

The shop stays dark in production until Will has **a shipping rate in Shop settings** and **a published print with an edition left**. Until then `/shop`, `/products/*` and `/checkout` return 404 and the cart is hidden. Once both are true it opens on its own, with no flag or redeploy. The "Prints" nav item is added by Will in the Header global.

**Before merging to `main`** (the deploy is harmless while the shop is dark, but these must be right before it opens):

- [ ] **Production env:** set `NEXT_PUBLIC_ENABLE_SHOP=true`. Otherwise the frozen Header never renders the cart, even when the shop is open; the code now gates the cart itself.
- [ ] **Production env:** set `NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL` to `https://www.willmnicholsphoto.com`. Today they are `https://wmn-shop.vercel.app` for every environment, so Stripe would return buyers to the vercel.app domain.
- [ ] **Production database:** delete the template test product ("PRINT", sold out) and its test order and transaction. It keeps the shop dark today, but once the shop opens it would appear in the sold-out archive.
- [ ] **Merge path:** `claude/shop-ui-1b6278` into `feat/shop-rework`, then `main`. Spot-check the portfolio on the Preview deploy first: `Media` now uses relative image URLs, the `/artwork/[slug]` route is removed, and the header cache fix is in.

**Before the shop opens (Stripe, live mode):**

- [ ] Put live keys in **Production only**. Today one test key is shared by Production, Preview and Development, which is fine until launch.
- [ ] Register a live webhook endpoint at `https://www.willmnicholsphoto.com/api/payments/stripe/webhooks` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` and `checkout.session.expired`. Put its signing secret in Production as `STRIPE_WEBHOOKS_SIGNING_SECRET`.
- [ ] **Stripe Tax:** activate it in live mode, set the origin address, and add the Georgia registration. Without a registration, tax is $0.
- [ ] **Payment methods (Dashboard):** decide on Link (its "save my info" box blocks Pay until a phone is entered or it is unticked), Cash App, Affirm and Klarna.
- [ ] **Emails (Dashboard):** turn on customer receipts for successful payments and payment notifications to Will. No email adapter is configured, so the site sends no order emails, and find-order emails are not sent either.

**Before the shop opens (Will, in the admin):**

- [ ] Shop settings: real shipping rates (label, price, delivery estimate) and ship-to countries.
- [ ] Prints: sizes as variants, inventory per size equal to the edition size, prices, paper, process, signed, production time, and the explicit flag where needed.
- [ ] Policies: Shipping, Returns/Damage, Privacy, Terms and the Print Disclosure (see the ops doc). There is no checkout link to them yet; add one when the pages exist.
- [ ] Add "Prints" to the Header nav when ready. With the header cache fix it appears on the next page view.

**Known gaps, acceptable for a soft launch:**

- **Last-edition race:** two buyers can pay for the last edition at once. Inventory can then go negative, and one order needs a refund. Watch for it, and add an alert or test later.
- **Accounts:** `/create-account` and `/login` are still public, though checkout is guest-only. Consider disabling self-signup.
- **Email adapter:** needed for order emails and find-order (`@payloadcms/email-resend`).
- **Order fulfillment in the admin:** status, tracking and packing slip are still to come (§3).
- **SEO titles:** they still say "Payload Ecommerce Template" (§0.4).

**Preview scaffolding to remove after review:**

- Vercel Authentication was turned **off** for the wmn project so Will can view the preview. Turn it back on.
- Revoke the "Stripe test webhooks for shop previews" automation bypass.
- Delete the Stripe test endpoint `we_1UcGjbRfUGsoOWjhrPj5NZeI`.
- Drop the `wmn-preview` database, or keep it for future reviews.

## Decisions needed

- [ ] **Will:** sizes, paper and framing offered; edition size per size; prices. Will he print himself or use a lab?
- [ ] **Will:** US-only at launch? Return/damage policy terms?
- [x] **Chad:** Checkout approach → **Checkout Sessions + Elements (option A)**.
- [ ] **Chad + Will:** v4 before or after launch (after the codemod spike).

## Sources

- Payload releases (3.67 guest carts, 3.71 server cart, 3.78, 3.84, v4 betas): https://github.com/payloadcms/payload/releases
- Payload v4 migration guide: https://github.com/payloadcms/payload/blob/main/docs/migration-guide/v4.mdx
- Payload AI tooling / skill: https://payloadcms.com/docs/v4/getting-started/ai-tooling
- Figma acquisition coverage: https://www.cmswire.com/digital-experience/when-cms-meets-ux-design-what-figmas-payload-deal-really-means
