# Selling Prints Online from Atlanta: Will's Operations Checklist

_Drafted 2026-11-15 for Will M Nichols. This is a working checklist, not legal or tax advice. Items marked **(verify)** are things the sources disagreed on, or that change year to year. Confirm them on the official site or with a CPA before relying on them. One hour with an Atlanta CPA who works with artists is worth it before launch._

The website side is in [shop-launch-plan.md](./shop-launch-plan.md). This doc covers everything **Will** has to do to legally and practically sell prints.

---

## Order of operations (do these roughly in sequence)

1. Pick the business structure and name (§1)
2. EIN and a separate bank account (§1)
3. Georgia sales tax registration (§2)
4. City of Atlanta Occupation Tax Certificate (§3)
5. Finish Stripe account activation (§4)
6. Production decisions: printing, editions, packaging, shipping (§5–6)
7. Write the policies and disclosure (§7)
8. Set up bookkeeping (§8)
9. Soft launch with friends, then public launch

---

## 1. Business structure

- [ ] **Sole proprietor vs. LLC.**
  - Selling under his own name as a sole proprietor is fine to start: no state filing, and income goes on Schedule C.
  - A **Georgia LLC** separates personal liability. It costs about **$100** to form online with the Georgia Secretary of State, plus an **annual registration of about $50 due April 1** **(verify current fees)**.
  - Ask the CPA which one makes sense at his expected volume.
- [ ] **Trade name.** If he sells as a sole proprietor under a name other than his legal name (e.g. "WMN Photo"), Georgia requires a **trade name registration with the Clerk of Superior Court** in his county (Fulton or DeKalb), plus publication in the county's legal newspaper.
  - Selling as "Will M Nichols" avoids this.
  - An LLC uses its registered name instead.
- [ ] **EIN.** Free from IRS.gov, about 10 minutes. Use it on Stripe and tax forms instead of his SSN.
- [ ] **Separate business checking account.** Stripe payouts go here, and all supplies and shipping get paid from here.

## 2. Georgia sales tax (required)

Prints are tangible goods, so they're taxable in Georgia.

- [ ] **Register for a Sales & Use Tax number** on the Georgia Tax Center (gtc.dor.ga.gov). Registration is free.
- [ ] **What to charge:**
  - Georgia sales tax is based on **where the buyer receives the item**.
  - Inside the **City of Atlanta it's 8.9%**. Elsewhere in Georgia it's roughly 7–8.9%, depending on county.
  - **Shipping charges on taxable items are taxable in Georgia**, even when shown on a separate line.
  - Stripe Tax handles all of this automatically once his Georgia registration is added to Stripe.
- [ ] **Local pickup or in-person sales** (studio visits, art fairs) are taxed at the rate where the sale happens.
- [ ] **File returns** (Form ST-3) on whatever schedule GA DOR assigns: monthly, quarterly or annual, usually due the 20th of the following month.
  - **File even in months with zero sales.**
  - Stripe Tax produces the report he needs to file.
- [ ] **Other states:** he only has to collect another state's tax after passing that state's "economic nexus" threshold, commonly **$100,000 in sales into that state per year**. Some states also count transactions **(verify per state)**.
  - Realistically that won't happen early on.
  - Stripe Tax monitors thresholds and warns him when he gets close.
- [ ] **Resale certificate:** with his GA sales tax number he can give his print lab a Georgia resale certificate (Form ST-5). That way he doesn't pay sales tax on prints he will resell. Ask the CPA how to handle framing and materials.

## 3. City of Atlanta business license

- [ ] **Occupation Tax Certificate (OTC).** Atlanta requires one for any business operating inside city limits, **including home-based and online-only businesses**.
  - Apply online through **ATLBIZ**.
  - Zoning approval (home occupation) is part of the application.
  - Requirements:
    - Notarized E-Verify and SAVE affidavits.
    - Government ID.
    - Secretary of State registration if he forms an LLC.
  - Fee: **$191 for tax year 2026 per the city's page** **(verify)**.
  - Renew every year: the application is due around Feb 15 and the tax by April 1 **(verify)**.
- [ ] If he lives in **unincorporated** Fulton or DeKalb rather than the City of Atlanta, the county issues the license instead.

## 4. Stripe: activate the account

Test mode is already connected to the site. To accept real payments:

