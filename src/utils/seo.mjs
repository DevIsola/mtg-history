export const SITE_ORIGIN = 'https://devisola.github.io';
export const SITE_BASE = '/mtg-history/';

export function canonicalUrl(pathname, origin = SITE_ORIGIN, base = SITE_BASE) {
  if (!pathname.startsWith(base)) throw new Error(`Page outside site base: ${pathname}`);
  if (pathname.includes('..') || pathname.includes('\\') || pathname.includes('//')) {
    throw new Error(`Unsafe canonical path: ${pathname}`);
  }
  return new URL(pathname, origin).href;
}

export function sitemapPaths(files) {
  return [...new Set(files
    .filter((file) => file === 'index.html' || file.endsWith('/index.html'))
    .filter((file) => file !== '404.html')
    .map((file) => file === 'index.html' ? '/' : `/${file.slice(0, -'index.html'.length)}`)
  )].sort();
}

export function sitemapXml(urls) {
  const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join('\n') +
    '\n</urlset>\n';
}
