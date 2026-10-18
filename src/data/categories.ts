import type { Category } from '../types';

/**
 * Categories are fully configurable: add, remove or reorder entries here.
 * Each product references exactly one category by `slug`.
 */
export const categories: Category[] = [
  {
    slug: 'mens-footwear',
    name: "Men's Footwear",
    navLabel: 'Men',
    description: 'Sneakers, formal shoes, loafers, boots and more for men.',
    seoTitle: "Men's Footwear | Royal Footwear",
    seoDescription:
      "Browse men's sneakers, formal shoes, loafers and boots at Royal Footwear. Order enquiries are handled on WhatsApp.",
    image: { src: '/images/category-mens.svg', alt: "Demo illustration of a men's formal shoe", width: 800, height: 800 },
    showOnHome: true,
    order: 1,
  },
  {
    slug: 'womens-footwear',
    name: "Women's Footwear",
    navLabel: 'Women',
    description: 'Flats, heels, sneakers, sandals and boots for women.',
    seoTitle: "Women's Footwear | Royal Footwear",
    seoDescription:
      "Explore women's flats, heels, sneakers, sandals and boots at Royal Footwear. Ask about availability on WhatsApp.",
    image: { src: '/images/category-womens.svg', alt: "Demo illustration of a women's heel", width: 800, height: 800 },
    showOnHome: true,
    order: 2,
  },
  {
    slug: 'kids-footwear',
    name: "Kids' Footwear",
    navLabel: 'Kids',
    description: 'Everyday, school and play footwear for children.',
    seoTitle: "Kids' Footwear | Royal Footwear",
    seoDescription:
      "Find kids' casual shoes, school shoes and sandals at Royal Footwear. Check sizes and availability on WhatsApp.",
    image: { src: '/images/category-kids.svg', alt: "Demo illustration of a kids' shoe", width: 800, height: 800 },
    showOnHome: true,
    order: 3,
  },
  {
    slug: 'sports-footwear',
    name: 'Sports Footwear',
    navLabel: 'Sports',
    description: 'Running and training shoes for an active routine.',
    seoTitle: 'Sports Footwear | Royal Footwear',
    seoDescription:
      'Shop running and training shoes at Royal Footwear. Confirm sizes and availability on WhatsApp.',
    image: { src: '/images/category-sports.svg', alt: 'Demo illustration of a sports shoe', width: 800, height: 800 },
    showOnHome: true,
    order: 4,
  },
  {
    slug: 'sandals-and-slippers',
    name: 'Sandals & Slippers',
    navLabel: 'Sandals',
    description: 'Open footwear for warm days and relaxed moments.',
    seoTitle: 'Sandals & Slippers | Royal Footwear',
    seoDescription:
      'Discover sandals and slides at Royal Footwear. Message the store on WhatsApp to check sizes and availability.',
    image: { src: '/images/category-sandals.svg', alt: 'Demo illustration of a sandal', width: 800, height: 800 },
    showOnHome: true,
    order: 5,
  },
];

export const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