- [ ] **Activate the account.** Submit business type (individual/sole prop or LLC), legal name, EIN or SSN, address, date of birth, and bank account for payouts. Then complete identity verification.
- [ ] **Public business details.** These appear on receipts and customers' card statements.
  - **Statement descriptor:** e.g. `WILLMNICHOLS PHOTO`, max 22 characters.
  - **Support email** (and phone, if he's willing).
  - **Website URL.**
  - **Refund/return policy URL.**
- [ ] **Turn on Stripe Tax** and add the Georgia registration (number + effective date). Set the product tax code for prints to tangible goods, and make shipping taxable.
- [ ] **Customer email receipts:** on, branded with his logo and colors.
- [ ] **Two-factor login** on the Stripe account.
- [ ] **Know the costs:**
  - About **2.9% + 30¢** per US card payment.
  - Stripe Tax adds about **0.5% per transaction** where tax is calculated **(verify current pricing)**.
  - A $300 print costs about **$9.00 in card fees + $1.50 for tax**.
- [ ] **Disputes/chargebacks:** each dispute has a fee. The defenses are tracking numbers plus signature-on-delivery for expensive pieces.
- [ ] **1099-K:** Stripe issues one if he passes the federal reporting threshold (**$20,000 and 200 transactions** under current law **(verify)**). All income is taxable either way.

## 5. Production: editions, printing, certificates

- [ ] **Decide the edition structure**, and write it down because it can't change after selling starts:
  - Sizes offered, and the edition size per size (e.g. 8×10 /25, 16×20 /10, 30×40 /3).
  - Artist's proofs (APs): how many.
  - Whether editions are per size or across all sizes.
  - Open editions vs. limited editions.
- [ ] **Printing:** in-house or a lab.
  - Pick paper and process (e.g. archival pigment on cotton rag).
  - Get the lab's turnaround time, and order a test print per size.
  - Production time drives the "ships in X days" promise.
- [ ] **Signing and numbering:** where (front margin vs. verso), and in what (pencil for fine art).
- [ ] **Certificate of Authenticity:** title, year, edition number/size, paper, process, print date, signature. The site will generate a printable version per order.
- [ ] **Edition log:** the site assigns edition numbers automatically, but keep a backup spreadsheet of number → buyer → date.

## 6. Packing and shipping

- [ ] **Packaging by size:**
  - Rigid flat mailers for small prints.
  - Tubes for large, unframed prints (use acid-free tissue, interleaving and glassine).
  - Framed work needs a box-in-box or crate. Shipping glass is risky, so consider acrylic or local pickup only.
- [ ] **Carrier and labels.** Use USPS Priority / UPS Ground through a label tool (Pirate Ship, Shippo or ShipStation) for discounted rates. Add tracking numbers to the order in the site admin, which emails the buyer.
- [ ] **Insurance:** declared value on every shipment over about $100, plus **signature required** above a price Will picks (e.g. $500).
- [ ] **Damage process:** the buyer sends photos within X days, then Will reprints from the same edition number or refunds. The edition number stays the same; destroy the damaged print.
- [ ] **US only at launch.** International means customs forms, duties disclosure and higher damage risk. Add it later.
- [ ] **Local pickup in Atlanta** as a free option.
- [ ] **Supplies budget:** mailers, tissue, tape, labels, COA cardstock and a pencil. Work out the cost per order so it's covered by price or shipping.

## 7. Policies and required disclosures

- [ ] **Shipping policy:** production time, carriers, regions, insurance/signature.
- [ ] **Returns policy.** Common for limited editions: no returns except damage or defect, and all sales final on custom framing. Stripe requires a visible refund policy.
- [ ] **Privacy policy:** what the site stores (name, address, email, order history) and that payments go through Stripe.
- [ ] **Terms of sale**, including **copyright**: the buyer owns the physical print, Will keeps the copyright and reproduction rights.
- [ ] **Limited-edition disclosure (Georgia law).**
  - Georgia's *Limited Edition Art Reproductions* law (O.C.G.A. §10-1-430 et seq.) covers prints and photographs sold as limited editions. It requires written disclosure to buyers about the edition.
  - The disclosure covers: the artist; the medium/process; the edition size and the number of proofs; whether it's signed; the year printed; and whether more copies may be made.
  - **(verify the exact required items in §10-1-431.)**
  - California has a similar law for multiples over $100 sold to buyers there.
  - The product page and invoice will show this from the product fields. Will supplies the true values.
- [ ] **Contact:** a real support email he checks, with a stated response time.

## 8. Money and bookkeeping

- [ ] **Bookkeeping app** (QuickBooks, Wave, or a spreadsheet) connected to the business bank account. Track:
  - Sales.
  - Sales tax collected (it's not his money; set it aside).
  - Printing costs, paper, framing, shipping, packaging.
  - Stripe fees, website costs, and the OTC fee.
- [ ] **Income tax:** profit is reported on Schedule C (sole prop or single-member LLC). It's subject to **self-employment tax (~15.3%)** plus federal and Georgia income tax.
- [ ] **Quarterly estimated taxes** (federal 1040-ES and Georgia 500-ES) once there's a steady profit. Due mid-April, June, September and January.
- [ ] **Keep receipts** for equipment and supplies, which may be deductible. Ask the CPA about the home studio deduction.
- [ ] **Insurance:** check whether renter's/homeowner's insurance covers business inventory (usually not). An inexpensive artist business policy covers stock and liability.

## 9. Launch-day readiness

- [ ] A few prints of each launch edition printed, signed and ready, or a lab confirmed to turn them around fast.
- [ ] Packaging for at least 10 orders on hand.
- [ ] Policies reviewed and published.
- [ ] Stripe live, Tax on with the GA registration, payouts verified with a $1 test.
- [ ] A real test purchase and refund done end to end.
- [ ] An announcement plan: email list, Instagram, gallery contacts.

---

## Sources

- Atlanta combined sales tax 8.9%: https://www.salestaxhandbook.com/georgia/rates/atlanta · Georgia DOR rate chart (authoritative): https://dor.georgia.gov/sales-tax-rates-general
- Georgia shipping taxability: https://www.taxjar.com/blog/retail/georgia-sales-tax-shipping
- Atlanta Occupation Tax Certificate: https://www.atlantaga.gov/government/departments/finance/office-of-revenue/apply-for-a-new-business-occupational-tax-certificate · https://www.atl311.com/en-US/knowledgearticle/?code=KB0012728
- Georgia Limited Edition Art Reproductions law: https://law.justia.com/codes/georgia/2019/title-10/chapter-1/article-15/part-5/
- Georgia Tax Center: https://gtc.dor.ga.gov
- Stripe Tax: https://stripe.com/tax
