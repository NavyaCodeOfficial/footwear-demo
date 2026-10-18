import type { SiteConfig } from '../types';

// TODO(launch): real production URL, e.g. "https://www.example.com" (no trailing slash).
// While empty, canonicals are relative and no sitemap.xml is written.
const PRODUCTION_URL: string = '';

/**
 * CENTRAL BUSINESS SETTINGS. Complete every "TODO" before launch.
 * Empty strings mean "not supplied yet": the UI hides or disables the related feature
 * instead of showing fake data.
 */
export const siteConfig: SiteConfig = {
  brandName: 'Royal Footwear',
  developerName: 'NavyaCode',
  developerTagline: 'Where Code Meets Creativity',
  tagline: 'Step Into Your Style',

  // Production URL comes from PRODUCTION_URL below, or the VITE_SITE_URL build variable (public, not a secret).
  siteUrl: (((import.meta.env?.VITE_SITE_URL as string | undefined) || PRODUCTION_URL) as string).trim().replace(/\/+$/, ''),

  logoPath: '/favicon.svg',
  faviconPath: '/favicon.svg',

  // TODO(launch): digits only with country code, e.g. "919876543210". Empty disables ordering.
  whatsappNumber: '',
  // TODO(launch): owner details. Left empty on purpose; nothing is invented.
  businessEmail: '',
  businessAddress: '',
  phoneDisplay: '',

  // TODO(launch): full profile URLs. Empty values are not rendered.
  social: { instagram: '', facebook: '', youtube: '' },

  defaultSeoTitle: 'Royal Footwear | Shoes, Sandals & Everyday Footwear',
  defaultSeoDescription:
    'Browse footwear for men, women and kids at Royal Footwear. Choose your pair and place your order enquiry on WhatsApp.',
  // TODO(launch): replace with a 1200x630 brand image.
  defaultOgImage: '/images/og-default.svg',

  // TODO(launch): token from Google Search Console "HTML tag" method. Empty = no tag rendered.
  googleSiteVerification: '',

  announcement: 'Sample storefront: products and prices shown are demonstration data.',
  footerNote: 'Orders are requested through WhatsApp and confirmed by the store.',

  currency: 'INR',
  locale: 'en-IN',

  policy: {
    shippingSummary:
      'Delivery options, charges and timelines are confirmed by the store when you message us on WhatsApp.',
    returnsSummary:
      'Return and exchange terms are set by the store and will be shared before you confirm an order.',
    // TODO(owner): leave null until the owner approves a return window.
    returnWindowDays: null,
    freeShippingThreshold: null,
  },

  // Set false once real catalogue data replaces the samples.
  showSampleDataNotice: true,
};

export function isWhatsAppConfigured(): boolean {
  return /^\d{8,15}$/.test(siteConfig.whatsappNumber);
}
