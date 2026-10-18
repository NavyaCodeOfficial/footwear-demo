import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CartProvider } from '../hooks/useCart';
import { CartDrawer } from './cart/CartDrawer';
import { EnquiryForm } from './forms/EnquiryForm';
import { ProductPurchase } from './products/ProductPurchase';
import { Header } from './navigation/Header';
import { products } from '../data/products';
import { siteConfig } from '../data/siteConfig';

const sneaker = products.find((p) => p.id === 'p001')!;
const boot = products.find((p) => p.id === 'p012')!; // out of stock in sample data

function wrap(ui: React.ReactNode) {
  return render(
    <MemoryRouter>
      <CartProvider>
        {ui}
        <CartDrawer />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('ProductPurchase', () => {
  it('blocks add-to-cart until a size is chosen, then adds a variant line', async () => {
    const user = userEvent.setup();
    wrap(<ProductPurchase product={sneaker} />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/choose an available size/i);

    await user.click(screen.getByLabelText('White'));
    await user.click(screen.getByLabelText('8'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    const dialog = await screen.findByRole('dialog', { name: /your cart/i });
    expect(within(dialog).getByText(/Size 8 · White/)).toBeInTheDocument();
    expect(within(dialog).getByText('Indicative subtotal')).toBeInTheDocument();
  });

  it('disables a size that the selected colour does not offer', async () => {
    const user = userEvent.setup();
    wrap(<ProductPurchase product={sneaker} />);
    await user.click(screen.getByLabelText('Sand')); // Sand only has 7-10
    expect(screen.getByLabelText('6')).toBeDisabled();
    expect(screen.getByLabelText('9')).not.toBeDisabled();
  });

  it('never opens WhatsApp while the business number is unset', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const user = userEvent.setup();
    expect(siteConfig.whatsappNumber).toBe('');
    wrap(<ProductPurchase product={sneaker} />);
    await user.click(screen.getByLabelText('White'));
    await user.click(screen.getByLabelText('8'));
    await user.click(screen.getByRole('button', { name: /order on whatsapp/i }));
    expect(open).not.toHaveBeenCalled();
    expect(screen.getAllByText(/number has not been set up/i).length).toBeGreaterThan(0);
    open.mockRestore();
  });

  it('turns ordering off for out-of-stock products', () => {
    wrap(<ProductPurchase product={boot} />);
    expect(screen.getByText(/out of stock, so ordering is turned off/i)).toBeInTheDocument();
  });
});

describe('Cart', () => {
  it('persists to local storage and keeps the cart when cleared only on request', async () => {
    const user = userEvent.setup();
    wrap(<ProductPurchase product={sneaker} />);
    await user.click(screen.getByLabelText('White'));
    await user.click(screen.getByLabelText('8'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    const stored = JSON.parse(window.localStorage.getItem('royal-footwear-cart-v1') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ productId: 'p001', size: '8', colour: 'White', quantity: 1 });

    await user.click(screen.getByRole('button', { name: /clear cart/i }));
    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument();
  });
});

describe('EnquiryForm', () => {
  it('shows accessible errors and does not proceed when invalid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><EnquiryForm heading="Enquiry" /></MemoryRouter>);
    // Submit is disabled without a configured number; the form still explains why.
    expect(screen.getByText(/WhatsApp is not set up yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prepare whatsapp message/i })).toBeDisabled();
    await user.type(screen.getByLabelText(/your name/i), 'Asha');
    expect(screen.getByLabelText(/your name/i)).toHaveValue('Asha');
  });
});

describe('Header', () => {
  it('opens the search dialog and the cart count is announced in the label', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>);
    expect(screen.getByRole('button', { name: /open cart, 0 items/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /search products/i }));
    expect(screen.getByRole('dialog', { name: /search products/i })).toBeInTheDocument();
  });
});

describe('EnquiryForm with a configured number', () => {
  it('validates, then opens a wa.me link with the encoded message only after a deliberate submit', async () => {
    const original = siteConfig.whatsappNumber;
    siteConfig.whatsappNumber = '919999999999'; // test value only, restored below
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    try {
      const user = userEvent.setup();
      render(<MemoryRouter><EnquiryForm heading="Enquiry" /></MemoryRouter>);
      const submit = screen.getByRole('button', { name: /prepare whatsapp message/i });

      await user.click(submit);
      expect(open).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(/fix 3 fields/i);
      expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'true');

      await user.type(screen.getByLabelText(/your name/i), 'Asha & Co');
      await user.type(screen.getByLabelText(/^message/i), 'Size 7 in black?');
      await user.click(screen.getByLabelText(/i understand this prepares/i));
      await user.click(submit);

      expect(open).toHaveBeenCalledTimes(1);
      const url = String(open.mock.calls[0][0]);
      expect(url.startsWith('https://wa.me/919999999999?text=')).toBe(true);
      const decoded = decodeURIComponent(url.split('?text=')[1]);
      expect(decoded).toContain('Name: Asha & Co');
      expect(decoded).toContain('Message: Size 7 in black?');
      expect(screen.getByRole('status')).toHaveTextContent(/nothing has been sent yet/i);
    } finally {
      siteConfig.whatsappNumber = original;
      open.mockRestore();
    }
  });

  it('ignores submissions that fill the honeypot', async () => {
    const original = siteConfig.whatsappNumber;
    siteConfig.whatsappNumber = '919999999999';
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    try {
      const user = userEvent.setup();
      render(<MemoryRouter><EnquiryForm /></MemoryRouter>);
      await user.type(screen.getByLabelText(/your name/i), 'Bot');
      await user.type(screen.getByLabelText(/^message/i), 'spam');
      await user.click(screen.getByLabelText(/i understand this prepares/i));
      await user.type(screen.getByLabelText(/leave this field empty/i), 'http://spam');
      await user.click(screen.getByRole('button', { name: /prepare whatsapp message/i }));
      expect(open).not.toHaveBeenCalled();
    } finally {
      siteConfig.whatsappNumber = original;
      open.mockRestore();
    }
  });
});
