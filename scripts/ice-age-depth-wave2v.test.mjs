import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const chapter = readFileSync(new URL('../src/content/chapters/ice-age.mdx', import.meta.url), 'utf8');
const originalPrintings = [
  '1ee86efa-248e-4251-b734-f8ad3e8a0344',
  'b8a3cdfe-0289-474b-b9c4-07e8c6588ec5',
  'f3a9112a-6a1d-4d89-9866-189b55cd326d',
  'a1f85b2a-7836-4058-87a5-859c4311a7e4',
  '4eef9bb7-cd3c-422e-a93b-90d98684675a',
  '60ffbb40-13c1-4d01-9421-95b2410d0d3b',
  '4d3cafdd-a03b-4b08-b9c1-c776f8450d3a',
  'e0769fc7-50b5-4b49-8aff-af04536288fb',
  '87b71b08-668c-4b32-8243-8def1a9acf26',
  '92b0be6d-9183-4938-b7a1-ae7f04ba78a0',
  '48eac047-f888-49c7-aa7e-339f900f558f',
];
const sectionTitles = [
  'Penregon: defending a city without repeating the war',
  'Icatia and Vodalia: different kinds of institutional breakdown',
  'Spores, thrulls, and the limits of game mechanics as evidence',
  'Jodah and Jaya: cooperation required political work',
];

function bodyOf(title) {
  const start = chapter.indexOf(`### ${title}`);
  assert.ok(start > 0, `missing section: ${title}`);
  assert.equal(chapter.split(`### ${title}`).length, 2, `duplicate section: ${title}`);
  const next = chapter.indexOf('\n## ', start + title.length + 4);
  return chapter.slice(start, next < 0 ? undefined : next);
}

test('one exact Wizards retrospective is newly cited, with original chapter sources retained', () => {
  const [frontmatter] = chapter.slice(4).split('\n---');
  const article = 'https://magic.wizards.com/en/news/making-magic/the-history-of-tokens-part-1';
  assert.equal(frontmatter.split(article).length, 2);
  assert.match(frontmatter, /title: "The History of Tokens, Part 1"\s+kind: official/);
  for (const title of ["The Gathering Dark", 'Faction Packed', 'The Eternal Ice', 'The Shattered Alliance'])
    assert.ok(frontmatter.includes(`title: "${title}"`), `lost existing bibliography item: ${title}`);
});

test('four additions appear in their actual historical narrative locations without duplicating headings', () => {
  for (const title of sectionTitles) bodyOf(title);
  const loc = sectionTitles.map((title) => chapter.indexOf(`### ${title}`));
  assert.ok(loc.every((at, i) => i === 0 || at > loc[i - 1]));
  assert.ok(loc[0] < chapter.indexOf('## III. Jodah and the Preservation of Knowledge'));
  assert.ok(loc[1] > chapter.indexOf('## IV. The Decline of Sarpadia'));
  assert.ok(loc[2] < chapter.indexOf('## V. The Frozen Kingdoms'));
  assert.ok(loc[3] < chapter.indexOf('## VII. Freyalise and the World Spell'));
});

test('historical and publication chronologies stay distinct with bounded citations', () => {
  assert.match(bodyOf(sectionTitles[0]), /69 AR/);
  assert.match(bodyOf(sectionTitles[0]), /one postwar city/);
  assert.match(bodyOf(sectionTitles[1]), /Farrelites/);
  assert.match(bodyOf(sectionTitles[1]), /homarids/);
  assert.match(bodyOf(sectionTitles[1]), /does not date/);
  assert.match(bodyOf(sectionTitles[2]), /spore counters/);
  assert.match(bodyOf(sectionTitles[2]), /Breeding Pit/);
  assert.match(bodyOf(sectionTitles[2]), /gameplay abstraction/);
  assert.match(bodyOf(sectionTitles[3]), /2022 retrospective/);
  assert.match(bodyOf(sectionTitles[3]), /does not specify an exact day/);
  assert.match(chapter, /storyPeriod: "64–2934 AR"/);
});

test('eleven exact chapter printings and contextual image uses remain intact', () => {
  const frontmatter = chapter.split('---')[1];
  const block = frontmatter.split('\ncardIds:')[1]?.split('\ncards:')[0];
  assert.ok(block);
  assert.deepEqual([...block.matchAll(/^  - ([a-f0-9-]{36})$/gm)].map((match) => match[1]), originalPrintings);
  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) ?? []).length, 11);
});

test('all previously curated Ice Age events and character identities remain linked', () => {
  for (const id of [
    'talite-siege-of-penregon', 'jodah-preserves-magic', 'dark-conclave-usurpation',
    'dark-ith-freed', 'sarpadian-factions-fracture', 'thrull-uprising',
    'sarpadia-thelon-thallids', 'sarpadia-endrek-breeding',
    'rise-of-lim-dul', 'alliance-against-lim-dul', 'world-spell', 'ice-age-shard-dissolves',
  ]) assert.ok(chapter.includes(`<HistoricalEventReference id="${id}" />`), id);
  for (const id of ['kayla', 'tawnos', 'jodah', 'jaya', 'lim-dul', 'freyalise']) {
    assert.ok(chapter.includes(`id="${id}"`), `lost character reference: ${id}`);
  }
  assert.ok(chapter.includes('not a literal depiction'));
});
