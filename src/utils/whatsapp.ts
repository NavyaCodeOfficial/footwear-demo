import type { CartItem, Product } from '../types';
import { getProductById } from '../data/products';
import { siteConfig } from '../data/siteConfig';
import { absoluteUrl, canonicalPath, formatPriceForMessage } from './format';

export const ENQUIRY_TYPES = [
  'Product availability',
  'Size assistance',
  'Price enquiry',
  'Delivery information',
  'Return or exchange enquiry',
  'Bulk purchase',
  'Other',
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

/** WhatsApp numbers must be digits only (country code included), 8 to 15 digits. */
export function isValidWhatsAppNumber(value: string): boolean {
  return /^\d{8,15}$/.test(value);
}

/**
 * Builds an official wa.me link. Returns null when the number is not configured/valid,
 * so callers can never open a fake or empty number.
 */
export function buildWhatsAppUrl(message: string, number: string = siteConfig.whatsappNumber): string | null {
  if (!isValidWhatsAppNumber(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Link included in WhatsApp messages. Uses the configured production domain; before one is set
 * it falls back to the current browser origin so demo links still work for testing.
 */
export function productUrl(product: Pick<Product, 'slug'>): string {
  const path = canonicalPath(`/product/${product.slug}`);
  if (siteConfig.siteUrl) return absoluteUrl(path);
  if (typeof window !== 'undefined') return `${window.location.origin}${path}`;
  return path;
}

export interface OrderLine {
  product: Product;
  size: string;
  colour: string;
  quantity: number;
}

export function buildSingleOrderMessage(line: OrderLine): string {
  const { product, size, colour, quantity } = line;
  const lines = [
    `Hello ${siteConfig.brandName}! I would like to order:`,
    '',
    `Product: ${product.name}`,
    `SKU: ${product.sku}`,
    `Price: ${formatPriceForMessage(product.price)}`,
    `Size: ${size}`,
  ];
  if (colour) lines.push(`Colour: ${colour}`);
  lines.push(`Quantity: ${quantity}`, `Product link: ${productUrl(product)}`, '', 'Please confirm availability and the next steps.');
  return lines.join('\n');
}

export function cartLines(items: CartItem[]): OrderLine[] {
  const out: OrderLine[] = [];
  for (const item of items) {
    const product = getProductById(item.productId);
    if (product) out.push({ product, size: item.size, colour: item.colour, quantity: item.quantity });
  }
  return out;
}

export function cartSubtotal(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
}

export function buildCartOrderMessage(lines: OrderLine[]): string {
  const parts: string[] = [`Hello ${siteConfig.brandName}! I would like to order the following:`, ''];
  lines.forEach((l, i) => {
    parts.push(
      `${i + 1}. ${l.product.name}`,
      `   SKU: ${l.product.sku}`,
      `   Size: ${l.size}${l.colour ? ` | Colour: ${l.colour}` : ''}`,
      `   Qty: ${l.quantity} x ${formatPriceForMessage(l.product.price)} = ${formatPriceForMessage(l.product.price * l.quantity)}`,
      `   Link: ${productUrl(l.product)}`,
      '',
    );
  });
  parts.push(
    `Indicative subtotal: ${formatPriceForMessage(cartSubtotal(lines))}`,
    '(Delivery charges, availability and final pricing are subject to your confirmation.)',
    '',
    'Please confirm availability and the next steps.',
  );
  return parts.join('\n');
}

export interface EnquiryInput {
  name?: string;
  phone?: string;
  product?: string;
  size?: string;
  type: EnquiryType | string;
  message: string;
}

export function buildEnquiryMessage(e: EnquiryInput): string {
  const lines = [`Hello ${siteConfig.brandName}! I have an enquiry.`, ''];
  if (e.name) lines.push(`Name: ${e.name}`);
  if (e.phone) lines.push(`Contact number: ${e.phone}`);
  lines.push(`Enquiry type: ${e.type}`);
  if (e.product) lines.push(`Product of interest: ${e.product}`);
  if (e.size) lines.push(`Preferred size: ${e.size}`);
  lines.push('', `Message: ${e.message}`);
  return lines.join('\n');
}
