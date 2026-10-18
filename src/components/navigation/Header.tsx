import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { sortedCategories } from '../../data/categories';
import { siteConfig } from '../../data/siteConfig';
import { useCart } from '../../hooks/useCart';
import { useDialog } from '../../hooks/useDialog';

export function Header() {
  const { count, open: openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setMenuOpen(false);
  const closeSearch = () => setSearchOpen(false);
  const menuRef = useDialog<HTMLDivElement>(menuOpen, closeMenu);
  const searchRef = useDialog<HTMLDivElement>(searchOpen, closeSearch);

  // Close transient UI whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!dropdown) return;
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdown(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDropdown(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropdown]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().slice(0, 80);
    closeSearch();
    navigate(q ? `/shop/?q=${encodeURIComponent(q)}` : '/shop/');
  }

  return (
    <header className="site-header glass">
      <div className="container site-header__inner">
        <button type="button" className="icon-btn only-mobile" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
          <Menu size={22} aria-hidden="true" />
        </button>

        <Link to="/" className="logo" aria-label={`${siteConfig.brandName} home`}>
          <img src={siteConfig.logoPath} alt="" width={32} height={32} />
          <span>{siteConfig.brandName}</span>
        </Link>

        <nav className="primary-nav only-desktop" aria-label="Primary">
          <NavLink to="/shop/">Shop</NavLink>
          <div className="dropdown" ref={dropdownRef}>
            <button type="button" className="dropdown__toggle" aria-expanded={dropdown} aria-controls="cat-menu" onClick={() => setDropdown((v) => !v)}>
              Categories <ChevronDown size={16} aria-hidden="true" />
            </button>
            {dropdown && (
              <ul className="dropdown__menu glass" id="cat-menu" role="list">
                {sortedCategories.map((c) => (
                  <li key={c.slug}><Link to={`/category/${c.slug}/`}>{c.name}</Link></li>
                ))}
              </ul>
            )}
          </div>
          <NavLink to="/about/">About</NavLink>
          <NavLink to="/faq/">FAQ</NavLink>
          <NavLink to="/contact/">Contact</NavLink>
        </nav>

        <div className="site-header__tools">
          <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search products" aria-haspopup="dialog">
            <Search size={20} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn cart-btn" onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <ShoppingBag size={20} aria-hidden="true" />
            {count > 0 && <span className="cart-btn__count" aria-hidden="true">{count}</span>}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && closeMenu()}>
          <div className="drawer drawer--left glass" role="dialog" aria-modal="true" aria-label="Menu" ref={menuRef}>
            <div className="drawer__head">
              <span className="logo__text">{siteConfig.brandName}</span>
              <button type="button" className="icon-btn" onClick={closeMenu} aria-label="Close menu">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile">
              <ul className="mobile-nav" role="list">
                <li><Link to="/shop/">Shop all</Link></li>
                {sortedCategories.map((c) => (
                  <li key={c.slug}><Link to={`/category/${c.slug}/`}>{c.name}</Link></li>
                ))}
                <li><Link to="/about/">About</Link></li>
                <li><Link to="/faq/">FAQ</Link></li>
                <li><Link to="/contact/">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="overlay overlay--top" onMouseDown={(e) => e.target === e.currentTarget && closeSearch()}>
          <div className="search-panel glass" role="dialog" aria-modal="true" aria-label="Search products" ref={searchRef}>
            <form onSubmit={submitSearch} role="search">
              <label htmlFor="site-search" className="sr-only">Search by product name or SKU</label>
              <input
                id="site-search" type="search" value={query} maxLength={80}
                onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or SKU"
                autoComplete="off"
              />
              <button type="submit" className="btn btn--primary">Search</button>
              <button type="button" className="icon-btn" onClick={closeSearch} aria-label="Close search">
                <X size={20} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
