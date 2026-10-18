import { isDeepStrictEqual } from 'node:util';

/** Canonical printing identity; contextual interpretations remain on each use. */
const fields = ['name', 'setCode', 'collectorNumber', 'artist'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function printingEntry(use, context) {
  if (!use || typeof use !== 'object' || !uuid.test(use.scryfallId ?? '')) {
    throw new Error(`${context}: missing or invalid Scryfall printing UUID`);
  }
  const id = use.scryfallId.toLowerCase();
  const data = Object.fromEntries(fields.map((field) => {
    const value = use[field];
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`${context}: invalid ${field} for ${id}`);
    }
    return [field, value];
  }));
  return { id, data };
}

/**
 * Derive one exact-printing registry from curated chapter cards and portraits.
 * Duplicate Scryfall IDs are acceptable only for identical printing metadata.
 */
export function planCards(chapters, characters, events) {
  const printings = new Map();
  const origins = new Map();
  const add = (use, context) => {
    const { id, data } = printingEntry(use, context);
    const existing = printings.get(id);
    if (existing && !isDeepStrictEqual(existing, data)) {
      throw new Error(`${context}: printing ${id} differs from ${origins.get(id)}; resolve its metadata before migration`);
    }
    printings.set(id, data);
    if (!origins.has(id)) origins.set(id, context);
    return id;
  };

  const chapterIds = new Map();
  const byChapter = new Map();
  for (const chapter of chapters) {
    if (!chapter?.id || !Array.isArray(chapter.cards) || chapter.cards.length === 0 || byChapter.has(chapter.id)) {
      throw new Error(`Invalid or duplicated chapter ${chapter?.id}`);
    }
    const names = new Map();
    const ids = chapter.cards.map((card) => {
      if (names.has(card.name)) throw new Error(`${chapter.id}: duplicate card name ${card.name}`);
      const id = add(card, `chapter ${chapter.id}: ${card.name}`);
      names.set(card.name, id);
      return id;
    });
    chapterIds.set(chapter.id, ids);
    byChapter.set(chapter.id, names);
  }

  const featuredIds = new Map();
  for (const character of characters) {
    if (!character?.id || featuredIds.has(character.id)) throw new Error(`Invalid or duplicate character ${character?.id}`);
    featuredIds.set(character.id, add(character.featuredCard, `character ${character.id}`));
  }

  const eventIds = new Map();
  for (const event of events) {
    if (!event?.id || eventIds.has(event.id)) throw new Error(`Invalid or duplicate event ${event?.id}`);
    const matchingChapter = byChapter.get(event.chapterId);
    const id = matchingChapter?.get(event.cardName);
    if (!id) throw new Error(`event ${event.id}: ${event.cardName} is not curated in ${event.chapterId}`);
    eventIds.set(event.id, id);
  }

  return {
    cards: [...printings].map(([id, data]) => ({ id, data })).sort((a, b) => a.id.localeCompare(b.id)),
    chapterIds, featuredIds, eventIds,
  };
}

export function addChapterCardIds(source, ids, chapter) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${chapter}: missing YAML frontmatter`);
  if (/^cardIds:/m.test(match[1])) throw new Error(`${chapter}: cardIds already exist; migration is one-time`);
  const occurrences = [...match[1].matchAll(/^cards:\s*$/gm)];
  if (occurrences.length !== 1) throw new Error(`${chapter}: expected one top-level cards section`);
  const updated = match[1].replace(/^cards:\s*$/m,
    `cardIds:\n${ids.map((id) => `  - ${id}`).join('\n')}\n\ncards:`);
  return source.replace(match[1], updated);
}

export function readChapterCardIds(source, chapter) {
  const block = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!block) throw new Error(`${chapter}: missing YAML frontmatter`);
  const part = block.match(/^cardIds:\s*\r?\n((?:^  - [^\r\n]+\r?\n?)+)/m)?.[1];
  if (!part) throw new Error(`${chapter}: missing cardIds`);
  return part.trimEnd().split(/\r?\n/).map((line) => line.replace(/^  - /, '').replace(/^['"]|['"]$/g, '').trim());
}

/** Validate every reference plus the entire printing set, not just totals. */
export function compareCards(plan, files, chapterSources, characters, events) {
  const errors = [];
  const canonical = new Map();
  for (const { id, data } of files) {
    if (canonical.has(id)) errors.push(`duplicate canonical printing ${id}`);
    if (!uuid.test(id) || id !== id.toLowerCase()) errors.push(`invalid canonical ID ${id}`);
    canonical.set(id, data);
  }
  const expected = new Map(plan.cards.map((entry) => [entry.id, entry.data]));
  for (const [id, data] of expected) {
    if (!canonical.has(id)) errors.push(`missing canonical printing ${id}`);
    else if (!isDeepStrictEqual(canonical.get(id), data)) errors.push(`printing ${id}: metadata drift`);
  }
  for (const id of canonical.keys()) if (!expected.has(id)) errors.push(`orphan canonical printing ${id}`);
  for (const [chapter, ids] of plan.chapterIds) {
    try {
      const actual = readChapterCardIds(chapterSources.get(chapter), chapter);
      if (!isDeepStrictEqual(actual, ids)) errors.push(`chapter ${chapter}: cardIds disagree with curated cards`);
    } catch (error) { errors.push(error.message); }
  }
  for (const character of characters) {
    if (character.featuredCardId !== plan.featuredIds.get(character.id)) {
      errors.push(`character ${character.id}: featuredCardId does not match exact printing`);
    }
  }
  for (const event of events) {
    if (event.cardId !== plan.eventIds.get(event.id)) errors.push(`event ${event.id}: cardId does not match chapter card`);
  }
  return errors;
}
