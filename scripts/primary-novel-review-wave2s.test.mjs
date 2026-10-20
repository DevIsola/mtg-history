import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { eventProvenance } from '../src/data/event-provenance.mjs';
import { NOVEL_REVIEW_TARGETS, buildNovelReviewPackets, renderNovelReviewWorksheet, parseNovelReviewArgs } from './prepare-primary-novel-review.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const books = ['Time Spiral', 'Planar Chaos', 'Future Sight'].map((title) => ({ title, kind: 'book' }));

test('two unresolved Time Spiral questions retain distinct primary novel targets', () => {
  const packets = buildNovelReviewPackets(eventProvenance, books);
  assert.equal(packets.length, 2);
  assert.deepEqual(packets.map((x) => x.id), [
    'mending-venser-first-walk', 'freyalise-seals-skyshroud',
  ]);
  assert.deepEqual(packets[0].books, ['Time Spiral', 'Planar Chaos']);
  assert.deepEqual(packets[1].books, ['Planar Chaos']);
  assert.match(packets[0].requiredEvidence, /edition and page/);
  assert.match(packets[1].requiredEvidence, /forest.s fate/);
  assert.ok(packets.every((x) => x.contextualSources.length > 0));
  assert.equal(NOVEL_REVIEW_TARGETS.length, 2);
});

test('worksheet never misrepresents secondary summaries as primary verification', () => {
  const report = renderNovelReviewWorksheet(buildNovelReviewPackets(eventProvenance, books));
  assert.match(report, /Status: \*\*unverified\*\*/);
  assert.match(report, /Secondary plot summaries are leads only/);
  assert.match(report, /0 claims newly verified|No changes to the 43 reviewed-event count/);
  assert.match(report, /Edition \/ ISBN examined: \[record after reading\]/);
  assert.match(report, /Venser/);
  assert.match(report, /Freyalise/);
  assert.doesNotMatch(report, /chapter\s+\d+\s*page\s+\d+/i);
});

test('missing novels and resolved claims refuse worksheet generation rather than inventing evidence', () => {
  assert.throws(() => buildNovelReviewPackets(eventProvenance, []), /missing primary book bibliography/);
  const changed = structuredClone(eventProvenance);
  delete changed['freyalise-seals-skyshroud'].unresolvedClaims;
  assert.throws(() => buildNovelReviewPackets(changed, books), /expected exactly one outstanding/);
  assert.throws(() => renderNovelReviewWorksheet([]), /No novel verification tasks/);
});

test('CLI requires explicit report destination; no implicit repo writes', () => {
  assert.deepEqual(parseNovelReviewArgs(['--help']), { help: true });
  assert.deepEqual(parseNovelReviewArgs(['--output', '/tmp/novel.md']), { output: '/tmp/novel.md' });
  assert.throws(() => parseNovelReviewArgs([]), /Usage:/);
  assert.throws(() => parseNovelReviewArgs(['--output']), /Usage:/);
  assert.throws(() => parseNovelReviewArgs(['--output', '--help']), /Usage:/);
  assert.throws(() => parseNovelReviewArgs(['--json', '/tmp/p.json']), /Usage:/);
});

test('primary bibliography exists, source panels retain uncertainty, and printing IDs remain stable', () => {
  const mending = read('src/content/chapters/mending.mdx');
  assert.match(mending, /title: "Time Spiral"\s+kind: book/);
  assert.match(mending, /title: "Planar Chaos"\s+kind: book/);
  const venser = JSON.parse(read('src/content/events/mending-venser-first-walk.json'));
  const freyalise = JSON.parse(read('src/content/events/freyalise-seals-skyshroud.json'));
  assert.equal(venser.cardId, '0e84fc99-4045-4518-b588-512a675f2933');
  assert.equal(freyalise.cardId, '6c6ef042-1a69-4b16-abae-4f436dbadbbd');
  assert.equal(Object.keys(eventProvenance).length, 43);
  assert.ok(eventProvenance['spark-gideons-sacrifice'].unresolvedClaims?.length > 0);
  const manifest = JSON.parse(read('package.json'));
  assert.equal(manifest.scripts['review:novel-evidence'], 'node scripts/prepare-primary-novel-review.mjs');
});
