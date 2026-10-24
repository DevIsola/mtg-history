import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORIGINAL_CHAPTER, RISE_CHAPTER, EVENT_PROPOSALS, PRINTING_INDEX_PROPOSALS,
  SECTION_PROPOSALS, buildPhase14bSplitLedger, renderPhase14bMarkdown,
  parsePhase14bArgs, runPhase14bSplitAudit,
} from './audit-phase14b-phyrexia-split.mjs';

const fixture = () => ({
  chapter: ORIGINAL_CHAPTER,
  roadmapIntent: true,
  hasPtCompanion: true,
  events: Object.values(EVENT_PROPOSALS).flat().map((id) => ({ id, chapterId: ORIGINAL_CHAPTER })),
  printings: Array.from({ length: 17 }, (_, i) => ({
    scryfallId: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
    name: `Printing ${i}`, setCode: 'mom', collectorNumber: String(i), artist: 'Test',
  })),
  sections: Object.values(SECTION_PROPOSALS).flat().map((number) => ({ number, title: `Section ${number}` })),
  sources: [{ title: 'Official original story', kind: 'official' }],
  relationships: [{ id: 'tie-one', a: 'x', b: 'y', chapterId: ORIGINAL_CHAPTER, context: 'Historical context' }],
  characters: [{ id: 'x', name: 'Character X', chapterIds: [ORIGINAL_CHAPTER] }],
});

test('every original event, printing and section has one explicit migration proposal', () => {
  const r = buildPhase14bSplitLedger(fixture());
  assert.equal(r.status, 'PROPOSED_SPLIT_AWAITING_EDITORIAL_ACCEPTANCE');
  assert.equal(r.current.events, 13);
  assert.equal(r.current.curatedPrintings, 17);
  assert.equal(r.proposed.eventAssignments[RISE_CHAPTER].length, 6);
  assert.equal(r.proposed.eventAssignments[ORIGINAL_CHAPTER].length, 7);
  assert.equal(r.proposed.printingAssignments[RISE_CHAPTER].length, 10);
  assert.equal(r.proposed.printingAssignments[ORIGINAL_CHAPTER].length, 7);
  assert.deepEqual(r.proposed.sections.CROSS_ARC_REWRITE.map((x) => x.number), ['VI', 'X', 'XI']);
  assert.equal(Object.values(PRINTING_INDEX_PROPOSALS).flat().length, 17);
});

test('the audit fails closed on a missing or duplicated event/printing/section', () => {
  const changes = [
    (x) => x.events.pop(),
    (x) => x.events[0].id = x.events[1].id,
    (x) => x.printings.pop(),
    (x) => x.printings[1].scryfallId = x.printings[0].scryfallId,
    (x) => x.sections.pop(),
    (x) => x.characters[0].chapterIds = ['different-chapter'],
    (x) => x.events[0].chapterId = RISE_CHAPTER,
    (x) => x.hasPtCompanion = false,
    (x) => x.roadmapIntent = false,
  ];
  for (const mutate of changes) {
    const x = fixture(); mutate(x);
    assert.throws(() => buildPhase14bSplitLedger(x));
  }
});

test('bibliography, relationships and characters require human reassignment', () => {
  const r = buildPhase14bSplitLedger(fixture());
  assert.equal(r.requiresManualAssignment.bibliography[0].target, 'UNASSIGNED_SOURCE_REVIEW');
  assert.equal(r.requiresManualAssignment.relationships[0].target, 'UNASSIGNED_RELATIONSHIP_REVIEW');
  assert.equal(r.requiresManualAssignment.characters[0].target, 'UNASSIGNED_CHARACTER_REVIEW');
  assert.ok(r.migrationDependencies.some((s) => s.includes('redirects')) ||
    r.migrationDependencies.some((s) => s.includes('deep links')));
  const markdown = renderPhase14bMarkdown(r);
  assert.match(markdown, /migration NOT executed|migration has been performed/);
  assert.match(markdown, /Scryfall UUID/);
  assert.match(markdown, /Portuguese:/);
  assert.doesNotMatch(markdown, /APPROVED|CERTIFIED/);
});

test('CLI rejects invalid or ambiguous output destinations', () => {
  assert.deepEqual(parsePhase14bArgs(['--help']), { help: true });
  assert.deepEqual(parsePhase14bArgs([]), {});
  assert.throws(() => parsePhase14bArgs(['--json']));
  assert.throws(() => parsePhase14bArgs(['--html', 'foo']));
  assert.throws(() => parsePhase14bArgs(['--json', 'x', '--json', 'y']));
  assert.throws(() => parsePhase14bArgs(['--markdown', 'same', '--json', 'same']));
});

test('pre-migration audit rejects the migrated working tree', async () => {
  await assert.rejects(runPhase14bSplitAudit, /Expected published ten-chapter baseline/);
});
