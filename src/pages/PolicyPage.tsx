import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Seo } from '../components/seo/Seo';
import { getPolicy } from '../data/policies';
import { breadcrumbJsonLd } from '../utils/seo';

export function PolicyPage({ slug }: { slug: string }) {
  const doc = getPolicy(slug);
  if (!doc) return null;
  const crumbs = [{ name: 'Home', path: '/' }, { name: doc.title, path: `/${doc.slug}/` }];

  return (
    <>
      <Seo title={doc.seoTitle} description={doc.seoDescription} path={`/${doc.slug}`} jsonLd={[breadcrumbJsonLd(crumbs)]} />
      <div className="container page narrow">
        <Breadcrumbs crumbs={crumbs} />
        <h1>{doc.title}</h1>
        <p className="notice notice--warn" role="note">
          DRAFT FOR OWNER REVIEW. {doc.intro} This text is not legal advice. Replace every [PLACEHOLDER] and have it reviewed before publishing.
        </p>
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((para) => <p key={para}>{para}</p>)}
          </section>
        ))}
      </div>
    </>
  );
}
