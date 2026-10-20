import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { eventProvenance } from '../src/data/event-provenance.mjs';

/** A read-only view of editorial uncertainties; reviewed != fully verified. */
export function collectEvidenceGaps(records = eventProvenance) {
  return Object.entries(records).flatMap(([id, record]) =>
    (record.unresolvedClaims ?? []).map((gap) => ({
      id, claim: gap.claim, requiredEvidence: gap.requiredEvidence,
    }))).sort((a, b) => a.id.localeCompare(b.id, 'en') || a.claim.localeCompare(b.claim, 'en'));
}

const escapeCell = (value) => String(value).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');

export function renderEvidenceGapsMarkdown(rows) {
  return [
    '# MTG History — Outstanding primary-source questions',
    '',
    `**Open questions:** ${rows.length} across ${new Set(rows.map((row) => row.id)).size} source-reviewed events.`,
    '',
    'A source-reviewed event can contain claims that have not yet been confirmed by the cited publications. These are editorial follow-ups, not known factual errors.',
    '',
    '| Event | Claim awaiting confirmation | Required evidence |',
    '| --- | --- | --- |',
    ...rows.map((row) => `| [${escapeCell(row.id)}](https://devisola.github.io/mtg-history/events/${encodeURIComponent(row.id)}/) | ${escapeCell(row.claim)} | ${escapeCell(row.requiredEvidence)} |`),
    '',
    'Resolve each question only after examining the relevant canonical text; then correct the narrative if needed, update the provenance source and remove the resolved question together.',
    '',
  ].join('\n');
}

export function parseEvidenceGapArgs(args) {
  if (args[0] === '--') args = args.slice(1);
  if (args.length === 1 && args[0] === '--help') return { help: true };
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (flag !== '--markdown' && flag !== '--json') throw new Error(`Unknown argument: ${flag}`);
    if (Object.hasOwn(result, flag)) throw new Error(`Duplicate argument: ${flag}`);
    const dest = args[++i];
    if (!dest || dest.startsWith('--')) throw new Error(`${flag} requires an output path`);
    result[flag] = resolve(dest);
  }
  if (result['--markdown'] && result['--markdown'] === result['--json']) {
    throw new Error('Markdown and JSON destinations must differ');
  }
  return result;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const args = parseEvidenceGapArgs(process.argv.slice(2));
    if (args.help) {
      console.log('Usage: node scripts/audit-event-source-gaps.mjs [--markdown OUTPUT.md] [--json OUTPUT.json]');
    } else {
      const rows = collectEvidenceGaps();
      console.log(`Open primary-source questions: ${rows.length} across ${new Set(rows.map((r) => r.id)).size} reviewed events.`);
      console.log('These are unresolved editorial claims, not verified errors.');
      if (args['--markdown']) {
        await writeFile(args['--markdown'], renderEvidenceGapsMarkdown(rows));
        console.log(`Markdown queue written to ${args['--markdown']}`);
      }
      if (args['--json']) {
        await writeFile(args['--json'], JSON.stringify({ openQuestions: rows.length, rows }, null, 2) + '\n');
        console.log(`JSON queue written to ${args['--json']}`);
      }
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
