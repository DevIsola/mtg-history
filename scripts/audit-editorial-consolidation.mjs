import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runHistoricalRiskAudit } from './audit-historical-risk.mjs';
import { checkArtwork } from './check-artwork-fidelity.mjs';
import { collectEvidenceGaps } from './audit-event-source-gaps.mjs';
import { checkEventProvenance } from './check-event-provenance.mjs';

const reviewFile = id =>
  new URL(`../src/content/chapters/${id}.mdx`, import.meta.url);

const readChapter = id => readFile(reviewFile(id), 'utf8');

function unique(items, name) {
  if (new Set(items).size !== items.length) {
    throw new Error(`Duplicate ${name}`);
  }
}

/**
 * Compose existing validated collections into a human acceptance queue.
 * This is not a canonical-fiction or artwork certification.
 */
export function buildEditorialConsolidation({
  risk, artwork, gaps, provenance, chapterTexts
}) {
  if (artwork.errors.length || provenance.errors.length) {
    throw new Error('Existing artwork or provenance integrity gate failed');
  }

  const { summary, byChapter, rows } = risk;

  if (
    summary.total !== provenance.totalEvents ||
    summary.reviewed !== provenance.reviewedEvents ||
    summary.queued !== rows.length ||
    summary.chapters !== artwork.chapters.length ||
    artwork.counts.references !== artwork.rows.length ||
    artwork.counts.reviewed !== artwork.rows.length
  ) {
    throw new Error('Editorial consolidation input counts disagree');
  }

  if (summary.reviewed + summary.queued !== summary.total) {
    throw new Error('Unaccounted event provenance');
  }

  unique(rows.map(r => r.id), 'queued event');
  unique(byChapter.map(r => r.chapterId), 'chapter coverage');
  unique(artwork.chapters.map(c => c.id), 'chapter record');

  const byId = new Map(byChapter.map(c => [c.chapterId, c]));

  const ordered = [...artwork.chapters]
    .sort((a, b) => a.order - b.order);

  const chapters = ordered.map(chapter => {
    const stats = byId.get(chapter.id);
    const text = chapterTexts[chapter.id];

    if (!stats || typeof text !== 'string') {
      throw new Error(`Missing chapter audit: ${chapter.id}`);
    }

    const frontmatter = text.replace(/\r\n?/g, '\n')
      .match(/^---\n([\s\S]*?)\n---\n/)?.[1];

    if (
      !frontmatter ||
      !/^chronology:\s*$/m.test(frontmatter) ||
      !/^  storyPeriod:\s*\S/m.test(frontmatter) ||
      !/^  publicationHistory:\s*\S/m.test(frontmatter)
    ) {
      throw new Error(
        `Chapter lacks explicit dual chronology: ${chapter.id}`
      );
    }

    const headings = [...text.matchAll(/^## ([^\r\n]+)/gm)]
      .map(x => x[1]);

    if (!headings.length) {
      throw new Error(`Chapter has no main headings: ${chapter.id}`);
    }

    if (stats.total !== stats.reviewed + stats.queued) {
      throw new Error(`Event totals disagree: ${chapter.id}`);
    }

    return {
      id: chapter.id,
      order: chapter.order,
      mainSections: headings.length,
      bibliography: chapter.sources.length,
      officialSources: chapter.sources
        .filter(s => s.kind === 'official').length,
      printingUses: chapter.cards.length,
      events: stats.total,
      reviewed: stats.reviewed,
      queued: stats.queued,
      high: stats.high,
      medium: stats.medium,
    };
  });

  if (
    chapters.reduce((n, c) => n + c.events, 0) !== summary.total ||
    chapters.reduce((n, c) => n + c.printingUses, 0) !==
      artwork.counts.references
  ) {
    throw new Error('Chapter coverage is incomplete');
  }

  const approvedIds = new Set(artwork.chapters.map(c => c.id));

  if (
    rows.some(r => !approvedIds.has(r.chapterId)) ||
    gaps.some(g => typeof g.id !== 'string')
  ) {
    throw new Error('Orphan editorial task');
  }

  const visualScenes = artwork.rows
    .filter(r =>
      r.visualRole === 'scene' && r.basis !== 'visual-checked'
    )
    .map(({ chapter, card, basis, timeContext }) => ({
      chapter, card, basis, timeContext
    }))
    .sort((a, b) =>
      a.chapter.localeCompare(b.chapter, 'en') ||
      a.card.localeCompare(b.card, 'en')
    );

  const notVisualChecked = artwork.rows
    .filter(r => r.basis !== 'visual-checked').length;

  return {
    status: 'PENDING_MANUAL_EDITORIAL_ACCEPTANCE',
    summary: {
      chapters: chapters.length,
      events: summary.total,
      sourceReviewed: summary.reviewed,
      awaitingEventReview: summary.queued,
      highPriority: summary.high,
      cardUses: artwork.counts.references,
      pendingVisualChecks: notVisualChecked,
      sceneVisualCandidates: visualScenes.length,
      openPrimaryClaims: gaps.length,
    },
    chapters,
    openClaims: [...gaps]
      .sort((a, b) => a.id.localeCompare(b.id, 'en')),
    visualScenes,
    eventQueue: rows.map(r => ({
      id: r.id,
      chapter: r.chapterId,
      priority: r.priority,
      score: r.score,
      signals: r.signals,
    })),
  };
}

const cell = value => String(value)
  .replace(/\|/g, '\\|')
  .replace(/[\r\n]/g, ' ');

export function renderEditorialConsolidation(report) {
  const s = report.summary;

  return [
    '# MTG History — Cross-chapter editorial acceptance',
    '',
    `**Status: ${report.status}.** This is a read-only editorial checklist, not historical fact verification, source retrieval, or image certification.`,
    '',
    `- ${s.chapters} chapters; ${s.events} historical events; ${s.cardUses} curated artwork references.`,
    `- ${s.sourceReviewed} source-reviewed event records; ${s.awaitingEventReview} remain to review (including ${s.highPriority} high-priority triage suggestions).`,
    `- ${s.openPrimaryClaims} unresolved primary-source questions; ${s.pendingVisualChecks} artwork uses without a visual-checked label; ${s.sceneVisualCandidates} scene candidates to inspect first.`,
    '',
    '## Chapter acceptance matrix',
    '',
    '| Chapter | Events reviewed / total | High priority | Official bibliography | Card uses | Canon and chronology | Image reviewed | Sign-off |',
    '| --- | ---: | ---: | ---: | ---: | --- | --- | --- |',
    ...report.chapters.map(c =>
      `| ${cell(c.id)} | ${c.reviewed}/${c.events} | ${c.high} | ${c.officialSources} | ${c.printingUses} | [ ] | [ ] | [ ] |`
    ),
    '',
    'The checkboxes are deliberately unchecked. Every chapter requires a human to compare specific statements with canonical sources, check publication date against in-world chronology, inspect artwork, and read for contradictions or duplication.',
    '',
    '## Open primary-fiction questions',
    '',
    ...report.openClaims.map(g =>
      `- **${cell(g.id)}** — ${cell(g.claim)}. Needed: ${cell(g.requiredEvidence)}.`
    ),
    ...(report.openClaims.length ? [] : [
      'None recorded. This does not imply every claim has been verified.'
    ]),
    '',
    '## Priority artwork scene review',
    '',
    ...report.visualScenes.map(v =>
      `- [ ] ${cell(v.chapter)} / ${cell(v.card)} — ${cell(v.basis)}, ${cell(v.timeContext)}; inspect the exact Scryfall printing and chapter significance.`
    ),
    ...(report.visualScenes.length ? [] : [
      'No uninspected scenes classified. Other artwork may still require manual checking.'
    ]),
    '',
    '## Source-review queue (highest priority first)',
    '',
    '| Priority | Score | Chapter | Event ID | Review signals |',
    '| --- | ---: | --- | --- | --- |',
    ...report.eventQueue.map(e =>
      `| ${cell(e.priority)} | ${e.score} | ${cell(e.chapter)} | ${cell(e.id)} | ${cell(e.signals.join(', ') || 'baseline')} |`
    ),
    '',
    '## Final acceptance criteria',
    '',
    '- [ ] Review official source passages for all material historical claims; distinguish primary fiction, retrospectives, and designer commentary.',
    '- [ ] Verify original publication chronology separately from in-world chronology, particularly cross-planar episodes.',
    '- [ ] Resolve or explicitly retain outstanding novel questions with exact edition and location evidence.',
    '- [ ] Review exact artwork prints, prioritizing scene candidates and keeping portraits / symbols from being mislabeled as witnessed events.',
    '- [ ] Read all ten chapters for duplicate explanation, contradictions, character continuity and transitions.',
    '- [ ] Record corrections as separate narrow editorial PRs and rerun this queue after each merge.',
    '- [ ] Run pnpm run verify, pnpm exec playwright test, and desktop/mobile editorial review.',
    '- [ ] Sign off only after the human checks, not from a zero-error CI result.',
    '',
  ].join('\n');
}

export function parseConsolidationArgs(argv) {
  const args = argv[0] === '--' ? argv.slice(1) : argv;

  if (args.length === 1 && args[0] === '--help') {
    return { help: true };
  }

  const out = {};

  for (let i = 0; i < args.length; i++) {
    const flag = args[i];

    if (
      !['--markdown', '--json'].includes(flag) ||
      Object.hasOwn(out, flag)
    ) {
      throw new Error(`Unknown or duplicate option: ${flag}`);
    }

    const dest = args[++i];

    if (!dest || dest.startsWith('--')) {
      throw new Error(`${flag} requires output path`);
    }

    out[flag] = resolve(dest);
  }

  if (
    out['--markdown'] &&
    out['--markdown'] === out['--json']
  ) {
    throw new Error('Output paths must differ');
  }

  return out;
}

export async function runEditorialConsolidation() {
  const [risk, artwork, provenance] = await Promise.all([
    runHistoricalRiskAudit(),
    checkArtwork(),
    checkEventProvenance(),
  ]);

  const chapterTexts = Object.fromEntries(await Promise.all(
    artwork.chapters.map(async c => [
      c.id,
      await readChapter(c.id),
    ])
  ));

  return buildEditorialConsolidation({
    risk,
    artwork,
    gaps: collectEvidenceGaps(),
    provenance,
    chapterTexts,
  });
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  try {
    const args = parseConsolidationArgs(process.argv.slice(2));

    if (args.help) {
      console.log(
        'Usage: node scripts/audit-editorial-consolidation.mjs [--markdown OUTPUT.md] [--json OUTPUT.json]'
      );
    } else {
      const report = await runEditorialConsolidation();

      console.log(
        `Editorial acceptance: ${report.status}; ${report.summary.chapters} chapters, ${report.summary.sourceReviewed}/${report.summary.events} reviewed events, ${report.summary.openPrimaryClaims} open claims.`
      );

      if (args['--markdown']) {
        await writeFile(
          args['--markdown'],
          renderEditorialConsolidation(report),
          'utf8'
        );
      }

      if (args['--json']) {
        await writeFile(
          args['--json'],
          JSON.stringify(report, null, 2) + '\n',
          'utf8'
        );
      }
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
