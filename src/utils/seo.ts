import type { Category, Product } from '../types';
import { siteConfig } from '../data/siteConfig';
import { absoluteUrl, canonicalPath } from './format';

export interface Crumb { name: string; path: string }

export function organizationJsonLd() {
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: absoluteUrl('/'),
    logo: absoluteUrl(siteConfig.logoPath),
    ...(siteConfig.businessEmail ? { email: siteConfig.businessEmail } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brandName,
    url: absoluteUrl('/'),
  };
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(canonicalPath(c.path)),
    })),
  };
}

const AVAILABILITY_URL: Record<Product['availability'], string> = {
  in_stock: 'https://schema.org/InStock',
  limited: 'https://schema.org/LimitedAvailability',
  out_of_stock: 'https://schema.org/OutOfStock',
  preorder: 'https://schema.org/PreOrder',
};

/**
 * Product JSON-LD. Sample products get NO Offer: demo prices must not be presented to
 * search engines as real offers. Once isSample is false the Offer is emitted.
 * No ratings, reviews or GTINs are ever generated.
 */
export function productJsonLd(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    description: p.description,
    image: p.images.map((i) => absoluteUrl(i.src)),
    category: p.subcategory ?? p.category,
    ...(p.materials ? { material: p.materials } : {}),
    brand: { '@type': 'Brand', name: siteConfig.brandName },
    url: absoluteUrl(canonicalPath(`/product/${p.slug}`)),
    ...(p.isSample
      ? {}
      : {
          offers: {
            '@type': 'Offer',
            url: absoluteUrl(canonicalPath(`/product/${p.slug}`)),
            priceCurrency: siteConfig.currency,
            price: p.price,
            availability: AVAILABILITY_URL[p.availability],
          },
        }),
  };
}

export function categoryJsonLd(c: Category, items: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: c.name,
    description: c.description,
    url: absoluteUrl(canonicalPath(`/category/${c.slug}`)),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(canonicalPath(`/product/${p.slug}`)),
        name: p.name,
      })),
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}
