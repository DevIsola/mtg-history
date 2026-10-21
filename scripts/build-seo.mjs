import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalUrl, SITE_BASE, SITE_ORIGIN, sitemapPaths, sitemapXml } from '../src/utils/seo.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

function visit(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isSymbolicLink()) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? visit(path) : [relative(dist, path).replaceAll('\\', '/')];
  });
}

export function buildSeo() {
  if (!existsSync(dist)) throw new Error('Build dist/ before generating SEO assets');
  const paths = sitemapPaths(visit(dist));
  if (paths.length < 3 || !paths.includes('/')) throw new Error('Incomplete static route inventory');
  const urls = paths.map((path) => canonicalUrl(SITE_BASE + path.slice(1)));
  for (const [index, path] of paths.entries()) {
    const html = readFileSync(join(dist, path.slice(1), 'index.html'), 'utf8');
    if (!html.includes(`rel="canonical" href="${urls[index]}"`)) {
      throw new Error(`Missing or mismatched canonical URL: ${path}`);
    }
  }
  writeFileSync(join(dist, 'sitemap.xml'), sitemapXml(urls));
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_ORIGIN}${SITE_BASE}sitemap.xml\n`);
  console.log(`SEO sitemap: ${urls.length} canonical routes; robots.txt generated.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  buildSeo();
}
