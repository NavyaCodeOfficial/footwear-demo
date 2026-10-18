# Royal Footwear storefront (demo)

Premium footwear storefront built by **NavyaCode: Where Code Meets Creativity**.
React 19 + Vite 8 + TypeScript + React Router 6, statically prerendered with `vite-react-ssg`.
Ordering is **WhatsApp only**: the site prepares a message, the customer reviews and sends it. There is no payment, checkout, server or admin panel.

> All products, prices, SKUs and size runs are **sample data**. Business details (WhatsApp number, address, email, domain, policies) are **empty or placeholder** until the owner supplies them. Nothing is invented.

## Quick start

```bash
npm install
npm run dev          # client-side dev server
npm run dev:ssr      # dev server with server rendering (closer to production)
npm test             # unit + component tests (vitest, jsdom)
npm run build        # typecheck, prerender, sitemap/robots, verification checks -> dist/
npm run preview      # serve dist/ locally
```

Requires Node 22+.

## Project layout

```
src/
  app/routes.tsx          route table (static + prerendered dynamic routes)
  components/             layout, navigation, products, cart, forms, whatsapp, seo, common
  data/                   siteConfig.ts, categories.ts, products.ts, faq.ts, policies.ts
  hooks/                  useCart (context + localStorage), useDialog (focus trap, Escape)
  pages/                  Home, Shop, Category, Product, About/Contact/FAQ/404, Policy
  utils/                  whatsapp, cart, filters, validation, seo (JSON-LD), format
  styles/global.css       design tokens, glass effects, components
public/                   favicon.svg, robots.txt (dev default), images/ (demo SVGs)
scripts/
  generate-seo-files.mjs  post-build: sitemap.xml, robots.txt, 404.html
  verify-build.mjs        post-build checks over the prerendered HTML
  generate-demo-images.mjs  regenerates the placeholder illustrations
docs/                     PRODUCT-GUIDE.md, SEARCH-CONSOLE.md, LAUNCH-CHECKLIST.md
vercel.json               routing, cache and security headers (Vercel)
```

## How prerendering works

`vite-react-ssg` renders every route to static HTML at build time using the same React components as the browser, so each page ships with its real `<title>`, description, canonical URL, visible content, internal links and JSON-LD. Product and category pages are generated from `products.ts` and `categories.ts` via `getStaticPaths`, so adding a product and rebuilding creates its page automatically. The browser then hydrates the HTML.

`scripts/generate-seo-files.mjs` builds `sitemap.xml` by reading the prerendered HTML in `dist/` (canonical URL + robots meta), so it cannot drift from the real pages. It refuses to write a sitemap when `siteUrl` is empty, a placeholder, localhost, non-HTTPS or a host preview domain. With `STRICT_SEO=1` (set automatically on Vercel production builds) that becomes a build failure.

## Configure before launch

Everything lives in `src/data/siteConfig.ts`. See `docs/LAUNCH-CHECKLIST.md`. The essentials:

| Setting | Effect while empty |
|---|---|
| `PRODUCTION_URL` or `VITE_SITE_URL` | Canonicals are relative, no sitemap, strict builds fail |
| `whatsappNumber` (digits, with country code) | All order/enquiry buttons are disabled with an explanation; floating chat button hidden |
| `businessEmail`, `businessAddress`, `phoneDisplay`, `social.*` | Not rendered |
| `googleSiteVerification` | Verification meta tag not rendered |

## Deploying (Vercel)

1. Push the repo, import it in Vercel (framework preset: Vite; `vercel.json` already sets build command, output dir, trailing slashes, headers).
2. Set `VITE_SITE_URL` to the real production domain (or edit `PRODUCTION_URL`).
3. Deploy, then follow `docs/SEARCH-CONSOLE.md`.

`vercel.json` sets: `trailingSlash: true` (matches the `/shop/` canonical convention); hashed `/assets/*` as `max-age=31536000, immutable`; `/images/*` as one day with stale-while-revalidate (filenames are not hashed); HTML, `sitemap.xml` and `robots.txt` as `max-age=0, must-revalidate`; plus HSTS, CSP, `nosniff`, frame and referrer headers.

Other static hosts: the `dist/` folder is plain static files in `/route/index.html` form. You must recreate the equivalent headers and trailing-slash behaviour in that host's own format (`_headers`, `netlify.toml`, etc.). That has **not** been tested here.

## Behaviour notes

- Cart identity is `productId|size|colour`; quantity is limited to 1 to 10; stored in `localStorage` only, never sent anywhere; corrupted storage is ignored safely.
- WhatsApp links use `https://wa.me/<digits>?text=<encoded>` and open only from a click/tap. Without a valid number nothing opens.
- Sample products intentionally emit **no `Offer` JSON-LD**, so demo prices are never presented to search engines as real. Set `isSample: false` on a verified product to enable its `Offer`.
- No ratings, reviews, GTINs, stock counts or discounts are generated. `originalPrice` is only shown when set.
- Newsletter signup and a social gallery are deliberately omitted: there is no real, consent-aware mechanism or genuine imagery yet.
- Fonts: system font stacks (a refined serif for headings, sans-serif body). No webfont requests, so nothing to preload or block rendering.
- No analytics, cookies or service worker.

## Known limitations and open items

- **Not tested in a real browser here.** The environment could not download a browser, so Lighthouse, PageSpeed Insights, Core Web Vitals, visual/responsive checks, screen-reader testing and browser-console checks have **not** been run. Do these before launch (see checklist). No scores are claimed.
- Automated coverage: 28 unit/component tests (jsdom) and a post-build verifier over all prerendered pages. Hydration in a real browser is unverified.
- Images are demo SVG illustrations. Social platforms generally do not render SVG for `og:image`: provide a 1200x630 JPG/PNG and point `defaultOgImage` and product images at real photography (WebP/AVIF with explicit dimensions).
- `npm audit` reports 3 moderate advisories in `react-router`/`react-router-dom` 6.x (open-redirect via backslash in `<Link>`/`useNavigate`; SSR-hydration error deserialisation), flagged as having no fix on the 6.x line. `vite-react-ssg` requires React Router 6. This site never passes user-supplied URLs to `Link`/`navigate` and does not serialise server errors, but review the advisories and revisit if you migrate to React Router 7's own static generation.
- Policy pages are drafts with `[PLACEHOLDER]` text and are **not legal advice**; the owner must complete and review them.
- Search Console verification, sitemap submission and indexing must be done by the site owner.
