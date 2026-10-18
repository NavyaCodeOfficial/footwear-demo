# Google Search Console setup (owner / developer)

Nothing here has been done for you. Verification, sitemap submission and indexing must be completed by the site owner or their developer, and indexing is decided by Google (no timeline is guaranteed).

## Before you start

1. The production domain is live over HTTPS.
2. `PRODUCTION_URL` (or `VITE_SITE_URL`) is set to that exact domain and the site is rebuilt.
3. Open `https://<domain>/robots.txt` and `https://<domain>/sitemap.xml`; both must load, and the sitemap must list only your real domain.

## Verify the property

Choose one method. Never invent a token: use the exact value Google shows you.

**A. HTML meta tag (URL-prefix property)**
1. Search Console > Add property > **URL prefix** > enter `https://<domain>/` (match the canonical host, with or without `www`).
2. Pick the **HTML tag** method and copy only the `content` value of the `google-site-verification` meta tag.
3. Paste it into `googleSiteVerification` in `src/data/siteConfig.ts`, rebuild and deploy. The tag then appears in every page's `<head>`.
4. Click **Verify** in Search Console.

**B. DNS TXT record (Domain property, covers all subdomains and protocols)**
1. Search Console > Add property > **Domain** > enter `<domain>`.
2. Add the TXT record Google gives you at your DNS provider, wait for propagation, then click **Verify**. No code change needed.

The HTML-file method needs a file with Google's generated name; add it to `public/` if you choose that method.

## Submit the sitemap

Search Console > **Sitemaps** > enter `sitemap.xml` > Submit. Check the status says Success and the discovered URL count matches the number printed by the build ("sitemap.xml written with N URLs").

## Inspect and request indexing

- **URL Inspection**: paste the homepage, a category and a product URL. Use **Test live URL** and **View tested page** to confirm the rendered HTML contains the title, content and links.
- Confirm "User-declared canonical" and "Google-selected canonical" match the canonical in the page source.
- Use **Request indexing** sparingly for key pages; the sitemap handles the rest.

## Ongoing diagnostics

- **Pages (Indexing) report**: review "Not indexed" reasons. Policy pages and the 404 are expected to behave differently (404 is `noindex`).
- **Experience / Core Web Vitals** and **Mobile usability**: real-user data appears after enough traffic.
- **Enhancements**: check breadcrumb and FAQ markup reports for errors.

## Structured data validation

Run key pages through the **Rich Results Test** (search.google.com/test/rich-results) and the **Schema Markup Validator** (validator.schema.org). Note: sample products intentionally emit no `Offer`; real price/availability markup appears only after you set `isSample: false` on verified products.

## Pre-launch crawlability checks

- [ ] No `noindex` on pages you want indexed (view source of `/`, `/shop/`, a product).
- [ ] `robots.txt` has no blanket `Disallow` and lists the sitemap.
- [ ] CSS, JS and images load (nothing blocked).
- [ ] Canonical on each page equals its own clean URL (the shop page canonicalises to `/shop/`, ignoring filter query strings).
- [ ] Only one host serves the site (redirect `www` or non-`www` to the canonical host at the domain/host level).
- [ ] HTTP redirects to HTTPS.
