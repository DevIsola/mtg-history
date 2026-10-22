/**
 * Phase 14: integrate existing editorial audit evidence into a prioritization
 * packet. All historical and visual sign-off remains human work.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runEditorialConsolidation } from './audit-editorial-consolidation.mjs';
import { eventProvenance } from '../src/data/event-provenance.mjs';
import { PORTUGUESE_BATCH_1 } from '../src/data/pt-chapter-batch1.mjs';
import { PORTUGUESE_BATCH_2 } from '../src/data/pt-chapter-batch2.mjs';
import { PORTUGUESE_BATCH_3 } from '../src/data/pt-chapter-batch3.mjs';

const rootFile = (path) => new URL('../' + path, import.meta.url);

export function parsePhase14Args(argv) {
  const args = argv[0] === '--' ? argv.slice(1) : argv;
  if (args.length === 1 && args[0] === '--help') return { help: true };
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const option = args[i];
    if (!['--markdown', '--json'].includes(option) || Object.hasOwn(options, option)) {
      throw new Error(`Unknown or duplicate option: ${option}`);
    }
    const destination = args[++i];
    if (!destination || destination.startsWith('--')) throw new Error(`${option} requires an output path`);
    options[option] = resolve(destination);
  }
  if (options['--markdown'] && options['--markdown'] === options['--json']) {
    throw new Error('Markdown and JSON destinations must differ');
  }
  return options;
}

/** Read configuration instead of assuming a future provider is deployed. */
export async function inspectPhase14Repository() {
  const editionIds = [
    'thran',
    ...PORTUGUESE_BATCH_1.map((chapter) => chapter.id),
    ...PORTUGUESE_BATCH_2.map((chapter) => chapter.id),
    ...PORTUGUESE_BATCH_3.map((chapter) => chapter.id),
  ];
  const workflowDir = rootFile('.github/workflows/');
  const workflowNames = (await readdir(workflowDir))
    .filter((name) => /\.ya?ml$/.test(name)).sort();
  const workflows = await Promise.all(workflowNames.map((name) =>
    readFile(new URL(name, workflowDir), 'utf8')));
  const portuguesePage = await readFile(rootFile('src/pages/pt-br/chapters/[id].astro'), 'utf8');
  const thranPage = await readFile(rootFile('src/pages/pt-br/chapters/thran/index.astro'), 'utf8');
  const performanceConfig = await readFile(rootFile('playwright.performance.config.mjs'), 'utf8');
  const chapterPerformance = await readFile(rootFile('tests/performance/living-chapters-phase4.spec.mjs'), 'utf8');

  return {
    editionIds,
    adaptationsDisclosed: portuguesePage.includes('não é uma tradução integral') &&
      /condensad|adapta|resumid/i.test(thranPage),
    koilosPending: !Object.hasOwn(eventProvenance, 'battle-of-koilos'),
    githubPagesConfigured: workflows.some((source) => /actions\/deploy-pages@/i.test(source)),
    cloudflareDeployConfigured: workflows.some((source) => /cloudflare\/|wrangler\s|cloudflare pages/i.test(source)),
    productionPerformanceSuite: /astro preview/.test(performanceConfig) &&
      /living-chapter-performance\.json/.test(chapterPerformance),
  };
}

function assertNonNegative(value, label) {
  if (!Number.isInteger(value) || value < 0) throw new Error(`Invalid ${label}: ${value}`);
}

