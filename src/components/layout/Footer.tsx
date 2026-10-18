import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { sortedCategories } from '../../data/categories';
import { siteConfig } from '../../data/siteConfig';

export function Footer() {
  const social = Object.entries(siteConfig.social).filter(([, url]) => Boolean(url));
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{siteConfig.brandName}</p>
          <p className="muted">{siteConfig.tagline}</p>
          <p className="muted small">{siteConfig.footerNote}</p>
          {siteConfig.businessAddress && <p className="small">{siteConfig.businessAddress}</p>}
          {siteConfig.businessEmail && <p className="small"><a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a></p>}
          {siteConfig.phoneDisplay && <p className="small">{siteConfig.phoneDisplay}</p>}
        </div>
        <nav aria-label="Shop">
          <h2 className="footer-title">Shop</h2>
          <ul role="list">
            <li><Link to="/shop/">All footwear</Link></li>
            {sortedCategories.map((c) => (
              <li key={c.slug}><Link to={`/category/${c.slug}/`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Help and information">
          <h2 className="footer-title">Help</h2>
          <ul role="list">
            <li><Link to="/about/">About</Link></li>
            <li><Link to="/contact/">Contact</Link></li>
            <li><Link to="/faq/">FAQ</Link></li>
            <li><Link to="/shipping-policy/">Shipping and delivery</Link></li>
            <li><Link to="/returns-policy/">Returns and exchanges</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2 className="footer-title">Legal</h2>
          <ul role="list">
            <li><Link to="/privacy-policy/">Privacy policy</Link></li>
            <li><Link to="/terms-and-conditions/">Terms and conditions</Link></li>
            <li><Link to="/cookie-policy/">Cookie policy</Link></li>
          </ul>
          {social.length > 0 && (
            <>
              <h2 className="footer-title">Follow</h2>
              <ul role="list">
                {social.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="cap">
                      {name} <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
      </div>
      <div className="container footer-bottom">
        <p className="small muted">© {new Date().getFullYear()} {siteConfig.brandName}. Website by {siteConfig.developerName}: {siteConfig.developerTagline}.</p>
      </div>
    </footer>
  );
}
