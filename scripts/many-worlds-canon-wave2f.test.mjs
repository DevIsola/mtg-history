import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const json = (file) => JSON.parse(read(file));
const chapter = read('src/content/chapters/many-worlds.mdx');
const events = [
  ['ravnica-nonmagical-guild-accord', '9eb856e6-8f63-4048-9818-cc3e65748855', ['teysa-karlov', 'agrus-kos']],
  ['zendikar-nahiri-chooses-prison', '45f43bd0-d4d9-4a64-a829-f1ea3dfc9e90', ['nahiri', 'sorin']],
  ['innistrad-thalia-breaks-helvault', '16d2448c-1b2e-466a-a0ab-e20ba1de6bc9', ['liliana-vess', 'avacyn', 'griselbrand']],
];

test('three distinct canon events use existing curated printings and known character IDs', () => {
  for (const [id, cardId, characterIds] of events) {
    const event = json(`src/content/events/${id}.json`);
    assert.equal(event.chapterId, 'many-worlds');
    assert.equal(event.cardId, cardId);
    assert.deepEqual(event.characterIds, characterIds);
    assert.equal(event.narrative.length, 4);
    assert.ok(event.narrative.every((paragraph) => paragraph.split(/\s+/).length >= 22));
    assert.ok(chapter.includes(`  - ${cardId}`), `${id}: printing not curated`);
    assert.equal(chapter.split(`<HistoricalEventReference id="${id}" />`).length - 1, 1);
    for (const characterId of characterIds) {
      assert.ok(json(`src/content/characters/${characterId}.json`).name, `${id}: missing ${characterId}`);
    }
  }
});

test('historical ordering distinguishes decisions, construction, release and restoration', () => {
  const at = (id) => chapter.indexOf(`<HistoricalEventReference id="${id}" />`);
  assert.ok(at('ravnica-project-kraj') < at('ravnica-nonmagical-guild-accord'));
  assert.ok(at('zendikar-nahiri-chooses-prison') < at('zendikar-hedrons'));
  assert.ok(at('innistrad-helvault-imprisonment') < at('innistrad-thalia-breaks-helvault'));
  assert.ok(at('innistrad-thalia-breaks-helvault') < at('innistrad-avacyn-restored'));
  assert.match(chapter, /not\*\* illustrate the specific confrontation/);
  assert.match(chapter, /much later \*\*Living Guildpact\*\*/);
});

test('expanded biographies preserve all existing printing IDs, source references and chronology', () => {
  const expected = {
    'teysa-karlov': ['9eb856e6-8f63-4048-9818-cc3e65748855', 5],
    nahiri: ['45f43bd0-d4d9-4a64-a829-f1ea3dfc9e90', 7],
    griselbrand: ['b51666ae-2aef-4cb1-9cd4-44aec81530f8', 5],
    'liliana-vess': ['d75ebba8-34ca-47a0-bf13-8318ad73b343', 6],
  };
  for (const [id, [cardId, minBio]] of Object.entries(expected)) {
    const c = json(`src/content/characters/${id}.json`);
    assert.equal(c.featuredCardId, cardId);
    assert.ok(c.biography.length >= minBio, `${id}: insufficient historical depth`);
    assert.match(c.source.url, /^https:\/\//);
    assert.ok(c.chapterIds.includes('many-worlds'));
  }
  assert.ok(json('src/content/characters/liliana-vess.json').chapterIds.includes('war-of-the-spark'));
});

test('generated event adapter and count gates reflect 133 events without changing cards', () => {
  const adapter = read('src/data/events.ts');
  for (const [id] of events) assert.ok(adapter.includes(`id: "${id}"`));
  assert.match(adapter, /entry132 from '\.\.\/content\/events\/innistrad-thalia-breaks-helvault\.json'/);
  assert.match(read('scripts/check-entity-collections.mjs'), /characters: 88, events: 133, relationships: 118/);
  assert.match(read('scripts/check-card-collections.mjs'), /133\/133 event references/);
  assert.match(read('scripts/check-card-collections.mjs'), /136\/136 chapter uses/);
});
