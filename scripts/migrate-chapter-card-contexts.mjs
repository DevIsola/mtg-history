import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';
import { readChapterCardIds } from './card-collection-tools.mjs';
import { migrateChapterCardSource, replaceOnce } from './chapter-card-migration-tools.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const content = join(root, 'src/content');
const checkOnly = process.argv.slice(2).length === 1 && process.argv[2] === '--check';
if (process.argv.length > 2 && !checkOnly) {
  console.error('Usage: node scripts/migrate-chapter-card-contexts.mjs [--check]');
  process.exit(2);
}

const transformations = [
  {
    path: 'src/content.config.ts',
    before: `    cards: z\n      .array(\n        z.object({\n          name: z.string(),\n          setCode: z.string(),\n          collectorNumber: z.string(),\n          scryfallId: z.uuid(),\n          artist: z.string(),\n          significance: z.string(),\n        }),\n      )\n      .default([]),`,
    after: `    // Printing metadata lives in cards collection; positions match cardIds.\n    cards: z.array(z.object({ significance: z.string().min(1) })).min(1),`,
  },
  {
    path: 'src/utils/card-printings.ts',
    before: `  if (context.scryfallId.toLowerCase() !== id) {\n    throw new Error(\`chapter \${chapter.id}: card reference and significance are misaligned at position \${position}\`);\n  }`,
    after: `  // Context stores significance only. Printing identity comes from cardIds.\n  if (Object.keys(context).length !== 1) {\n    throw new Error(\`chapter \${chapter.id}: unexpected duplicated printing fields at position \${position}\`);\n  }`,
  },
  {
    path: 'src/components/HistoricalCard.astro',
    before: `type HistoricalCardData =\n  CollectionEntry<'chapters'>['data']['cards'][number];`,
    after: `type HistoricalCardData = { scryfallId: string; significance: string };`,
    remove: `import type { CollectionEntry } from 'astro:content';\n`,
  },
  {
    path: 'src/components/HistoricalMoment.astro',
    before: `import type { CollectionEntry } from 'astro:content';\n\ntype Card = CollectionEntry<'chapters'>['data']['cards'][number];\n\ninterface Props {\n  card: Card;\n}\n\nconst { card } = Astro.props;\nconst printing = await getEntry('cards', card.scryfallId);\nif (!printing) throw new Error(\`Missing canonical card \${card.scryfallId}\`);`,
    after: `interface Props {\n  cardId: string | { id: string; collection: 'cards' };\n  significance: string;\n}\n\nconst { cardId, significance } = Astro.props;\nconst id = typeof cardId === 'string' ? cardId : cardId.id;\nconst printing = await getEntry('cards', id);\nif (!printing) throw new Error(\`Missing canonical card \${id}\`);`,
    extraBefore: `<HistoricalCard card={card} />`,
    extraAfter: `<HistoricalCard card={{ scryfallId: printing.id, significance }} />`,
  },
  {
    path: 'scripts/check-editorial-metadata.mjs',
    before: `  const names = (await readdir(directory)).filter((name) => /\\.(md|mdx)$/.test(name)).sort();\n  const chapters = await Promise.all(names.map(async (name) =>\n    parseChapterEditorial(await readFile(join(directory, name), 'utf8'), name.replace(/\\.(md|mdx)$/, '')),\n  ));`,
    after: `  const chapters = await loadCuratedChapters(directory, parseChapterEditorial);`,
    remove: `import { readdir, readFile } from 'node:fs/promises';\nimport { join } from 'node:path';\n`,
    insert: `import { loadCuratedChapters } from './load-curated-chapters.mjs';\n`,
  },
  {
    path: 'scripts/audit-external-provenance.mjs',
    before: `  const files = (await readdir(directory)).filter((name) => /\\.(md|mdx)$/.test(name)).sort();\n  return Promise.all(files.map(async (file) => parseChapterEditorial(\n    await readFile(join(directory, file), 'utf8'), file.replace(/\\.(md|mdx)$/, ''),\n  )));`,
    after: `  return loadCuratedChapters(directory, parseChapterEditorial);`,
    remove: `import { readdir, readFile, writeFile } from 'node:fs/promises';\nimport { join } from 'node:path';\n`,
    insert: `import { writeFile } from 'node:fs/promises';\nimport { loadCuratedChapters } from './load-curated-chapters.mjs';\n`,
  },
  {
    path: 'scripts/check-artwork-fidelity.mjs',
    before: `export function extractCardSignificance(source) {`,
    after: `export function extractCardSignificance(source, canonicalNames = null) {`,
    extraBefore: String.raw`  let name = null;
  let folded = false;
  for (const line of cards.split(/\r?\n/)) {`,
    extraAfter: String.raw`  let name = null;
  let folded = false;
  let index = 0;
  for (const line of cards.split(/\r?\n/)) {
    if (/^  - significance:\s*>-\s*$/.test(line)) {
      name = canonicalNames?.[index++] ?? null;
      folded = Boolean(name);
      if (folded) result.set(name, '');
      continue;
    }`,
    extra2Before: `const significance = extractCardSignificance(content);`,
    extra2After: `const significance = extractCardSignificance(content, chapter.cards.map((card) => card.name));`,
  },
  {
    path: 'scripts/check-card-collections.mjs',
    before: `const chapters = await Promise.all((await readdir(join(content, 'chapters')))\n  .filter((name) => /\\.(md|mdx)$/.test(name)).sort().map(async (filename) => {\n    const id = filename.replace(/\\.(md|mdx)$/, '');\n    const source = await readFile(join(content, 'chapters', filename), 'utf8');\n    chapterSources.set(id, source);\n    return parseChapterEditorial(source, id);\n  }));`,
    after: `const chapters = await loadCuratedChapters(\n  join(content, 'chapters'), parseChapterEditorial, chapterSources,\n);`,
    insert: `import { loadCuratedChapters } from './load-curated-chapters.mjs';\n`,
  },
];

