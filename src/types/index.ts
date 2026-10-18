export type Availability = 'in_stock' | 'limited' | 'out_of_stock' | 'preorder';

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ColourOption {
  name: string;
  /** Hex used only for the swatch preview. */
  hex: string;
  /** Optional: sizes in which this colour is available. Defaults to all product sizes. */
  sizes?: string[];
  /** Optional: set to false to mark this colour unavailable. */
  available?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string; // Category.slug
  subcategory?: string;
  price: number; // INR, whole rupees
  originalPrice?: number; // only set for a genuine, owner-approved discount
  description: string;
  images: ProductImage[];
  sizes: string[];
  colours: ColourOption[];
  availability: Availability;
  materials?: string;
  care?: string;
  seoTitle: string;
  seoDescription: string;
  relatedIds?: string[];
  /** ISO date, used for "newest" sorting and the New Arrivals section. */
  addedOn: string;
  featured?: boolean;
  /** Only set true when real sales data supports it. */
  bestseller?: boolean;
  /** True while this is demonstration data. */
  isSample: boolean;
}

export interface Category {
  slug: string;
  name: string;
  /** Short name used in navigation. */
  navLabel: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  image: ProductImage;
  /** Shown in the homepage category grid. */
  showOnHome: boolean;
  /** Order in navigation and listings. */
  order: number;
}

export interface CartItem {
  /** Variant-aware identity: productId|size|colour */
  key: string;
  productId: string;
  size: string;
  colour: string;
  quantity: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  brandName: string;
  developerName: string;
  developerTagline: string;
  tagline: string;
  siteUrl: string;
  logoPath: string;
  faviconPath: string;
  whatsappNumber: string;
  businessEmail: string;
  businessAddress: string;
  phoneDisplay: string;
  social: { instagram: string; facebook: string; youtube: string };
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImage: string;
  googleSiteVerification: string;
  announcement: string;
  footerNote: string;
  currency: string;
  locale: string;
  policy: {
    shippingSummary: string;
    returnsSummary: string;
    returnWindowDays: number | null;
    freeShippingThreshold: number | null;
  };
  showSampleDataNotice: boolean;
}
