// Post-build checks over the prerendered output in dist/. Exits non-zero on any failure.
// Verifies: unique titles/descriptions, canonical + single h1 per indexable page, valid JSON-LD,
// internal links and image/asset references resolve to real files, sitemap consistency.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors = [];
const fail = (m) => errors.push(m);

function walk(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const f = join(dir, n);
    statSync(f).isDirectory() ? out.push(...walk(f)) : out.push(f);
  }
  return out;
}

const htmlFiles = walk(dist).filter((f) => f.endsWith('index.html'));
const titles = new Map();
const descs = new Map();
const linkTargets = new Set();

function resolves(urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return existsSync(join(dist, 'index.html'));
  const direct = join(dist, clean);
  if (existsSync(direct) && statSync(direct).isFile()) return true;
  return existsSync(join(direct, 'index.html'));
}

for (const file of htmlFiles) {
  const route = '/' + relative(dist, dirname(file)).split('\\').join('/');
  const html = readFileSync(file, 'utf8');
  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1];
  const desc = /<meta[^>]+name="description"[^>]+content="([^"]*)"/i.exec(html)?.[1];
  const canonical = /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i.exec(html)?.[1];
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;

  if (!title) fail(`${route}: missing <title>`);
  if (!desc) fail(`${route}: missing meta description`);
  if (h1s !== 1) fail(`${route}: expected exactly 1 <h1>, found ${h1s}`);
  if (!noindex && !canonical) fail(`${route}: indexable page without canonical`);
  if (!/<html[^>]+lang="[^"]+"/.test(html)) fail(`${route}: missing html lang`);
  if (title) titles.set(title, [...(titles.get(title) ?? []), route]);
  if (desc) descs.set(desc, [...(descs.get(desc) ?? []), route]);

  for (const m of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (!data['@context'] || !data['@type']) fail(`${route}: JSON-LD missing @context/@type`);
    } catch {
      fail(`${route}: invalid JSON-LD`);
    }
  }

  for (const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    const target = m[1];
    if (target.startsWith('//')) continue;
    linkTargets.add(`${route} -> ${target}`);
    if (!resolves(target)) fail(`${route}: broken reference ${target}`);
  }
}

for (const [map, label] of [[titles, 'title'], [descs, 'description']]) {
  for (const [value, routes] of map) {
    if (routes.length > 1 && !routes.every((r) => r === '/404')) fail(`duplicate ${label} on ${routes.join(', ')}: "${value.slice(0, 60)}"`);
  }
}

const sitemap = join(dist, 'sitemap.xml');
if (existsSync(sitemap)) {
  const locs = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (new Set(locs).size !== locs.length) fail('sitemap has duplicate URLs');
  for (const l of locs) if (/localhost|example\.|127\.0\.0\.1/.test(l)) fail(`sitemap contains non-production URL ${l}`);
  if (locs.some((l) => /\/(404|cart)\/?$/.test(l))) fail('sitemap contains 404 or cart');
  console.log(`sitemap.xml: ${locs.length} URLs`);
} else {
  console.log('sitemap.xml: not present (siteUrl not configured)');
}

console.log(`checked ${htmlFiles.length} pages, ${linkTargets.size} internal references`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log('verify-build: all checks passed');
