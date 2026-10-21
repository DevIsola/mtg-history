import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkPagefindIndex } from './check-pagefind-index.mjs';
import { normalizeFullTextQuery, plainExcerpt, safeSearchResultUrl } from '../src/utils/pagefind-search.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('search query normalization preserves ordinary terms and caps input', () => {
  assert.equal(normalizeFullTextQuery('  Urza   and  Mishra  '), 'Urza and Mishra');
  assert.equal(normalizeFullTextQuery('x'.repeat(300)).length, 160);
  assert.equal(normalizeFullTextQuery(null), '');
});

test('excerpts are rendered as text instead of accepting HTML', () => {
  assert.equal(plainExcerpt('Freyalise <mark>sealed</mark> the rift'), 'Freyalise sealed the rift');
  assert.doesNotMatch(plainExcerpt('<img src=x onerror=alert(1)>Example'), /<img/);
});

test('search result routes must remain under the GitHub Pages prefix', () => {
  const base = '/mtg-history/', origin = 'https://example.org';
  assert.equal(safeSearchResultUrl('/mtg-history/chapters/thran/', base, origin), '/mtg-history/chapters/thran/');
  for (const unsafe of ['/chapters/thran/', '//evil.test/', 'https://evil.test/', '/mtg-history-other/', '/mtg-history/%2Fhack']) {
    assert.equal(safeSearchResultUrl(unsafe, base, origin), null, unsafe);
  }
});

test('build pipeline indexes static pages before link checks', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts.build, 'astro build && node scripts/build-seo.mjs && pagefind --site dist');
  assert.match(pkg.scripts.verify, /pnpm run build && pnpm run check:search && pnpm run check:links/);
  assert.equal(pkg.scripts['check:search'], 'node scripts/check-pagefind-index.mjs');
  assert.match(read('src/layouts/BaseLayout.astro'), /<main id="main-content" data-pagefind-body>/);
  const header = read('src/components/SiteHeader.astro');
  // Both language choices use the original Pagefind search routes, not another search engine.
  assert.match(header, /const search = withBase\(pt \? 'pt-br\/search\/' : 'search\/'\)/);
  assert.match(header, /class="site-header__search" href=\{search\}/);
});

test('search route provides base-aware lazy index loading, status and no-JS navigation', () => {
  const page = read('src/pages/search/index.astro');
  assert.match(page, /withBase\('pagefind\/pagefind.js'\)/);
  assert.match(page, /data-fulltext-results/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /<noscript>/);
  assert.match(page, /vite-ignore/);
  assert.match(page, /pagefind\(\)/);
  assert.doesNotMatch(page, /excerpt\.innerHTML/);
});

test('index integrity gate fails closed on absent or incomplete generated output', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'mtg-pagefind-'));
  try {
    assert.ok((await checkPagefindIndex(tmp)).length >= 3);
    await mkdir(join(tmp, 'pagefind'));
    await mkdir(join(tmp, 'search'));
    await mkdir(join(tmp, 'chapters', 'thran'), { recursive: true });
    await writeFile(join(tmp, 'pagefind', 'pagefind.js'), 'module');
    await writeFile(join(tmp, 'search', 'index.html'), '<section data-pagefind-bundle="/mtg-history/pagefind/pagefind.js"></section>');
    await writeFile(join(tmp, 'chapters', 'thran', 'index.html'), '<main id="main-content" data-pagefind-body></main>');
    assert.deepEqual(await checkPagefindIndex(tmp), ['missing build output: pagefind/fragment/']);
    await mkdir(join(tmp, 'pagefind', 'fragment'));
    assert.deepEqual(await checkPagefindIndex(tmp), ['Pagefind has no generated fragments']);
    // A misleading fragment-like file in the bundle root must not satisfy the check.
    await writeFile(join(tmp, 'pagefind', 'fragment.en_123.pf_fragment'), 'wrong directory');
    assert.deepEqual(await checkPagefindIndex(tmp), ['Pagefind has no generated fragments']);
    await writeFile(join(tmp, 'pagefind', 'fragment', 'en_123.pf_fragment'), 'fragment');
    assert.deepEqual(await checkPagefindIndex(tmp), []);
  } finally { await rm(tmp, { recursive: true, force: true }); }
});
