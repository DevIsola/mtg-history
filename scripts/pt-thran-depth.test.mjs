import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const english = read('src/content/chapters/thran.mdx');
const portuguese = read('src/pages/pt-br/chapters/thran/index.astro');

// This is an editorial outline gate, not a word-by-word translation certificate.
const expectedEnglishHeadings = [
  'I. Before the Brothers',
  'II. The Civilization of Powerstones',
  'Architecture of Ascension: power made visible',
  'III. The Arrival of Yawgmoth',
  'How a physician became a political authority',
  'An inventor was not exempt from the danger he helped create',
  'IV. The Discovery of Phyrexia',
  'V. The Fall of the Thran Empire',
  'A civil war with more than two sides',
  "VI. Rebbec's Final Decision",
  'Sealing the gate was containment, not restoration',
  'VII. The Legacy of Glacian',
  'The implantation was a separate Thran event',
  'Why the two powerstone halves mattered later',
  'VIII. How Magic Told This Story',
  'IX. Beneath Halcyon: The People the Empire Abandoned',
  'X. Medicine, Public Safety, and the Capture of the State',
  'XI. Dyfed and the Gate Beyond Dominaria',
  'Pyrulea: an earlier glimpse of planeswalking',
  'Pyrulea on a card is a different historical moment',
  'XII. The War for Halcyon',
  'Reading Thran history backward without distorting it',
  'XIII. The Two Stones That Outlived an Empire',
  'One inventor, two traditions of artifice',
];

function englishOutline(source) {
  return [...source.matchAll(/^(#{2,3}) (.+)$/gm)].map(([, hashes, heading]) => ({ level: hashes.length, heading }));
}
function portugueseOutline(source) {
  const article = source.match(/<article class="chapter-prose" data-thran-pt-companion>([\s\S]*?)<\/article>/)?.[1];
  assert.ok(article, 'Portuguese narrative article missing');
  return [...article.matchAll(/<h([23])>([^<]+)<\/h\1>/g)].map(([, level, heading]) => ({ level: Number(level), heading }));
}

const expectedEventIds = [
  'powerstone-revolution',
  'rise-of-yawgmoth',
  'thran-glacian-stones-implanted',
  'rebbec-seals-phyrexia',
  'thran-untouchables-uprising',
  'thran-phthisis-and-power',
  'thran-dyfed-portal',
  'thran-war-for-halcyon',
  'thran-stones-rediscovered',
];

test('English Thran editorial outline is pinned to the reviewed twenty-four headings', () => {
  assert.deepEqual(englishOutline(english).map(x => x.heading), expectedEnglishHeadings);
  assert.equal(englishOutline(english).filter(x => x.level === 2).length, 13);
  assert.equal(englishOutline(english).filter(x => x.level === 3).length, 11);
});

test('Portuguese reading edition contains matching editorial heading levels in original order', () => {
  const en = englishOutline(english), pt = portugueseOutline(portuguese);
  assert.equal(pt.length, en.length, 'Some English editorial sections have no Portuguese counterpart');
  assert.deepEqual(pt.map(x => x.level), en.map(x => x.level));
  assert.equal(new Set(pt.map(x => x.heading)).size, 24, 'Portuguese headings must be distinct');
  assert.ok(pt.every(x => x.heading.trim().length >= 16));
});

test('all nine canonical event anchors remain available as explicitly English record links', () => {
  const enIds = [...english.matchAll(/<HistoricalEventReference\s+id="([^"]+)"/g)].map(x => x[1]);
  const ptLinks = [...portuguese.matchAll(/href=\{withBase\('events\/([a-z0-9-]+)\/'\)\}\s+hreflang="en"/g)].map(x => x[1]);
  assert.deepEqual(enIds, expectedEventIds);
  assert.deepEqual([...ptLinks].sort(), [...enIds].sort());
  assert.equal(new Set(ptLinks).size, 9);
});

test('six exact canonical Thran illustrations and the bibliography are reused without copied printing IDs', () => {
  assert.equal((portuguese.match(/<HistoricalMoment\b/g) ?? []).length, 6);
  for (let i = 0; i < 6; i++) {
    assert.equal((portuguese.match(new RegExp(`cardId=\\{chapter\\.data\\.cardIds\\[${i}\\]\\}`, 'g')) ?? []).length, 1);
  }
  assert.match(portuguese, /chapter\.data\.sources\.map/);
  assert.doesNotMatch(portuguese, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});

test('editorial subsection coverage must not be mislabeled as a complete translation', () => {
  assert.match(portuguese, /Versão condensada, não tradução integral/);
  assert.match(portuguese, /href=\{withBase\('chapters\/thran\/'\)\}\s+hreflang="en"/);
  assert.doesNotMatch(portuguese, /rel="alternate"|hreflang="pt-BR"/);
  assert.match(portuguese, /interpretação editorial do cenário/);
  assert.match(portuguese, /Invasion of Pyrulea/);
  assert.match(portuguese, /continuidade material sem compreensão integral/);
});
