import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useDialog } from '../../hooks/useDialog';
import { MAX_QTY } from '../../utils/cart';
import { formatPrice } from '../../utils/format';
import { buildCartOrderMessage } from '../../utils/whatsapp';
import { WhatsAppButton } from '../whatsapp/WhatsAppButton';

export function CartDrawer() {
  const { isOpen, close, lines, items, subtotal, update, remove, clear } = useCart();
  const ref = useDialog<HTMLDivElement>(isOpen, close);

  if (!isOpen) return null;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="drawer drawer--right glass" role="dialog" aria-modal="true" aria-labelledby="cart-title" ref={ref}>
        <div className="drawer__head">
          <h2 id="cart-title">Your cart</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close cart">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your cart is empty.</p>
            <Link to="/shop/" className="btn btn--primary" onClick={close}>Browse the shop</Link>
          </div>
        ) : (
          <>
            <ul className="cart-list" role="list">
              {items.map((item) => {
                const line = lines.find((l) => l.product.id === item.productId && l.size === item.size && l.colour === item.colour);
                if (!line) return null;
                const { product } = line;
                return (
                  <li key={item.key} className="cart-item">
                    <img src={product.images[0].src} alt="" width={72} height={72} loading="lazy" decoding="async" />
                    <div className="cart-item__info">
                      <Link to={`/product/${product.slug}/`} onClick={close} className="cart-item__name">{product.name}</Link>
                      <p className="cart-item__meta">Size {item.size}{item.colour ? ` · ${item.colour}` : ''}</p>
                      <p className="cart-item__meta">{formatPrice(product.price)} each</p>
                      <div className="qty qty--sm" role="group" aria-label={`Quantity for ${product.name}, size ${item.size}`}>
                        <button type="button" className="qty__btn" aria-label="Decrease quantity" disabled={item.quantity <= 1} onClick={() => update(item.key, item.quantity - 1)}>
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <output className="qty__value">{item.quantity}</output>
                        <button type="button" className="qty__btn" aria-label="Increase quantity" disabled={item.quantity >= MAX_QTY} onClick={() => update(item.key, item.quantity + 1)}>
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="cart-item__side">
                      <strong>{formatPrice(product.price * item.quantity)}</strong>
                      <button type="button" className="icon-btn" onClick={() => remove(item.key)} aria-label={`Remove ${product.name}, size ${item.size}`}>
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="drawer__foot">
              <p className="cart-subtotal">
                <span>Indicative subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </p>
              <p className="field-hint">
                Delivery charges, availability and final pricing are confirmed by the store. This is a request, not a confirmed order.
              </p>
              <WhatsAppButton label="Send order request on WhatsApp" message={buildCartOrderMessage(lines)} />
              <ol className="steps">
                <li>WhatsApp opens with your list prepared.</li>
                <li>Review it and press send yourself.</li>
                <li>The store replies to confirm availability and next steps.</li>
              </ol>
              <button type="button" className="btn btn--link" onClick={clear}>Clear cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
