import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { routeAlternates, translatedSuffix } from '../src/utils/i18n.mjs';

const read = (file) => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const page = read('src/pages/pt-br/chapters/thran/index.astro');
const timeline = read('src/pages/pt-br/timeline/index.astro');
const route = '/mtg-history/pt-br/chapters/thran/';

test('Thran Portuguese companion is a genuine static route with an explicit condensed-edition disclaimer', () => {
  assert.match(page, /<BaseLayout\s+locale="pt-BR"/);
  assert.match(page, /data-thran-pt-companion/);
  assert.match(page, /Versão condensada, não tradução integral/);
  assert.match(page, /disponíveis em inglês \(EN\)/);
  assert.match(page, /href=\{withBase\('chapters\/thran\/'\)\}\s+hreflang="en"/);
  assert.match(page, /href=\{withBase\('pt-br\/timeline\/'\)\}/);
  assert.doesNotMatch(page, /getStaticPaths|\bredirect\(/);
});

test('Thran companion preserves six canonical printing references in original order', () => {
  assert.match(page, /getEntry\('chapters', 'thran'\)/);
  assert.match(page, /chapter\.data\.sources\.map/);
  assert.equal((page.match(/<HistoricalMoment\b/g) ?? []).length, 6);
  for (let i = 0; i < 6; i++) {
    assert.equal((page.match(new RegExp(`cardId=\\{chapter\\.data\\.cardIds\\[${i}\\]\\}`, 'g')) ?? []).length, 1, `printing ${i}`);
  }
  assert.doesNotMatch(page, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});

test('Thran reading companion provides thirteen navigable sections with clear historic distinctions', () => {
  const ids = [...page.matchAll(/<section id="([a-z-]+)">\s*<h2>/g)].map(m => m[1]);
  assert.equal(ids.length, 13);
  assert.equal(new Set(ids).size, 13);
  for (const id of ids) assert.ok(page.includes(`id: '${id}'`), `missing TOC ${id}`);
  for (const term of ['−5000 AR', 'Dyfed', 'Pyrulea', 'Intocáveis', 'Gix', 'Glacian', 'Rebbec', 'Yawgmoth', 'phthisis', 'Koilos', 'contenção']) {
    assert.ok(page.includes(term), `missing editorial context ${term}`);
  }
});

test('Portuguese Thran companion does not claim to be a full translation or a reciprocal equivalent', () => {
  assert.equal(translatedSuffix(route), null);
  assert.equal(translatedSuffix('/mtg-history/chapters/thran/'), null);
  assert.deepEqual(routeAlternates(route, 'https://devisola.github.io'), []);
  assert.doesNotMatch(page, /rel="alternate"|hreflang="pt-BR"/);
});

test('Portuguese timeline offers a distinct companion link without replacing the canonical English chapter', () => {
  assert.match(timeline, /era\.id === 'thran'/);
  assert.match(timeline, /withBase\('pt-br\/chapters\/thran\/'\)/);
  assert.match(timeline, /versão condensada em português/);
  assert.match(timeline, /withBase\(`chapters\/\$\{era\.id\}\/`\)/);
  assert.match(timeline, /hreflang="en"/);
});
