import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { collectEvidenceGaps } from './audit-event-source-gaps.mjs';

const gideon = 'spark-gideons-sacrifice';
const sourceTitle = 'More War Games';
const sourceURL = 'https://magic.wizards.com/en/news/making-magic/more-war-games-2019-04-29';
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Gideon now has explicit designer corroboration while retaining the first story citation', () => {
  const row = eventProvenance[gideon];
  assert.ok(row);
  assert.equal(row.sources.length, 2);
  assert.equal(row.sources[0].role, 'story');
  assert.match(row.sources[0].supports, /does not alone detail the protective transfer/);
  assert.equal(row.sources[1].title, sourceTitle);
  assert.equal(row.sources[1].url, sourceURL);
  assert.equal(row.sources[1].role, 'design-commentary');
  assert.match(row.sources[1].supports, /takes all the fatal damage intended for Liliana/);
  assert.match(row.sources[1].supports, /does not narrate the novel scene/);
});

test('Gideon citation matches its own chapter bibliography, not the War Games predecessor', () => {
  const chapter = read('src/content/chapters/war-of-the-spark.mdx');
  assert.match(chapter, /title: "More War Games"/);
  assert.ok(chapter.includes(`url: "${sourceURL}"`));
  assert.deepEqual(validateEventProvenance({ [gideon]: eventProvenance[gideon] },
    [{ id: gideon, chapterId: 'war-of-the-spark' }],
    new Map([['war-of-the-spark', eventProvenance[gideon].sources.map(({ title, url }) =>
      ({ kind: 'official', title, url }))]])), []);
});

test('card representation is precise, but the unexamined novel scene remains an open question', () => {
  const row = eventProvenance[gideon];
  const event = JSON.parse(read('src/content/events/spark-gideons-sacrifice.json'));
  const printing = JSON.parse(read(`src/content/cards/${event.cardId}.json`));
  assert.equal(event.cardId, '849c79ad-8bfc-4512-ab41-f213b6b285ab');
  assert.equal(printing.name, "Gideon's Sacrifice");
  assert.equal(printing.setCode, 'war');
  assert.equal(printing.collectorNumber, '14');
  assert.match(row.artworkNote, /collector number 14/);
  assert.match(row.artworkNote, /not a verbatim narrative/);
  assert.equal(row.unresolvedClaims.length, 1);
  assert.match(row.unresolvedClaims[0].claim, /specifically described protective spell or transfer rite/);
  assert.match(row.unresolvedClaims[0].requiredEvidence, /2019 novel/);
  assert.match(row.unresolvedClaims[0].requiredEvidence, /design commentary/);
});

test('the three primary-fiction questions remain open and reviewed coverage is unchanged', () => {
  assert.equal(Object.keys(eventProvenance).length, 43);
  assert.deepEqual(collectEvidenceGaps().map(({ id }) => id), [
    'freyalise-seals-skyshroud',
    'mending-venser-first-walk',
    'spark-gideons-sacrifice',
  ]);
  for (const id of ['mending-venser-first-walk', 'freyalise-seals-skyshroud']) {
    assert.equal(eventProvenance[id].unresolvedClaims.length, 1);
  }
});

test('fabricated citations and invented calendar precision still fail closed', () => {
  const edited = structuredClone(eventProvenance[gideon]);
  edited.chronology.precision = 'exact';
  edited.sources[1].url = 'https://example.org/fictional-source';
  const errors = validateEventProvenance({ [gideon]: edited },
    [{ id: gideon, chapterId: 'war-of-the-spark' }],
    new Map([['war-of-the-spark', eventProvenance[gideon].sources.map(({ title, url }) =>
      ({ kind: 'official', title, url }))]])).join(' | ');
  assert.match(errors, /invalid chronology precision/);
  assert.match(errors, /canonical Wizards HTTPS article URL/);
  assert.match(errors, /absent from the chapter bibliography/);
});
