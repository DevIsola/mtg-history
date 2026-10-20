import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { eventProvenance } from '../src/data/event-provenance.mjs';

const repoFile = (path) => new URL('../' + path, import.meta.url);

/** The worksheet identifies a primary-fiction question; it does not inspect novels. */
export function buildKoilosReviewPacket({ review, event, chapterText, provenance, relatedEvent }) {
  if (!review || review.eventId !== 'battle-of-koilos' ||
      review.chapterId !== 'weatherlight' || review.status !== 'PENDING_PRIMARY_FICTION' ||
      review.bookTitle !== 'Invasion') {
    throw new Error('Koilos review must identify the pending Weatherlight primary-fiction question');
  }
  if (!event || event.chapterId !== review.chapterId ||
      event.cardId !== review.cardId || !Array.isArray(event.narrative) ||
      event.narrative.length < 3) {
    throw new Error('Koilos event or its canonical printing has changed');
  }
  if (!relatedEvent || relatedEvent.chapterId !== 'brothers-war' ||
      relatedEvent.cardId === event.cardId || review.relatedEventId !== 'brothers-koilos-stones') {
    throw new Error('The two historically distinct Koilos events must remain separate');
  }
  if (Object.hasOwn(provenance ?? {}, review.eventId)) {
    throw new Error('Koilos already has a reviewed provenance record; update the worksheet scope');
  }
  const normalized = String(chapterText ?? '').replace(/\r\n?/g, '\n');
  if (!normalized.includes('  - title: "Invasion"\n    kind: book\n')) {
    throw new Error('Weatherlight chapter must retain the Invasion primary-novel bibliography entry');
  }
  for (const key of ['claim', 'requiredEvidence', 'notice', 'artworkNote']) {
    if (typeof review[key] !== 'string' || review[key].trim().length < 65) {
      throw new Error(`Incomplete Koilos editorial research detail: ${key}`);
    }
  }
  return { ...review, eventTitle: event.title, existingNarrative: [...event.narrative] };
}

export function renderKoilosReviewWorksheet(packet) {
  if (!packet || !Array.isArray(packet.existingNarrative)) {
    throw new Error('A validated Koilos packet is required');
  }
  const lines = [
    '# MTG History — Koilos primary-fiction review (Wave 2AF)',
    '',
    '**Status: PENDING_PRIMARY_FICTION. This report verifies zero historical claims.**',
    '',
    'This is a blank manual review packet, not a transcription or verification of the original novel.',
    '',
    `Event: ${packet.eventTitle} (${packet.eventId})`,
    `Chapter: ${packet.chapterId}`,
    `Original primary-fiction candidate: ${packet.bookTitle} (J. Robert King, 2000)`,
    `Exact curated printing ID (unchanged): ${packet.cardId}`,
    '',
    `**Claim to inspect:** ${packet.claim}`,
    '',
    `**Evidence needed:** ${packet.requiredEvidence}`,
    '',
    `**Current public-facing limitation:** ${packet.notice}`,
    '',
    `**Artwork caveat:** ${packet.artworkNote}`,
    '',
    '## Compare each existing narrative paragraph',
    '',
    ...packet.existingNarrative.flatMap((paragraph, index) => [
      `### Claim group ${index + 1}`,
      '',
      paragraph,
      '',
      '- [ ] Source passage found and checked against this claim',
      '- Evidence locator (edition, chapter and page or ebook location): [record after reading]',
      '- Verdict (supported / partially supported / contradicted / inconclusive): [record after reading]',
      '- Correction or qualification needed: [record after reading]',
      '',
    ]),
    '## Historical-identity safeguards',
    '',
    '- [ ] Distinguish the original Phyrexian invasion battle at Koilos from Urza and Mishra discovering the stones there in childhood.',
    '- [ ] Distinguish the later Dominaria United-era Caves of Koilos excavation from the original invasion battle.',
    '- [ ] Establish which participants actually appear in the primary battle account.',
    '- [ ] Verify whether the battle victory precedes the Rathi Overlay and how the later war continues.',
    '- [ ] Compare Coalition Victory artwork with the scene, without treating card mechanics or art as primary-fiction testimony.',
    '- [ ] Record exact source edition and location, or leave the case explicitly unresolved.',
    '',
    '## Editorial decision (manual)',
    '',
    '- Reviewer and date: [record after reading]',
    '- Edition / ISBN: [record after reading]',
    '- Overall verdict and evidence summary: [record after reading]',
    '- Proposed event narrative / provenance / artwork changes: [record after reading]',
    '',
    'No source-review record, precise AR year, card identity, or publication chronology changes should be made solely from this worksheet.',
    '',
  ];
  return lines.join('\n');
}

export function parseKoilosReviewArgs(argv) {
  const args = argv[0] === '--' ? argv.slice(1) : argv;
  if (args.length === 1 && args[0] === '--help') return { help: true };
  if (args.length !== 2 || args[0] !== '--output' || !args[1] || args[1].startsWith('--')) {
    throw new Error('Usage: node scripts/prepare-koilos-review.mjs --output OUTPUT.md');
  }
  return { output: resolve(args[1]) };
}

export async function runKoilosReview(argv) {
  const args = parseKoilosReviewArgs(argv);
  if (args.help) {
    console.log('Usage: node scripts/prepare-koilos-review.mjs --output OUTPUT.md');
    console.log('Creates a blank manual evidence worksheet; no novel text is accessed.');
    return;
  }
  const [reviews, event, related, chapterText] = await Promise.all([
    readFile(repoFile('src/data/manual-event-review.json'), 'utf8').then(JSON.parse),
    readFile(repoFile('src/content/events/battle-of-koilos.json'), 'utf8').then(JSON.parse),
    readFile(repoFile('src/content/events/brothers-koilos-stones.json'), 'utf8').then(JSON.parse),
    readFile(repoFile('src/content/chapters/weatherlight.mdx'), 'utf8'),
  ]);
  const packet = buildKoilosReviewPacket({
    review: reviews['battle-of-koilos'], event, relatedEvent: related,
    chapterText, provenance: eventProvenance,
  });
  await writeFile(args.output, renderKoilosReviewWorksheet(packet), { encoding: 'utf8', flag: 'wx' });
  console.log(`Koilos primary-fiction worksheet written to ${args.output}; 0 claims newly verified.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runKoilosReview(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
