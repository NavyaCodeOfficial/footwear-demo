// Post-build step: derives sitemap.xml and robots.txt from the HTML that was ACTUALLY prerendered,
// so they stay in sync with the product/category data without a second hand-maintained list.
// Also copies dist/404/index.html to dist/404.html for static hosts.
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const strict = process.env.STRICT_SEO === '1';

if (!existsSync(dist)) {
  console.error('dist/ not found. Run the build first.');
  process.exit(1);
}

// Load the real TypeScript config through Vite so there is one source of truth.
const server = await createServer({ root, logLevel: 'silent', server: { middlewareMode: true }, appType: 'custom' });
let siteUrl = '';
try {
  const mod = await server.ssrLoadModule('/src/data/siteConfig.ts');
  siteUrl = mod.siteConfig.siteUrl;
} finally {
  await server.close();
}

function problemWith(url) {
  if (!url) return 'siteUrl is empty';
  let u;
  try { u = new URL(url); } catch { return `siteUrl "${url}" is not a valid URL`; }
  if (u.protocol !== 'https:') return 'siteUrl must use https';
  if (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(u.hostname)) return 'siteUrl points at localhost';
  if (/(^|\.)(example\.(com|org|net)|invalid|test|localhost)$/i.test(u.hostname)) return 'siteUrl is a placeholder domain';
  if (/\.vercel\.app$|\.netlify\.app$|\.pages\.dev$/i.test(u.hostname)) return 'siteUrl is a preview/host domain, not the production domain';
  return '';
}

const problem = problemWith(siteUrl);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name === 'index.html') out.push(full);
  }
  return out;
}

const pages = walk(dist).map((file) => {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(dist, dirname(file)).split('\\').join('/');
  const robots = /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i.exec(html)?.[1] ?? '';
  const canonical = /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i.exec(html)?.[1] ?? '';
  return { file, route: route === '/.' ? '/' : route, robots, canonical };
});

// 404 copy for static hosts
const nf = join(dist, '404', 'index.html');
if (existsSync(nf)) copyFileSync(nf, join(dist, '404.html'));

const indexable = pages
  .filter((p) => !/noindex/i.test(p.robots))
  .filter((p) => p.route !== '/404')
  .sort((a, b) => a.route.localeCompare(b.route));

let robotsTxt = 'User-agent: *\nAllow: /\n';
if (problem) {
  const msg = `SEO: sitemap.xml NOT written: ${problem}. Set siteUrl in src/data/siteConfig.ts or VITE_SITE_URL.`;
  if (strict) { console.error(msg); process.exit(1); }
  console.warn(`WARNING ${msg}`);
} else {
  const base = siteUrl.replace(/\/+$/, '');
  const bad = indexable.filter((p) => !p.canonical.startsWith(base + '/'));
  if (bad.length) {
    console.error('Canonical URL mismatch on:', bad.map((b) => b.route).join(', '));
    process.exit(1);
  }
  const urls = indexable.map((p) => `  <url><loc>${p.canonical.replace(/&/g, '&amp;')}</loc></url>`).join('\n');
  writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  robotsTxt += `\nSitemap: ${base}/sitemap.xml\n`;
  console.log(`SEO: sitemap.xml written with ${indexable.length} URLs for ${base}`);
}
writeFileSync(join(dist, 'robots.txt'), robotsTxt);
console.log(`SEO: ${pages.length} prerendered pages found, ${indexable.length} indexable.`);
