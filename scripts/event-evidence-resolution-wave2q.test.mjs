import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { eventProvenance } from '../src/data/event-provenance.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const resolution = {
  'brothers-tawnos-carries-testimony': [
    'brothers-war',
    "The Brothers' War — Episode 5: As Cruel, As Necessary",
    'https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-5-as-cruel-as-necessary',
  ],
  'phyrexia-dominaria-sleeper-war': [
    'march-of-the-machine',
    'Dominaria United — Episode 5: A Whisper in the Wind',
    'https://magic.wizards.com/en/news/magic-story/episode-5-whisper-wind-2022-08-18',
  ],
};

test('two resolved claims are backed by specific official primary fiction', () => {
  for (const [id, [chapter, title, url]] of Object.entries(resolution)) {
    const record = eventProvenance[id];
    assert.ok(record, `${id} missing`);
    assert.equal(record.unresolvedClaims, undefined, `${id} must not remain an open question`);
    assert.ok(record.sources.length >= 2 && record.sources.length <= 3);
    const citation = record.sources.find((source) => source.title === title && source.url === url);
    assert.equal(citation?.role, 'story');
    assert.ok(citation.supports.length >= 35);
    const bibliography = read(`src/content/chapters/${chapter}.mdx`);
    assert.ok(bibliography.includes(`title: "${title}"`), id);
    assert.ok(bibliography.includes(`url: "${url}"`), id);
    assert.equal(record.chronology.precision, 'relative');
    assert.ok(!/\b2022 AR|2026 AR\b/.test(record.chronology.label));
  }
});

test('Urza’s instruction and Tawnos’s later testimony remain two different attested scenes', () => {
  const record = eventProvenance['brothers-tawnos-carries-testimony'];
  assert.match(record.sources[1].supports, /instructing Tawnos to travel west/);
  assert.match(record.sources[1].supports, /ivory towers/);
  assert.match(record.sources[0].supports, /recounting Urza and Mishra/);
  assert.match(record.artworkNote, /not Urza delivering instructions/);
});

test('Ajani’s direct attack on Jaya has its own source rather than relying on the Ertai account', () => {
  const record = eventProvenance['phyrexia-dominaria-sleeper-war'];
  assert.match(record.sources[0].supports, /Ertai/);
  assert.match(record.sources[1].supports, /compleated infiltrator/);
  assert.match(record.sources[1].supports, /throwing her from the Mana Rig/);
  assert.match(record.artworkNote, /not a literal visual record/);
});

test('the other three historical questions remain open and existing source coverage is preserved', () => {
  assert.equal(Object.keys(eventProvenance).length, 43);
  const remaining = Object.entries(eventProvenance)
    .filter(([, record]) => record.unresolvedClaims?.length)
    .map(([id]) => id).sort();
  assert.deepEqual(remaining, [
    'freyalise-seals-skyshroud',
    'mending-venser-first-walk',
    'spark-gideons-sacrifice',
  ]);
});
