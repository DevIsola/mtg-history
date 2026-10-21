import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { routeAlternates, translatedSuffix, uiFor } from '../src/utils/i18n.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const pt = read('src/pages/pt-br/search/index.astro');
const en = read('src/pages/search/index.astro');
const header = read('src/components/SiteHeader.astro');
const home = read('src/pages/pt-br/index.astro');
const util = read('src/utils/pagefind-search.mjs');
const site = 'https://devisola.github.io';
const base = '/mtg-history/';

test('Pagefind search has a complete PT-BR static route and accessible search form', () => {
  assert.match(pt, /locale="pt-BR"/);
  assert.match(pt, /data-fulltext-locale="pt-BR"/);
  assert.match(pt, /data-fulltext-results/);
  assert.match(pt, /aria-live="polite"/);
  assert.match(pt, /Pesquisar o conteúdo em português/);
  assert.match(pt, /data-pagefind-ignore/);
  assert.match(pt, /<noscript>/);
  assert.doesNotMatch(pt, /set:html|innerHTML|client:only/);
});

test('Pagefind uses the same base-prefixed static bundle in both languages', () => {
  for (const src of [en, pt]) {
    assert.match(src, /withBase\('pagefind\/pagefind\.js'\)/);
    assert.match(src, /withBase\(''\)/);
    assert.match(src, /import\(\/\* @vite-ignore \*\/ bundle\)/);
    assert.match(src, /module\.options\(\{ baseUrl: base \}\)/);
    assert.match(src, /normalizeFullTextQuery/);
    assert.match(src, /plainExcerpt/);
    assert.match(src, /safeSearchResultUrl/);
  }
  const build = JSON.parse(read('package.json')).scripts.build;
  assert.equal(build, 'astro build && node scripts/build-seo.mjs && pagefind --site dist');
  assert.match(read('src/layouts/BaseLayout.astro'), /<html lang=\{locale\}>/);
  assert.match(read('src/layouts/BaseLayout.astro'), /data-pagefind-body/);
});

test('Portuguese search rejects result URLs outside translated pages', () => {
  assert.match(pt, /safeSearchResultUrl\(item\.url, base, window\.location\.origin\)/);
  assert.match(pt, /!url\.startsWith\(`\$\{base\}pt-br\/`\)/);
  assert.match(util, /url\.origin !== root\.origin/);
  assert.match(util, /url\.pathname\.startsWith\(root\.pathname\)/);
  assert.match(pt, /title\.textContent/);
  assert.match(pt, /excerpt\.textContent/);
});

test('Portuguese and English search advertise reciprocal SEO alternates only for search', () => {
  assert.equal(translatedSuffix(base + 'search/'), 'search/');
  assert.equal(translatedSuffix(base + 'pt-br/search/'), 'search/');
  assert.deepEqual(routeAlternates(base + 'search/', site), [
    { lang: 'en', href: `${site}${base}search/` },
    { lang: 'pt-BR', href: `${site}${base}pt-br/search/` },
  ]);
  for (const chapter of ['thran', 'omenpaths']) {
    assert.deepEqual(routeAlternates(`${base}pt-br/chapters/${chapter}/`, site), []);
  }
});

test('Portuguese navigation and homepage link to real search without altering English search', () => {
  assert.equal(uiFor('pt-BR').navigation[2], 'Buscar');
  assert.equal(uiFor('en').navigation[2], 'Search');
  assert.match(header, /'pt-br\/search\/'/);
  assert.match(header, /label: 'Search', href: withBase\('search\/'\)/);
  assert.match(home, /withBase\('pt-br\/search\/'\)/);
  assert.match(home, /withBase\('search\/'\)/);
});

test('Portuguese search handles query, statuses and no-JS navigation in PT-BR', () => {
  assert.match(pt, /Digite pelo menos dois caracteres/);
  assert.match(pt, /Nenhum registro encontrado em português/);
  assert.match(pt, /Pesquisando registros históricos/);
  assert.match(pt, /Exibindo \$\{rendered\} de \$\{total\}/);
  assert.match(pt, /Índice indisponível/);
  assert.match(pt, /withBase\('pt-br\/timeline\/'\)/);
  assert.match(pt, /plainExcerpt\(item\.excerpt\)/);
});
