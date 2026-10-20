import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { eventProvenance } from '../src/data/event-provenance.mjs';

/** Novel research leads, not primary citations or verified scene references. */
export const NOVEL_REVIEW_TARGETS = Object.freeze([
  {
    id: 'mending-venser-first-walk',
    books: ['Time Spiral', 'Planar Chaos'],
    focus: 'Locate the alternate timeline and first planeswalk; check who assists Venser and when it occurs.',
    caveat: 'Public Wizards material establishes his spark but does not narrate this episode.',
  },
  {
    id: 'freyalise-seals-skyshroud',
    books: ['Planar Chaos'],
    focus: 'Locate Freyalise’s final action, the rift geography, and what happens to Skyshroud itself.',
    caveat: 'Her official biography establishes sacrifice, not a named rift or the forest’s fate.',
  },
]);

/** Fail closed if a question or its relevant novel bibliography disappears. */
export function buildNovelReviewPackets(records, bibliography) {
  if (!records || !Array.isArray(bibliography)) throw new Error('Provide the provenance records and Mending chapter bibliography.');
  const packets = NOVEL_REVIEW_TARGETS.map((task) => {
    const record = records[task.id];
    if (!record || !Array.isArray(record.unresolvedClaims) || record.unresolvedClaims.length !== 1) {
      throw new Error(`${task.id}: expected exactly one outstanding novel-specific question`);
    }
    const [gap] = record.unresolvedClaims;
    if (!gap?.claim || !gap?.requiredEvidence || gap.claim.length < 35 || gap.requiredEvidence.length < 35) {
      throw new Error(`${task.id}: incomplete outstanding claim`);
    }
    for (const book of task.books) {
      if (!bibliography.some((item) => item.title === book && item.kind === 'book')) {
        throw new Error(`${task.id}: missing primary book bibliography entry for ${book}`);
      }
    }
    return { ...task, claim: gap.claim, requiredEvidence: gap.requiredEvidence,
      contextualSources: record.sources.map((source) => ({ title: source.title, role: source.role })) };
  });
  return packets;
}

export function renderNovelReviewWorksheet(packets) {
  if (!Array.isArray(packets) || packets.length === 0) throw new Error('No novel verification tasks to render');
  const lines = [
    '# MTG History — Time Spiral primary-novel evidence worksheet',
    '',
    'Status: **unverified**. This worksheet does not claim the novels have been inspected. Secondary plot summaries are leads only; they are not a substitute for checking the actual licensed novel text.',
    '',
    'Do not add an official article citation for a novel, invent page numbers, or remove an unresolved claim without evidence. Prefer a brief paraphrase and a precise edition/page locator over reproducing copyrighted passages.',
    '',
  ];
  for (const row of packets) {
    lines.push(
      `## ${row.id}`,
      '',
      `**Claim:** ${row.claim}`,
      '',
      `**Candidate primary works:** ${row.books.join('; ')}`,
      '',
      `**Reading focus:** ${row.focus}`,
      '',
      `**Existing source limitation:** ${row.caveat}`,
      '',
      `**Current required evidence:** ${row.requiredEvidence}`,
      '',
      `**Existing contextual citations:** ${row.contextualSources.map((s) => `${s.title} (${s.role})`).join('; ')}`,
      '',
      '- Edition / ISBN examined: [record after reading]',
      '- Chapter and page / digital location: [record after reading]',
      '- Scene summary, in your own words: [record after reading]',
      '- Verdict (supported / partially supported / contradicted / inconclusive): [record after reading]',
      '- Required event prose and provenance changes: [record after reading]',
      '- Artwork interpretation checked against exact printing: [record after reading]',
      '',
    );
  }
  lines.push('## Editorial acceptance', '',
    'The recorded passage must support the specific geographical, chronological, and character-action claims. A book listed in the chapter bibliography is not itself proof of a passage. If the text cannot be inspected, keep the question open. No changes to the 43 reviewed-event count are implied.', '');
  return lines.join('\n');
}

export function parseNovelReviewArgs(args) {
  if (args[0] === '--') args = args.slice(1);
  if (args.length === 1 && args[0] === '--help') return { help: true };
  if (args.length !== 2 || args[0] !== '--output' || !args[1] || args[1].startsWith('--')) {
    throw new Error('Usage: node scripts/prepare-primary-novel-review.mjs --output OUTPUT.md');
  }
  return { output: args[1] };
}

async function main(args) {
  const parsed = parseNovelReviewArgs(args);
  if (parsed.help) {
    console.log('Usage: node scripts/prepare-primary-novel-review.mjs --output OUTPUT.md');
    console.log('Exports a local editorial worksheet; does not fetch copyrighted novels or verify claims.');
    return;
  }
  const chapter = await readFile(new URL('../src/content/chapters/mending.mdx', import.meta.url), 'utf8');
  // Only the existing bibliographic book entries are needed; do not parse MDX text as evidence.
  const bibliography = [...chapter.matchAll(/^  - title: "([^"]+)"\r?\n    kind: book$/gm)]
    .map((match) => ({ title: match[1], kind: 'book' }));
  const packets = buildNovelReviewPackets(eventProvenance, bibliography);
  await writeFile(parsed.output, renderNovelReviewWorksheet(packets), 'utf8');
  console.log(`Primary-novel worksheet: ${packets.length} open event questions; 0 claims newly verified.`);
  console.log(`Report written to ${resolve(parsed.output)}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch((error) => { console.error(error); process.exitCode = 1; });
}
