import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sourceAccessFor, annotateReviewQueue, artworkReviewDependency } from '../src/data/source-access.mjs';
import { buildPhase14Roadmap, renderPhase14Markdown } from './audit-phase14-roadmap.mjs';
import { eventProvenance } from '../src/data/event-provenance.mjs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const targets = [
  'omenpaths-loot-and-the-future', 'omenpaths-desparking-consequences',
  'omenpaths-thunder-junction-vault', 'omenpaths-loot-discovered', 'omenpaths-thunder-crossroads',
];

test('source access is explicit and never inferred from score', () => {
  const queue = annotateReviewQueue([
    { id: 'battle-of-koilos', score: 6 },
    { id: targets[0], score: 6 },
    { id: 'some-other-event', score: 9 },
  ]);
  assert.equal(queue[0].sourceAccess.status, 'BLOCKED_ORIGINAL_NOVEL');
  assert.equal(queue[1].sourceAccess.status, 'WEB_ORIGINAL_AVAILABLE');
  assert.equal(queue[2].sourceAccess.status, 'NOT_ASSESSED');
  assert.equal(sourceAccessFor('spark-gideons-sacrifice').medium, 'novel');
});

test('all five Omenpaths events use primary-story citations from their chapter bibliography', () => {
  const chapter = read('src/content/chapters/omenpaths.mdx');
  for (const id of targets) {
    const record = eventProvenance[id];
    assert.ok(record, `Missing reviewed record: ${id}`);
    assert.ok(record.sources.some((s) => s.role === 'story'), `Missing original fiction: ${id}`);
    for (const source of record.sources) {
      assert.ok(source.url.startsWith('https://magic.wizards.com/en/news/'));
      assert.ok(chapter.includes(`title: "${source.title}"`), `Missing chapter bibliography title ${source.title}`);
      assert.ok(chapter.includes(source.url), `Missing chapter bibliography URL ${source.url}`);
      assert.ok(source.supports.length >= 35, `Need precise support statement for ${id}`);
    }
    assert.ok(record.artworkNote.length > 40);
  }
});

test('artwork dependency cannot be silently accepted as verified', () => {
  assert.equal(artworkReviewDependency('war-of-the-spark', "Gideon's Sacrifice"), 'spark-gideons-sacrifice');
  assert.equal(artworkReviewDependency('omenpaths', "The Kenriths' Royal Funeral"), null);
  assert.match(read('docs/artwork-fidelity-ledger.tsv'), /omenpaths\tThe Kenriths' Royal Funeral\tscene\tcontemporary\tcontext-assessed\t/);
});

test('ROADMAP records local split while retaining stable invasion URL', () => {
  const roadmap = read('ROADMAP.md');
  assert.match(roadmap, /Merged #155; Pages deployment passed/);
  assert.match(roadmap, /new-phyrexia/);
  assert.match(roadmap, /march-of-the-machine/);
  assert.match(roadmap, /Omenpaths moves from order 10 to order 11/);
  assert.match(read('src/content/chapters/march-of-the-machine.mdx'), /order:\s*10/);
});

test('roadmap builder includes accessibility and dependency without falsifying risk score', () => {
  const editorial = {
    status: 'PENDING_MANUAL_EDITORIAL_ACCEPTANCE',
    summary: { chapters: 1, events: 2, sourceReviewed: 0, awaitingEventReview: 2, highPriority: 0, cardUses: 1, pendingVisualChecks: 1, sceneVisualCandidates: 1, openPrimaryClaims: 0 },
    chapters: [{ id: 'omenpaths' }], openClaims: [],
    eventQueue: [{ id: 'battle-of-koilos', chapter: 'omenpaths', priority: 'medium', score: 6, signals: [] }, { id: targets[0], chapter: 'omenpaths', priority: 'medium', score: 6, signals: [] }],
    visualScenes: [{ chapter: 'war-of-the-spark', card: "Gideon's Sacrifice", basis: 'context-assessed', timeContext: 'contemporary' }],
  };
  const inspection = { editionIds: ['omenpaths'], adaptationsDisclosed: true, koilosPending: true, githubPagesConfigured: true, cloudflareDeployConfigured: false, productionPerformanceSuite: true };
  const report = buildPhase14Roadmap(editorial, inspection);
  assert.equal(report.queues.unreviewedEvents[0].sourceAccess.status, 'BLOCKED_ORIGINAL_NOVEL');
  assert.equal(report.queues.unreviewedEvents[1].sourceAccess.status, 'WEB_ORIGINAL_AVAILABLE');
  assert.equal(report.queues.artworkScenes[0].blockedByClaim, 'spark-gideons-sacrifice');
  assert.ok(report.sourceAvailability.some((item) => item.id === targets[0] && item.status === 'WEB_ORIGINAL_AVAILABLE'));
  assert.match(renderPhase14Markdown(report), /Source accessibility is not a risk score/);
});
