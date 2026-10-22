import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  buildPhase14Roadmap, renderPhase14Markdown, parsePhase14Args,
} from './audit-phase14-roadmap.mjs';

function fixture() {
  return {
    editorial: {
      status: 'PENDING_MANUAL_EDITORIAL_ACCEPTANCE',
      summary: {
        chapters: 2, events: 3, sourceReviewed: 1, awaitingEventReview: 2,
        highPriority: 1, cardUses: 4, pendingVisualChecks: 3,
        sceneVisualCandidates: 1, openPrimaryClaims: 1,
      },
      chapters: [{ id: 'thran' }, { id: 'brothers-war' }],
      openClaims: [{ id: 'question-1', claim: 'Unverified detail', requiredEvidence: 'Original passage' }],
      eventQueue: [
        { id: 'event-1', chapter: 'thran', priority: 'high', score: 9, signals: ['chronology'] },
        { id: 'event-2', chapter: 'brothers-war', priority: 'standard', score: 2, signals: [] },
      ],
      visualScenes: [{ chapter: 'thran', card: 'Historical scene', basis: 'context-assessed', timeContext: 'retrospective' }],
    },
    inspection: {
      editionIds: ['brothers-war', 'thran'], adaptationsDisclosed: true,
      koilosPending: true, githubPagesConfigured: true,
      cloudflareDeployConfigured: false, productionPerformanceSuite: true,
    },
  };
}

test('roadmap reuses validated editorial queues and counts without certifying lore', () => {
  const { editorial, inspection } = fixture();
  const r = buildPhase14Roadmap(editorial, inspection);
  assert.equal(r.status, 'PENDING_HUMAN_PHASE14_ACCEPTANCE');
  assert.equal(r.inventory.sourceReviewed, 1);
  assert.equal(r.workstreams[0].outstanding, 2); // Ledgered claim plus separate Koilos.
  assert.equal(r.queues.unreviewedEvents.length, 2);
  assert.equal(r.queues.artworkScenes[0].card, 'Historical scene');
  assert.equal(r.localization.portugueseEditions, 2);
  assert.equal(r.localization.fullyTranslatedAndProofread, false);
  assert.equal(r.publishing.cloudflareDeployConfigured, false);
});

test('priority packet distinguishes the Koilos queue, source triage and artwork illustration', () => {
  const { editorial, inspection } = fixture();
  const markdown = renderPhase14Markdown(buildPhase14Roadmap(editorial, inspection));
  assert.match(markdown, /PENDING_HUMAN_PHASE14_ACCEPTANCE/);
  assert.match(markdown, /question-1.*Original passage/);
  assert.match(markdown, /battle-of-koilos.*not counted in the ledgered unresolved claims/);
  assert.match(markdown, /event-1.*chronology/);
  assert.doesNotMatch(markdown, /\| standard \| 2 \|/);
  assert.match(markdown, /Historical scene.*context-assessed/);
  assert.match(markdown, /not canon verification/);
  assert.match(markdown, /three production performance runs/);
});

test('input drift and duplicate chapter IDs fail closed', () => {
  const cases = [
    (x) => { x.editorial.summary.awaitingEventReview = 5; },
    (x) => { x.editorial.summary.openPrimaryClaims = 0; },
    (x) => { x.inspection.editionIds = ['thran', 'thran']; },
    (x) => { x.inspection.editionIds = ['thran', 'unknown']; },
    (x) => { x.editorial.status = 'CERTIFIED'; },
  ];
  for (const modify of cases) {
    const input = fixture();
    modify(input);
    assert.throws(() => buildPhase14Roadmap(input.editorial, input.inspection));
  }
});

test('CLI output destinations are optional but must be unambiguous', () => {
  assert.deepEqual(parsePhase14Args(['--help']), { help: true });
  assert.deepEqual(parsePhase14Args([]), {});
  assert.deepEqual(parsePhase14Args(['--', '--help']), { help: true });
  for (const args of [
    ['--json'], ['--pdf', 'a'], ['--json', 'x', '--json', 'y'],
    ['--markdown', 'same', '--json', 'same'],
  ]) assert.throws(() => parsePhase14Args(args));
});

test('repository integration is read-only and retains the existing review boundaries', () => {
  const script = readFileSync(new URL('./audit-phase14-roadmap.mjs', import.meta.url), 'utf8');
  assert.match(script, /runEditorialConsolidation\(\)/);
  assert.match(script, /eventProvenance/);
  assert.match(script, /\.github\/workflows\//);
  assert.match(script, /living-chapters-phase4\.spec\.mjs/);
  assert.doesNotMatch(script, /fetch\(|innerHTML\s*=/);
  assert.doesNotMatch(script, /\b(?:rename|rm|unlink|mkdir)\(/);
});
