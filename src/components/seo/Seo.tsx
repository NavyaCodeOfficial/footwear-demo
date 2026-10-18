import { Head } from 'vite-react-ssg';
import { siteConfig } from '../../data/siteConfig';
import { absoluteUrl, canonicalPath } from '../../utils/format';

interface SeoProps {
  title: string;
  description: string;
  /** Route path, e.g. "/shop". Used for the canonical URL and og:url. */
  path: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'product';
  jsonLd?: object[];
}

export function Seo({ title, description, path, image, noindex = false, type = 'website', jsonLd = [] }: SeoProps) {
  const canonical = absoluteUrl(canonicalPath(path));
  const ogImage = absoluteUrl(image ?? siteConfig.defaultOgImage);
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      {!noindex && <link rel="canonical" href={canonical} />}
      <meta property="og:site_name" content={siteConfig.brandName} />
      <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {siteConfig.googleSiteVerification && (
        <meta name="google-site-verification" content={siteConfig.googleSiteVerification} />
      )}
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Head>
  );
}
