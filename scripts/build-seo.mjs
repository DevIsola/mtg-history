import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalUrl, SITE_BASE, SITE_ORIGIN, sitemapPaths, sitemapXml } from '../src/utils/seo.mjs';
import { homeAlternates, routeAlternates, translatedSuffix } from '../src/utils/i18n.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

function visit(directory, root) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isSymbolicLink()) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? visit(path, root) : [relative(root, path).replaceAll('\\', '/')];
  });
}

export function buildSeo(root = dist) {
  if (!existsSync(root)) throw new Error('Build dist/ before generating SEO assets');
  const socialImage = `${SITE_ORIGIN}${SITE_BASE}social-preview.png`;
  const imagePath = join(root, 'social-preview.png');
  if (!existsSync(imagePath)) throw new Error('Missing social-preview.png in build output');
  const image = readFileSync(imagePath);
  const signature = Buffer.from('89504e470d0a1a0a', 'hex');
  if (image.length < 2048 || !image.subarray(0, 8).equals(signature) ||
      image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 630) {
    throw new Error('Social preview must be a valid 1200x630 PNG');
  }
  const paths = sitemapPaths(visit(root, root));
  if (paths.length < 3 || !paths.includes('/') || !paths.includes('/pt-br/')) throw new Error('Incomplete localized static route inventory');
  // Tests can invoke buildSeo with a minimal fixture, but the production build
  // must publish every newly translated catalog before producing a sitemap.
  if (root === dist && ['timeline', 'characters', 'events', 'archive'].some((key) => !paths.includes(`/pt-br/${key}/`))) {
    throw new Error('Incomplete Portuguese directory inventory');
  }
  const urls = paths.map((path) => canonicalUrl(SITE_BASE + path.slice(1)));
  for (const [index, path] of paths.entries()) {
    const html = readFileSync(join(root, path.slice(1), 'index.html'), 'utf8');
    if (path === '/' || path === '/pt-br/') {
      const language = path === '/' ? 'en' : 'pt-BR';
      if (!html.includes(`<html lang="${language}"`)) {
        throw new Error(`Incorrect homepage language: ${path}`);
      }
      for (const { lang, href } of homeAlternates(SITE_ORIGIN, SITE_BASE)) {
        if (!html.includes(`rel="alternate" hreflang="${lang}" href="${href}"`)) {
          throw new Error(`Missing homepage hreflang ${lang}: ${path}`);
        }
      }
    }
    const route = `${SITE_BASE}${path.slice(1)}`;
    const suffix = translatedSuffix(route, SITE_BASE);
    if (suffix !== null && suffix !== '') {
      const language = path.startsWith('/pt-br/') ? 'pt-BR' : 'en';
      if (!html.includes(`<html lang="${language}"`)) throw new Error(`Incorrect catalog language: ${path}`);
      for (const { lang, href } of routeAlternates(route, SITE_ORIGIN, SITE_BASE)) {
        if (!html.includes(`rel="alternate" hreflang="${lang}" href="${href}"`)) {
          throw new Error(`Missing catalog hreflang ${lang}: ${path}`);
        }
      }
    } else if (suffix === null && html.includes('rel="alternate" hreflang="pt-BR"')) {
      throw new Error(`False Portuguese alternate: ${path}`);
    }
    if (!html.includes(`rel="canonical" href="${urls[index]}"`)) {
      throw new Error(`Missing or mismatched canonical URL: ${path}`);
    }
    if (!html.includes(`property="og:image" content="${socialImage}"`) ||
        !html.includes(`name="twitter:image" content="${socialImage}"`)) {
      throw new Error(`Missing or mismatched social preview metadata: ${path}`);
    }
  }
  writeFileSync(join(root, 'sitemap.xml'), sitemapXml(urls));
  writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_ORIGIN}${SITE_BASE}sitemap.xml\n`);
  console.log(`SEO sitemap: ${urls.length} canonical routes; robots.txt generated.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  buildSeo();
}
