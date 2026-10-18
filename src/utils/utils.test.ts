import { describe, expect, it } from 'vitest';
import { addItem, clampQty, itemKey, MAX_QTY, parseStoredCart, removeItem, setQuantity, totalCount } from './cart';
import {
  buildCartOrderMessage, buildEnquiryMessage, buildSingleOrderMessage, buildWhatsAppUrl,
  cartLines, cartSubtotal, isValidWhatsAppNumber,
} from './whatsapp';
import { filterProducts, defaultFilters, filtersFromParams, filtersToParams } from './filters';
import { validateEnquiry } from './validation';
import { canonicalPath } from './format';
import { products } from '../data/products';
import { productJsonLd } from './seo';

describe('cart', () => {
  it('keeps different sizes and colours as separate lines', () => {
    let items = addItem([], 'p001', '8', 'White', 1);
    items = addItem(items, 'p001', '9', 'White', 1);
    items = addItem(items, 'p001', '8', 'Sand', 1);
    expect(items).toHaveLength(3);
  });

  it('merges identical variants and clamps quantity', () => {
    let items = addItem([], 'p001', '8', 'White', 4);
    items = addItem(items, 'p001', '8', 'White', 20);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(MAX_QTY);
    expect(clampQty(0)).toBe(1);
    expect(clampQty(NaN)).toBe(1);
  });

  it('updates and removes by variant key', () => {
    let items = addItem([], 'p001', '8', 'White', 1);
    const key = itemKey('p001', '8', 'White');
    items = setQuantity(items, key, 3);
    expect(totalCount(items)).toBe(3);
    expect(removeItem(items, key)).toEqual([]);
  });

  it('survives corrupted storage', () => {
    expect(parseStoredCart('not json')).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart('[{"productId":"p001","size":"8","colour":"White","quantity":999}]')[0].quantity).toBe(MAX_QTY);
  });

  it('computes the subtotal from catalogue prices', () => {
    const p1 = products.find((p) => p.id === 'p001')!;
    const p2 = products.find((p) => p.id === 'p002')!;
    let items = addItem([], 'p001', '8', 'White', 2);
    items = addItem(items, 'p002', '9', 'Brown', 1);
    expect(cartSubtotal(cartLines(items))).toBe(p1.price * 2 + p2.price);
  });
});

describe('whatsapp', () => {
  it('refuses to build a link without a valid number', () => {
    expect(buildWhatsAppUrl('hi', '')).toBeNull();
    expect(buildWhatsAppUrl('hi', '+91 98765')).toBeNull();
    expect(isValidWhatsAppNumber('919876543210')).toBe(true);
  });

  it('builds a wa.me link and encodes the message', () => {
    const url = buildWhatsAppUrl('Size: 8 & Colour: Black\nQty: 1 ₹2,499', '919876543210')!;
    expect(url.startsWith('https://wa.me/919876543210?text=')).toBe(true);
    expect(url).toContain('%26');
    expect(url).toContain('%0A');
    expect(url).not.toContain(' ');
    const decoded = decodeURIComponent(url.split('?text=')[1]);
    expect(decoded).toBe('Size: 8 & Colour: Black\nQty: 1 ₹2,499');
  });

  it('includes every required field in a single order message', () => {
    const product = products[0];
    const msg = buildSingleOrderMessage({ product, size: '8', colour: 'White', quantity: 2 });
    for (const part of [product.name, product.sku, 'Size: 8', 'Colour: White', 'Quantity: 2', '/product/' + product.slug + '/', 'confirm availability']) {
      expect(msg).toContain(part);
    }
  });

  it('states the subtotal is indicative in a cart message', () => {
    const items = addItem([], 'p001', '8', 'White', 1);
    const msg = buildCartOrderMessage(cartLines(items));
    expect(msg).toContain('Indicative subtotal');
    expect(msg).toContain('subject to your confirmation');
  });

  it('builds an enquiry message', () => {
    const msg = buildEnquiryMessage({ name: 'A', type: 'Size assistance', message: 'Hello', size: '7' });
    expect(msg).toContain('Preferred size: 7');
    expect(msg).not.toContain('Contact number');
  });
});

describe('filters', () => {
  it('searches by name and SKU', () => {
    expect(filterProducts(products, { ...defaultFilters, q: 'oxford' }).length).toBeGreaterThan(0);
    expect(filterProducts(products, { ...defaultFilters, q: 'sample-m-snk-001' })).toHaveLength(1);
  });

  it('filters by category, size, colour and price, and sorts', () => {
    const r = filterProducts(products, { ...defaultFilters, category: 'kids-footwear', maxPrice: 1500, sort: 'price-asc' });
    expect(r.every((p) => p.category === 'kids-footwear' && p.price <= 1500)).toBe(true);
    const prices = r.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(filterProducts(products, { ...defaultFilters, size: '1Y' }).every((p) => p.sizes.includes('1Y'))).toBe(true);
  });

  it('round-trips through URL params', () => {
    const f = { ...defaultFilters, q: 'boot', category: 'mens-footwear', minPrice: 100, sort: 'newest' as const };
    expect(filtersFromParams(filtersToParams(f))).toEqual(f);
  });
});

describe('validation', () => {
  const base = { name: 'Asha', phone: '', product: '', size: '', type: 'Other', message: 'Hi', consent: true, website: '' };
  it('accepts a valid enquiry', () => expect(validateEnquiry(base)).toEqual({}));
  it('requires name, message, consent and a valid type', () => {
    const e = validateEnquiry({ ...base, name: '', message: '', consent: false, type: 'x' });
    expect(Object.keys(e).sort()).toEqual(['consent', 'message', 'name', 'type']);
  });
  it('enforces length limits', () => {
    expect(validateEnquiry({ ...base, message: 'a'.repeat(601) }).message).toBeTruthy();
  });
});

describe('seo helpers', () => {
  it('uses a consistent trailing slash', () => {
    expect(canonicalPath('/shop')).toBe('/shop/');
    expect(canonicalPath('/shop/')).toBe('/shop/');
    expect(canonicalPath('/')).toBe('/');
  });
  it('does not emit an Offer for sample products', () => {
    expect(productJsonLd(products[0])).not.toHaveProperty('offers');
    expect(productJsonLd({ ...products[0], isSample: false })).toHaveProperty('offers');
  });
  it('has unique slugs, ids and SKUs', () => {
    for (const k of ['slug', 'id', 'sku'] as const) {
      expect(new Set(products.map((p) => p[k])).size).toBe(products.length);
    }
  });
});
