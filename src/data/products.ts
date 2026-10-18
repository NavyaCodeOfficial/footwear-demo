import type { Availability, ColourOption, Product } from '../types';

/**
 * SAMPLE CATALOGUE: every product, price, SKU and size run below is demonstration data.
 * Replace the whole list with the owner's verified catalogue before launch.
 * See docs/PRODUCT-GUIDE.md for how to add or edit products.
 */

const images = (base: string, alt: string) => [
  { src: `/images/${base}-1.svg`, alt, width: 800, height: 800 },
  { src: `/images/${base}-2.svg`, alt: `${alt}, alternate angle`, width: 800, height: 800 },
];

const adult = ['6', '7', '8', '9', '10', '11'];
const womens = ['3', '4', '5', '6', '7', '8'];
const kids = ['11C', '12C', '13C', '1Y', '2Y', '3Y'];

const c = (name: string, hex: string, extra: Partial<ColourOption> = {}): ColourOption => ({ name, hex, ...extra });

const sample = (p: Omit<Product, 'isSample'>): Product => ({ ...p, isSample: true });

export const products: Product[] = [
  sample({
    id: 'p001', name: 'Sample Court Sneaker', slug: 'sample-court-sneaker', sku: 'SAMPLE-M-SNK-001',
    category: 'mens-footwear', subcategory: 'Casual sneakers', price: 2499, originalPrice: undefined,
    description: 'A clean low-top sneaker for everyday wear. Sample description: replace with the owner\'s verified product details.',
    images: images('mens-sneaker-white', 'Demo illustration of a white low-top sneaker'),
    sizes: adult, colours: [c('White', '#F3F1EC'), c('Sand', '#CDBA9A', { sizes: ['7', '8', '9', '10'] })],
    availability: 'in_stock', materials: 'Sample: synthetic upper, rubber sole', care: 'Sample: wipe clean with a soft damp cloth.',
    seoTitle: 'Sample Court Sneaker | Men\'s Casual Sneakers | Royal Footwear',
    seoDescription: 'Sample men\'s low-top sneaker in white and sand. Check size availability and order on WhatsApp.',
    relatedIds: ['p002', 'p015', 'p005'], addedOn: '2026-09-20', featured: true,
  }),
  sample({
    id: 'p002', name: 'Sample Oxford Dress Shoe', slug: 'sample-oxford-dress-shoe', sku: 'SAMPLE-M-FRM-002',
    category: 'mens-footwear', subcategory: 'Formal shoes', price: 3999,
    description: 'A structured lace-up oxford for office and occasions. Sample description: replace with verified details.',
    images: images('mens-oxford', 'Demo illustration of a brown oxford dress shoe'),
    sizes: adult, colours: [c('Brown', '#5A3E2B'), c('Black', '#1F1D1B')],
    availability: 'in_stock', materials: 'Sample: leather-look upper', care: 'Sample: polish with a neutral cream.',
    seoTitle: 'Sample Oxford Dress Shoe | Men\'s Formal Shoes | Royal Footwear',
    seoDescription: 'Sample men\'s oxford dress shoe in brown and black. Ask about sizes and availability on WhatsApp.',
    relatedIds: ['p003', 'p004'], addedOn: '2026-09-12', featured: true,
  }),
  sample({
    id: 'p003', name: 'Sample Derby Lace-Up', slug: 'sample-derby-lace-up', sku: 'SAMPLE-M-FRM-003',
    category: 'mens-footwear', subcategory: 'Formal shoes', price: 3499,
    description: 'A versatile derby with a comfortable fit. Sample description: replace with verified details.',
    images: images('mens-derby-black', 'Demo illustration of a black derby shoe'),
    sizes: adult, colours: [c('Black', '#1F1D1B')],
    availability: 'limited', materials: 'Sample: leather-look upper',
    seoTitle: 'Sample Derby Lace-Up | Men\'s Formal Shoes | Royal Footwear',
    seoDescription: 'Sample men\'s black derby lace-up shoe. Confirm availability on WhatsApp.',
    relatedIds: ['p002', 'p004'], addedOn: '2026-08-30',
  }),
  sample({
    id: 'p004', name: 'Sample Penny Loafer', slug: 'sample-penny-loafer', sku: 'SAMPLE-M-LFR-004',
    category: 'mens-footwear', subcategory: 'Loafers', price: 2999,
    description: 'A slip-on loafer with a champagne-toned accent. Sample description: replace with verified details.',
    images: images('mens-loafer', 'Demo illustration of a tan penny loafer'),
    sizes: adult, colours: [c('Tan', '#7A5A3C'), c('Black', '#1F1D1B', { available: false })],
    availability: 'in_stock', materials: 'Sample: leather-look upper',
    seoTitle: 'Sample Penny Loafer | Men\'s Loafers | Royal Footwear',
    seoDescription: 'Sample men\'s penny loafer in tan. Message the store on WhatsApp for sizes.',
    relatedIds: ['p002', 'p003'], addedOn: '2026-09-05',
  }),
  sample({
    id: 'p005', name: 'Sample Chelsea Boot', slug: 'sample-chelsea-boot', sku: 'SAMPLE-M-BOT-005',
    category: 'mens-footwear', subcategory: 'Boots', price: 4499,
    description: 'An ankle boot for cooler days. Sample description: replace with verified details.',
    images: images('mens-boot', 'Demo illustration of a brown ankle boot'),
    sizes: ['7', '8', '9', '10'], colours: [c('Brown', '#6B4A32')],
    availability: 'preorder', materials: 'Sample: leather-look upper, rubber sole',
    seoTitle: 'Sample Chelsea Boot | Men\'s Boots | Royal Footwear',
    seoDescription: 'Sample men\'s brown ankle boot. Ask the store about availability on WhatsApp.',
    relatedIds: ['p003', 'p001'], addedOn: '2026-10-01', featured: true,
  }),
  sample({
    id: 'p006', name: 'Sample Everyday Sandal', slug: 'sample-everyday-sandal', sku: 'SAMPLE-M-SND-006',
    category: 'sandals-and-slippers', subcategory: "Men's sandals", price: 1299,
    description: 'A strapped sandal for relaxed days. Sample description: replace with verified details.',
    images: images('mens-sandal', 'Demo illustration of a brown strapped sandal'),
    sizes: adult, colours: [c('Brown', '#6B4A32')],
    availability: 'in_stock',
    seoTitle: 'Sample Everyday Sandal | Sandals | Royal Footwear',
    seoDescription: 'Sample strapped sandal in brown. Check sizes on WhatsApp.',
    relatedIds: ['p007', 'p008'], addedOn: '2026-07-18',
  }),
  sample({
    id: 'p007', name: 'Sample Slide', slug: 'sample-slide', sku: 'SAMPLE-U-SLD-007',
    category: 'sandals-and-slippers', subcategory: 'Slides', price: 799,
    description: 'A simple slip-on slide. Sample description: replace with verified details.',
    images: images('slide-sandal', 'Demo illustration of a grey slide sandal'),
    sizes: ['6', '7', '8', '9', '10'], colours: [c('Grey', '#8A8378')],
    availability: 'in_stock',
    seoTitle: 'Sample Slide | Sandals & Slippers | Royal Footwear',
    seoDescription: 'Sample grey slip-on slide. Ask about sizes on WhatsApp.',
    relatedIds: ['p006', 'p010'], addedOn: '2026-06-02',
  }),
  sample({
    id: 'p008', name: 'Sample Strappy Sandal', slug: 'sample-strappy-sandal', sku: 'SAMPLE-W-SND-008',
    category: 'womens-footwear', subcategory: 'Sandals', price: 1799,
    description: 'A strappy sandal with a champagne finish. Sample description: replace with verified details.',
    images: images('womens-sandal', 'Demo illustration of a champagne strappy sandal'),
    sizes: womens, colours: [c('Champagne', '#B89B72')],
    availability: 'in_stock',
    seoTitle: 'Sample Strappy Sandal | Women\'s Sandals | Royal Footwear',
    seoDescription: 'Sample women\'s strappy sandal in champagne. Check sizes on WhatsApp.',
    relatedIds: ['p009', 'p010'], addedOn: '2026-09-25', featured: true,
  }),
  sample({
    id: 'p009', name: 'Sample Block Heel', slug: 'sample-block-heel', sku: 'SAMPLE-W-HEL-009',
    category: 'womens-footwear', subcategory: 'Heels', price: 2799,
    description: 'A heeled shoe for occasions. Sample description: replace with verified details.',
    images: images('womens-heel', 'Demo illustration of a bronze heeled shoe'),
    sizes: womens, colours: [c('Bronze', '#8A6E4B')],
    availability: 'limited',
    seoTitle: 'Sample Block Heel | Women\'s Heels | Royal Footwear',
    seoDescription: 'Sample women\'s heel in bronze. Ask about availability on WhatsApp.',
    relatedIds: ['p010', 'p008'], addedOn: '2026-09-15',
  }),
  sample({
    id: 'p010', name: 'Sample Ballet Flat', slug: 'sample-ballet-flat', sku: 'SAMPLE-W-FLT-010',
    category: 'womens-footwear', subcategory: 'Flats', price: 1999,
    description: 'A soft everyday flat. Sample description: replace with verified details.',
    images: images('womens-flat', 'Demo illustration of a champagne ballet flat'),
    sizes: womens, colours: [c('Champagne', '#B89B72'), c('Black', '#1F1D1B')],
    availability: 'in_stock',
    seoTitle: 'Sample Ballet Flat | Women\'s Flats | Royal Footwear',
    seoDescription: 'Sample women\'s ballet flat in champagne and black. Check sizes on WhatsApp.',
    relatedIds: ['p008', 'p009'], addedOn: '2026-08-10',
  }),
  sample({
    id: 'p011', name: 'Sample Women\'s Sneaker', slug: 'sample-womens-sneaker', sku: 'SAMPLE-W-SNK-011',
    category: 'womens-footwear', subcategory: 'Casual sneakers', price: 2399,
    description: 'A light casual sneaker. Sample description: replace with verified details.',
    images: images('womens-sneaker', 'Demo illustration of a cream sneaker'),
    sizes: womens, colours: [c('Cream', '#E6DCCB')],
    availability: 'in_stock',
    seoTitle: 'Sample Women\'s Sneaker | Casual Sneakers | Royal Footwear',
    seoDescription: 'Sample women\'s cream sneaker. Ask about sizes on WhatsApp.',
    relatedIds: ['p010', 'p012'], addedOn: '2026-10-08', featured: true,
  }),
  sample({
    id: 'p012', name: 'Sample Ankle Boot', slug: 'sample-ankle-boot', sku: 'SAMPLE-W-BOT-012',
    category: 'womens-footwear', subcategory: 'Boots', price: 3899,
    description: 'A dark ankle boot. Sample description: replace with verified details.',
    images: images('womens-boot', 'Demo illustration of a dark ankle boot'),
    sizes: ['4', '5', '6', '7'], colours: [c('Espresso', '#3A332C')],
    availability: 'out_of_stock',
    seoTitle: 'Sample Ankle Boot | Women\'s Boots | Royal Footwear',
    seoDescription: 'Sample women\'s ankle boot. Currently shown as out of stock in the demo data.',
    relatedIds: ['p009', 'p011'], addedOn: '2026-07-01',
  }),
  sample({
    id: 'p013', name: 'Sample Kids\' Play Sneaker', slug: 'sample-kids-play-sneaker', sku: 'SAMPLE-K-SNK-013',
    category: 'kids-footwear', subcategory: 'Kids\' casual', price: 1499,
    description: 'A comfortable casual sneaker for children. Sample description: replace with verified details.',
    images: images('kids-sneaker', 'Demo illustration of a sage green kids sneaker'),
    sizes: kids, colours: [c('Sage', '#C9D6C3')],
    availability: 'in_stock',
    seoTitle: 'Sample Kids\' Play Sneaker | Kids\' Casual Shoes | Royal Footwear',
    seoDescription: 'Sample kids\' casual sneaker in sage. Check sizes on WhatsApp.',
    relatedIds: ['p014', 'p015'], addedOn: '2026-09-28', featured: true,
  }),
  sample({
    id: 'p014', name: 'Sample School Shoe', slug: 'sample-school-shoe', sku: 'SAMPLE-K-SCH-014',
    category: 'kids-footwear', subcategory: 'School shoes', price: 1799,
    description: 'A plain black school shoe. Sample description: replace with verified details.',
    images: images('kids-school', 'Demo illustration of a black school shoe'),
    sizes: kids, colours: [c('Black', '#1F1D1B')],
    availability: 'in_stock',
    seoTitle: 'Sample School Shoe | Kids\' School Shoes | Royal Footwear',
    seoDescription: 'Sample black school shoe for kids. Confirm sizes on WhatsApp.',
    relatedIds: ['p013', 'p016'], addedOn: '2026-06-20',
  }),
  sample({
    id: 'p015', name: 'Sample Road Runner', slug: 'sample-road-runner', sku: 'SAMPLE-U-SPT-015',
    category: 'sports-footwear', subcategory: 'Running', price: 3299,
    description: 'A running shoe for daily mileage. Sample description: replace with verified details.',
    images: images('sports-runner', 'Demo illustration of a slate running shoe'),
    sizes: adult, colours: [c('Slate', '#4A5A63')],
    availability: 'in_stock',
    seoTitle: 'Sample Road Runner | Running Shoes | Royal Footwear',
    seoDescription: 'Sample slate running shoe. Ask about sizes on WhatsApp.',
    relatedIds: ['p016', 'p001'], addedOn: '2026-10-05', featured: true,
  }),
  sample({
    id: 'p016', name: 'Sample Gym Trainer', slug: 'sample-gym-trainer', sku: 'SAMPLE-U-SPT-016',
    category: 'sports-footwear', subcategory: 'Training', price: 2899,
    description: 'A stable trainer for the gym. Sample description: replace with verified details.',
    images: images('sports-trainer', 'Demo illustration of a charcoal training shoe'),
    sizes: adult, colours: [c('Charcoal', '#2F3B40')],
    availability: 'limited',
    seoTitle: 'Sample Gym Trainer | Training Shoes | Royal Footwear',
    seoDescription: 'Sample charcoal training shoe. Check availability on WhatsApp.',
    relatedIds: ['p015', 'p014'], addedOn: '2026-08-22',
  }),
  sample({
    id: 'p017', name: 'Sample Kids\' Sandal', slug: 'sample-kids-sandal', sku: 'SAMPLE-K-SND-017',
    category: 'kids-footwear', subcategory: 'Sandals', price: 999,
    description: 'A simple sandal for children. Sample description: replace with verified details.',
    images: images('kids-sandal', 'Demo illustration of a blue kids sandal'),
    sizes: kids, colours: [c('Blue', '#9DB4C0')],
    availability: 'in_stock',
    seoTitle: 'Sample Kids\' Sandal | Kids\' Sandals | Royal Footwear',
    seoDescription: 'Sample kids\' sandal in blue. Ask about sizes on WhatsApp.',
    relatedIds: ['p013', 'p007'], addedOn: '2026-07-25',
  }),
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const ids = product.relatedIds ?? [];
  const related = ids.map(getProductById).filter((p): p is Product => Boolean(p));
  if (related.length >= limit) return related.slice(0, limit);
  const fill = products.filter((p) => p.category === product.category && p.id !== product.id && !ids.includes(p.id));
  return [...related, ...fill].slice(0, limit);
}

export function isOrderable(a: Availability): boolean {
  return a !== 'out_of_stock';
}

export const availabilityLabel: Record<Availability, string> = {
  in_stock: 'In stock (confirm on WhatsApp)',
  limited: 'Limited stock',
  out_of_stock: 'Out of stock',
  preorder: 'Pre-order',
};
