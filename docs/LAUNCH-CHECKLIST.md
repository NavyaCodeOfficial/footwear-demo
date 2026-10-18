# Launch checklist

## Must be supplied by the owner (nothing was invented)

- [ ] Production domain -> `PRODUCTION_URL` or `VITE_SITE_URL`
- [ ] WhatsApp business number (digits with country code) -> `whatsappNumber`
- [ ] Business email, address, phone display, social profile URLs
- [ ] Verified product catalogue: names, SKUs, prices, sizes, colours, availability, materials, care
- [ ] Real product photography with rights to use, plus a 1200x630 JPG/PNG social image
- [ ] Brand story (home "How we choose" and About page placeholders)
- [ ] Approved shipping, returns, cancellation, privacy, terms and cookie text (replace every `[PLACEHOLDER]`; review with a qualified adviser)
- [ ] Approved customer benefits/claims, if any (none are published now)
- [ ] Decision on newsletter and social gallery (omitted until a real mechanism/imagery exists)

## Code changes at launch

- [ ] Set `isSample: false` on each verified product
- [ ] Set `showSampleDataNotice: false`; replace or empty `announcement`
- [ ] Remove "Sample"/"demo" wording in product descriptions, SEO titles and descriptions
- [ ] Delete unused demo SVGs from `public/images/`
- [ ] Remove the draft banner in `PolicyPage.tsx` only after policy sign-off
- [ ] Update `defaultOgImage` and `logoPath`/favicon to final brand assets

## Verify (not yet done in this environment)

- [ ] `npm test` and `npm run build` pass; `npm run verify` passes
- [ ] Open `dist` via `npm run preview` and click through: home, shop (every filter/sort/search), a product (size/colour validation), cart (add/remove/quantity/persist/clear), enquiry forms, all policy pages, 404
- [ ] With the real number set, confirm the WhatsApp message text on a phone and in WhatsApp Web (check the ₹ symbol, line breaks and product links)
- [ ] Keyboard-only pass (tab order, focus visible, dialogs trap focus and close with Escape)
- [ ] Screen-reader pass (cart announcements, form errors)
- [ ] Mobile, tablet, desktop layouts at 360, 768, 1280 px
- [ ] Browser console free of errors; Network tab shows no failed requests
- [ ] Lighthouse (mobile and desktop) and PageSpeed Insights on the deployed URL; record real scores
- [ ] Response headers: assets `immutable`, HTML `must-revalidate`, security headers present
- [ ] Rich Results Test and Schema Markup Validator on home, category, product, FAQ
- [ ] `robots.txt` and `sitemap.xml` correct on the live domain

## After launch

- [ ] Verify the Search Console property and submit the sitemap (`docs/SEARCH-CONSOLE.md`)
- [ ] Re-check the Indexing report after a few days
- [ ] Obtain explicit consent mechanisms and update the privacy and cookie policies **before** adding any analytics
