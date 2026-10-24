import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { PORTUGUESE_BATCH_3, BATCH_3_IDS, portugueseChapterBatch3 } from '../src/data/pt-chapter-batch3.mjs';
import { BATCH_1_IDS } from '../src/data/pt-chapter-batch1.mjs';
import { BATCH_2_IDS } from '../src/data/pt-chapter-batch2.mjs';
import { routeAlternates } from '../src/utils/i18n.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const route = read('src/pages/pt-br/chapters/[id].astro');
const timeline = read('src/pages/pt-br/timeline/index.astro');
const home = read('src/pages/pt-br/index.astro');
const expectedSections = { 'war-of-the-spark': 11, 'new-phyrexia': 6, 'march-of-the-machine': 7, omenpaths: 10 };

function canonicalRecords(id) {
  const mdx = read(`src/content/chapters/${id}.mdx`);
  const cardBlock = mdx.match(/^cardIds:\s*\r?\n((?:^  - [^\r\n]+\r?\n?)+)/m)?.[1];
  assert.ok(cardBlock, `Missing original card inventory in ${id}`);
  const cards = cardBlock.split(/\r?\n/).filter(Boolean).map(line => line.trim().replace(/^-\s*/, ''));
  const events = [...mdx.matchAll(/<HistoricalEventReference\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
  return { cards, events };
}

test('phase 9 completes eleven distinct PT-BR chapter routes in canonical order', () => {
  assert.deepEqual(BATCH_3_IDS, ['war-of-the-spark','new-phyrexia','march-of-the-machine','omenpaths']);
  assert.deepEqual(PORTUGUESE_BATCH_3.map(chapter => chapter.number), ['08','09','10','11']);
  assert.equal(new Set(['thran', ...BATCH_1_IDS, ...BATCH_2_IDS, ...BATCH_3_IDS]).size, 11);
  assert.equal(portugueseChapterBatch3('thran'), null);
  assert.equal(portugueseChapterBatch3('omenpaths')?.number, '11');
});

test('four Portuguese narratives contain 34 substantive sections and no placeholders', () => {
  assert.equal(PORTUGUESE_BATCH_3.reduce((sum, chapter) => sum + chapter.sections.length, 0), 34);
  for (const chapter of PORTUGUESE_BATCH_3) {
    assert.equal(chapter.sections.length, expectedSections[chapter.id], chapter.id);
    assert.ok(chapter.title.length > 12 && chapter.subtitle.length > 55, chapter.id);
    assert.equal(new Set(chapter.sections.map(section => section.id)).size, chapter.sections.length);
    const paragraphs = chapter.sections.flatMap(section => section.paragraphs);
    assert.equal(paragraphs.length, chapter.sections.length * 2);
    assert.ok(paragraphs.every(p => p.length >= 180), `Truncated ${chapter.id} paragraph`);
    assert.ok(paragraphs.join(' ').split(/\s+/).length >= (chapter.id === 'new-phyrexia' ? 650 : chapter.id === 'march-of-the-machine' ? 650 : 1000), `Insufficient ${chapter.id} narrative`);
    assert.doesNotMatch(paragraphs.join(' '), /coming soon|lorem ipsum|tradução pendente/i);
  }
});

test('chapter printing inventory is owned by the canonical collection, not copied or hard-coded', () => {
  for (const chapter of PORTUGUESE_BATCH_3) {
    const { cards } = canonicalRecords(chapter.id);
    assert.equal(cards.length, ({ 'war-of-the-spark': 11, 'new-phyrexia': 10, 'march-of-the-machine': 8, omenpaths: 14 })[chapter.id], chapter.id);
    assert.equal(new Set(cards).size, cards.length, chapter.id);
    assert.ok(cards.every(id => /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)), chapter.id);
  }
  assert.match(route, /chapter\.data\.cardIds\.map/);
  assert.match(route, /chapter\.data\.cards\[index\]\.significance/);
  assert.match(route, /<HistoricalCard card=\{card\} \/>/);
  assert.doesNotMatch(read('src/data/pt-chapter-batch3.mjs'), /[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/i);
});

test('all historical event references match the English MDX records exactly', () => {
  for (const chapter of PORTUGUESE_BATCH_3) {
    const { events } = canonicalRecords(chapter.id);
    assert.equal(events.length, ({ 'war-of-the-spark': 11, 'new-phyrexia': 7, 'march-of-the-machine': 6, omenpaths: 11 })[chapter.id], chapter.id);
    assert.deepEqual([...chapter.eventIds].sort(), [...events].sort(), chapter.id);
    assert.equal(new Set(chapter.eventIds).size, chapter.eventIds.length, chapter.id);
  }
  assert.match(route, /event\.chapterId !== companion\.id/);
  assert.match(route, /withBase\(`events\/\$\{event\.id\}\/`\)/);
});

test('timeline and homepage now advertise eleven Portuguese chapter editions', () => {
  assert.match(route, /\.\.\.PORTUGUESE_BATCH_1, \.\.\.PORTUGUESE_BATCH_2, \.\.\.PORTUGUESE_BATCH_3/);
  for (const batch of ['BATCH_1_IDS','BATCH_2_IDS','BATCH_3_IDS']) {
    assert.ok(timeline.includes(`${batch}.includes(era.id)`), `${batch} missing from catalog`);
  }
  assert.match(timeline, /Onze períodos/);
  assert.match(home, /Onze períodos históricos/);
  assert.match(timeline, /hreflang="en"/);
});

test('PT-BR companion metadata does not falsely assert complete reciprocal translation', () => {
  for (const id of BATCH_3_IDS) {
    assert.deepEqual(routeAlternates(`/mtg-history/pt-br/chapters/${id}/`, 'https://devisola.github.io'), []);
  }
  assert.match(route, /locale="pt-BR"/);
  assert.match(route, /não é uma tradução integral/);
  assert.match(route, /chapter\.data\.sources\.map/);
  assert.match(route, /getEntry\('chapters', companion\.id\)/);
  assert.doesNotMatch(route, /set:html|innerHTML|client:only|hreflang="pt-BR"/);
});

test('source narratives retain key historical and causal distinctions', () => {
  const narrative = id => portugueseChapterBatch3(id).sections.flatMap(s => s.paragraphs).join(' ');
  for (const term of ['Bolas','Ravnica','Liliana','Gideon','Elderspell','Ponte Planar','Sol Imortal']) {
    assert.ok(narrative('war-of-the-spark').includes(term), `War of the Spark missing ${term}`);
  }
  for (const term of ['Elesh Norn','Realmbreaker','Melira','Karn','Elspeth','Zhalfir','Wrenn','Phyrexia']) {
    assert.ok(narrative('march-of-the-machine').includes(term), `New Phyrexia missing ${term}`);
  }
  for (const term of ['Omenpaths','Kellan','Eldraine','Ixalan','Ravnica','Thunder Junction','Loot','Jace']) {
    assert.ok(narrative('omenpaths').includes(term), `Omenpaths missing ${term}`);
  }
});
