import assert from 'node:assert/strict';
import { test } from 'node:test';
import { auditHistoricalRisk, renderHistoricalRiskMarkdown, signalExplanation } from '../src/data/historical-risk.mjs';
import { parseHistoricalRiskArgs, runHistoricalRiskAudit } from './audit-historical-risk.mjs';

const ids = {
  a: '00000000-0000-4000-8000-000000000001',
  b: '00000000-0000-4000-8000-000000000002',
};
function data() {
  return {
    chapters: [
      { id: 'alpha', order: 1, sources: [{ title: 'Reference', kind: 'official' }], cards: [{ scryfallId: ids.a, name: 'Portrait A' }] },
      { id: 'beta', order: 2, sources: [], cards: [{ scryfallId: ids.b, name: 'Battle B' }] },
    ],
    artworkRows: [
      { chapter: 'alpha', card: 'Portrait A', visualRole: 'portrait', basis: 'context-assessed', timeContext: 'retrospective' },
      { chapter: 'beta', card: 'Battle B', visualRole: 'scene', basis: 'context-assessed', timeContext: 'retrospective' },
    ],
    events: [
      { id: 'a', chapterId: 'alpha', title: 'An early discovery', summary: 'An artifact is found.',
        narrative: ['A person discovers a tool.'], characterIds: ['figure'], cardId: ids.a },
      { id: 'b', chapterId: 'beta', title: 'The contested invasion',
        summary: 'Conflicting accounts describe interplanar battles in 4562 AR.',
        narrative: ['It caused the fall of every city.'], characterIds: ['figure'], cardId: ids.b },
    ],
    reviewed: {},
  };
}

test('triage ranks explicit chronological, contested and contextual scene issues above plain references', () => {
  const result = auditHistoricalRisk(data());
  assert.deepEqual(result.summary, { total: 2, reviewed: 0, queued: 2, chapters: 2, high: 1, medium: 0, standard: 1 });
  assert.deepEqual(result.rows.map((row) => row.id), ['b', 'a']);
  assert.deepEqual(result.rows[0].signals, [
    'calendar-claim', 'contested-language', 'interplanar-claim', 'absolute-language',
    'causal-claim', 'cross-chapter-figure', 'contextual-scene',
  ]);
  assert.equal(result.rows[0].score, 17);
  assert.equal(result.rows[0].artwork.role, 'scene');
  assert.ok(signalExplanation('calendar-claim').includes('chronological'));
});

test('only canonical reviewed event IDs leave the queue, and an in-chapter-only figure is not cross-chapter evidence', () => {
  const input = data();
  input.reviewed = { b: { chronology: { precision: 'relative' } } };
  const r = auditHistoricalRisk(input);
  assert.equal(r.summary.reviewed, 1);
  assert.equal(r.summary.queued, 1);
  assert.equal(r.rows[0].id, 'a');
  assert.equal(r.rows[0].priority, 'standard');
  input.events[1].characterIds = ['someone-else'];
  assert.ok(!auditHistoricalRisk(input).rows[0].signals.includes('cross-chapter-figure'));
});

test('orphan provenance, duplicate IDs, unknown chapters, missing printings and missing artwork fail closed', () => {
  const mutations = [
    [({ reviewed }) => { reviewed.ghost = {}; }, /orphan reviewed event/],
    [({ events }) => { events[1].id = events[0].id; }, /duplicate ID/],
    [({ events }) => { events[0].chapterId = 'void'; }, /unknown chapter/],
    [({ events }) => { events[0].cardId = 'unknown'; }, /is not curated/],
    [({ artworkRows }) => { artworkRows.pop(); }, /missing artwork review/],
    [({ artworkRows }) => { artworkRows.push(artworkRows[0]); }, /duplicate artwork ledger row/],
  ];
  for (const [mutate, expected] of mutations) {
    const input = data();
    mutate(input);
    assert.throws(() => auditHistoricalRisk(input), expected);
  }
});

test('ranking is deterministic across input order and does not treat a portrait as scene evidence', () => {
  const input = data();
  input.events[1].narrative.push('A second narrative paragraph.', 'A third.', 'A fourth.');
  const a = auditHistoricalRisk(input);
  input.events.reverse();
  input.chapters.reverse();
  const b = auditHistoricalRisk(input);
  assert.deepEqual(a.rows, b.rows);
  assert.ok(!a.rows.find((row) => row.id === 'a').signals.includes('contextual-scene'));
  assert.ok(b.rows[0].signals.includes('multi-paragraph'));
});

test('report exposes complete queue, artwork labels and explicitly disclaims certification', () => {
  const report = renderHistoricalRiskMarkdown(auditHistoricalRisk(data()));
  assert.match(report, /2\*\* events remain in the manual review queue/);
  assert.match(report, /does not certify canon/);
  assert.match(report, /\/events\/a\//);
  assert.match(report, /\/events\/b\//);
  assert.match(report, /Portrait A \(portrait; retrospective; context-assessed\)/);
  assert.match(report, /chapter bibliography is not an event-level citation/i);
});

test('report arguments reject unsupported and ambiguous writes', () => {
  assert.deepEqual(parseHistoricalRiskArgs(['--markdown', '/tmp/queue.md', '--json', '/tmp/queue.json']),
    { '--markdown': '/tmp/queue.md', '--json': '/tmp/queue.json' });
  assert.deepEqual(parseHistoricalRiskArgs(['--', '--help']), { help: true });
  assert.throws(() => parseHistoricalRiskArgs(['--markdown']), /requires an output path/);
  assert.throws(() => parseHistoricalRiskArgs(['--json', '--json']), /requires an output path/);
  assert.throws(() => parseHistoricalRiskArgs(['--markdown', 'same', '--json', 'same']), /must differ/);
  assert.throws(() => parseHistoricalRiskArgs(['--bogus']), /Unknown option/);
});

test('repository-level audit accounts for 26 reviewed and 107 unreviewed records without mutating content', async () => {
  const result = await runHistoricalRiskAudit();
  assert.deepEqual(result.summary, {
    total: 133, reviewed: 26, queued: 107, chapters: 10,
    high: result.summary.high, medium: result.summary.medium, standard: result.summary.standard,
  });
  assert.equal(result.byChapter.reduce((n, chapter) => n + chapter.queued, 0), 107);
  assert.equal(new Set(result.rows.map((row) => row.id)).size, 107);
  assert.equal(result.summary.high + result.summary.medium + result.summary.standard, 107);
  assert.ok(result.rows.every((row) => row.artwork.card && row.chapterId && row.chapterSourceCount >= 0));
});
