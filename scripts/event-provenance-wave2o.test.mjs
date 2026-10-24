import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const event = (id) => JSON.parse(read(`src/content/events/${id}.json`));
const seedcore = 'phyrexia-seedcore-failure';
const primarySources = [
  ['Assault on New Phyrexia — Episode 4: Impossible Odds', 'https://magic.wizards.com/en/news/magic-story/assault-on-new-phyrexia-or-episode-4-impossible-odds'],
  ['Assault on New Phyrexia — Episode 5: Inevitable Resolutions', 'https://magic.wizards.com/en/news/magic-story/assault-on-new-phyrexia-or-episode-5-inevitable-resolutions'],
];

test('Seedcore narration distinguishes opening, disputed activation and Elspeth removing the Sylex', () => {
  const row = event(seedcore);
  assert.equal(row.chapterId, 'new-phyrexia');
  assert.equal(row.cardId, '1dd64b1d-bcef-476c-bf0b-3ac7df7cbed3');
  assert.equal(row.narrative.length, 3);
  assert.match(row.narrative[0], /Realmbreaker had already opened passages/);
  assert.match(row.narrative[1], /Kaya and Kaito warned/);
  assert.match(row.narrative[2], /Elspeth interrupted Jace, seized the activating Sylex/);
  assert.match(row.narrative[2], /did not destroy New Phyrexia there/);
  assert.doesNotMatch(row.narrative.join(' '), /4562\s*AR|2023/);
});

test('two primary stories must be cited verbatim in the original chapter bibliography', () => {
  const bibliography = read('src/content/chapters/new-phyrexia.mdx');
  const record = eventProvenance[seedcore];
  assert.ok(record);
  assert.equal(record.chronology.precision, 'relative');
  assert.equal(record.sources.length, 2);
  assert.match(record.artworkNote, /Nissa, Ascended Animist/);
  assert.match(record.artworkNote, /not a literal scene of Jace/);
  assert.ok(record.sources.every(({ role }) => role === 'story'));
  for (const [title, url] of primarySources) {
    assert.ok(bibliography.includes(`title: "${title}"`), `chapter missing ${title}`);
    assert.ok(bibliography.includes(`url: "${url}"`), `chapter missing ${url}`);
    assert.ok(record.sources.some((source) => source.title === title && source.url === url));
  }
  assert.deepEqual(validateEventProvenance({ [seedcore]: record },
    [{ id: seedcore, chapterId: 'new-phyrexia' }],
    new Map([['new-phyrexia', primarySources.map(([title, url]) => ({ title, url, kind: 'official' }))]])), []);
});

test('Venser has character and design context but no fabricated first-walk source', () => {
  const record = eventProvenance['mending-venser-first-walk'];
  const chapter = read('src/content/chapters/mending.mdx');
  // Validate the *existing* two book-independent official source entries.
  assert.ok(record.sources.some((s) => s.title === 'Venser' && s.role === 'retrospective'));
  assert.ok(record.sources.some((s) => s.title === 'A Double Take, Part 1' && s.role === 'design-commentary'));
  assert.match(record.sources[0].supports, /does not document the alternate-history scene/);
  assert.ok(record.sources.some((s) => /does not narrate his first walk/.test(s.supports)));
  assert.ok(chapter.includes('title: "A Double Take, Part 1"'));
  assert.match(event('mending-venser-first-walk').narrative.at(-1), /requires comparison with the Time Spiral block novels/);
});

test('Freyalise source does not silently certify the Skyshroud rift location', () => {
  const record = eventProvenance['freyalise-seals-skyshroud'];
  assert.equal(record.sources[0].title, 'Freyalise');
  assert.match(record.sources[0].supports, /does not identify Skyshroud by name/);
  assert.match(event('freyalise-seals-skyshroud').narrative.at(-1), /does not identify Skyshroud or the exact rift/);
});

test('provenance validator still rejects unsupported dates and forged source URLs', () => {
  const record = structuredClone(eventProvenance[seedcore]);
  record.chronology.precision = 'exact';
  record.sources[1].url = 'https://example.com/fabrication';
  const errors = validateEventProvenance({ [seedcore]: record },
    [{ id: seedcore, chapterId: 'new-phyrexia' }],
    new Map([['new-phyrexia', primarySources.map(([title, url]) => ({ title, url, kind: 'official' }))]])).join(' | ');
  assert.match(errors, /invalid chronology precision/);
  assert.match(errors, /canonical Wizards HTTPS article URL/);
  assert.match(errors, /absent from the chapter bibliography/);
});

test('source review coverage grows by one, preserving 42 prior reviewed events', () => {
  assert.ok(Object.keys(eventProvenance).length >= 46);
  for (const id of ['mending-venser-first-walk', 'freyalise-seals-skyshroud',
    'teferis-phasing-decision', 'phyrexia-norns-fall', 'phyrexia-realmbreaker-invasion']) {
    assert.ok(eventProvenance[id], `lost source review: ${id}`);
  }
});
