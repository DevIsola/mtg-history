import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const batch = {
  'ravnica-nonmagical-guild-accord': ['many-worlds', 'Ravnica, Then and Now'],
  'ravnica-project-kraj': ['many-worlds', 'Ravnica, Then and Now'],
  'zendikar-nahiri-chooses-prison': ['many-worlds', 'The Lithomancer'],
  'phyrexia-tamiyos-last-story': ['march-of-the-machine', 'March of the Machine — Episode 3: Mother, Son, and Story'],
  'phyrexia-vorinclex-world-tree': ['march-of-the-machine', "Planeswalker's Guide to March of the Machine: The Phyrexian Invasion of the Multiverse"],
  'phyrexia-dominaria-sleeper-war': ['march-of-the-machine', 'Dominaria United — Death and Salvation'],
  'omenpaths-kellan-first-crossing': ['omenpaths', 'A First Look at The Lost Caverns of Ixalan'],
  'omenpaths-quintorius-expedition': ['omenpaths', 'The Lost Caverns of Ixalan — Episode 1'],
};
const prior = [
  'thran-glacian-stones-implanted', 'thran-stones-rediscovered',
  'zendikar-hedrons', 'ravnica-guildpact-collapse',
  'phyrexia-zhalfir-return', 'omenpaths-sparks-and-roads',
  'sylex-blast', 'phyrexia-norns-fall',
];

function collectionView() {
  const chapterNames = readdirSync(new URL('../src/content/chapters/', import.meta.url)).filter((name) => name.endsWith('.mdx'));
  const chapterSources = new Map(chapterNames.map((name) => [name.slice(0, -4),
    parseChapterEditorial(read(`src/content/chapters/${name}`), name.slice(0, -4)).sources]));
  const events = readdirSync(new URL('../src/content/events/', import.meta.url))
    .filter((name) => name.endsWith('.json'))
    .map((name) => ({ id: name.slice(0, -5), ...json(`src/content/events/${name}`) }));
  return { chapterSources, events };
}

test('Wave 2M adds eight source-bounded reviews without dropping previous entries', () => {
  assert.equal(Object.keys(batch).length, 8);
  assert.equal(Object.keys(eventProvenance).length, 34);
  for (const id of prior) assert.ok(eventProvenance[id], `prior review missing: ${id}`);
  for (const [id, [chapter, sourceTitle]] of Object.entries(batch)) {
    assert.equal(json(`src/content/events/${id}.json`).chapterId, chapter);
    const review = eventProvenance[id];
    assert.equal(review.chronology.precision, 'relative', id);
    assert.ok(review.chronology.basis.length >= 35, id);
    assert.ok(review.artworkNote.length >= 35, id);
    assert.equal(review.sources.length, 1, id);
    assert.equal(review.sources[0].title, sourceTitle, id);
    assert.ok(review.sources[0].supports.length >= 35, id);
  }
});

test('every review cites the identical official entry in its own chapter bibliography', () => {
  const { chapterSources, events } = collectionView();
  assert.equal(chapterSources.size, 10);
  assert.equal(events.length, 133);
  assert.deepEqual(validateEventProvenance(eventProvenance, events, chapterSources), []);
  for (const [id, [chapter]] of Object.entries(batch)) {
    for (const source of eventProvenance[id].sources) {
      assert.ok(chapterSources.get(chapter)?.some((entry) => entry.kind === 'official' &&
        entry.title === source.title && entry.url === source.url), `${id}: missing official citation`);
    }
  }
});

test('claim limits do not turn announcements or partial scenes into complete certification', () => {
  assert.match(eventProvenance['phyrexia-dominaria-sleeper-war'].sources[0].supports, /does not independently document Ajani/);
  assert.match(eventProvenance['omenpaths-kellan-first-crossing'].sources[0].supports, /does not prove every detail/);
  assert.match(eventProvenance['zendikar-nahiri-chooses-prison'].sources[0].supports, /Nahiri protesting/);
  assert.match(eventProvenance['phyrexia-vorinclex-world-tree'].sources[0].supports, /World Tree essence/);
});

test('Project Kraj correction separates Momir Vig’s death, Kraj’s rampage and Teysa’s role', () => {
  const event = json('src/content/events/ravnica-project-kraj.json');
  assert.equal(event.cardId, '9eb856e6-8f63-4048-9818-cc3e65748855');
  assert.equal(event.narrative.length, 3);
  assert.match(event.narrative[2], /Agrus Kos killed Simic guildmaster Momir Vig/);
  assert.match(event.narrative[2], /Project Kraj then went berserk/);
  assert.match(event.narrative[2], /Teysa.s political role/);
});

test('orphan or fabricated event-level citations still fail closed', () => {
  const { chapterSources, events } = collectionView();
  const modified = structuredClone(eventProvenance);
  modified['omenpaths-quintorius-expedition'].sources[0].url = 'https://example.net/forged';
  modified['ravnica-project-kraj'].chronology.precision = 'exact';
  const errors = validateEventProvenance(modified, events, chapterSources).join(' | ');
  assert.match(errors, /canonical Wizards HTTPS article URL/);
  assert.match(errors, /absent from the chapter bibliography/);
  assert.match(errors, /invalid chronology precision/);
});
