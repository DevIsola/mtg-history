import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const added = {
  'brothers-tawnos-carries-testimony': ['brothers-war', "The Brothers' War — Episode 1: The End"],
  'innistrad-avacyn-created': ['many-worlds', 'Innistrad Plane Guide'],
  'innistrad-helvault-imprisonment': ['many-worlds', "Planeswalker's Guide to Avacyn Restored, Part 2"],
  'phyrexia-melira-resistance': ['march-of-the-machine', 'Assault on New Phyrexia — Episode 2: Unstable Foundations'],
  'phyrexia-meliras-last-gift': ['march-of-the-machine', 'March of the Machine — Episode 10: The Rhythms of Life'],
  'omenpaths-eldraine-mourning': ['omenpaths', 'Wilds of Eldraine — Episode 1: Pure of Heart'],
  'omenpaths-rowan-and-will-diverge': ['omenpaths', 'Wilds of Eldraine — Episode 1: Pure of Heart'],
  'omenpaths-ravnica-investigation': ['omenpaths', 'Murders at Karlov Manor — Episode 9: Beauty in Destruction'],
};

function publishedCollections() {
  const names = readdirSync(new URL('../src/content/chapters/', import.meta.url))
    .filter((name) => name.endsWith('.mdx'));
  const chapters = new Map(names.map((name) => [name.slice(0, -4),
    parseChapterEditorial(read(`src/content/chapters/${name}`), name.slice(0, -4)).sources]));
  const events = readdirSync(new URL('../src/content/events/', import.meta.url))
    .filter((name) => name.endsWith('.json'))
    .map((name) => ({ id: name.slice(0, -5), ...json(`src/content/events/${name}`) }));
  return { chapters, events };
}

test('Wave 2K adds eight distinct, narrowly supported event reviews', () => {
  assert.equal(Object.keys(added).length, 8);
  assert.ok(Object.keys(eventProvenance).length >= 26, "earlier review coverage must never shrink");
  for (const [id, [chapterId, sourceTitle]] of Object.entries(added)) {
    const event = json(`src/content/events/${id}.json`);
    const entry = eventProvenance[id];
    assert.equal(event.chapterId, chapterId, id);
    assert.ok(entry, `${id}: review missing`);
    assert.ok(['relative', 'undated'].includes(entry.chronology.precision), id);
    assert.ok(entry.chronology.basis.length >= 35, id);
    assert.ok(entry.artworkNote.length >= 35, id);
    assert.ok(entry.sources.some((source) => source.title === sourceTitle), id);
    assert.ok(entry.sources.every((source) => source.supports.length >= 35), id);
  }
});

test('the additional reviews cite official sources in each event chapter', () => {
  const { chapters, events } = publishedCollections();
  assert.equal(events.length, 133);
  assert.equal(chapters.size, 10);
  for (const [id, [chapterId]] of Object.entries(added)) {
    const bibliography = chapters.get(chapterId) ?? [];
    for (const source of eventProvenance[id].sources) {
      assert.ok(bibliography.some((item) => item.kind === 'official' &&
        item.title === source.title && item.url === source.url),
      `${id}: source ${source.title} is absent from chapter ${chapterId}`);
    }
  }
  assert.deepEqual(validateEventProvenance(eventProvenance, events, chapters), []);
});

test('Sylex origin uncertainty is not confused with the Argoth blast or modern 4562 AR frame', () => {
  const event = json('src/content/events/sylex-blast.json');
  const record = eventProvenance['sylex-blast'];
  assert.equal(event.chapterId, 'brothers-war');
  assert.equal(event.cardId, '3000d1c6-dbb3-4e65-b428-dbf167bb8797');
  assert.equal(event.narrative.length, 3);
  assert.match(event.narrative[2], /Feldon, Ashnod, and Gix/);
  assert.match(event.narrative[2], /4562 AR framing dates Teferi.s investigation, not the blast/);
  assert.ok(!/4562\s*AR/.test(event.summary), 'modern framing is not a claimed event year');
  assert.equal(record.sources.length, 2);
  assert.ok(record.sources.some(({ title }) => title === "The Brothers' War — Episode 5: As Cruel, As Necessary"));
  assert.ok(record.sources.some(({ supports }) => /incompatible accounts/.test(supports)));
});

test('source and chronology integrity checks still fail closed for the new batch', () => {
  const { chapters, events } = publishedCollections();
  const records = structuredClone(eventProvenance);
  records['innistrad-avacyn-created'].chronology.precision = 'exact';
  records['omenpaths-eldraine-mourning'].sources[0].url = 'https://example.com/fake';
  const errors = validateEventProvenance(records, events, chapters).join(' | ');
  assert.match(errors, /invalid chronology precision/);
  assert.match(errors, /expected a canonical Wizards HTTPS article URL/);
  assert.match(errors, /source is absent from the chapter bibliography/);
});
