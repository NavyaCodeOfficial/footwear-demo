import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGrid } from '../components/products/ProductGrid';
import { Seo } from '../components/seo/Seo';
import { sortedCategories } from '../data/categories';
import { products } from '../data/products';
import { useDialog } from '../hooks/useDialog';
import {
  activeFilterCount, defaultFilters, filterProducts, filtersFromParams, filtersToParams,
  uniqueColours, uniqueSizes, type ShopFilters, type SortKey,
} from '../utils/filters';
import { breadcrumbJsonLd } from '../utils/seo';

const sizes = uniqueSizes(products);
const colours = uniqueColours(products);

function FilterFields({ f, onChange }: { f: ShopFilters; onChange: (next: Partial<ShopFilters>) => void }) {
  return (
    <>
      <div className="field">
        <label htmlFor="f-q">Search name or SKU</label>
        <input id="f-q" type="search" value={f.q} maxLength={80} onChange={(e) => onChange({ q: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="f-cat">Category</label>
        <select id="f-cat" value={f.category} onChange={(e) => onChange({ category: e.target.value })}>
          <option value="">All categories</option>
          {sortedCategories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-size">Size</label>
        <select id="f-size" value={f.size} onChange={(e) => onChange({ size: e.target.value })}>
          <option value="">Any size</option>
          {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-colour">Colour</label>
        <select id="f-colour" value={f.colour} onChange={(e) => onChange({ colour: e.target.value })}>
          <option value="">Any colour</option>
          {colours.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <fieldset className="field field--pair">
        <legend>Price range (INR)</legend>
        <div>
          <label htmlFor="f-min" className="sr-only">Minimum price</label>
          <input id="f-min" type="number" inputMode="numeric" min={0} placeholder="Min" value={f.minPrice ?? ''}
            onChange={(e) => onChange({ minPrice: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} />
        </div>
        <div>
          <label htmlFor="f-max" className="sr-only">Maximum price</label>
          <input id="f-max" type="number" inputMode="numeric" min={0} placeholder="Max" value={f.maxPrice ?? ''}
            onChange={(e) => onChange({ maxPrice: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} />
        </div>
      </fieldset>
    </>
  );
}

export function Component() {
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const results = useMemo(() => filterProducts(products, filters), [filters]);
  const activeCount = activeFilterCount(filters);
  const drawerRef = useDialog<HTMLDivElement>(drawer, () => setDrawer(false));

  const update = (next: Partial<ShopFilters>) => setParams(filtersToParams({ ...filters, ...next }), { replace: true });
  const clear = () => setParams(filtersToParams(defaultFilters), { replace: true });

  return (
    <>
      {/* Filtered/searched views canonicalise to /shop/ so query URLs are never indexed as duplicates. */}
      <Seo
        title="Shop All Footwear | Royal Footwear"
        description="Browse the full Royal Footwear range. Filter by category, size, colour and price, then enquire or order on WhatsApp."
        path="/shop"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }])]}
      />
      <div className="container page">
        <Breadcrumbs crumbs={[{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop/' }]} />
        <h1>Shop all footwear</h1>

        <div className="shop">
          <aside className="shop__filters only-desktop" aria-label="Filters">
            <FilterFields f={filters} onChange={update} />
            <button type="button" className="btn btn--link" onClick={clear} disabled={activeCount === 0}>Clear filters</button>
          </aside>

          <div className="shop__results">
            <div className="shop__bar">
              <p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'product' : 'products'}</p>
              <button type="button" className="btn btn--secondary only-mobile" onClick={() => setDrawer(true)}>
                <SlidersHorizontal size={16} aria-hidden="true" /> Filters{activeCount ? ` (${activeCount})` : ''}
              </button>
              <div className="field field--inline">
                <label htmlFor="sort">Sort by</label>
                <select id="sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
                  <option value="featured">Featured</option>
                  <option value="newest">Newest arrivals</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </div>
            </div>

            {results.length > 0 ? (
              <ProductGrid products={results} />
            ) : (
              <div className="empty" role="status">
                <h2>No products match</h2>
                <p>Try removing a filter or searching a different name.</p>
                <button type="button" className="btn btn--primary" onClick={clear}>Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {drawer && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setDrawer(false)}>
          <div className="drawer drawer--left glass" role="dialog" aria-modal="true" aria-label="Filters" ref={drawerRef}>
            <div className="drawer__head">
              <h2>Filters</h2>
              <button type="button" className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close filters">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="drawer__body">
              <FilterFields f={filters} onChange={update} />
            </div>
            <div className="drawer__foot">
              <button type="button" className="btn btn--primary" onClick={() => setDrawer(false)}>Show {results.length} {results.length === 1 ? 'product' : 'products'}</button>
              <button type="button" className="btn btn--link" onClick={clear} disabled={activeCount === 0}>Clear filters</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
