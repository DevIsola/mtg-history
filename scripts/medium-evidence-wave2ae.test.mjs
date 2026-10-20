import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { eventProvenance } from '../src/data/event-provenance.mjs';
import { checkEventProvenance } from './check-event-provenance.mjs';
import { collectEvidenceGaps } from './audit-event-source-gaps.mjs';
import { runEditorialConsolidation } from './audit-editorial-consolidation.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const event = id => JSON.parse(read('src/content/events/' + id + '.json'));

const reviewed = ['thran-dyfed-portal', 'tocasias-death'];

test('Dyfed provenance separates Phyrexia creation from the portal and preserves printing', () => {
  const entry = eventProvenance['thran-dyfed-portal'];
  assert.equal(entry.chronology.precision, 'relative');
  assert.deepEqual(entry.sources.map(source => source.role), ['retrospective']);
  assert.match(entry.sources[0].supports, /earlier planeswalker/);
  assert.match(entry.sources[0].supports, /opened the Dominaria/);
  assert.match(entry.artworkNote, /portrait/);

  const e = event('thran-dyfed-portal');
  assert.match(e.narrative.join(' '), /Dyfed opened the planar gateway/);
  assert.doesNotMatch(e.narrative.join(' '), /without meaningful consent/);
  assert.equal(e.cardId, '8690cbcc-f8fd-41f7-9e28-e61c12b04014');
});

test('Tocasia death remains design commentary, not novel-scene verification', () => {
  const entry = eventProvenance['tocasias-death'];
  assert.equal(entry.chronology.precision, 'relative');
  assert.deepEqual(entry.sources.map(source => source.role), ['design-commentary']);
  assert.match(entry.sources[0].supports, /powerstone battle/);
  assert.match(entry.sources[0].supports, /not the original novel scene/);
  assert.match(entry.artworkNote, /mechanics do not establish/);
  assert.equal(event('tocasias-death').cardId, '50f7666d-0d60-4fe5-b144-286d4e47b704');
});

test('both official citations occur exactly once in their chapter bibliography', () => {
  for (const id of reviewed) {
    const chapter = read('src/content/chapters/' + event(id).chapterId + '.mdx');
    for (const source of eventProvenance[id].sources) {
      assert.equal(chapter.split('  - title: "' + source.title + '"').length - 1, 1);
      assert.equal(chapter.split('    url: "' + source.url + '"').length - 1, 1);
    }
  }
});

test('Koilos stays outside claim-reviewed provenance without a direct primary account', () => {
  assert.equal(eventProvenance['battle-of-koilos'], undefined);
  const e = event('battle-of-koilos');
  assert.equal(e.cardId, 'dd8ad3aa-3225-45ae-8343-5991f5b52269');
  const chapter = read('src/content/chapters/weatherlight.mdx');
  assert.match(chapter, /title: "Invasion"\r?\n\s+kind: book/);
});

test('integrity gate counts only the two newly sourced events and retains novel questions', async () => {
  const result = await checkEventProvenance();
  assert.deepEqual(result.errors, []);
  assert.equal(result.totalEvents, 133);
  assert.ok(result.reviewedEvents >= 48);
  assert.equal(collectEvidenceGaps().length, 3);

  const report = await runEditorialConsolidation();
  assert.equal(report.summary.events, 133);
  assert.equal(report.summary.cardUses, 135);
  assert.equal(report.summary.sourceReviewed, result.reviewedEvents);
  assert.equal(report.summary.openPrimaryClaims, 3);
  assert.equal(report.summary.awaitingEventReview, 133 - result.reviewedEvents);
});
