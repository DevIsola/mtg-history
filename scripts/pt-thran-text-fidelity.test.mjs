import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const page = read('src/pages/pt-br/chapters/thran/index.astro');

const editorialSections = [
  'antes-dos-irmaos', 'civilizacao', 'yawgmoth', 'phyrexia', 'queda',
  'rebbec', 'glacian', 'publicacoes', 'intocaveis', 'medicina', 'dyfed',
  'guerra', 'pedras',
];
const expansions = [...page.matchAll(
  /<div class="chapter-pt-translation-depth" data-pt-depth="([a-z-]+)">([\s\S]*?)<\/div>/g,
)];

test('all thirteen historical sections have substantial original Portuguese narrative expansions', () => {
  assert.equal(expansions.length, editorialSections.length);
  assert.deepEqual(expansions.map(([, id]) => id), editorialSections);
  for (const [, id, body] of expansions) {
    assert.equal((body.match(/<p>/g) ?? []).length, 2, `${id}: prose paragraphs`);
    assert.ok(body.length >= 900, `${id}: insufficient narrative depth`);
    assert.doesNotMatch(body, /\[(?:TODO|TBD|placeholder)\]|lorem ipsum/i, `${id}: incomplete content`);
  }
});

test('translated expansions retain editorial structure without confusing card headings', () => {
  assert.equal((page.match(/<section id="[a-z-]+">\s*<h2>/g) ?? []).length, 13);
  assert.equal((page.match(/\s<h3>/g) ?? []).length, 11);
  assert.equal((page.match(/<HistoricalMoment\b/g) ?? []).length, 6);
  for (const id of editorialSections) {
    assert.equal((page.match(new RegExp(`<section id="${id}">`, 'g')) ?? []).length, 1, id);
  }
});

test('source, card printing and historic event references are unchanged', () => {
  assert.match(page, /getEntry\('chapters', 'thran'\)/);
  assert.match(page, /chapter\.data\.sources\.map/);
  for (let i = 0; i < 6; i++) {
    assert.equal((page.match(new RegExp(`cardId=\\{chapter\\.data\\.cardIds\\[${i}\\]\\}`, 'g')) ?? []).length, 1);
  }
  assert.equal((page.match(/withBase\('events\/[^']+'\)/g) ?? []).length, 9);
  assert.doesNotMatch(page, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});

test('textual expansion is not misrepresented as editorially certified full translation', () => {
  assert.match(page, /Versão condensada, não tradução integral/);
  assert.match(page, /href=\{withBase\('chapters\/thran\/'\)\} hreflang="en"/);
  assert.doesNotMatch(page, /<link rel="alternate"|hreflang="pt-BR"/);
});

test('translated terminology keeps essential chronology and evidentiary distinctions', () => {
  const compact = expansions.map(([, , body]) => body).join('\n');
  for (const phrase of ['Pyrulea', 'Phyrexia', 'Intocáveis', 'Glacian', 'Yawgmoth', 'Rebbec', 'Koilos', 'Urza', 'Mishra', 'pedras de poder']) {
    assert.ok(compact.includes(phrase), `Missing key context: ${phrase}`);
  }
  assert.ok(compact.includes('não equivale a destruir'), 'Containment must not imply Phyrexia was destroyed');
  assert.ok(compact.includes('não foi seu criador original') || compact.includes('Atribuir a ele sua criação apagaria'), 'Yawgmoth did not originally create Phyrexia');
});
