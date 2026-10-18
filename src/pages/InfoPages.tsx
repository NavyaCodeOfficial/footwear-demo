import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EnquiryForm } from '../components/forms/EnquiryForm';
import { Seo } from '../components/seo/Seo';
import { faqs } from '../data/faq';
import { siteConfig } from '../data/siteConfig';
import { breadcrumbJsonLd, faqJsonLd } from '../utils/seo';

export function AboutPage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }];
  return (
    <>
      <Seo
        title="About Royal Footwear"
        description="Learn how Royal Footwear selects footwear and how ordering through WhatsApp works."
        path="/about"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <div className="container page narrow">
        <Breadcrumbs crumbs={crumbs} />
        <h1>About {siteConfig.brandName}</h1>
        <p className="lead">{siteConfig.tagline}.</p>
        <p>
          [OWNER: add your story here: who you are, where you are based and what you stand for. Only include facts you can stand behind.]
        </p>
        <h2>How ordering works</h2>
        <p>
          Choose a pair on this website and send us a WhatsApp message with your selection. We confirm availability, delivery
          and the final price with you before anything is finalised. This website does not take payments.
        </p>
        <p><Link to="/shop/" className="btn btn--primary">Shop the collection</Link></p>
      </div>
    </>
  );
}

export function ContactPage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }];
  return (
    <>
      <Seo
        title="Contact Royal Footwear"
        description="Ask Royal Footwear about sizes, availability, delivery or returns. Prepare a WhatsApp message in a few steps."
        path="/contact"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <div className="container page narrow">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Contact us</h1>
        <p className="lead">Fill in the form and we will prepare a WhatsApp message for you to review and send.</p>
        <ul className="contact-list" role="list">
          {siteConfig.businessAddress && <li><strong>Address:</strong> {siteConfig.businessAddress}</li>}
          {siteConfig.businessEmail && <li><strong>Email:</strong> <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a></li>}
          {siteConfig.phoneDisplay && <li><strong>Phone:</strong> {siteConfig.phoneDisplay}</li>}
        </ul>
        <EnquiryForm heading="Send an enquiry" defaultType="Other" />
      </div>
    </>
  );
}

export function FaqPage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq/' }];
  return (
    <>
      <Seo
        title="Frequently Asked Questions | Royal Footwear"
        description="Answers about ordering on WhatsApp, sizes, delivery and returns at Royal Footwear."
        path="/faq"
        jsonLd={[breadcrumbJsonLd(crumbs), faqJsonLd(faqs)]}
      />
      <div className="container page narrow">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Frequently asked questions</h1>
        {faqs.map((f) => (
          <details key={f.question} className="faq">
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found | Royal Footwear" description="This page could not be found." path="/404" noindex />
      <div className="container page narrow center">
        <h1>Page not found</h1>
        <p>The page you were looking for does not exist or has moved.</p>
        <p className="hero__cta">
          <Link to="/" className="btn btn--primary">Go to homepage</Link>
          <Link to="/shop/" className="btn btn--secondary">Browse the shop</Link>
        </p>
      </div>
    </>
  );
}
