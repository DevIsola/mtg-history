import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8').replace(/\r\n?/g, '\n');
const chapter = read('src/content/chapters/weatherlight.mdx');
const doc = read('docs/weatherlight-depth-wave2w.md');
const headings = [
  'Karn and the Sliver Queen: recovering the Legacy without conquest',
  "Sisay's recruitment and Gerrard's right to refuse",
  "Hanna's craft and the difficult return to Tolaria",
  'Rath was engineered to become a battlefield on Dominaria',
  'The abandoned outline is not an alternate event timeline',
];
const printings = [
  '63f5498b-bb12-48ec-811b-b52e45ffddaf',
  '5a293c45-1e73-4527-be2f-2dcd5c47b610',
  '08bdd66e-9ca1-456e-a61c-7c96cf6f7c56',
  'ccca800f-e850-4bec-95d0-70280b51b7a7',
  '385d8691-b9bd-4b4d-86db-7a7cc6181104',
  '83a4e48d-6452-4245-bdad-63fe3263550e',
  '2db7a0e6-eea5-4fa6-ac14-401411b106cc',
  '88a9b76d-6ce1-40d4-bc04-7ae6237f5eaf',
  '6d1682dd-5a99-4bee-a2c2-c8735047e1a9',
  '91971e19-61ce-45ac-b700-9ffca5091a27',
  '9c1624f7-8275-46d3-ab7e-7b162e27593f',
  'e5c87c93-8cf4-4d1a-9bb8-349600da55bc',
  '66b950d9-8fef-4deb-b51b-26edb90abc56',
  'dd8ad3aa-3225-45ae-8343-5991f5b52269',
  '8f244716-78ab-46f5-b6e9-fc1e6db28052',
  '84e19975-e3e1-453b-b902-a1b1fc1d8504',
  '2a1bfefd-dae8-49e9-9d56-cc852e3dc93b',
  'ec79e35f-9e78-462d-8b71-4f044e2eff90',
  '99509da7-3e11-4c38-804b-286ce572f36e',
  '0d6cc98b-b376-40af-8308-198bab00b2b1',
  '6aa5cc65-f8f1-4f6f-8b4e-2fedccbda684',
  '4ba8325a-1203-4125-9111-94d9e2b1f14b',
];

test('five editorial subsections exist exactly once in chapter order', () => {
  const positions = headings.map((heading) => {
    const label = `### ${heading}`;
    assert.equal(chapter.split(label).length - 1, 1, heading);
    return chapter.indexOf(label);
  });
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.ok(positions[0] < chapter.indexOf('## III. Sisay'));
  assert.ok(positions[3] < chapter.indexOf('## V. The Stronghold'));
  assert.ok(positions[4] > chapter.indexOf('## XIII. How Magic Told This Story'));
});

test('Karn, Sisay, Hanna and Ertai accounts retain concrete, supported distinctions', () => {
  assert.match(chapter, /Sliver Queen/);
  assert.match(chapter, /Sisay<\/CharacterLink> eventually recovered Karn/);
  assert.match(chapter, /without initially telling him/);
  assert.match(chapter, /Rofellos<\/CharacterLink> died/);
  assert.match(chapter, /Barrin<\/CharacterLink>, trained her in spellcasting/);
  assert.match(chapter, /Barrin sent <CharacterLink id="ertai">Ertai<\/CharacterLink>/);
  assert.match(chapter, /not.*later activation of the Legacy Weapon/s);
});

test('Rath is an invasion structure and the Overlay remains a separate later event', () => {
  assert.match(chapter, /material taken from other planes/);
  assert.match(chapter, /flowstone production/);
  assert.match(chapter, /separate events/);
  assert.match(chapter, /later Rathi Overlay/);
});

test('abandoned plot concepts cannot be counted as canonical in-world events', () => {
  assert.match(chapter, /unproduced outline/);
  assert.match(chapter, /older Ertai/);
  assert.match(chapter, /Hourglass Pendant/);
  assert.match(chapter, /not events that occurred in the canonical storyline/);
  assert.match(chapter, /not be inserted into the historical event directory/);
  assert.match(doc, /not canon/);
});

test('original twenty-two printing IDs and existing source and event links remain stable', () => {
  const block = chapter.split('\ncardIds:\n')[1]?.split('\ncards:')[0];
  assert.ok(block);
  assert.deepEqual([...block.matchAll(/^  - ([a-f0-9-]{36})$/gm)].map((m) => m[1]), printings);
  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) ?? []).length, 21);
  for (const [title, url] of [
    ['Weather(light) Report', 'https://magic.wizards.com/en/news/making-magic/weatherlight-report-2007-12-03'],
    ['The Known Mutliverse', 'https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19'],
    ['Face Cards, Part 2', 'https://magic.wizards.com/en/news/making-magic/face-cards-part-2-2018-12-03'],
    ['Dominaria United States of Design, Part 1', 'https://magic.wizards.com/en/news/making-magic/dominaria-united-states-design-part-1-2022-08-29'],
  ]) {
    assert.equal(chapter.split(`title: "${title}"`).length - 1, 1, title);
    assert.equal(chapter.split(`url: "${url}"`).length - 1, 1, url);
  }
  for (const id of [
    'weatherlight-bloodlines-project', 'weatherlight-serras-realm',
    'weatherlight-gerrard-rejects-legacy', 'weatherlight-rescue',
    'weatherlight-yavimaya-training', 'weatherlight-rofellos-loss',
    'selenia-curse-crovax', 'ertai-stranded-on-rath', 'volrath-unmasked',
    'hanna-phyrexian-plague', 'rathi-overlay', 'nine-titans-assault',
    'yawgmoths-arena', 'legacy-weapon', 'weatherlight-squee-immortality',
  ]) assert.ok(chapter.includes(`<HistoricalEventReference id="${id}" />`), id);
});