// Everything, including a one-time migration guard and file pattern checks, is
// validated before any write. A failed preflight leaves the checkout intact.
const plan = [];
const files = (await readdir(join(content, 'chapters'))).filter((f) => /\.(md|mdx)$/.test(f)).sort();
const printings = new Map();
for (const file of (await readdir(join(content, 'cards'))).filter((f) => f.endsWith('.json'))) {
  printings.set(file.slice(0, -5), JSON.parse(await readFile(join(content, 'cards', file), 'utf8')));
}
if (files.length !== 10 || printings.size !== 133) throw new Error('Unexpected chapter or canonical-printing totals');
let cardCount = 0, momentCount = 0;
for (const filename of files) {
  const id = filename.replace(/\.(md|mdx)$/, '');
  const path = join(content, 'chapters', filename);
  const source = await readFile(path, 'utf8');
  const cards = parseChapterEditorial(source, id).cards;
  const ids = readChapterCardIds(source, id);
  const result = migrateChapterCardSource(source, id, cards, ids, printings);
  cardCount += result.cards;
  momentCount += result.moments;
  plan.push({ path, updated: result.source });
}
if (cardCount !== 135 || momentCount !== 132) {
  throw new Error(`Unexpected card or moment totals: ${cardCount} cards and ${momentCount} HistoricalMoment uses`);
}
for (const transform of transformations) {
  const path = join(root, transform.path);
  let source = await readFile(path, 'utf8');
  source = replaceOnce(source, transform.before, transform.after, transform.path);
  if (transform.extraBefore) source = replaceOnce(source, transform.extraBefore, transform.extraAfter, transform.path);
  if (transform.extra2Before) source = replaceOnce(source, transform.extra2Before, transform.extra2After, transform.path);
  if (transform.remove) source = replaceOnce(source, transform.remove, '', transform.path);
  if (transform.insert) source = transform.insert + source;
  plan.push({ path, updated: source });
}
if (checkOnly) {
  console.log(`Preflight passed: ${files.length} chapters, ${cardCount} cards, ${momentCount} historical illustrations, ${transformations.length} source consumers. No files changed.`);
} else {
  for (const { path, updated } of plan) await writeFile(path, updated);
  console.log(`Migrated ${files.length} chapters, ${cardCount} card contexts and ${momentCount} HistoricalMoment calls; updated ${transformations.length} consumers.`);
  console.log('Run pnpm run verify && pnpm exec playwright test.');
}
