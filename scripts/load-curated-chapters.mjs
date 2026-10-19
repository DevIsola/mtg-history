import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readChapterCardIds } from './card-collection-tools.mjs';

const canonicalDirectory = fileURLToPath(new URL('../src/content/cards/', import.meta.url));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Reconstruct a read-only printing view for legacy editorial and provenance
 * validators. Canonical JSON owns printing identity; MDX owns significance.
 * No external requests and no silent fallback to old frontmatter metadata.
 */
export async function loadCuratedChapters(directory, parseChapter, sourceMap, printingDirectory = canonicalDirectory) {
  const filenames = (await readdir(directory)).filter((name) => /\.(md|mdx)$/.test(name)).sort();
  const chapters = [];
  const cache = new Map();
  for (const filename of filenames) {
    const id = filename.replace(/\.(md|mdx)$/, '');
    const source = await readFile(join(directory, filename), 'utf8');
    if (sourceMap) sourceMap.set(id, source);
    const chapter = parseChapter(source, id);
    const cardIds = readChapterCardIds(source, id);
    if (!chapter.cards.length || cardIds.length !== chapter.cards.length) {
      throw new Error(`chapter ${id}: cardIds and historical significance must have equal, nonzero length`);
    }
    const seen = new Set();
    const cards = [];
    for (let i = 0; i < cardIds.length; i++) {
      const printingId = cardIds[i];
      const context = chapter.cards[i];
      if (!uuid.test(printingId) || seen.has(printingId)) {
        throw new Error(`chapter ${id}: duplicate or invalid printing ID at index ${i}`);
      }
      seen.add(printingId);
      if (Object.keys(context).length !== 1 ||
          typeof context.significance !== 'string' || !context.significance.trim()) {
        throw new Error(`chapter ${id}: card ${i} must contain only historical significance`);
      }
      if (!cache.has(printingId)) {
        const data = JSON.parse(await readFile(join(printingDirectory, `${printingId}.json`), 'utf8'));
        const keys = Object.keys(data).sort().join(',');
        if (keys !== 'artist,collectorNumber,name,setCode' ||
            Object.values(data).some((v) => typeof v !== 'string' || !v.trim())) {
          throw new Error(`printing ${printingId}: invalid canonical printing data`);
        }
        cache.set(printingId, data);
      }
      cards.push({ ...cache.get(printingId), scryfallId: printingId, significance: context.significance });
    }
    chapters.push({ ...chapter, cards });
  }
  return chapters;
}
