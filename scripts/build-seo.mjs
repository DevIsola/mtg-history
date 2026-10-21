import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalUrl, SITE_BASE, SITE_ORIGIN, sitemapPaths, sitemapXml } from '../src/utils/seo.mjs';

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
  if (paths.length < 3 || !paths.includes('/')) throw new Error('Incomplete static route inventory');
  const urls = paths.map((path) => canonicalUrl(SITE_BASE + path.slice(1)));
  for (const [index, path] of paths.entries()) {
    const html = readFileSync(join(root, path.slice(1), 'index.html'), 'utf8');
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
