import { loadCuratedChapters } from './load-curated-chapters.mjs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const chapterDirectory = fileURLToPath(new URL('../src/content/chapters/', import.meta.url));
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Extract only top-level lists and single-line scalar metadata. Astro's content
// schema remains responsible for full YAML and MDX syntax and type validation.
function readScalar(text) {
  const value = text.trim();
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function readList(frontmatter, section) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `${section}:`);
  if (start < 0) return [];
  const entries = [];
  let current;
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z][\w-]*:/.test(line)) break;
    const first = line.match(/^  - ([A-Za-z][\w-]*):\s*(.*?)\s*$/);
    if (first) {
      current = { [first[1]]: readScalar(first[2]) };
      entries.push(current);
      continue;
    }
    const property = line.match(/^    ([A-Za-z][\w-]*):\s*(.*?)\s*$/);
    if (property && current) current[property[1]] = readScalar(property[2]);
  }
  return entries;
}

export function parseChapterEditorial(source, id) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!frontmatter) throw new Error(`chapter "${id}": missing YAML frontmatter`);
  const order = frontmatter.match(/^order:\s*(\d+)\s*$/m)?.[1];
  return {
    id,
    order: order === undefined ? null : Number(order),
    cards: readList(frontmatter, 'cards'),
    sources: readList(frontmatter, 'sources'),
  };
}

export function validateEditorialMetadata(chapters) {
  const errors = [];
  const orders = new Map();
  const printings = new Map();

  for (const chapter of chapters) {
    const where = `chapter "${chapter.id}"`;
    if (!Number.isSafeInteger(chapter.order) || chapter.order < 1) {
      errors.push(`${where}: missing or invalid positive order`);
    } else if (orders.has(chapter.order)) {
      errors.push(`${where}: order ${chapter.order} already used by "${orders.get(chapter.order)}"`);
    } else {
      orders.set(chapter.order, chapter.id);
    }

    if (!chapter.cards.length) errors.push(`${where}: no curated card printings`);
    const localNames = new Set();
    const localPrints = new Set();
    for (const card of chapter.cards) {
      const name = card.name?.trim();
      if (!name) errors.push(`${where}: card missing name`);
      else if (localNames.has(name)) errors.push(`${where}: duplicate card name "${name}"`);
      localNames.add(name);

      if (!/^[a-z0-9]{2,8}$/.test(card.setCode ?? '') ||
          !card.collectorNumber?.trim() || !card.artist?.trim() ||
          !uuidPattern.test(card.scryfallId ?? '')) {
        errors.push(`${where}: card "${name ?? '(unnamed)'}" has incomplete or invalid printing metadata`);
        continue;
      }
      const printingKey = `${card.setCode}/${card.collectorNumber}`;
      if (localPrints.has(printingKey)) {
        errors.push(`${where}: duplicate set/collector printing "${printingKey}"`);
      }
      localPrints.add(printingKey);

      const identity = [name, card.setCode, card.collectorNumber, card.artist].join('|');
      const original = printings.get(card.scryfallId.toLowerCase());
      if (original && original.identity !== identity) {
        errors.push(`${where}: Scryfall id "${card.scryfallId}" conflicts with ${original.chapter}'s printing metadata`);
      } else if (!original) {
        printings.set(card.scryfallId.toLowerCase(), { identity, chapter: where });
      }
    }

    if (!chapter.sources.length) errors.push(`${where}: no bibliography sources`);
    if (!chapter.sources.some((source) => source.kind === 'official')) {
      errors.push(`${where}: no official source`);
    }
    const citations = new Set();
    for (const source of chapter.sources) {
      const title = source.title?.trim();
      if (!title) errors.push(`${where}: source missing title`);
      let key;
      if (source.kind === 'official') {
        try {
          const url = new URL(source.url);
          if (url.protocol !== 'https:' || !url.hostname) throw new Error('insecure or missing URL');
          key = `url:${url.href}`;
        } catch {
          errors.push(`${where}: official source "${title ?? '(unnamed)'}" requires an HTTPS URL`);
        }
      } else if (source.kind === 'book') {
        if (!source.author?.trim() || !Number.isInteger(Number(source.year)) ||
            Number(source.year) < 1993 || Number(source.year) > 2100) {
          errors.push(`${where}: book "${title ?? '(unnamed)'}" requires an author and publication year`);
        }
        key = `book:${title}|${source.author}`;
      } else {
        errors.push(`${where}: source "${title ?? '(unnamed)'}" has unknown kind`);
      }
      if (key) {
        if (citations.has(key)) errors.push(`${where}: duplicate source "${title}"`);
        citations.add(key);
      }
    }
  }

  // Published chapters are numbered 01..N in the reader and chronology.
  for (let order = 1; order <= chapters.length; order += 1) {
    if (!orders.has(order)) errors.push(`chapter order: missing chapter number ${order}`);
  }
  return errors;
}

export async function checkEditorialMetadata(directory = chapterDirectory) {
  const chapters = await loadCuratedChapters(directory, parseChapterEditorial);
  return {
    counts: {
      chapters: chapters.length,
      cards: chapters.reduce((total, chapter) => total + chapter.cards.length, 0),
      sources: chapters.reduce((total, chapter) => total + chapter.sources.length, 0),
    },
    errors: validateEditorialMetadata(chapters),
  };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const { counts, errors } = await checkEditorialMetadata();
    console.log(`Reviewed ${counts.chapters} chapters, ${counts.cards} card references, and ${counts.sources} sources.`);
    if (errors.length) {
      for (const error of errors) console.error(`- ${error}`);
      process.exitCode = 1;
    } else {
      console.log('Editorial metadata checks passed. Canonical accuracy requires separate source review.');
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