/** Pure report builder: all counts are sourced from validated audit inputs. */
export function buildPhase14Roadmap(editorial, inspection) {
  if (editorial?.status !== 'PENDING_MANUAL_EDITORIAL_ACCEPTANCE') {
    throw new Error('Phase 14 requires the existing editorial acceptance report');
  }
  const s = editorial.summary;
  for (const key of ['chapters', 'events', 'sourceReviewed', 'awaitingEventReview',
    'highPriority', 'cardUses', 'pendingVisualChecks', 'sceneVisualCandidates', 'openPrimaryClaims']) {
    assertNonNegative(s[key], key);
  }
  if (s.sourceReviewed + s.awaitingEventReview !== s.events ||
      editorial.chapters.length !== s.chapters ||
      editorial.eventQueue.length !== s.awaitingEventReview ||
      editorial.openClaims.length !== s.openPrimaryClaims ||
      editorial.visualScenes.length !== s.sceneVisualCandidates) {
    throw new Error('Editorial queue counts do not reconcile');
  }

  const enIds = editorial.chapters.map((c) => c.id);
  const ptIds = inspection.editionIds;
  if (new Set(enIds).size !== enIds.length || new Set(ptIds).size !== ptIds.length) {
    throw new Error('Duplicate English or Portuguese chapter identity');
  }
  const english = new Set(enIds);
  const missing = enIds.filter((id) => !ptIds.includes(id));
  const unexpected = ptIds.filter((id) => !english.has(id));
  if (missing.length || unexpected.length) {
    throw new Error(`Portuguese chapter coverage mismatch: missing ${missing.join(', ') || 'none'}, unexpected ${unexpected.join(', ') || 'none'}`);
  }

  const primaryTasks = s.openPrimaryClaims + (inspection.koilosPending ? 1 : 0);
  const workstreams = [
    {
      id: 'primary-fiction', priority: 'P0', outstanding: primaryTasks,
      action: 'Resolve or explicitly retain ledgered primary-fiction questions; review Koilos separately when still pending.',
      acceptance: 'Record exact edition/location and update claims only with defensible evidence.',
    },
    {
      id: 'event-provenance', priority: 'P0', outstanding: s.awaitingEventReview,
      action: 'Work the existing source-review queue, starting with high-priority triage suggestions.',
      acceptance: 'Review claim-level evidence and update event provenance and narrative together.',
    },
    {
      id: 'artwork-fidelity', priority: 'P1', outstanding: s.pendingVisualChecks,
      action: 'Inspect exact printings, prioritizing unverified narrative-scene candidates.',
      acceptance: 'Compare the rendered artwork, category, chronology and significance before visual sign-off.',
    },
    {
      id: 'pt-br-parity', priority: 'P1', outstanding: null,
      action: 'Review the condensed Portuguese reading editions for meaning, links, terminology and translation boundaries.',
      acceptance: 'Do not present adaptations as full translations without a separate editorial review.',
    },
    {
      id: 'performance', priority: 'P1', outstanding: null,
      action: 'Compare at least three retained production-preview performance runs and visual behavior on representative devices.',
      acceptance: 'Record accepted baselines and uncertainty; never equate lab runs with field Core Web Vitals.',
    },
    {
      id: 'publishing', priority: 'P2', outstanding: null,
      action: 'Review domain and parallel Cloudflare Pages feasibility only after defining comparison criteria.',
      acceptance: 'Require explicit domain/hosting decision, reproducible builds and verified deployment workflows.',
    },
  ];
  return {
    status: 'PENDING_HUMAN_PHASE14_ACCEPTANCE',
    inventory: { ...s },
    localization: {
      englishChapters: enIds.length,
      portugueseEditions: ptIds.length,
      condensedAdaptations: inspection.adaptationsDisclosed,
      completeChapterIdentityCoverage: true,
      fullyTranslatedAndProofread: false,
    },
    publishing: {
      githubPagesConfigured: inspection.githubPagesConfigured,
      cloudflareDeployConfigured: inspection.cloudflareDeployConfigured,
      domainDecision: 'NOT_ASSESSED',
    },
    performance: {
      productionSuiteConfigured: inspection.productionPerformanceSuite,
      comparisonStatus: 'REQUIRES_SAVED_LOCAL_SAMPLES',
    },
    koilos: { pendingSeparatePrimaryFictionReview: inspection.koilosPending },
    workstreams,
    queues: {
      primaryClaims: editorial.openClaims,
      unreviewedEvents: editorial.eventQueue,
      artworkScenes: editorial.visualScenes,
      chapters: editorial.chapters,
    },
  };
}

const cell = (value) => String(value).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');

