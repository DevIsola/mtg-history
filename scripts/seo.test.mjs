import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { canonicalUrl, sitemapPaths, sitemapXml } from '../src/utils/seo.mjs';

const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('canonical URLs honor the deployed GitHub Pages base', () => {
  assert.equal(canonicalUrl('/mtg-history/chapters/thran/'), 'https://devisola.github.io/mtg-history/chapters/thran/');
  assert.throws(() => canonicalUrl('/chapters/thran/'), /outside site base/);
  assert.throws(() => canonicalUrl('/mtg-history/../'), /Unsafe/);
});

test('sitemap only includes distinct clean index routes', () => {
  assert.deepEqual(sitemapPaths(['index.html', 'chapters/thran/index.html', 'chapters/thran/index.html', '404.html', 'pagefind/pagefind.js', 'favicon.svg']), ['/', '/chapters/thran/']);
});

test('sitemap XML contains canonical loc elements', () => {
  const xml = sitemapXml(['https://example.com/a?b=1&c=2']);
  assert.match(xml, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  assert.match(xml, /a\?b=1&amp;c=2/);
});

test('layout publishes complete canonical and social text metadata', () => {
  for (const token of ['rel="canonical"', 'property="og:url"', 'property="og:title"', 'property="og:description"', 'property="og:type"', 'name="twitter:card"', 'name="twitter:title"', 'name="twitter:description"']) {
    assert.ok(layout.includes(token), `Missing ${token}`);
  }
});

test('build generates sitemap after Astro and before indexing', () => {
  assert.equal(pkg.scripts.build, 'astro build && node scripts/build-seo.mjs && pagefind --site dist');
  assert.match(pkg.scripts.verify, /pnpm run build && pnpm run check:search/);
});
