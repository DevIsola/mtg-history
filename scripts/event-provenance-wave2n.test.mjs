import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const batch = Object.freeze({
  'teferis-phasing-decision': ['mending', 'Return to Dominaria: Episode 6'],
  'shivan-rift': ['mending', 'Return to Dominaria: Episode 6'],
  'mending-venser-first-walk': ['mending', 'Venser'],
  'freyalise-seals-skyshroud': ['mending', 'Freyalise'],
  'phyrexia-urabrask-dissent': ['new-phyrexia', 'The Legends of Phyrexia: All Will Be One'],
  'phyrexia-elspeth-return': ['march-of-the-machine', 'March of the Machine — Episode 7: Divine Intervention'],
  'phyrexia-jin-kamigawa': ['new-phyrexia', "Planeswalker's Guide to March of the Machine: The Phyrexian Invasion of the Multiverse"],
  'phyrexia-mirran-survival': ['new-phyrexia', 'The Legends of Phyrexia: All Will Be One'],
});

function publishedCollections() {
  const chapters = new Map(readdirSync(new URL('../src/content/chapters/', import.meta.url))
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => [name.slice(0, -4), parseChapterEditorial(read(`src/content/chapters/${name}`), name.slice(0, -4)).sources]));
  const events = readdirSync(new URL('../src/content/events/', import.meta.url))
    .filter((name) => name.endsWith('.json'))
    .map((name) => ({ id: name.slice(0, -5), ...json(`src/content/events/${name}`) }));
  return { chapters, events };
}

test('Wave 2N adds eight distinct event reviews without dropping prior provenance', () => {
  assert.equal(Object.keys(batch).length, 8);
  assert.ok(Object.keys(eventProvenance).length >= 42);
  for (const [id, [chapter, title]] of Object.entries(batch)) {
    assert.equal(json(`src/content/events/${id}.json`).chapterId, chapter, id);
    const record = eventProvenance[id];
    assert.ok(record, `${id}: provenance missing`);
    assert.ok(['relative', 'undated'].includes(record.chronology.precision), id);
    assert.ok(record.chronology.label.length >= 15 && record.chronology.basis.length >= 35, id);
    assert.ok(record.artworkNote.length >= 35, id);
    assert.ok(record.sources.some((source) => source.title === title), id);
    assert.ok(record.sources.every((source) => source.supports.length >= 35), id);
  }
  for (const id of ['ravnica-project-kraj', 'sylex-blast', 'phyrexia-norns-fall', 'the-mending']) {
    assert.ok(eventProvenance[id], `${id}: preceding review lost`);
  }
});

test('each event source has an identical official title and URL in its own chapter bibliography', () => {
  const { chapters, events } = publishedCollections();
  assert.equal(events.length, 133);
  assert.equal(chapters.size, 11);
  for (const [id, [chapter]] of Object.entries(batch)) {
    for (const source of eventProvenance[id].sources) {
      assert.ok(chapters.get(chapter)?.some((reference) => reference.kind === 'official' &&
        reference.title === source.title && reference.url === source.url), `${id}: bibliography mismatch`);
    }
  }
  assert.deepEqual(validateEventProvenance(eventProvenance, events, chapters), []);
});

test('historical sources never imply their narrow claims document entire disputed episodes', () => {
  assert.match(eventProvenance['mending-venser-first-walk'].sources[0].supports, /does not document the alternate-history scene/);
  assert.match(eventProvenance['freyalise-seals-skyshroud'].sources[0].supports, /does not identify Skyshroud by name/);
  assert.match(eventProvenance['phyrexia-urabrask-dissent'].sources[0].supports, /does not independently substantiate his later punishment/);
  assert.match(eventProvenance['phyrexia-jin-kamigawa'].sources[0].supports, /does not alone document Tamiyo/);
  assert.match(eventProvenance['phyrexia-mirran-survival'].sources[0].supports, /Melira.s separate contributions require other sources/);
});

test('Teferi chronology separates original phasing, Shivan restoration and Zhalfir remaining absent', () => {
  const event = json('src/content/events/teferis-phasing-decision.json');
  assert.equal(event.cardId, '3c0145f6-4e27-49e7-9ef6-bac6fa3de26d');
  assert.equal(event.narrative.length, 3);
  assert.match(event.narrative[2], /cost Teferi his planeswalker spark/);
  assert.match(event.narrative[2], /did not also restore Zhalfir/);
  assert.ok(!/2018/.test(event.narrative.join(' ')), 'publication year cannot become fictional chronology');
  assert.equal(eventProvenance['teferis-phasing-decision'].sources[0].role, 'story');
  assert.equal(eventProvenance['shivan-rift'].sources[0].role, 'story');
});

test('false calendar precision and mismatched source URLs still fail closed', () => {
  const { chapters, events } = publishedCollections();
  const tampered = structuredClone(eventProvenance);
  tampered['shivan-rift'].chronology.precision = 'exact';
  tampered['phyrexia-elspeth-return'].sources[0].url = 'https://example.net/unrelated';
  const errors = validateEventProvenance(tampered, events, chapters).join(' | ');
  assert.match(errors, /invalid chronology precision/);
  assert.match(errors, /expected a canonical Wizards HTTPS article URL/);
  assert.match(errors, /source is absent from the chapter bibliography/);
});
