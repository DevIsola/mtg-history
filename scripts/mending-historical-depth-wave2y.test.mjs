import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) =>
  readFileSync(new URL('../' + path, import.meta.url), 'utf8')
    .replace(/\r\n?/g, '\n');

const chapter = read('src/content/chapters/mending.mdx');
const notes = read('docs/mending-historical-depth-wave2y.md');

const headings = [
  'Zhalfirin families beyond the phased-out homeland',
  "Jhoira's preparation beyond the Mending",
  'Radha and Venser: different capacities, shared agency',
  'Mechanics as a language of past, present, and future',
  'From the Mending to the first planeswalker cards',
];

test('five unique sections follow chronological chapter structure', () => {
  const positions = headings.map(h => {
    const label = '### ' + h;
    assert.equal(chapter.split(label).length - 1, 1, h);
    return chapter.indexOf(label);
  });

  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.ok(positions[0] > chapter.indexOf('## III. Teferi'));
  assert.ok(positions[4] > chapter.indexOf('## XV. The Mending'));
});

test('Zhalfirin diaspora and Jhoira retrospective remain distinct', () => {
  assert.match(chapter, /Femeref, Suq'Ata/);
  assert.match(chapter, /Niambi/);
  assert.match(chapter, /powerstone at the Thran Mana Rig/);
  assert.match(chapter, /later aftermath/);
  assert.match(chapter, /not the original Shivan sealing ritual/);
});

test('Radha and Venser retain distinct roles and source limitations', () => {
  assert.match(chapter, /Radha's link to rift mana/);
  assert.match(chapter, /Venser's skill with teleportation/);
  assert.match(chapter, /unresolved primary-novel question/);
  assert.match(notes, /Venser's first-walk episode remains open/);
});

test('mechanics remain distinct from fictional events', () => {
  assert.match(chapter, /flashback.*Time Spiral/s);
  assert.match(chapter, /vanishing.*Planar Chaos/s);
  assert.match(chapter, /scry.*Future Sight/s);
  assert.match(chapter, /not descriptions of literal rift-closing rituals/);
  assert.match(chapter, /first planeswalker cards appeared in \*Lorwyn\* \(2007\)/);
});

test('all canonical printings and historical event references remain exact', () => {
  const expectedIds = ["3c0145f6-4e27-49e7-9ef6-bac6fa3de26d","7fc23b2e-9124-4f88-b93e-8bfe90e6eb41","0e84fc99-4045-4518-b588-512a675f2933","1f437128-3a87-4958-97d0-3940d8761cba","6c6ef042-1a69-4b16-abae-4f436dbadbbd","213d6fb8-5624-4804-b263-51f339482754","48caf4c4-745c-4072-bf3d-1a3fa7c3bc9c","0d5e4d9a-34e1-46eb-814b-8e3bd4475b8a","9ce2c6d7-505b-490b-9c6f-b5166c9ff71d","8c6ad9c3-b5dd-46a9-8494-8b395e21aedf","670c1a05-0dd2-4535-aa7f-ed33bbe92681","ad5ba7ee-d6df-4b62-a8a1-c81e6fca392a"];
  const expectedEvents = ["origins-of-the-temporal-rifts","teferis-phasing-decision","mending-jhoira-timekeeping","radha-and-the-skyshroud-rift","mending-venser-first-walk","shivan-rift","freyalise-seals-skyshroud","windgrace-seals-urborg","mending-alternate-reality-incursion","karn-heals-tolaria","jeska-seals-zhalfir-rift","mending-yavimaya-rift-cost","mending-leshrac-deceives-jeska","bolas-and-madara-rift","jeskas-final-sacrifice","the-mending"];

  const idsNow = [...chapter.matchAll(
    /^  - ([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/gm
  )].map(m => m[1]);

  const eventsNow = [...chapter.matchAll(
    /<HistoricalEventReference id="([^"]+)"/g
  )].map(m => m[1]);

  assert.deepEqual(idsNow, expectedIds);
  assert.deepEqual(eventsNow, expectedEvents);
  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) ?? []).length, 12);
});

test('official sources remain in existing chapter bibliography', () => {
  for (const title of [
    'Return to Dominaria: Episode 6',
    'Venser',
    '27 Things You Might Not Have Known About Time Spiral Block'
  ]) {
    assert.equal(
      chapter.split('  - title: "' + title + '"').length - 1,
      1,
      title
    );
  }

  assert.match(notes, /No new event IDs, card printings, or bibliography records/);
});
