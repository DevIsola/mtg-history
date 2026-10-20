import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { eventProvenance } from '../src/data/event-provenance.mjs';
import {
  buildKoilosReviewPacket,
  parseKoilosReviewArgs,
  renderKoilosReviewWorksheet,
} from './prepare-koilos-review.mjs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const review = json('src/data/manual-event-review.json')['battle-of-koilos'];
const event = json('src/content/events/battle-of-koilos.json');
const relatedEvent = json('src/content/events/brothers-koilos-stones.json');
const chapterText = read('src/content/chapters/weatherlight.mdx');
const input = () => ({ review, event, relatedEvent, chapterText, provenance: eventProvenance });

test('Koilos manual review is explicit and does not enter verified provenance', () => {
  assert.equal(Object.keys(json('src/data/manual-event-review.json')).length, 1);
  assert.equal(review.status, 'PENDING_PRIMARY_FICTION');
  assert.equal(eventProvenance['battle-of-koilos'], undefined);
  assert.equal(event.cardId, 'dd8ad3aa-3225-45ae-8343-5991f5b52269');
  assert.equal(review.cardId, event.cardId);
  assert.equal(review.chapterId, event.chapterId);
});

test('review packet requires the actual primary-novel bibliography, on either line ending', () => {
  assert.match(chapterText.replace(/\r\n?/g, '\n'), /  - title: "Invasion"\n    kind: book/);
  const packet = buildKoilosReviewPacket(input());
  assert.equal(packet.bookTitle, 'Invasion');
  assert.equal(packet.existingNarrative.length, event.narrative.length);
  assert.deepEqual(
    buildKoilosReviewPacket({ ...input(), chapterText: chapterText.replace(/\r?\n/g, '\r\n') }).existingNarrative,
    event.narrative,
  );
});

test('the ancient Koilos stones and later invasion battle remain different records', () => {
  assert.equal(review.relatedEventId, 'brothers-koilos-stones');
  assert.equal(relatedEvent.chapterId, 'brothers-war');
  assert.notEqual(event.cardId, relatedEvent.cardId);
  const packet = buildKoilosReviewPacket(input());
  assert.match(packet.requiredEvidence, /Rathi Overlay/);
  assert.match(packet.artworkNote, /do not independently establish/);
});

test('the reader displays pending research independently of source-verified claims', () => {
  const page = read('src/pages/events/[id].astro');
  const component = read('src/components/UnverifiedEventNotice.astro');
  assert.match(page, /Object\.values\(manualEventReviews\)\.find/);
  assert.match(page, /provenance && <EventEvidence entry=\{provenance\}/);
  assert.match(page, /manualReview && <UnverifiedEventNotice entry=\{manualReview\}/);
  assert.match(page, /manualReview && provenance/);
  assert.match(component, /Primary-fiction review pending/);
  assert.match(component, /not a conclusion that the narrative is false/);
});

test('worksheet remains an empty human-evidence form and never asserts a completed novel review', () => {
  const worksheet = renderKoilosReviewWorksheet(buildKoilosReviewPacket(input()));
  assert.match(worksheet, /Status: PENDING_PRIMARY_FICTION/);
  assert.match(worksheet, /zero historical claims/);
  assert.match(worksheet, /Edition \/ ISBN: \[record after reading\]/);
  assert.match(worksheet, /the later Dominaria United-era Caves of Koilos/);
  assert.match(worksheet, /not a transcription or verification/);
  assert.doesNotMatch(worksheet, /verified chapter \d+|confirmed on page \d+/i);
});

test('outdated reviewed status, changed identities and missing novel fail closed', () => {
  assert.throws(() => buildKoilosReviewPacket({ ...input(), provenance: { ...eventProvenance, 'battle-of-koilos': {} } }), /already has a reviewed provenance/);
  assert.throws(() => buildKoilosReviewPacket({ ...input(), event: { ...event, cardId: 'changed' } }), /canonical printing has changed/);
  assert.throws(() => buildKoilosReviewPacket({ ...input(), chapterText: chapterText.replace(/  - title: "Invasion"/g, '  - title: "Removed"') }), /must retain the Invasion/);
  assert.throws(() => buildKoilosReviewPacket({ ...input(), relatedEvent: { ...relatedEvent, chapterId: 'weatherlight' } }), /must remain separate/);
  assert.throws(() => renderKoilosReviewWorksheet(null), /validated Koilos packet/);
});

test('CLI does not write by default and a dedicated script is registered', () => {
  assert.deepEqual(parseKoilosReviewArgs(['--help']), { help: true });
  assert.deepEqual(parseKoilosReviewArgs(['--output', 'notes.md']).output.endsWith('notes.md'), true);
  for (const args of [[], ['--output'], ['--output', '--help'], ['--unknown', 'notes.md']]) {
    assert.throws(() => parseKoilosReviewArgs(args), /Usage/);
  }
  assert.equal(json('package.json').scripts['review:koilos-evidence'], 'node scripts/prepare-koilos-review.mjs');
});
