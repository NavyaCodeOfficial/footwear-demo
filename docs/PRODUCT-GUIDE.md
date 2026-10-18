# Product and site editing guide (developer)

There is no admin dashboard in this version. All content is edited in code, then rebuilt and redeployed.

## Add a product

Open `src/data/products.ts` and add an object to the `products` array:

```ts
{
  id: 'p018',                       // unique
  name: 'Classic Derby',
  slug: 'classic-derby',            // lowercase, hyphens, unique, becomes /product/classic-derby/
  sku: 'RF-M-DRB-018',              // unique
  category: 'mens-footwear',        // must match a slug in categories.ts
  subcategory: 'Formal shoes',
  price: 3499,                      // INR, whole rupees (verified price only)
  description: '...',
  images: [{ src: '/images/classic-derby-1.webp', alt: 'Black derby shoe, side view', width: 1200, height: 1200 }],
  sizes: ['6', '7', '8', '9', '10'],
  colours: [{ name: 'Black', hex: '#1F1D1B' }],
  availability: 'in_stock',         // in_stock | limited | preorder | out_of_stock
  materials: '...', care: '...',    // optional, only if known
  seoTitle: 'Classic Derby | Men\'s Formal Shoes | Royal Footwear',
  seoDescription: '...150-160 characters, unique...',
  relatedIds: ['p002'],             // optional
  addedOn: '2026-10-20',            // drives "newest" sorting and New Arrivals
  featured: true,                   // optional: homepage Featured
  isSample: false,                  // IMPORTANT: false once details are verified
}
```

Then `npm run build`. The product page, sitemap entry, JSON-LD and internal links are created automatically.

## Common edits (same file)

| Task | What to change |
|---|---|
| Edit a product name | `name` (also update `seoTitle`/`seoDescription`; keep `slug` stable once published) |
| Update a price | `price`. Add `originalPrice` **only** for a genuine, approved discount |
| Change images | Put files in `public/images/`, update `images[]` with correct `width`/`height` and meaningful `alt` |
| Add/remove sizes | `sizes[]`. Per-colour size limits: `colours[].sizes`. Unavailable colour: `colours[].available: false` |
| Change availability | `availability`. `out_of_stock` disables ordering but keeps enquiries |
| Mark real bestsellers | `bestseller: true` (the homepage section appears only when at least one is set) |
| Remove a product | Delete the object. Consider a redirect in `vercel.json` if the URL was indexed |

Changing a `slug` changes the URL; add a redirect from the old path.

## Categories

Edit `src/data/categories.ts`. Each category needs `slug`, `name`, `navLabel`, `description`, `seoTitle`, `seoDescription`, `image`, `showOnHome`, `order`. A product uses exactly one category slug. New categories get a page at `/category/<slug>/`, a nav entry and a sitemap entry automatically.

## Business details and WhatsApp

Edit `src/data/siteConfig.ts`:

- `whatsappNumber`: digits only with country code (e.g. `919876543210`, no `+` or spaces). 8 to 15 digits. Until set, ordering is disabled.
- `businessEmail`, `businessAddress`, `phoneDisplay`, `social.*`, `announcement`, `footerNote`, `policy.*`.
- `PRODUCTION_URL` (or the `VITE_SITE_URL` environment variable).
- Set `showSampleDataNotice: false` once real data replaces samples, and remove or change `announcement`.

If real LocalBusiness details become available, add LocalBusiness JSON-LD in `src/utils/seo.ts` using only verified facts.

## FAQ and policies

`src/data/faq.ts` (also feeds FAQ JSON-LD) and `src/data/policies.ts`. Replace every `[PLACEHOLDER]` and have the owner review before publishing. Remove the "DRAFT" banner in `src/pages/PolicyPage.tsx` only after sign-off.

## Rebuild and redeploy

```bash
npm test && npm run build     # build also runs the SEO file generator and verifier
```

On Vercel, pushing to the connected branch redeploys. Run `npm run verify` after any build to re-check metadata, links and the sitemap.

## Replacing demo images

`public/images/*.svg` are labelled placeholders (regenerate with `npm run images:demo`). Use WebP or AVIF, keep explicit `width`/`height`, and size hero/product images for mobile first (about 800 to 1200 px wide). Use only photography the owner has rights to.
