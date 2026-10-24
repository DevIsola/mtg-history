import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PORTUGUESE_ERAS, portugueseEra, normalizePortugueseQuery, matchesPortugueseQuery, portugueseCatalogStatus } from '../src/utils/pt-catalog.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('ten authored Portuguese summaries map to established historical chapters', () => {
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

test('all four translated directories attach no-JS-safe search controls to their canonical lists', () => {
  for (const [route, sourceMarker] of Object.entries({timeline:'eras.map',characters:'people.map',events:'events.map',archive:'chapters.map'})) {
    const page = read(`src/pages/pt-br/${route}/index.astro`);
    assert.ok(page.includes(sourceMarker));
    for (const marker of ['data-pt-catalog','data-pt-entry',`id="${route}"`,'setupPortugueseCatalog','hreflang="en"']) {
      assert.ok(page.includes(marker), `${route}: missing ${marker}`);
    }
    assert.ok(page.includes('em inglês'), `${route}: untranslated records must remain marked`);
  }
  assert.match(read('src/pages/pt-br/events/index.astro'), /data-pt-group/);
});

test('filter controls are progressive enhancement with semantic accessibility cues', () => {
  const component = read('src/components/PortugueseCatalogControls.astro');
  const script = read('src/utils/pt-catalog.mjs');
  for (const term of ['data-pt-controls hidden', 'data-pt-query', 'data-pt-clear','role="status"','aria-live="polite"']) {
    assert.ok(component.includes(term), term);
  }
  assert.match(script, /controls\.hidden = false/);
  assert.match(script, /group\.hidden = !group\.querySelector/);
  assert.match(script, /clear\.addEventListener\('click'/);
});
