import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import { CartProvider, useCart } from '../../hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';
import { Header } from '../navigation/Header';
import { FloatingWhatsApp } from '../whatsapp/FloatingWhatsApp';
import { Footer } from './Footer';

function LiveRegion() {
  const { announcement } = useCart();
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
}

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <CartProvider>
      <a className="skip-link" href="#main">Skip to main content</a>
      {siteConfig.announcement && (
        <div className="announcement" role="note">
          <p className="container">{siteConfig.announcement}</p>
        </div>
      )}
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <LiveRegion />
      <ScrollManager />
    </CartProvider>
  );
}
