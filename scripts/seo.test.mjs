import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSeo } from './build-seo.mjs';
import { test } from 'node:test';
import { canonicalUrl, sitemapPaths, sitemapXml } from '../src/utils/seo.mjs';
import { routeAlternates } from '../src/utils/i18n.mjs';

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


test('social preview is a nontrivial, exact-size PNG in public assets', () => {
  const bytes = readFileSync(new URL('../public/social-preview.png', import.meta.url));
  assert.ok(bytes.length > 20_000);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 1200);
  assert.equal(bytes.readUInt32BE(20), 630);
});

test('shared social metadata uses the deployed base and a large image card', () => {
  assert.match(layout, /new URL\(withBase\('social-preview\.png'\), Astro\.site\)\.href/);
  assert.match(layout, /property="og:image" content=\{socialImage\}/);
  assert.match(layout, /property="og:image:width" content="1200"/);
  assert.match(layout, /property="og:image:height" content="630"/);
  assert.match(layout, /property="og:image:alt" content=\{socialImageAlt\}/);
  assert.match(layout, /name="twitter:card" content="summary_large_image"/);
  assert.match(layout, /name="twitter:image" content=\{socialImage\}/);
});

test('SEO build fails on missing, invalid or unreferenced social imagery', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mtg-social-preview-'));
  const imageUrl = 'https://devisola.github.io/mtg-history/social-preview.png';
  try {
    const routes = ['/', '/pt-br/', '/chapters/thran/', '/pt-br/chapters/thran/', '/characters/yawgmoth/', '/pt-br/characters/yawgmoth/'];
    for (const path of routes) {
      const folder = join(dir, path.slice(1));
      await mkdir(folder, { recursive: true });
      const canonical = `https://devisola.github.io/mtg-history${path}`;
      const language = path.startsWith('/pt-br/') ? 'pt-BR' : 'en';
      const alternates = routeAlternates('/mtg-history' + path, 'https://devisola.github.io');
      const head = `<html lang="${language}">` + alternates.map(
        ({ lang, href }) => `<link rel="alternate" hreflang="${lang}" href="${href}" />`,
      ).join('');
      await writeFile(join(folder, 'index.html'), `${head}<link rel="canonical" href="${canonical}" /><meta property="og:image" content="${imageUrl}" /><meta name="twitter:image" content="${imageUrl}" />`);
    }
    assert.throws(() => buildSeo(dir), /Missing social-preview/);
    await writeFile(join(dir, 'social-preview.png'), 'not an image');
    assert.throws(() => buildSeo(dir), /1200x630 PNG/);
    await copyFile(new URL('../public/social-preview.png', import.meta.url), join(dir, 'social-preview.png'));
    buildSeo(dir);
    assert.match(readFileSync(join(dir, 'sitemap.xml'), 'utf8'), /chapters\/thran/);
    assert.match(readFileSync(join(dir, 'sitemap.xml'), 'utf8'), /pt-br\//);
    const ptFile = join(dir, 'pt-br', 'index.html');
    const ptHtml = readFileSync(ptFile, 'utf8');
    await writeFile(ptFile, ptHtml.replace('<html lang="pt-BR">', '<html lang="en">'));
    assert.throws(() => buildSeo(dir), /Incorrect homepage language: \/pt-br\//);
    await writeFile(ptFile, ptHtml.replace('hreflang="en"', 'hreflang="fr"'));
    assert.throws(() => buildSeo(dir), /Missing homepage hreflang en: \/pt-br\//);
    await writeFile(ptFile, ptHtml);
    const chapterFile = join(dir, 'chapters', 'thran', 'index.html');
    const chapterHtml = readFileSync(chapterFile, 'utf8');
    await writeFile(chapterFile, chapterHtml.replace(/<meta (?:property="og:image"|name="twitter:image")[^>]+>/g, ''));
    assert.throws(() => buildSeo(dir), /Missing or mismatched social preview metadata: \/chapters\/thran\//);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
