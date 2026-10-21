import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { PORTUGUESE_BATCH_1, BATCH_1_IDS, portugueseChapter } from '../src/data/pt-chapter-batch1.mjs';
import { routeAlternates } from '../src/utils/i18n.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const page = read('src/pages/pt-br/chapters/[id].astro');
const timeline = read('src/pages/pt-br/timeline/index.astro');
const homepage = read('src/pages/pt-br/index.astro');
const expectedCards = { 'brothers-war': 11, 'ice-age': 11, weatherlight: 22 };
const expectedEvents = { 'brothers-war': 12, 'ice-age': 12, weatherlight: 21 };

function sourceEventIds(id) {
  const source = read(`src/content/chapters/${id}.mdx`);
  return [...source.matchAll(/<HistoricalEventReference\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
}

function sourceCardIds(id) {
  const source = read(`src/content/chapters/${id}.mdx`);
  const block = source.match(/^cardIds:\s*\r?\n((?:^  - [^\r\n]+\r?\n?)+)/m)?.[1];
  assert.ok(block, `Missing canonical card IDs: ${id}`);
  return block.split(/\r?\n/).filter(Boolean).map(line => line.trim().replace(/^-\s*/, ''));
}

test('phase 7 delivers exactly three distinct consecutive historical chapters', () => {
  assert.deepEqual(BATCH_1_IDS, ['brothers-war','ice-age','weatherlight']);
  assert.deepEqual(PORTUGUESE_BATCH_1.map(entry => entry.number), ['02','03','04']);
  assert.equal(portugueseChapter('thran'), null);
  assert.equal(portugueseChapter('weatherlight')?.id, 'weatherlight');
});

test('Portuguese narratives are substantial readable adaptations, not placeholders', () => {
  for (const chapter of PORTUGUESE_BATCH_1) {
    assert.ok(chapter.title.length > 12 && chapter.subtitle.length > 40);
    assert.ok(chapter.sections.length >= 8, `${chapter.id}: too few sections`);
    assert.equal(new Set(chapter.sections.map(section => section.id)).size, chapter.sections.length);
    const paragraphs = chapter.sections.flatMap(section => section.paragraphs);
    assert.ok(paragraphs.length >= 16, `${chapter.id}: too few paragraphs`);
    assert.ok(paragraphs.every(p => p.length >= 180), `${chapter.id}: truncated paragraph`);
    const words = paragraphs.join(' ').split(/\s+/).length;
    assert.ok(words >= 650, `${chapter.id}: narrative too short (${words})`);
    assert.ok(!chapter.sections.some(section => /coming soon|lorem ipsum/i.test(section.paragraphs.join(' '))));
  }
});

test('all canonical event references are linked once, with no invented identities', () => {
  for (const chapter of PORTUGUESE_BATCH_1) {
    const canonical = sourceEventIds(chapter.id);
    assert.equal(canonical.length, expectedEvents[chapter.id]);
    assert.deepEqual([...chapter.eventIds].sort(), canonical.sort(), chapter.id);
    assert.equal(new Set(chapter.eventIds).size, chapter.eventIds.length);
  }
  assert.match(page, /event\.chapterId !== companion\.id/);
  assert.match(page, /withBase\(`events\/\$\{event\.id\}\/`\)/);
});

test('card inventories remain exact and are read from the original collection', () => {
  for (const chapter of PORTUGUESE_BATCH_1) {
    const cardIds = sourceCardIds(chapter.id);
    assert.equal(cardIds.length, expectedCards[chapter.id], chapter.id);
    assert.equal(new Set(cardIds).size, cardIds.length);
  }
  assert.match(page, /chapter\.data\.cardIds\.map/);
  assert.match(page, /chapter\.data\.cards\[index\]\.significance/);
  assert.match(page, /<HistoricalCard card=\{card\} \/>/);
  assert.doesNotMatch(page, /[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/i);
});

test('readers see explicit non-parity notice and canonical source links', () => {
  assert.match(page, /não é uma tradução integral/);
  assert.match(page, /data-pt-batch-narrative/);
  assert.match(page, /chapter\.data\.sources\.map/);
  assert.match(page, /getEntry\('chapters', companion\.id\)/);
  assert.match(page, /href=\{withBase\(`chapters\/\$\{companion\.id\}\/`\)\} hreflang="en"/);
  assert.doesNotMatch(page, /hreflang="pt-BR"|rel="alternate"/);
  for (const id of BATCH_1_IDS) {
    assert.deepEqual(routeAlternates(`/mtg-history/pt-br/chapters/${id}/`, 'https://devisola.github.io'), []);
  }
});

test('timeline links four Portuguese adaptations without changing original Thran link', () => {
  assert.match(timeline, /era\.id === 'thran'/);
  assert.match(timeline, /withBase\('pt-br\/chapters\/thran\/'\)/);
  assert.match(timeline, /BATCH_1_IDS\.includes\(era\.id\)/);
  assert.match(timeline, /withBase\(`pt-br\/chapters\/\$\{era\.id\}\/`\)/);
  assert.match(timeline, /withBase\(`chapters\/\$\{era\.id\}\/`\)/);
  assert.match(homepage, /Dez períodos históricos/);
});

test('static route, progressive enhancement and catalog accessibility are preserved', () => {
  assert.match(page, /export function getStaticPaths\(\)/);
  assert.match(page, /locale="pt-BR"/);
  assert.match(page, /data-pt-batch-section/);
  assert.match(page, /aria-label="Índice da leitura"/);
  assert.match(page, /aria-labelledby="pt-batch-sources-heading"/);
  assert.match(page, /aria-labelledby="pt-batch-events-heading"/);
  assert.doesNotMatch(page, /client:load|client:only|innerHTML|set:html/);
});
