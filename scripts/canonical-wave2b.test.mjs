import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const selected = [
  ['brothers-loran-recovers-sylex', 'brothers-war', '3000d1c6-dbb3-4e65-b428-dbf167bb8797'],
  ['brothers-tawnos-carries-testimony', 'brothers-war', '1f855a7e-3a97-4b62-a2a7-06ff1fbb2c4c'],
  ['weatherlight-crovax-frees-selenia', 'weatherlight', '9c1624f7-8275-46d3-ab7e-7b162e27593f'],
  ['weatherlight-gerrard-rejects-legacy', 'weatherlight', 'ccca800f-e850-4bec-95d0-70280b51b7a7'],
];

test('Wave 2B adds four distinct event IDs, referenced by their chapters and curated printings', () => {
  for (const [id, chapter, printing] of selected) {
    const data = json(`src/content/events/${id}.json`);
    const page = read(`src/content/chapters/${chapter}.mdx`);
    assert.equal(data.chapterId, chapter);
    assert.equal(data.cardId, printing);
    assert.ok(page.includes(`<HistoricalEventReference id="${id}" />`), `${id}: reference missing`);
    assert.ok(page.includes(printing), `${id}: card not curated in chapter`);
    assert.ok(readdirSync(new URL('../src/content/cards/', import.meta.url)).includes(`${printing}.json`));
    assert.ok(data.narrative.length >= 3);
    assert.ok(data.summary.length >= 30);
  }
});

test('Selenia has an exact matching historic portrait, belongs to a category and is linked from MDX', () => {
  const entry = json('src/content/characters/selenia.json');
  const printing = json(`src/content/cards/${entry.featuredCardId}.json`);
  assert.equal(printing.name, 'Selenia, Dark Angel');
  assert.equal(printing.setCode, 'tmp');
  assert.deepEqual(entry.chapterIds, ['weatherlight']);
  assert.equal(entry.biography.length >= 4, true);
  assert.match(read('src/content/chapters/weatherlight.mdx'), /<CharacterLink id="selenia">/);
  const categories = read('src/data/characterCategories.ts');
  assert.match(categories, /"selenia"/);
  assert.ok(entry.source.url.startsWith('https://magic.wizards.com/'));
});

test('old curse event is linked to Selenia and new ties have valid endpoints', () => {
  const old = json('src/content/events/selenia-curse-crovax.json');
  assert.ok(old.characterIds.includes('selenia'));
  for (const file of ['crovax--selenia--rivalry--weatherlight', 'mirri--selenia--rivalry--weatherlight']) {
    const link = json(`src/content/relationships/${file}.json`);
    assert.equal(link.chapterId, 'weatherlight');
    for (const id of [link.a, link.b]) {
      assert.ok(readdirSync(new URL('../src/content/characters/', import.meta.url)).includes(`${id}.json`));
    }
  }
});

test('legacy data adapters and cardinality gates include Wave 2B records', () => {
  assert.match(read('src/data/characters.ts'), /id: "selenia", \.\.\.entry87/);
  for (const [id] of selected) assert.ok(read('src/data/events.ts').includes(`id: "${id}"`));
  assert.match(read('scripts/check-entity-collections.mjs'), /characters: 88, events: 133, relationships: 118/);
  assert.match(read('scripts/check-card-collections.mjs'), /88\/88 character references, 133\/133 event references/);
});
