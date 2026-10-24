import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArtworkLedger, validateArtworkLedger, makeArtworkGallery, extractCardSignificance, checkArtwork } from './check-artwork-fidelity.mjs';

const id = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
const chapter = { id: 'thran', cards: [{ name: 'Rebbec', setCode: 'cmr', collectorNumber: '1', scryfallId: id, significance: 'A portrait, not the gate sealing.' }] };
const line = 'thran\tRebbec\tportrait\tretrospective\tcontext-assessed\tCharacter portrait does not show gateway closure';
const heading = 'chapter\tcard\tvisualRole\ttimeContext\tbasis\teditorialInterpretation';
const rows = () => parseArtworkLedger(`${heading}\n${line}\n`);

test('parses a tab-separated ledger with fixed columns', () => {
  assert.deepEqual(rows()[0], { chapter: 'thran', card: 'Rebbec', visualRole: 'portrait', timeContext: 'retrospective', basis: 'context-assessed', editorialInterpretation: 'Character portrait does not show gateway closure' });
  assert.throws(() => parseArtworkLedger('wrong\theader\n'), /header/);
  assert.throws(() => parseArtworkLedger(`${heading}\nthran\tRebbec`), /tab-separated/);
});

test('accepts one review per actual card with conservative confidence labeling', () => {
  assert.deepEqual(validateArtworkLedger([chapter], rows()), []);
});

test('rejects orphan, missing, and duplicate artwork reviews', () => {
  const notes = rows();
  const findings = validateArtworkLedger([chapter], [notes[0], notes[0], { ...notes[0], card: 'Imaginary Card' }]);
  assert.ok(findings.some((x) => x.includes('Duplicate artwork review')));
  assert.ok(findings.some((x) => x.includes('Orphan artwork review')));
  assert.ok(validateArtworkLedger([chapter], []).some((x) => x.includes('Missing artwork review')));
});

test('rejects unknown review kinds and empty or superficial interpretations', () => {
  const errors = validateArtworkLedger([chapter], [{ ...rows()[0], visualRole: 'photograph', basis: 'trusted', timeContext: 'future', editorialInterpretation: '' }]);
  for (const marker of ['visualRole', 'evidence basis', 'timeContext', 'substantive']) assert.ok(errors.some((e) => e.includes(marker)), marker);
});

test('review gallery uses exact printing identity, safely escapes content, and stays read-only', () => {
  const html = makeArtworkGallery([{ ...chapter, cards: [{ ...chapter.cards[0], significance: '<script>alert(1)</script>' }] }], rows());
  assert.ok(html.includes(`scryfall.com/card/cmr/1`));
  assert.ok(html.includes(`cards.scryfall.io/normal/front/${id[0]}/${id[1]}/${id}.jpg`));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!html.includes('<script>alert(1)</script>'));
});

test('extracts real folded significance for gallery captions', () => {
  const source = '---\ncards:\n  - name: "First"\n    setCode: "bro"\n    significance: >-\n      Actual narrative account\n      with its essential caution.\n  - name: "Second"\n    significance: >-\n      Different event illustration.\nsources: []\n---\n';
  assert.deepEqual([...extractCardSignificance(source)], [
    ['First', 'Actual narrative account with its essential caution.'],
    ['Second', 'Different event illustration.'],
  ]);
});

test('full ledger covers all published curated cards', async () => {
  const result = await checkArtwork();
  assert.deepEqual(result.errors, []);
  assert.equal(result.counts.references, 136);
  assert.equal(result.counts.reviewed, 136);
});
