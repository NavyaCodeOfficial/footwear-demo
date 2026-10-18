import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CartItem } from '../types';
import { addItem, parseStoredCart, removeItem, setQuantity, STORAGE_KEY, totalCount } from '../utils/cart';
import { cartLines, cartSubtotal, type OrderLine } from '../utils/whatsapp';

interface CartContextValue {
  items: CartItem[];
  lines: OrderLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  announcement: string;
  open: () => void;
  close: () => void;
  add: (productId: string, size: string, colour: string, quantity: number, productName: string) => void;
  remove: (key: string) => void;
  update: (key: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty on both server and first client render so prerendered HTML hydrates cleanly.
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      setItems(parseStoredCart(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      /* storage unavailable (private mode): carry on with an in-memory cart */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback((productId: string, size: string, colour: string, quantity: number, productName: string) => {
    setItems((prev) => addItem(prev, productId, size, colour, quantity));
    setAnnouncement(`${productName}, size ${size}, added to your cart.`);
  }, []);
  const remove = useCallback((key: string) => {
    setItems((prev) => removeItem(prev, key));
    setAnnouncement('Item removed from your cart.');
  }, []);
  const update = useCallback((key: string, quantity: number) => {
    setItems((prev) => setQuantity(prev, key, quantity));
    setAnnouncement(`Quantity updated to ${quantity}.`);
  }, []);
  const clear = useCallback(() => {
    setItems([]);
    setAnnouncement('Your cart has been cleared.');
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines = cartLines(items);
    return {
      items, lines, count: totalCount(items), subtotal: cartSubtotal(lines), isOpen, announcement,
      open: () => setOpen(true), close: () => setOpen(false), add, remove, update, clear,
    };
  }, [items, isOpen, announcement, add, remove, update, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
