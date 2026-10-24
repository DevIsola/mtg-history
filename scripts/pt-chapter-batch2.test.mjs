import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { BATCH_2_IDS, PORTUGUESE_BATCH_2, portugueseChapterBatch2 } from '../src/data/pt-chapter-batch2.mjs';
import { BATCH_1_IDS } from '../src/data/pt-chapter-batch1.mjs';
import { routeAlternates } from '../src/utils/i18n.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const route = read('src/pages/pt-br/chapters/[id].astro');
const timeline = read('src/pages/pt-br/timeline/index.astro');
const homepage = read('src/pages/pt-br/index.astro');
const canonicalCards = { otaria: 20, mending: 12, 'many-worlds': 11 };
const canonicalEvents = { otaria: 15, mending: 16, 'many-worlds': 11 };
const chapterNumbers = ['05', '06', '07'];

function sourceCardIds(id) {
  const source = read(`src/content/chapters/${id}.mdx`);
  const block = source.match(/^cardIds:\s*\r?\n((?:^  - [^\r\n]+\r?\n?)+)/m)?.[1];
  assert.ok(block, `${id}: missing canonical printing list`);
  return block.split(/\r?\n/).filter(Boolean).map(line => line.trim().replace(/^-\s*/, ''));
}
function sourceEventIds(id) {
  const source = read(`src/content/chapters/${id}.mdx`);
  return [...source.matchAll(/<HistoricalEventReference\b[^>]*?\bid="([^"]+)"/g)].map(match => match[1]);
}

test('phase 8 covers exactly chapters 05–07 without colliding with phase 7 or Thran', () => {
  assert.deepEqual(BATCH_2_IDS, ['otaria', 'mending', 'many-worlds']);
  assert.deepEqual(PORTUGUESE_BATCH_2.map(c => c.number), chapterNumbers);
  assert.equal(new Set([...BATCH_1_IDS, ...BATCH_2_IDS, 'thran']).size, 7);
  assert.equal(portugueseChapterBatch2('thran'), null);
  assert.equal(portugueseChapterBatch2('otaria')?.number, '05');
});

test('narratives are human-readable, substantial Portuguese adaptations with nonduplicated sections', () => {
  for (const chapter of PORTUGUESE_BATCH_2) {
    assert.ok(chapter.title.length > 12 && chapter.subtitle.length > 50, chapter.id);
    assert.ok(chapter.sections.length >= 13, chapter.id);
    assert.equal(new Set(chapter.sections.map(s => s.id)).size, chapter.sections.length);
    for (const section of chapter.sections) {
      assert.ok(section.title.length > 12, `${chapter.id}: short section title`);
      assert.equal(section.paragraphs.length, 2, `${chapter.id}: paragraph coverage`);
      assert.ok(section.paragraphs.every(p => p.length >= 180), `${chapter.id}: shortened/placeholder paragraph`);
    }
    const words = chapter.sections.flatMap(s => s.paragraphs).join(' ').trim().split(/\s+/).length;
    assert.ok(words >= 1000, `${chapter.id}: insufficient narrative (${words} words)`);
    assert.doesNotMatch(chapter.sections.flatMap(s => s.paragraphs).join(' '), /lorem ipsum|coming soon|tradução pendente/i);
  }
});

test('chapter card counts are sourced from exact original printing lists and not event-scene counts', () => {
  for (const chapter of PORTUGUESE_BATCH_2) {
    const ids = sourceCardIds(chapter.id);
    assert.equal(ids.length, canonicalCards[chapter.id], chapter.id);
    assert.equal(new Set(ids).size, ids.length);
  }
  assert.match(route, /chapter\.data\.cardIds\.map/);
  assert.match(route, /chapter\.data\.cards\[index\]\.significance/);
  assert.match(route, /<HistoricalCard card=\{card\} \/>/);
});

test('all canonical historical-event IDs are carried once with no invented events', () => {
  for (const chapter of PORTUGUESE_BATCH_2) {
    const source = sourceEventIds(chapter.id);
    assert.equal(source.length, canonicalEvents[chapter.id], chapter.id);
    assert.deepEqual([...chapter.eventIds].sort(), [...source].sort(), chapter.id);
    assert.equal(new Set(chapter.eventIds).size, source.length, chapter.id);
  }
  assert.match(route, /event\.chapterId !== companion\.id/);
  assert.match(route, /withBase\(`events\/\$\{event\.id\}\/`\)/);
});

test('all six companion routes remain in the shared static route and Portuguese timeline', () => {
  assert.match(route, /\.\.\.PORTUGUESE_BATCH_1, \.\.\.PORTUGUESE_BATCH_2/);
  assert.match(timeline, /BATCH_1_IDS\.includes\(era\.id\)/);
  assert.match(timeline, /BATCH_2_IDS\.includes\(era\.id\)/);
  assert.match(homepage, /Onze períodos históricos/);
  assert.match(timeline, /Onze períodos/);
  assert.match(timeline, /withBase\(`pt-br\/chapters\/\$\{era\.id\}\/`\)/);
});

test('English records, source bibliography and accessibility are shared without false translation parity', () => {
  for (const id of BATCH_2_IDS) {
    assert.deepEqual(routeAlternates(`/mtg-history/pt-br/chapters/${id}/`, 'https://devisola.github.io'), []);
  }
  assert.match(route, /locale="pt-BR"/);
  assert.match(route, /não é uma tradução integral/);
  assert.match(route, /chapter\.data\.sources\.map/);
  assert.match(route, /getEntry\('chapters', companion\.id\)/);
  assert.match(route, /data-pt-batch-narrative/);
  assert.doesNotMatch(route, /client:only|set:html|innerHTML|hreflang="pt-BR"/);
});

test('key chronological and editorial distinctions survive the larger translation batch', () => {
  const byId = id => portugueseChapterBatch2(id).sections.flatMap(s => s.paragraphs).join(' ');
  for (const term of ['Chainer', 'Kirtar', 'Jeska', 'Phage', 'Zagorka', 'Karona', 'Karn', 'Memnarch']) {
    assert.ok(byId('otaria').includes(term), `Otaria missing ${term}`);
  }
  for (const term of ['Teferi', 'Zhalfir', 'Shiv', 'Radha', 'Venser', 'Leshrac', 'Jeska', 'Reparação']) {
    assert.ok(byId('mending').includes(term), `Mending missing ${term}`);
  }
  for (const term of ['Ravnica', 'Guildpact', 'Zendikar', 'Eldrazi', 'Avacyn', 'Helvault', 'Griselbrand']) {
    assert.ok(byId('many-worlds').includes(term), `Many Worlds missing ${term}`);
  }
});
