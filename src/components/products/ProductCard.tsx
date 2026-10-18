import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { getCategory } from '../../data/categories';
import { availabilityLabel } from '../../data/products';
import { formatPrice } from '../../utils/format';
import { buildEnquiryMessage } from '../../utils/whatsapp';
import { WhatsAppButton } from '../whatsapp/WhatsAppButton';

interface Props { product: Product; priority?: boolean }

export function ProductCard({ product, priority = false }: Props) {
  const category = getCategory(product.category);
  const img = product.images[0];
  const to = `/product/${product.slug}/`;
  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.price;

  return (
    <article className="card">
      <Link to={to} className="card__media" aria-label={`View details for ${product.name}`}>
        <img
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
        />
        {product.isSample && <span className="badge badge--sample">Sample</span>}
      </Link>
      <div className="card__body">
        {category && <p className="card__category">{category.navLabel}{product.subcategory ? ` · ${product.subcategory}` : ''}</p>}
        <h3 className="card__title">
          <Link to={to}>{product.name}</Link>
        </h3>
        <p className="card__price">
          <span>{formatPrice(product.price)}</span>
          {hasDiscount && <s className="card__was">{formatPrice(product.originalPrice!)}</s>}
        </p>
        <p className={`card__avail card__avail--${product.availability}`}>{availabilityLabel[product.availability]}</p>
        <div className="card__actions">
          <Link to={to} className="btn btn--secondary">View details</Link>
          <WhatsAppButton
            variant="ghost"
            label="Enquire"
            message={buildEnquiryMessage({
              type: 'Product availability',
              product: `${product.name} (${product.sku})`,
              message: 'Is this available? Please share sizes and details.',
            })}
          />
        </div>
      </div>
    </article>
  );
}
