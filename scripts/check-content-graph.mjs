import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function uniqueIds(records, label, errors) {
  const seen = new Set();
  for (const record of records) {
    if (typeof record.id !== 'string' || !record.id.trim()) {
      errors.push(`${label}: missing or empty id`);
    } else if (seen.has(record.id)) {
      errors.push(`${label}: duplicate id "${record.id}"`);
    }
    seen.add(record.id);
  }
  return seen;
}

function checkReferences(ids, targets, context, errors) {
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${context}: duplicate reference "${id}"`);
    if (!targets.has(id)) errors.push(`${context}: unknown reference "${id}"`);
    seen.add(id);
  }
}

/** Pure integrity validation, independent of Astro page rendering. */
export function validateContentGraph({
  eras, chapters, characters, historicalEvents, characterRelationships, characterCategories,
}) {
  const errors = [];
  const eraIds = uniqueIds(eras, 'era', errors);
  const chapterIds = uniqueIds(chapters, 'chapter', errors);
  const characterIds = uniqueIds(characters, 'character', errors);
  const eventIds = uniqueIds(historicalEvents, 'event', errors);
  uniqueIds(characterCategories, 'character category', errors);

  const chaptersById = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  for (const era of eras) {
    if (era.status === 'published' && !chapterIds.has(era.id)) {
      errors.push(`era "${era.id}": published without a chapter`);
    }
  }
  for (const chapter of chapters) {
    if (!eraIds.has(chapter.eraId)) {
      errors.push(`chapter "${chapter.id}": unknown era "${chapter.eraId}"`);
    } else if (chapter.id !== chapter.eraId) {
      errors.push(`chapter "${chapter.id}": eraId "${chapter.eraId}" differs from chapter id`);
    }
    for (const reference of chapter.references) {
      const valid = reference.kind === 'CharacterLink' ? characterIds
        : reference.kind === 'HistoricalEventReference' ? eventIds : undefined;
      if (valid && !valid.has(reference.id)) {
        errors.push(`chapter "${chapter.id}": ${reference.kind} references unknown id "${reference.id}"`);
      }
    }
  }
  for (const character of characters) {
    checkReferences(character.chapterIds, chapterIds, `character "${character.id}" chapters`, errors);
  }
  for (const event of historicalEvents) {
    if (!chapterIds.has(event.chapterId)) {
      errors.push(`event "${event.id}": unknown chapter "${event.chapterId}"`);
    } else {
      const chapter = chaptersById.get(event.chapterId);
      if (typeof event.cardId === 'string' && Array.isArray(chapter.cardIds) && chapter.cardIds.length) {
        if (!chapter.cardIds.includes(event.cardId)) {
          errors.push(`event "${event.id}": card printing "${event.cardId}" missing from chapter "${event.chapterId}"`);
        }
      } else if (typeof event.cardName === 'string') {
        // Keep supporting standalone legacy fixtures during this transition.
        if (!chapter.cardNames.includes(event.cardName)) {
          errors.push(`event "${event.id}": card "${event.cardName}" missing from chapter "${event.chapterId}"`);
        }
      } else {
        errors.push(`event "${event.id}": missing chapter card printing reference`);
      }
    }
    checkReferences(event.characterIds, characterIds, `event "${event.id}" characters`, errors);
  }
  const relationshipsSeen = new Set();
  for (const relation of characterRelationships) {
    if (!characterIds.has(relation.a)) errors.push(`relationship: unknown character "${relation.a}"`);
    if (!characterIds.has(relation.b)) errors.push(`relationship: unknown character "${relation.b}"`);
    if (relation.a === relation.b) errors.push(`relationship: self-link for "${relation.a}"`);
    if (!chapterIds.has(relation.chapterId)) {
      errors.push(`relationship "${relation.a}" / "${relation.b}": unknown chapter "${relation.chapterId}"`);
    }
    const key = [relation.a, relation.b].sort().join('|') + `|${relation.category}|${relation.chapterId}`;
    if (relationshipsSeen.has(key)) errors.push(`relationship: duplicated pair/category/chapter "${key}"`);
    relationshipsSeen.add(key);
  }
  const categorizedCharacterIds = new Set();
  for (const category of characterCategories) {
    checkReferences(category.characterIds, characterIds, `category "${category.id}" characters`, errors);
    for (const id of category.characterIds) categorizedCharacterIds.add(id);
  }
  for (const character of characters) {
    if (!categorizedCharacterIds.has(character.id)) {
      errors.push(`character "${character.id}": missing directory category`);
    }
  }
  return errors;
}

/** Read the limited chapter metadata this integrity check needs, without replacing Astro's YAML schema validation. */
export function parseChapter(source, id) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) throw new Error(`chapter "${id}": missing YAML frontmatter`);
  const frontmatter = match[1];
  const era = frontmatter.match(/^eraId:\s*["']?([\w-]+)["']?\s*$/m);
  if (!era) throw new Error(`chapter "${id}": missing or invalid eraId`);
  const cardsBlock = frontmatter.match(/^cards:\s*\r?\n([\s\S]*?)(?=^[a-zA-Z][\w-]*:|$(?![\s\S]))/m)?.[1] ?? '';
  const cardNames = [...cardsBlock.matchAll(/^\s{2}- name:\s*(?:"([^"]+)"|'([^']+)'|([^\r\n]+))\s*$/gm)]
    .map((m) => (m[1] ?? m[2] ?? m[3]).trim());
  const cardIdsBlock = frontmatter.match(/^cardIds:\s*\r?\n((?:^  - [^\r\n]+\r?\n?)+)/m)?.[1] ?? '';
  const cardIds = cardIdsBlock.split(/\r?\n/).filter(Boolean).map((line) => line.replace(/^  - /, '').replace(/^['"]|['"]$/g, '').trim());
  const references = [...source.slice(match[0].length).matchAll(/<(CharacterLink|HistoricalEventReference)\b[^>]*?\bid\s*=\s*(["'])([^"']+)\2/g)]
    .map((m) => ({ kind: m[1], id: m[3] }));
  return { id, eraId: era[1], cardNames, ...(cardIds.length ? { cardIds } : {}), references };
}

export async function checkContentGraph(chapterDirectory = fileURLToPath(new URL('../src/content/chapters/', import.meta.url))) {
  const [eras, characters, historicalEvents, characterRelationships, characterCategories] = await Promise.all([
    import('../src/data/eras.ts').then((m) => m.eras),
    import('../src/data/characters.ts').then((m) => m.characters),
    import('../src/data/events.ts').then((m) => m.historicalEvents),
    import('../src/data/relationships.ts').then((m) => m.characterRelationships),
    import('../src/data/characterCategories.ts').then((m) => m.characterCategories),
  ]);
  const files = (await readdir(chapterDirectory)).filter((name) => /\.(md|mdx)$/.test(name)).sort();
  const chapters = await Promise.all(files.map(async (file) => {
    const id = file.replace(/\.(md|mdx)$/, '');
    return parseChapter(await readFile(join(chapterDirectory, file), 'utf8'), id);
  }));
  return {
    counts: { chapters: chapters.length, characters: characters.length, events: historicalEvents.length, relationships: characterRelationships.length },
    errors: validateContentGraph({ eras, chapters, characters, historicalEvents, characterRelationships, characterCategories }),
  };
}

if (process.argv[1] && pathToFileURL(fileURLToPath(import.meta.url)).href === pathToFileURL(process.argv[1]).href) {
  try {
    const { counts, errors } = await checkContentGraph();
    console.log(`Checked ${counts.chapters} chapters, ${counts.characters} characters, ${counts.events} events, and ${counts.relationships} relationships.`);
    if (errors.length) {
      for (const error of errors) console.error(`- ${error}`);
      process.exitCode = 1;
    } else console.log('All content graph references are valid.');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
