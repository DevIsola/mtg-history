import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const chapter = readFileSync(new URL('../src/content/chapters/otaria.mdx', import.meta.url), 'utf8').replace(/\r\n?/g, '\n');
const cards = [
  '3cbaad4f-fb66-4e56-b383-32f55552c8b2',
  'ee88c776-85f1-4beb-a814-f706f5c4f341',
  '40342b11-1005-4ccc-bef4-9ea4c640b048',
  '1cf96a59-8b7d-4a5b-adfd-17eeedd95db5',
  '314d5e89-55f7-42b4-af19-d4d0f499a265',
  'a410b933-99d0-4383-b54b-4839a76eb6fe',
  '814245de-6105-43ef-acbf-d12d304b6331',
  'de53d083-251e-42a4-9e2e-c2978c80615b',
  '9e9a1276-5ad5-44ee-83e5-2d1ab728946e',
  '4dcdcad5-e4fb-480e-984f-1ac5cdc986b9',
  '2b934c78-258e-4b1e-9783-ec9f734e8776',
  '82db4a41-03e8-4f0c-946c-a98fc5c9f7c8',
  '014af391-3b4a-4aab-a3e9-f60e61016985',
  '641a3bae-9146-4e70-862a-86a56f7c3816',
  'b5ddad46-5e2e-43c9-8c91-7aca6ca23562',
  '97ab4974-d0a4-4033-b150-8928b46dc626',
  '48caf4c4-745c-4072-bf3d-1a3fa7c3bc9c',
  'dcd48c28-bfa3-4eca-8e1a-f72d785b2ab9',
  'e518750f-492d-4575-b4ee-c80c1f8e0a58',
  'ed4cc273-adc3-4f46-9743-134b552d1d56',
];
const eventIds = [
  'mirari-discovery', 'otaria-kirtar-and-the-order', 'mirari-changes-hands',
  'otaria-skellums-dementia-training', 'chainer-downfall', 'otaria-balthors-two-lives',
  'jeska-wounded', 'miraris-wake', 'jeska-becomes-phage', 'akroma-created',
  'otaria-nivea-and-akroma', 'birth-of-karona', 'otaria-zagorkas-convergence',
  'jeska-spark', 'mirari-aftermath',
];
const additions = [
  ['From marquee artifact to historical catalyst', /Odyssey.*marquee card/s, /copy instant and sorcery spells/, /how the story was developed/],
  ['A flooded empire was more than a change of artifact owner', /Aboshan/, /Laquatus/, /does \*\*not\*\* claim/],
  ['The black-centered set and the cost of Cabal patronage', /Vendetta/, /black cards/, /publication decision/],
  ['A design contrast that mirrors an irreconcilable vendetta', /Ixidor/, /Phage/, /character and card design/],
  ["Karona's collapse was a crisis of belief as well as power", /Sash and Waistcoat/, /Zagorka died/, /not\*\* a restoration/],
];

test('two distinct official design articles are cited verbatim in the existing Otaria bibliography', () => {
  const frontmatter = chapter.split('---')[1];
  const expected = [
    ['Stories from Dominaria, Part 3', 'https://magic.wizards.com/en/news/making-magic/stories-dominaria-part-3-2018-04-30'],
    ['Make It Black', 'https://magic.wizards.com/en/news/making-magic/make-it-black-2002-01-14'],
  ];
  for (const [title, url] of expected) {
    const pattern = `  - title: "${title}"\n    kind: official\n    url: "${url}"`;
    assert.equal(frontmatter.split(pattern).length, 2, `${title}: citation missing or repeated`);
  }
  for (const book of ['Odyssey', "Chainer's Torment", 'Judgment', 'Onslaught', 'Legions', 'Scourge']) {
    assert.ok(frontmatter.includes(`  - title: "${book}"\n    kind: book`), `${book}: book reference missing`);
  }
});

test('five unique editorial additions each retain bounded supporting context', () => {
  for (const [heading, ...patterns] of additions) {
    assert.equal(chapter.split(`### ${heading}\n`).length, 2, `${heading} must appear once`);
    const at = chapter.indexOf(`### ${heading}\n`);
    const after = chapter.slice(at + heading.length + 5);
    const next = after.search(/\n#{2,3} /);
    const passage = next === -1 ? after : after.slice(0, next);
    assert.ok(passage.length >= 350, `${heading}: passage too short`);
    for (const pattern of patterns) assert.match(passage, pattern, heading);
  }
});

test('sections follow the established chronology rather than moving characters between arcs', () => {
  const placements = [
    ["## II. The Mirari's Discovery and Hidden Origin", 'From marquee artifact to historical catalyst', '## III. The Cabal: Spectacle, Commerce, and Control'],
    ['## IV. A Prize That Moved Between Rival Powers', 'A flooded empire was more than a change of artifact owner', '## V. Kamahl and Chainer: Friendship Across the Pits'],
    ["## VI. Chainer's Rise and the Nightmare Catastrophe", 'The black-centered set and the cost of Cabal patronage', "## VII. The Mirari Sword and Jeska's Wound"],
    ['## X. Ixidor, Nivea, and a Vengeful Creation', 'A design contrast that mirrors an irreconcilable vendetta', '## XI. Armies, Devotion, and the Threat to Otaria'],
    ['## XII. A Single Blow and the Birth of Karona', "Karona's collapse was a crisis of belief as well as power", "## XIII. The False God's Fall and Jeska's Third Rebirth"],
  ];
  for (const [first, middle, last] of placements) {
    assert.ok(chapter.indexOf(first) < chapter.indexOf(`### ${middle}`), middle);
    assert.ok(chapter.indexOf(`### ${middle}`) < chapter.indexOf(last), middle);
  }
  assert.match(chapter, /storyPeriod: "c\. 4305 AR onward"/);
  assert.match(chapter, /exact dating of later Onslaught events is disputed/);
});

test('all twenty exact chapter printing UUIDs and historical moments remain intact', () => {
  const frontmatter = chapter.split('---')[1];
  const block = frontmatter.split('\ncardIds:')[1]?.split('\ncards:')[0];
  assert.ok(block, 'missing ordered canonical printing list');
  assert.deepEqual([...block.matchAll(/^  - ([0-9a-f-]{36})$/gm)].map((m) => m[1]), cards);
  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) ?? []).length, 20);
});

test('existing historical event links are retained without duplicates', () => {
  const found = [...chapter.matchAll(/<HistoricalEventReference id="([^"]+)"\s*\/>/g)].map((m) => m[1]);
  assert.deepEqual(found.slice().sort(), eventIds.slice().sort());
  assert.equal(new Set(found).size, 15);
  assert.match(chapter, /<CharacterLink id="aboshan">Aboshan<\/CharacterLink>/);
  assert.match(chapter, /<CharacterLink id="chainer">Chainer<\/CharacterLink>/);
});

test('design evidence cannot be mistaken for a novel scene or exact in-world date', () => {
  assert.match(chapter, /This is evidence about \*\*how the story was developed\*\*/);
  assert.match(chapter, /documented \*\*publication decision\*\*/);
  assert.match(chapter, /printed keyword or combat rule should not be mistaken/);
  assert.match(chapter, /independently attested date/);
  assert.match(chapter, /\*\*not\*\* a restoration of all three contributors/);
  assert.doesNotMatch(chapter, /Akroma and Zagorka survived Karona/);
});
