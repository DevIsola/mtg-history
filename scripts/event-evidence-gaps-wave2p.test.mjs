import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { collectEvidenceGaps, parseEvidenceGapArgs, renderEvidenceGapsMarkdown } from './audit-event-source-gaps.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const expected = [
  'brothers-tawnos-carries-testimony',
  'freyalise-seals-skyshroud',
  'mending-venser-first-walk',
  'phyrexia-dominaria-sleeper-war',
  'spark-gideons-sacrifice',
];

function sampleValidation() {
  const id = 'mending-venser-first-walk';
  const row = structuredClone(eventProvenance[id]);
  return {
    id, row,
    events: [{ id, chapterId: 'mending' }],
    sources: new Map([['mending', row.sources.map(({ title, url }) => ({ kind: 'official', title, url }))]]),
  };
}

test('five documented uncertainties remain visibly distinct from 43 provenance records', () => {
  assert.equal(Object.keys(eventProvenance).length, 43);
  const rows = collectEvidenceGaps();
  assert.equal(rows.length, 5);
  assert.deepEqual(rows.map((row) => row.id).sort(), expected.slice().sort());
  for (const row of rows) {
    assert.ok(row.claim.length >= 35);
    assert.ok(row.requiredEvidence.length >= 35);
    assert.ok(eventProvenance[row.id]?.sources?.length > 0);
  }
  assert.equal(collectEvidenceGaps({ ordinary: { sources: [], artworkNote: 'none' } }).length, 0);
});

test('existing provenance validator accepts actionable unresolved claims', () => {
  const { id, row, events, sources } = sampleValidation();
  assert.deepEqual(validateEventProvenance({ [id]: row }, events, sources), []);
});

test('unresolved claims fail closed on malformed entries, duplication or empty arrays', () => {
  const { id, row, events, sources } = sampleValidation();
  const badRows = [
    [[], /one to four actionable entries/],
    [[{ claim: 'short', requiredEvidence: 'too short' }], /must be substantive/],
    [Array.from({ length: 5 }, () => row.unresolvedClaims[0]), /one to four actionable entries/],
    [[row.unresolvedClaims[0], { ...row.unresolvedClaims[0] }], /duplicate unresolved claim/],
    ['not-an-array', /one to four actionable entries/],
  ];
  for (const [gaps, expectedError] of badRows) {
    const candidate = structuredClone(row);
    candidate.unresolvedClaims = gaps;
    assert.match(validateEventProvenance({ [id]: candidate }, events, sources).join(' | '), expectedError);
  }
});

test('report exports a stable and complete editor queue with no claims of certification', () => {
  const rows = collectEvidenceGaps();
  assert.deepEqual(collectEvidenceGaps(Object.fromEntries(Object.entries(eventProvenance).reverse())), rows);
  const report = renderEvidenceGapsMarkdown(rows);
  assert.match(report, /Open questions:\*\* 5 across 5 source-reviewed events/);
  assert.match(report, /not known factual errors/);
  assert.match(report, /mending-venser-first-walk/);
  assert.match(report, /freyalise-seals-skyshroud/);
  assert.match(report, /primary-source questions/);
});

test('report CLI handles explicit output paths and rejects ambiguous writes', () => {
  assert.deepEqual(parseEvidenceGapArgs(['--help']), { help: true });
  const output = parseEvidenceGapArgs(['--markdown', '/tmp/p.md', '--json', '/tmp/p.json']);
  assert.equal(output['--markdown'], '/tmp/p.md');
  assert.equal(output['--json'], '/tmp/p.json');
  assert.throws(() => parseEvidenceGapArgs(['--markdown']), /requires an output path/);
  assert.throws(() => parseEvidenceGapArgs(['--json', '--json']), /requires an output path/);
  assert.throws(() => parseEvidenceGapArgs(['--markdown', 'same', '--json', 'same']), /must differ/);
  assert.throws(() => parseEvidenceGapArgs(['--bogus']), /Unknown argument/);
});

test('reader exposes unresolved claims without incorrectly labeling citations fully verified', () => {
  const panel = read('src/components/EventEvidence.astro');
  const declaration = read('src/data/event-provenance.d.mts');
  const manifest = JSON.parse(read('package.json'));
  assert.match(panel, /entry\.unresolvedClaims/);
  assert.match(panel, /Claims still awaiting primary-source confirmation/);
  assert.match(panel, /requiredEvidence/);
  assert.match(panel, /aria-labelledby="event-evidence-gaps-heading"/);
  assert.match(declaration, /unresolvedClaims\?: Array/);
  assert.equal(manifest.scripts['audit:source-gaps'], 'node scripts/audit-event-source-gaps.mjs');
  assert.match(manifest.scripts.verify, /pnpm run check:provenance && pnpm run check:artwork/);
});
