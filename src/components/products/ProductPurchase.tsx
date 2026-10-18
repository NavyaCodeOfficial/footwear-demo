import { useMemo, useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { isOrderable } from '../../data/products';
import { useCart } from '../../hooks/useCart';
import { MAX_QTY, clampQty } from '../../utils/cart';
import { buildSingleOrderMessage } from '../../utils/whatsapp';
import { WhatsAppButton } from '../whatsapp/WhatsAppButton';

/** Size/colour/quantity selection with variant validation, then add-to-cart or direct WhatsApp order. */
export function ProductPurchase({ product }: { product: Product }) {
  const { add, open } = useCart();
  const [size, setSize] = useState('');
  const [colour, setColour] = useState(product.colours.length === 1 ? product.colours[0].name : '');
  const [qty, setQty] = useState(1);
  const [touched, setTouched] = useState(false);

  const orderable = isOrderable(product.availability);
  const colourObj = product.colours.find((c) => c.name === colour);

  const sizeAvailable = useMemo(() => {
    return (s: string) => {
      if (!colourObj) return true;
      if (colourObj.available === false) return false;
      return !colourObj.sizes || colourObj.sizes.includes(s);
    };
  }, [colourObj]);

  const sizeOk = size !== '' && sizeAvailable(size);
  const colourOk = product.colours.length === 0 || (colour !== '' && colourObj?.available !== false);
  const ready = orderable && sizeOk && colourOk;

  const missing = !sizeOk ? 'Choose an available size' : !colourOk ? 'Choose an available colour' : '';

  function pickColour(name: string) {
    setColour(name);
    const next = product.colours.find((c) => c.name === name);
    if (size && next?.sizes && !next.sizes.includes(size)) setSize('');
  }

  const handleAdd = () => {
    setTouched(true);
    if (!ready) return;
    add(product.id, size, colour, qty, product.name);
    open();
  };

  return (
    <div className="purchase">
      {product.colours.length > 0 && (
        <fieldset className="choice">
          <legend>Colour {colour && <span className="choice__current">: {colour}</span>}</legend>
          <div className="choice__row">
            {product.colours.map((c) => {
              const unavailable = c.available === false;
              return (
                <label key={c.name} className={`swatch ${colour === c.name ? 'is-selected' : ''} ${unavailable ? 'is-disabled' : ''}`}>
                  <input
                    type="radio" name="colour" value={c.name} checked={colour === c.name}
                    disabled={unavailable} onChange={() => pickColour(c.name)}
                  />
                  <span className="swatch__dot" style={{ background: c.hex }} aria-hidden="true" />
                  <span>{c.name}{unavailable ? ' (unavailable)' : ''}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <fieldset className="choice">
        <legend>Size {size && <span className="choice__current">: {size}</span>}</legend>
        <div className="choice__row">
          {product.sizes.map((s) => {
            const ok = sizeAvailable(s);
            return (
              <label key={s} className={`chip ${size === s ? 'is-selected' : ''} ${ok ? '' : 'is-disabled'}`}>
                <input type="radio" name="size" value={s} checked={size === s} disabled={!ok} onChange={() => setSize(s)} />
                <span>{s}</span>
              </label>
            );
          })}
        </div>
        <p className="field-hint">Sizes are shown as a sample run. Confirm your size with the store on WhatsApp.</p>
      </fieldset>

      <div className="choice">
        <span className="choice__label" id="qty-label">Quantity</span>
        <div className="qty" role="group" aria-labelledby="qty-label">
          <button type="button" className="qty__btn" aria-label="Decrease quantity" onClick={() => setQty((q) => clampQty(q - 1))} disabled={qty <= 1}>
            <Minus size={16} aria-hidden="true" />
          </button>
          <output aria-live="polite" className="qty__value">{qty}</output>
          <button type="button" className="qty__btn" aria-label="Increase quantity" onClick={() => setQty((q) => clampQty(q + 1))} disabled={qty >= MAX_QTY}>
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {!orderable && <p className="notice notice--warn" role="status">This item is shown as out of stock, so ordering is turned off. You can still enquire about it.</p>}
      {touched && missing && orderable && <p className="field-error" role="alert">{missing} before adding to your cart.</p>}

      <div className="purchase__actions">
        <button type="button" className="btn btn--primary" onClick={handleAdd} aria-disabled={!orderable}>
          <ShoppingBag size={18} aria-hidden="true" />
          Add to cart
        </button>
        <WhatsAppButton
          variant="secondary"
          label="Order on WhatsApp"
          disabled={!ready}
          disabledReason={orderable ? (missing ? `${missing} to order.` : undefined) : 'This item is out of stock.'}
          message={ready ? buildSingleOrderMessage({ product, size, colour, quantity: qty }) : ''}
        />
      </div>
      <p className="field-hint">
        WhatsApp will open with a message for you to review. Your order is not placed or confirmed until you send it and the store confirms.
      </p>
    </div>
  );
}
