import { Navigate, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGrid } from '../components/products/ProductGrid';
import { Seo } from '../components/seo/Seo';
import { categories, getCategory } from '../data/categories';
import { products } from '../data/products';
import { breadcrumbJsonLd, categoryJsonLd } from '../utils/seo';

export function getStaticPaths() {
  return categories.map((c) => `category/${c.slug}`);
}

export function Component() {
  const { slug = '' } = useParams();
  const category = getCategory(slug);
  if (!category) return <Navigate to="/404/" replace />;

  const items = products.filter((p) => p.category === category.slug);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop/' },
    { name: category.name, path: `/category/${category.slug}/` },
  ];

  return (
    <>
      <Seo
        title={category.seoTitle}
        description={category.seoDescription}
        path={`/category/${category.slug}`}
        image={category.image.src}
        jsonLd={[breadcrumbJsonLd(crumbs), categoryJsonLd(category, items)]}
      />
      <div className="container page">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{category.name}</h1>
        <p className="lead muted">{category.description}</p>
        {items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <p className="empty">No products in this category yet.</p>
        )}
      </div>
    </>
  );
}
