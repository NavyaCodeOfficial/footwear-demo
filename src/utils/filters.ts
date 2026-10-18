import type { Product } from '../types';

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface ShopFilters {
  q: string;
  category: string;
  size: string;
  colour: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortKey;
}

export const defaultFilters: ShopFilters = {
  q: '', category: '', size: '', colour: '', minPrice: null, maxPrice: null, sort: 'featured',
};

const SORTS: SortKey[] = ['featured', 'newest', 'price-asc', 'price-desc'];

function num(v: string | null): number | null {
  if (v === null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function filtersFromParams(p: URLSearchParams): ShopFilters {
  const sort = p.get('sort') as SortKey | null;
  return {
    q: (p.get('q') ?? '').slice(0, 80),
    category: p.get('category') ?? '',
    size: p.get('size') ?? '',
    colour: p.get('colour') ?? '',
    minPrice: num(p.get('min')),
    maxPrice: num(p.get('max')),
    sort: sort && SORTS.includes(sort) ? sort : 'featured',
  };
}

export function filtersToParams(f: ShopFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.category) p.set('category', f.category);
  if (f.size) p.set('size', f.size);
  if (f.colour) p.set('colour', f.colour);
  if (f.minPrice !== null) p.set('min', String(f.minPrice));
  if (f.maxPrice !== null) p.set('max', String(f.maxPrice));
  if (f.sort !== 'featured') p.set('sort', f.sort);
  return p;
}

export function activeFilterCount(f: ShopFilters): number {
  return [f.q, f.category, f.size, f.colour].filter(Boolean).length + (f.minPrice !== null ? 1 : 0) + (f.maxPrice !== null ? 1 : 0);
}

export function filterProducts(list: Product[], f: ShopFilters): Product[] {
  const q = f.q.trim().toLowerCase();
  const out = list.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    if (f.category && p.category !== f.category) return false;
    if (f.size && !p.sizes.includes(f.size)) return false;
    if (f.colour && !p.colours.some((c) => c.name === f.colour)) return false;
    if (f.minPrice !== null && p.price < f.minPrice) return false;
    if (f.maxPrice !== null && p.price > f.maxPrice) return false;
    return true;
  });
  const sorted = [...out];
  switch (f.sort) {
    case 'newest': sorted.sort((a, b) => b.addedOn.localeCompare(a.addedOn)); break;
    case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
    case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
    default: sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
  return sorted;
}

export function uniqueSizes(list: Product[]): string[] {
  const set = new Set<string>();
  list.forEach((p) => p.sizes.forEach((s) => set.add(s)));
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function uniqueColours(list: Product[]): string[] {
  const set = new Set<string>();
  list.forEach((p) => p.colours.forEach((c) => set.add(c.name)));
  return [...set].sort();
}
