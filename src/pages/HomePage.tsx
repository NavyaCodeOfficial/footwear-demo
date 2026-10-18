import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Ruler, ShoppingBag } from 'lucide-react';
import { ProductGrid } from '../components/products/ProductGrid';
import { Seo } from '../components/seo/Seo';
import { WhatsAppButton } from '../components/whatsapp/WhatsAppButton';
import { sortedCategories } from '../data/categories';
import { faqs } from '../data/faq';
import { products } from '../data/products';
import { siteConfig } from '../data/siteConfig';
import { organizationJsonLd, websiteJsonLd } from '../utils/seo';

export function Component() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newest = [...products].sort((a, b) => b.addedOn.localeCompare(a.addedOn)).slice(0, 4);
  // Only shown when the owner marks real bestsellers in the catalogue.
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <>
      <Seo
        title={siteConfig.defaultSeoTitle}
        description={siteConfig.defaultSeoDescription}
        path="/"
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">{siteConfig.tagline}</p>
            <h1>Find Your Perfect Pair.</h1>
            <p className="lead">Explore footwear for every occasion, from everyday essentials to statement styles.</p>
            <div className="hero__cta">
              <Link to="/shop/" className="btn btn--primary">Shop Collection</Link>
              <a href="#categories" className="btn btn--secondary">Explore Categories</a>
            </div>
          </div>
          <div className="hero__media glass">
            <img
              src="/images/hero.svg" alt="Demo illustration of a champagne-toned sneaker"
              width={800} height={800} fetchPriority="high" decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="section" id="categories" aria-labelledby="cats-h">
        <div className="container">
          <h2 id="cats-h" className="section__title">Shop by category</h2>
          <ul className="cat-grid" role="list">
            {sortedCategories.filter((c) => c.showOnHome).map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}/`} className="cat-card">
                  <img src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height} loading="lazy" decoding="async" />
                  <span className="cat-card__label glass">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="feat-h">
        <div className="container">
          <div className="section__head">
            <h2 id="feat-h" className="section__title">Featured</h2>
            <Link to="/shop/" className="link-arrow">View all <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="section" aria-labelledby="new-h">
        <div className="container">
          <h2 id="new-h" className="section__title">New arrivals</h2>
          <ProductGrid products={newest} />
        </div>
      </section>

      {bestsellers.length > 0 && (
        <section className="section section--tint" aria-labelledby="best-h">
          <div className="container">
            <h2 id="best-h" className="section__title">Bestsellers</h2>
            <ProductGrid products={bestsellers} />
          </div>
        </section>
      )}

      <section className="section section--tint" aria-labelledby="story-h">
        <div className="container narrow">
          <h2 id="story-h" className="section__title">How we choose</h2>
          <p>
            We aim to offer footwear that suits real routines: pairs for work, play, school and celebrations.
            {' '}[OWNER: add your brand story and product-selection approach here.]
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="how-h">
        <div className="container">
          <h2 id="how-h" className="section__title">How ordering works</h2>
          <ol className="how">
            <li><ShoppingBag aria-hidden="true" /><h3>Pick your pair</h3><p>Choose a size and colour, then add it to your cart or order it directly.</p></li>
            <li><MessageCircle aria-hidden="true" /><h3>Send on WhatsApp</h3><p>We prepare the message. You review it and send it yourself.</p></li>
            <li><Ruler aria-hidden="true" /><h3>Store confirms</h3><p>The store confirms availability, delivery and final price with you.</p></li>
          </ol>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="faq-h">
        <div className="container narrow">
          <h2 id="faq-h" className="section__title">Questions, answered</h2>
          {faqs.slice(0, 3).map((f) => (
            <details key={f.question} className="faq">
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
          <p><Link to="/faq/" className="link-arrow">See all FAQs <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>

      <section className="section" aria-labelledby="help-h">
        <div className="container narrow center">
          <h2 id="help-h" className="section__title">Need help choosing?</h2>
          <p>Ask about sizes, availability or anything else. We will prepare the message; you decide when to send it.</p>
          <WhatsAppButton label="Message us on WhatsApp" message={`Hello ${siteConfig.brandName}! I need help choosing footwear.`} />
        </div>
      </section>
    </>
  );
}
