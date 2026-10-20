import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const chapter = readFileSync(new URL('../src/content/chapters/thran.mdx', import.meta.url), 'utf8').replace(/\r\n?/g, '\n');
const titles = [
  'Architecture of Ascension: power made visible',
  'Pyrulea: an earlier glimpse of planeswalking',
  'Pyrulea on a card is a different historical moment',
  'One inventor, two traditions of artifice',
];

function chapterPosition(heading) {
  return chapter.indexOf(`### ${heading}`);
}

test('new historical-depth sections are unique and situated in the original narrative', () => {
  for (const heading of titles) {
    assert.ok(chapterPosition(heading) > 0, `${heading} is missing`);
    assert.equal(chapter.split(`### ${heading}`).length - 1, 1, `${heading} is duplicated`);
  }
  assert.ok(chapter.indexOf('## II. The Civilization of Powerstones') < chapterPosition(titles[0]));
  assert.ok(chapterPosition(titles[0]) < chapter.indexOf('## III. The Arrival of Yawgmoth'));
  assert.ok(chapter.indexOf('## XI. Dyfed and the Gate Beyond Dominaria') < chapterPosition(titles[1]));
  assert.ok(chapterPosition(titles[1]) < chapterPosition(titles[2]));
  assert.ok(chapterPosition(titles[2]) < chapter.indexOf('## XII. The War for Halcyon'));
  assert.ok(chapter.indexOf('## XIII. The Two Stones That Outlived an Empire') < chapterPosition(titles[3]));
});

test('Pyrulea, its later battle card and Phyrexia are historically separate', () => {
  assert.match(chapter, /Pyrulea.*forest.*inside of a sphere/s);
  assert.match(chapter, /Dyfed.*Yawgmoth.*Pyrulea/s);
  assert.match(chapter, /two different story periods/);
  assert.match(chapter, /not a curated card in this chapter/);
  assert.match(chapter, /did not create the original plane of Phyrexia/);
});

test('official source additions are exact and appropriately limited', () => {
  assert.match(chapter, /title: "Choosing Your Battles, Part 3"\n    kind: official\n    url: "https:\/\/magic\.wizards\.com\/en\/news\/making-magic\/choosing-your-battles-part-3"/);
  assert.match(chapter, /The Known Multiverse/);
  assert.match(chapter, /The Legendary Characters of Commander Legends, Part 1/);
  assert.match(chapter, /The Legendary Characters of Commander Legends, Part 2/);
  assert.match(chapter, /editorial interpretation of the setting/);
  assert.match(chapter, /not a claim that the original architects/);
  assert.match(chapter, /supply an exact AR date/);
});

test('all six exact Thran printings and curated scene references remain unchanged', () => {
  const metadata = chapter.split('---')[1];
  const cards = metadata.split('cardIds:')[1].split('\ncards:')[0];
  const ids = [...cards.matchAll(/  - ([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})/g)].map((m) => m[1]);
  assert.deepEqual(ids, [
    'a736df42-18e9-4259-b0b8-54d21143e72e',
    '8690cbcc-f8fd-41f7-9e28-e61c12b04014',
    '46975250-950f-4f5d-a7c5-f61aec8e40ad',
    '2c76f7e0-37e7-4e87-93a3-a25ba0674645',
    '3f0c9dee-fab5-4522-9821-343f84b0c8ab',
    '02aea379-b444-46a3-82f4-3038f698d4f4',
  ]);
  const cardMoments = [...chapter.matchAll(/<HistoricalMoment cardId=\{frontmatter\.cardIds\[(\d+)\]\}/g)].map((m) => Number(m[1]));
  assert.deepEqual(cardMoments, [0, 1, 2, 3, 4, 5]);
  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) ?? []).length, 6);
});

test('existing event references remain unique and no unreviewed event is invented', () => {
  const references = [...chapter.matchAll(/<HistoricalEventReference id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(references.length, new Set(references).size);
  for (const required of ['powerstone-revolution', 'thran-dyfed-portal', 'thran-stones-rediscovered']) {
    assert.ok(references.includes(required), `original event link missing: ${required}`);
  }
  assert.doesNotMatch(chapter, /<HistoricalEventReference id="thran-pyrulea/);
});
