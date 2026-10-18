import type { CartItem } from '../types';

export const MAX_QTY = 10;
export const STORAGE_KEY = 'royal-footwear-cart-v1';

export function itemKey(productId: string, size: string, colour: string): string {
  return `${productId}|${size}|${colour}`;
}

export function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(n)));
}

/** Adds an item; the same product/size/colour merges, different variants stay separate. */
export function addItem(items: CartItem[], productId: string, size: string, colour: string, quantity: number): CartItem[] {
  const key = itemKey(productId, size, colour);
  const existing = items.find((i) => i.key === key);
  if (existing) {
    return items.map((i) => (i.key === key ? { ...i, quantity: clampQty(i.quantity + quantity) } : i));
  }
  return [...items, { key, productId, size, colour, quantity: clampQty(quantity) }];
}

export function removeItem(items: CartItem[], key: string): CartItem[] {
  return items.filter((i) => i.key !== key);
}

export function setQuantity(items: CartItem[], key: string, quantity: number): CartItem[] {
  return items.map((i) => (i.key === key ? { ...i, quantity: clampQty(quantity) } : i));
}

export function totalCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

/** Defensive parse so corrupted or tampered local storage can never break the app. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const out: CartItem[] = [];
    for (const d of data) {
      if (
        d && typeof d === 'object' &&
        typeof (d as CartItem).productId === 'string' &&
        typeof (d as CartItem).size === 'string' &&
        typeof (d as CartItem).colour === 'string' &&
        typeof (d as CartItem).quantity === 'number'
      ) {
        const { productId, size, colour, quantity } = d as CartItem;
        out.push({ key: itemKey(productId, size, colour), productId, size, colour, quantity: clampQty(quantity) });
      }
    }
    return out;
  } catch {
    return [];
  }
}
