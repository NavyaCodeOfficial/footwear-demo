import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EnquiryForm } from '../components/forms/EnquiryForm';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductPurchase } from '../components/products/ProductPurchase';
import { Seo } from '../components/seo/Seo';
import { getCategory } from '../data/categories';
import { availabilityLabel, getProduct, getRelatedProducts, products } from '../data/products';
import { siteConfig } from '../data/siteConfig';
import { formatPrice } from '../utils/format';
import { breadcrumbJsonLd, productJsonLd } from '../utils/seo';

export function getStaticPaths() {
  return products.map((p) => `product/${p.slug}`);
}

export function Component() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  const [active, setActive] = useState(0);
  if (!product) return <Navigate to="/404/" replace />;

  const category = getCategory(product.category);
  const related = getRelatedProducts(product);
  const image = product.images[Math.min(active, product.images.length - 1)];
  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.price;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop/' },
    ...(category ? [{ name: category.name, path: `/category/${category.slug}/` }] : []),
    { name: product.name, path: `/product/${product.slug}/` },
  ];

  return (
    <>
      <Seo
        title={product.seoTitle}
        description={product.seoDescription}
        path={`/product/${product.slug}`}
        image={product.images[0].src}
        type="product"
        jsonLd={[breadcrumbJsonLd(crumbs), productJsonLd(product)]}
      />
      <div className="container page">
        <Breadcrumbs crumbs={crumbs} />

        <div className="pdp">
          <div className="pdp__gallery">
            <div className="pdp__main">
              <img key={image.src} src={image.src} alt={image.alt} width={image.width} height={image.height} fetchPriority="high" decoding="async" />
            </div>
            {product.images.length > 1 && (
              <ul className="pdp__thumbs" role="list">
                {product.images.map((img, i) => (
                  <li key={img.src}>
                    <button type="button" className={i === active ? 'is-selected' : ''} onClick={() => setActive(i)} aria-label={`Show image ${i + 1} of ${product.images.length}`} aria-pressed={i === active}>
                      <img src={img.src} alt="" width={96} height={96} loading="lazy" decoding="async" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pdp__info">
            {product.isSample && <p className="badge badge--sample">Sample product: demonstration data</p>}
            <h1>{product.name}</h1>
            <p className="muted small">SKU: {product.sku}</p>
            <p className="pdp__price">
              <span>{formatPrice(product.price)}</span>
              {hasDiscount && <s className="card__was">{formatPrice(product.originalPrice!)}</s>}
            </p>
            <p className={`card__avail card__avail--${product.availability}`}>{availabilityLabel[product.availability]}</p>
            <p>{product.description}</p>

            <ProductPurchase product={product} />

            <dl className="specs">
              {product.subcategory && (<><dt>Type</dt><dd>{product.subcategory}</dd></>)}
              {product.materials && (<><dt>Materials</dt><dd>{product.materials}</dd></>)}
              {product.care && (<><dt>Care</dt><dd>{product.care}</dd></>)}
            </dl>

            <div className="info-box">
              <h2>Shipping and returns</h2>
              <p>{siteConfig.policy.shippingSummary} <Link to="/shipping-policy/">Shipping details</Link></p>
              <p>{siteConfig.policy.returnsSummary} <Link to="/returns-policy/">Returns details</Link></p>
            </div>
          </div>
        </div>

        <section className="section">
          <div className="narrow">
            <EnquiryForm product={`${product.name} (${product.sku})`} heading="Ask about this product" />
          </div>
        </section>

        {related.length > 0 && (
          <section className="section" aria-labelledby="rel-h">
            <h2 id="rel-h" className="section__title">You may also like</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </>
  );
}
