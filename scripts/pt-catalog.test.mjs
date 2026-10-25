import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PORTUGUESE_ERAS, portugueseEra, normalizePortugueseQuery, matchesPortugueseQuery, portugueseCatalogStatus } from '../src/utils/pt-catalog.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('eleven authored Portuguese summaries map to established historical chapters', () => {
  const ids = ['thran','brothers-war','ice-age','weatherlight','otaria','mending','many-worlds','war-of-the-spark','new-phyrexia','march-of-the-machine','omenpaths'];
  assert.deepEqual(Object.keys(PORTUGUESE_ERAS), ids);
  for (const id of ids) {
    assert.ok(portugueseEra(id).name.length > 9);
    assert.ok(portugueseEra(id).summary.length > 35);
  }
  assert.throws(() => portugueseEra('unpublished'), /Unknown era/);
});

test('accent-insensitive search supports Portuguese names and whitespace', () => {
  assert.equal(normalizePortugueseQuery('  ACONTECIMENTOS  HistÓricos '), 'acontecimentos historicos');
  assert.ok(matchesPortugueseQuery('guerra   irmãos', 'A Guerra dos Irmãos'));
  assert.ok(matchesPortugueseQuery('phyrexia', 'A origem de Phyrexia'));
  assert.equal(matchesPortugueseQuery('Yawgmoth', 'Urza e Mishra'), false);
});

test('multiword matching requires all query terms regardless of word order', () => {
  assert.equal(matchesPortugueseQuery('urza mishra', 'Mishra e Urza'), true);
  assert.equal(matchesPortugueseQuery('urza yawgmoth', 'Mishra e Urza'), false);
  assert.equal(matchesPortugueseQuery('', 'anything'), true);
  assert.equal(matchesPortugueseQuery(null, null), true);
});

test('count status reports zero and rejects inconsistent totals', () => {
  assert.equal(portugueseCatalogStatus(0, 88), 'Nenhum registro encontrado.');
  assert.equal(portugueseCatalogStatus(8, 10), '8 de 10 registros exibidos.');
  assert.throws(() => portugueseCatalogStatus(12, 10), /Invalid/);
  assert.throws(() => portugueseCatalogStatus(-1, 10), /Invalid/);
});


test('complete translated era catalog preserves canonical identities and release metadata', () => {
  const translated = JSON.parse(read('src/data/pt-br/eras.json'));
  assert.deepEqual(Object.keys(translated), Object.keys(PORTUGUESE_ERAS));
  for (const [id, record] of Object.entries(translated)) {
    assert.ok(record.name && record.kicker && record.summary, id);
    assert.doesNotMatch(record.summary, /lorem ipsum|tradução pendente/i);
  }
});
test('translated directories reuse accessible progressive controls without English record detours', () => {
  for (const [component, marker] of [['TimelinePage','data-timeline-explorer'],['CharacterDirectory','data-character-directory'],['EventDirectory','historical-events']]) {
    const source = read(`src/components/pages/${component}.astro`);
    assert.ok(source.includes(marker), component);
    assert.match(source, /localeForPath\(Astro.url.pathname\)/);
    assert.match(source, /localized\('events'|localized\('characters'/);
    assert.doesNotMatch(source, /hreflang="en"|\(EN\)/);
  }
  const archive = read('src/pages/pt-br/archive/index.astro');
  for (const marker of ['archive-filters','data-archive-card','aria-live="polite"','archiveCard(canonical, locale)','card.originalUrl']) assert.ok(archive.includes(marker), marker);
  assert.match(archive, /getCollection\('chaptersPt'\)/);
});
