import { siteConfig } from '../data/siteConfig';

const formatter = new Intl.NumberFormat(siteConfig.locale, {
  style: 'currency',
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return formatter.format(amount);
}

/** Plain "₹2,499" style string for WhatsApp text (avoids locale-specific spacing). */
export function formatPriceForMessage(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Absolute URL for a site path using the configured production domain. Returns the bare path when no domain is set. */
export function absoluteUrl(path: string): string {
  const base = siteConfig.siteUrl.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

/** Consistent trailing-slash convention: every route except "/" ends with a slash. */
export function canonicalPath(path: string): string {
  if (path === '/' || path === '') return '/';
  const clean = path.replace(/\/+$/, '');
  return `${clean}/`;
}
