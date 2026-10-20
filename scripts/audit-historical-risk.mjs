import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { auditHistoricalRisk, renderHistoricalRiskMarkdown } from '../src/data/historical-risk.mjs';
import { checkArtwork } from './check-artwork-fidelity.mjs';

const eventsDir = fileURLToPath(new URL('../src/content/events/', import.meta.url));

/** Read canonical collections and reuse the existing artwork and provenance gates. */
export async function runHistoricalRiskAudit() {
  const { chapters, rows: artworkRows, errors: artworkErrors } = await checkArtwork();
  if (artworkErrors.length) throw new Error(`Artwork ledger errors:\n${artworkErrors.join('\n')}`);
  const files = (await readdir(eventsDir)).filter((file) => file.endsWith('.json')).sort();
  const events = await Promise.all(files.map(async (name) => ({
    id: name.slice(0, -5),
    ...JSON.parse(await readFile(new URL(`../src/content/events/${name}`, import.meta.url), 'utf8')),
  })));
  const sourcesByChapter = new Map(chapters.map(({ id, sources }) => [id, sources]));
  const errors = validateEventProvenance(eventProvenance, events, sourcesByChapter);
  if (errors.length) throw new Error(`Provenance ledger errors:\n${errors.join('\n')}`);
  return auditHistoricalRisk({ events, chapters, reviewed: eventProvenance, artworkRows });
}

/** Support optional local report output; never write to repository implicitly. */
export function parseHistoricalRiskArgs(args) {
  const options = {};
  if (args[0] === '--') args = args.slice(1);
  if (args.length === 1 && args[0] === '--help') return { help: true };
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (!['--markdown', '--json'].includes(flag)) throw new Error(`Unknown option ${flag}; use --help`);
    if (options[flag]) throw new Error(`Duplicate option ${flag}`);
    const destination = args[++i];
    if (!destination || destination.startsWith('--')) throw new Error(`${flag} requires an output path`);
    options[flag] = destination;
  }
  if (options['--markdown'] && resolve(options['--markdown']) === resolve(options['--json'] ?? '')) {
    throw new Error('Markdown and JSON destinations must differ');
  }
  return options;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const args = parseHistoricalRiskArgs(process.argv.slice(2));
    if (args.help) {
      console.log('Usage: node scripts/audit-historical-risk.mjs [--markdown OUTPUT.md] [--json OUTPUT.json]');
      console.log('Read-only offline triage; generates optional reports, never certifies historical claims.');
    } else {
      const audit = await runHistoricalRiskAudit();
      const s = audit.summary;
      console.log(`Historical evidence triage: ${s.queued}/${s.total} events awaiting claim-level review; ${s.reviewed} source-reviewed.`);
      console.log(`Priority suggestions: ${s.high} high, ${s.medium} medium, ${s.standard} standard; ${s.chapters} chapters accounted for.`);
      console.log('Risk signals are editorial prompts, not historical fact-check results.');
      for (const row of audit.rows.slice(0, 10)) {
        console.log(`- ${row.priority.padEnd(8)} ${String(row.score).padStart(2)} ${row.chapterId}/${row.id}: ${row.signals.join(', ') || 'baseline source review'}`);
      }
      if (args['--markdown']) {
        await writeFile(args['--markdown'], renderHistoricalRiskMarkdown(audit), 'utf8');
        console.log(`Markdown review queue written to ${args['--markdown']}`);
      }
      if (args['--json']) {
        await writeFile(args['--json'], JSON.stringify(audit, null, 2) + '\n', 'utf8');
        console.log(`JSON review queue written to ${args['--json']}`);
      }
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
