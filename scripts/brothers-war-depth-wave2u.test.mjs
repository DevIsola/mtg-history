import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';

const chapter = readFileSync(new URL('../src/content/chapters/brothers-war.mdx', import.meta.url), 'utf8');
const originalIds = [
  '50f7666d-0d60-4fe5-b144-286d4e47b704',
  '8aefe8bd-216a-4ec1-9362-3f9dbf7fd083',
  '585a753d-a692-474a-bc28-48dd93b73ace',
  '25d759dc-0501-481a-8330-005f83b999d7',
  '2c76f7e0-37e7-4e87-93a3-a25ba0674645',
  '3000d1c6-dbb3-4e65-b428-dbf167bb8797',
  '685c9767-eaa7-4e16-b245-816181e2fc36',
  '1f855a7e-3a97-4b62-a2a7-06ff1fbb2c4c',
  '5eb43c15-50a9-488f-b0be-84a5e0a6d10b',
  '02aea379-b444-46a3-82f4-3038f698d4f4',
  'f454583d-d227-4fc8-842e-128e025880e4',
];
const sources = [
  ['The Brothers\' War — Episode 3: Sword One', 'https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-3-sword-one'],
  ['The Brothers\' War — Episode 4: The Ink of Empires', 'https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-4-the-ink-of-empires'],
];

test('both added official primary stories match the exact chapter bibliography', () => {
  const metadata = parseChapterEditorial(chapter, 'brothers-war');
  for (const [title, url] of sources) {
    assert.equal(metadata.sources.filter((entry) => entry.kind === 'official' && entry.title === title && entry.url === url).length, 1, title);
  }
  assert.match(chapter, /author: "Jeff Grubb"/);
  assert.match(chapter, /year: 1998/);
});

test('three new historical viewpoints follow the corresponding source episodes', () => {
  const sections = [
    ['Kroog\'s defense through the eyes of young pilots', /Sanwell.*five student pilots|five student pilots.*Sanwell/s, /Rendall/, /28 AR/],
    ['The long war from a Fallaji trench', /Farid/, /Karrak/, /44 AR/],
    ['Penregon\'s civilian machines face the cost of another war', /civils/, /finite/, /69 AR/],
  ];
  let previous = -1;
  for (const [heading, ...phrases] of sections) {
    const at = chapter.indexOf(`### ${heading}`);
    assert.ok(at > previous, `missing or misplaced section: ${heading}`);
    assert.equal(chapter.split(`### ${heading}`).length, 2, `${heading} duplicated`);
    const body = chapter.slice(at, chapter.indexOf('\n### ', at + 4) < 0 ? undefined : chapter.indexOf('\n### ', at + 4));
    for (const phrase of phrases) assert.match(body, phrase, heading);
    previous = at;
  }
});

test('2022 retrospective scenes never alter the in-world chronology of the blast', () => {
  assert.match(chapter, /28 AR.*44 AR.*69 AR/s);
  assert.match(chapter, /4562 AR/);
  assert.match(chapter, /does\s+not\s+move\s+the\s+Sylex\s+Blast/);
  assert.match(chapter, /aftermath.*not an extension of its final/s);
  assert.match(chapter, /storyPeriod: "c\. 20–64 AR"/);
});

test('curated printing IDs and eleven original chapter cards stay untouched', () => {
  const frontmatter = chapter.split('---')[1];
  const block = frontmatter.split('\ncardIds:')[1]?.split('\ncards:')[0];
  assert.ok(block);
  assert.deepEqual([...block.matchAll(/^  - ([a-f0-9-]{36})$/gm)].map((item) => item[1]), originalIds);
  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) ?? []).length, 11);
});

test('original event references and central historical participants stay connected', () => {
  for (const id of [
    'brothers-koilos-stones', 'tocasias-death', 'brothers-fallaji-ascent',
    'fall-of-kroog', 'gix-influences-mishra', 'ashnod-frees-tawnos',
    'brothers-war', 'brothers-loran-recovers-sylex', 'brothers-argoth-ruin',
    'sylex-blast', 'brothers-tawnos-carries-testimony', 'brothers-kaylas-reconstruction',
  ]) assert.ok(chapter.includes(`<HistoricalEventReference id="${id}" />`), id);
  for (const id of ['urza', 'mishra', 'kayla', 'tawnos', 'ashnod', 'gix']) {
    assert.ok(chapter.includes(`<CharacterLink id="${id}">`), id);
  }
  assert.match(chapter, /not a portrait of Sanwell/);
});