export function renderPhase14Markdown(report) {
  const { inventory: s, localization, publishing, performance, koilos } = report;
  return [
    '# Phase 14 — Post–Living Chapters roadmap audit',
    '',
    `**Status: ${report.status}.** This packet is a triage snapshot, not canon verification, accessibility certification, visual artwork acceptance, or hosting approval.`,
    '',
    '## Validated inventory and open queues',
    '',
    `- ${s.chapters} chapters, ${s.events} historical events; ${s.sourceReviewed} source-reviewed, ${s.awaitingEventReview} awaiting event review (${s.highPriority} high-priority suggestions).`,
    `- ${s.cardUses} chapter artwork uses, ${s.pendingVisualChecks} not yet tagged visual-checked, ${s.sceneVisualCandidates} scene candidates for first visual inspection.`,
    `- ${s.openPrimaryClaims} outstanding ledgered primary-fiction questions. Koilos separate pending-primary-fiction review: ${koilos.pendingSeparatePrimaryFictionReview ? 'yes' : 'no'}.`,
    `- ${localization.portugueseEditions}/${localization.englishChapters} PT-BR edition identities; concise adaptations, not certified full translations. Adaptation disclosure found: ${localization.condensedAdaptations ? 'yes' : 'review wording'}.`,
    `- Production performance suite configured: ${performance.productionSuiteConfigured ? 'yes' : 'review configuration'}; comparison: ${performance.comparisonStatus}.`,
    `- GitHub Pages workflow configured: ${publishing.githubPagesConfigured ? 'yes' : 'not detected'}; Cloudflare workflow detected: ${publishing.cloudflareDeployConfigured ? 'yes' : 'no'}; domain decision: ${publishing.domainDecision}.`,
    '',
    '## Ordered workstreams',
    '',
    '| Priority | Workstream | Open records | Recommended next action | Acceptance boundary |',
    '| --- | --- | ---: | --- | --- |',
    ...report.workstreams.map((w) => `| ${w.priority} | ${w.id} | ${w.outstanding ?? 'manual'} | ${cell(w.action)} | ${cell(w.acceptance)} |`),
    '',
    '## Explicitly unresolved primary-fiction claims',
    '',
    ...report.queues.primaryClaims.map((x) => `- [ ] **${cell(x.id)}**: ${cell(x.claim)} — required: ${cell(x.requiredEvidence)}`),
    ...(report.queues.primaryClaims.length ? [] : ['No ledgered claims. This does not certify the full narrative.']),
    ...(koilos.pendingSeparatePrimaryFictionReview ? ['- [ ] **battle-of-koilos**: separate pending original-fiction check (not counted in the ledgered unresolved claims); review *Invasion* before altering provenance.'] : []),
    '',
    '## Highest-priority event-source review proposals',
    '',
    '| Priority | Score | Chapter | Event | Signals |',
    '| --- | ---: | --- | --- | --- |',
    ...report.queues.unreviewedEvents.filter((x) => x.priority === 'high').map((x) =>
      `| ${x.priority} | ${x.score} | ${cell(x.chapter)} | ${cell(x.id)} | ${cell(x.signals.join(', ') || 'baseline')} |`),
    ...(report.queues.unreviewedEvents.some((x) => x.priority === 'high') ? [] : ['| — | — | — | No high-priority events currently queued | — |']),
    '',
    'The full event review queue is retained in the JSON output and existing editorial-consolidation report.',
    '',
    '## First-pass visual scene queue',
    '',
    ...report.queues.artworkScenes.map((x) => `- [ ] ${cell(x.chapter)} / ${cell(x.card)} — ${cell(x.basis)}; ${cell(x.timeContext)}`),
    ...(report.queues.artworkScenes.length ? [] : ['No unverified scene candidates in the current classification ledger.']),
    '',
    '## Acceptance checkpoints (human decisions)',
    '',
    '- [ ] Review the source passages for priority claims; preserve open questions when source text is unavailable.',
    '- [ ] Confirm each proposed correction preserves both story chronology and real publication chronology.',
    '- [ ] Inspect exact printing, artwork crop, artist credit and historical interpretation before claiming scene fidelity.',
    '- [ ] Compare PT-BR adaptations with the canonical English chapters; document specific equivalence gaps.',
    '- [ ] Retain and compare at least three production performance runs; test keyboard and reduced-motion modes.',
    '- [ ] Make domain and alternate-hosting decisions only with reproducible build and comparison criteria.',
    '- [ ] Merge evidence-specific PRs only after verification, browser tests and editorial review.',
    '',
    '## Reproducibility',
    '',
    'This report reuses `runEditorialConsolidation()` and current repository configuration; generating it changes no historical or source metadata. Use `pnpm run audit:consolidation` for the complete chapter acceptance matrix, `pnpm run review:artwork` for the exact-printing gallery, and the production Playwright configuration for measurements.',
    '',
  ].join('\n');
}

export async function runPhase14Roadmap() {
  const editorial = await runEditorialConsolidation();
  const inspection = await inspectPhase14Repository();
  return buildPhase14Roadmap(editorial, inspection);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const args = parsePhase14Args(process.argv.slice(2));
    if (args.help) {
      console.log('Usage: node scripts/audit-phase14-roadmap.mjs [--markdown OUTPUT.md] [--json OUTPUT.json]');
    } else {
      const report = await runPhase14Roadmap();
      const s = report.inventory;
      console.log(`Phase 14: ${s.sourceReviewed}/${s.events} source-reviewed events; ${s.openPrimaryClaims} open ledger claims; ${s.sceneVisualCandidates} visual scene candidates.`);
      console.log('Status: PENDING_HUMAN_PHASE14_ACCEPTANCE. No canonical or visual verification claimed.');
      if (args['--markdown']) await writeFile(args['--markdown'], renderPhase14Markdown(report), 'utf8');
      if (args['--json']) await writeFile(args['--json'], JSON.stringify(report, null, 2) + '\n', 'utf8');
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
