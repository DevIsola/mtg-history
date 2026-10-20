import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildEditorialConsolidation,
  renderEditorialConsolidation,
  parseConsolidationArgs,
  runEditorialConsolidation,
} from './audit-editorial-consolidation.mjs';

const scene = {
  chapter: 'alpha',
  card: 'Scene A',
  visualRole: 'scene',
  basis: 'context-assessed',
  timeContext: 'retrospective',
};

const portrait = {
  chapter: 'beta',
  card: 'Portrait B',
  visualRole: 'portrait',
  basis: 'visual-checked',
  timeContext: 'contemporary',
};

const chapterSource = id => `---
title: "${id}"
chronology:
  storyPeriod: "undated"
  publicationHistory: >-
    Historical publication
---

## Main narrative

Text.
`;

function fixture() {
  return {
    risk: {
      summary: {
        total: 2,
        reviewed: 1,
        queued: 1,
        chapters: 2,
        high: 1,
      },
      byChapter: [
        {
          chapterId: 'alpha',
          total: 1,
          reviewed: 0,
          queued: 1,
          high: 1,
          medium: 0,
        },
        {
          chapterId: 'beta',
          total: 1,
          reviewed: 1,
          queued: 0,
          high: 0,
          medium: 0,
        },
      ],
      rows: [
        {
          id: 'e1',
          chapterId: 'alpha',
          priority: 'high',
          score: 8,
          signals: ['calendar-claim'],
        },
      ],
    },
    artwork: {
      errors: [],
      counts: { references: 2, reviewed: 2 },
      rows: [scene, portrait],
      chapters: [
        {
          id: 'alpha',
          order: 1,
          sources: [{ kind: 'official' }],
          cards: [{ name: 'Scene A' }],
        },
        {
          id: 'beta',
          order: 2,
          sources: [{ kind: 'official' }, { kind: 'book' }],
          cards: [{ name: 'Portrait B' }],
        },
      ],
    },
    provenance: {
      errors: [],
      totalEvents: 2,
      reviewedEvents: 1,
    },
    gaps: [
      {
        id: 'e2',
        claim: 'Specific claim unverified',
        requiredEvidence: 'Read the original story',
      },
    ],
    chapterTexts: {
      alpha: chapterSource('alpha'),
      beta: chapterSource('beta'),
    },
  };
}

test('consolidation accounts for every chapter, event, artwork use and open claim', () => {
  const report = buildEditorialConsolidation(fixture());

  assert.deepEqual(report.summary, {
    chapters: 2,
    events: 2,
    sourceReviewed: 1,
    awaitingEventReview: 1,
    highPriority: 1,
    cardUses: 2,
    pendingVisualChecks: 1,
    sceneVisualCandidates: 1,
    openPrimaryClaims: 1,
  });

  assert.equal(
    report.status,
    'PENDING_MANUAL_EDITORIAL_ACCEPTANCE'
  );

  assert.deepEqual(
    report.visualScenes.map(r => r.card),
    ['Scene A']
  );

  assert.equal(report.chapters[1].bibliography, 2);
});

test('report never claims canonical or visual certification', () => {
  const report = renderEditorialConsolidation(
    buildEditorialConsolidation(fixture())
  );

  assert.match(report, /not historical fact verification/);
  assert.match(report, /\[ \] Sign off only after the human checks/);
  assert.match(report, /e2.*Specific claim unverified/);
  assert.match(report, /Scene A/);
  assert.match(report, /calendar-claim/);
});

test('missing chronology, counts and artwork cause a failure', () => {
  const mutations = [
    f => { f.chapterTexts.beta = '---\ntitle: Beta\n---\n## One'; },
    f => { f.risk.summary.queued = 0; },
    f => { f.artwork.rows.pop(); },
    f => { f.risk.byChapter.pop(); },
    f => { f.provenance.errors.push('invalid'); },
  ];

  for (const mutate of mutations) {
    const input = fixture();
    mutate(input);

    assert.throws(() => buildEditorialConsolidation(input));
  }
});

test('chapter order remains stable independent of collection order', () => {
  const a = buildEditorialConsolidation(fixture());
  const input = fixture();

  input.artwork.chapters.reverse();
  input.risk.byChapter.reverse();

  const b = buildEditorialConsolidation(input);

  assert.deepEqual(a.chapters, b.chapters);
  assert.deepEqual(a.visualScenes, b.visualScenes);
});

test('CLI rejects ambiguous and unsupported output arguments', () => {
  assert.deepEqual(parseConsolidationArgs(['--help']), {
    help: true,
  });

  assert.deepEqual(parseConsolidationArgs([]), {});

  assert.throws(
    () => parseConsolidationArgs(['--json']),
    /requires output path/
  );

  assert.throws(
    () => parseConsolidationArgs(['--html', 'foo']),
    /Unknown/
  );

  assert.throws(
    () => parseConsolidationArgs([
      '--json', 'same', '--markdown', 'same',
    ]),
    /differ/
  );

  assert.throws(
    () => parseConsolidationArgs([
      '--json', 'a', '--json', 'b',
    ]),
    /duplicate/
  );
});

test('real repository inventory retains all ten chapters and evidence boundaries', async () => {
  const report = await runEditorialConsolidation();

  assert.equal(report.summary.chapters, 10);
  assert.equal(report.summary.events, 133);
  assert.equal(report.summary.cardUses, 135);
  assert.equal(report.summary.sourceReviewed, 43);
  assert.equal(report.summary.openPrimaryClaims, 3);

  assert.equal(
    report.summary.awaitingEventReview,
    report.summary.events - report.summary.sourceReviewed
  );

  assert.equal(
    report.status,
    'PENDING_MANUAL_EDITORIAL_ACCEPTANCE'
  );

  assert.equal(report.chapters.length, 10);
});
