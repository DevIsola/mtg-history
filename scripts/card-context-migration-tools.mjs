/** Pure, strict preparation of legacy card-use records for canonical-only display metadata. */
const printingFields = ['name', 'setCode', 'collectorNumber', 'artist'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function migrateFeaturedCard(character, printings) {
  const context = `character ${character?.id ?? '(unknown)'}`;
  const id = character?.featuredCardId;
  const featured = character?.featuredCard;
  if (!uuid.test(id ?? '') || !featured || typeof featured !== 'object' ||
      typeof featured.significance !== 'string' || !featured.significance.trim()) {
    throw new Error(`${context}: invalid portrait ID or missing editorial significance`);
  }
  if (Object.keys(featured).length === 1 && 'significance' in featured) {
    throw new Error(`${context}: already migrated; refusing a second migration`);
  }
  const canonical = printings.get(id.toLowerCase());
  if (!canonical) throw new Error(`${context}: canonical printing ${id} does not exist`);
  if (featured.scryfallId?.toLowerCase() !== id.toLowerCase() ||
      printingFields.some((field) => featured[field] !== canonical[field])) {
    throw new Error(`${context}: portrait does not match its canonical printing ${id}`);
  }
  if (Object.keys(featured).some((field) => ![...printingFields, 'scryfallId', 'significance'].includes(field))) {
    throw new Error(`${context}: unrecognized portrait data would be lost`);
  }
  return { ...character, featuredCard: { significance: featured.significance } };
}

export function migrateEventCard(event, chapters, printings) {
  const context = `event ${event?.id ?? '(unknown)'}`;
  if (typeof event?.cardName !== 'string' || !event.cardName.trim()) {
    throw new Error(`${context}: missing cardName or already migrated`);
  }
  if (!uuid.test(event.cardId ?? '')) throw new Error(`${context}: invalid cardId`);
  if (!printings.has(event.cardId.toLowerCase())) throw new Error(`${context}: unknown canonical printing ${event.cardId}`);
  const curated = chapters.get(event.chapterId);
  if (!curated) throw new Error(`${context}: unknown chapter ${event.chapterId}`);
  const card = curated.find((item) => item.scryfallId?.toLowerCase() === event.cardId.toLowerCase());
  if (!card || card.name !== event.cardName) {
    throw new Error(`${context}: card ID and legacy name do not identify the same curated chapter card`);
  }
  const migrated = { ...event };
  delete migrated.cardName;
  return migrated;
}

function replaceExactly(source, before, after, context) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${context}: required unique source anchor missing or duplicated; no files written`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
}

/** Reject unexpected source revisions before changing either code or editorial JSON. */
export function migrateSourceFile(file, original) {
  const transformations = {
    'src/content.config.ts': [
      [
        `    featuredCard: z.object({\n      name: z.string(),\n      setCode: z.string(),\n      collectorNumber: z.string(),\n      scryfallId: z.uuid(),\n      artist: z.string(),\n      significance: z.string(),\n    }),`,
        `    featuredCard: z.object({ significance: z.string().min(1) }),`,
      ],
      [`    cardName: z.string(),\n    cardId: reference("cards"),`, `    cardId: reference("cards"),`],
    ],
    'src/data/characters.ts': [
      [`import type { CollectionEntry } from "astro:content";\n\ntype HistoricalCard = CollectionEntry<"chapters">["data"]["cards"][number];`,
        `type HistoricalCard = { significance: string };`],
    ],
    'src/data/events.ts': [
      [`  cardName: string;\n  cardId: string;`, `  cardId: string;`],
    ],
    'scripts/check-content-graph.mjs': [
      [
        `    } else if (!chaptersById.get(event.chapterId).cardNames.includes(event.cardName)) {\n      errors.push(\`event "\${event.id}": card "\${event.cardName}" missing from chapter "\${event.chapterId}"\`);\n    }`,
        `    } else {\n      const chapter = chaptersById.get(event.chapterId);\n      if (typeof event.cardId === 'string' && Array.isArray(chapter.cardIds) && chapter.cardIds.length) {\n        if (!chapter.cardIds.includes(event.cardId)) {\n          errors.push(\`event "\${event.id}": card printing "\${event.cardId}" missing from chapter "\${event.chapterId}"\`);\n        }\n      } else if (typeof event.cardName === 'string') {\n        // Keep supporting standalone legacy fixtures during this transition.\n        if (!chapter.cardNames.includes(event.cardName)) {\n          errors.push(\`event "\${event.id}": card "\${event.cardName}" missing from chapter "\${event.chapterId}"\`);\n        }\n      } else {\n        errors.push(\`event "\${event.id}": missing chapter card printing reference\`);\n      }\n    }`,
      ],
      [
        `  const references = [...source.slice(match[0].length).matchAll(/<(CharacterLink|HistoricalEventReference)\\b[^>]*?\\bid\\s*=\\s*(["'])([^"']+)\\2/g)]`,
        `  const cardIdsBlock = frontmatter.match(/^cardIds:\\s*\\r?\\n((?:^  - [^\\r\\n]+\\r?\\n?)+)/m)?.[1] ?? '';\n  const cardIds = cardIdsBlock.split(/\\r?\\n/).filter(Boolean).map((line) => line.replace(/^  - /, '').replace(/^['"]|['"]$/g, '').trim());\n  const references = [...source.slice(match[0].length).matchAll(/<(CharacterLink|HistoricalEventReference)\\b[^>]*?\\bid\\s*=\\s*(["'])([^"']+)\\2/g)]`,
      ],
      [`  return { id, eraId: era[1], cardNames, references };`, `  return { id, eraId: era[1], cardNames, ...(cardIds.length ? { cardIds } : {}), references };`],
    ],
    'scripts/check-card-collections.mjs': [
      [
        `const plan = planCards(chapters, characters, events);`,
        `// Reconstruct legacy-shaped values only for the unchanged comparison engine.\n// Canonical card JSON is the sole source of printing metadata.\nconst byPrinting = new Map(canonical.map(({ id, data }) => [id, data]));\nconst chaptersById = new Map(chapters.map((chapter) => [chapter.id, chapter]));\nconst comparedCharacters = characters.map((character) => {\n  const { featuredCard, featuredCardId } = character;\n  if (!featuredCard || Object.keys(featuredCard).length !== 1 ||\n      typeof featuredCard.significance !== 'string' || !featuredCard.significance.trim()) {\n    throw new Error(\`character \${character.id}: portrait must contain significance only\`);\n  }\n  const printing = byPrinting.get(featuredCardId);\n  if (!printing) throw new Error(\`character \${character.id}: missing printing \${featuredCardId}\`);\n  return { ...character, featuredCard: { ...printing, scryfallId: featuredCardId, significance: featuredCard.significance } };\n});\nconst comparedEvents = events.map((event) => {\n  if (Object.hasOwn(event, 'cardName')) throw new Error(\`event \${event.id}: duplicate cardName must be removed\`);\n  const curated = chaptersById.get(event.chapterId)?.cards.find((card) => card.scryfallId.toLowerCase() === event.cardId);\n  if (!curated) throw new Error(\`event \${event.id}: printing not curated in its chapter\`);\n  return { ...event, cardName: curated.name };\n});\nconst plan = planCards(chapters, comparedCharacters, comparedEvents);`,
      ],
    ],
  };
  const rules = transformations[file];
  if (!rules) throw new Error(`${file}: not a supported migration target`);
  return rules.reduce((result, [from, to]) => replaceExactly(result, from, to, file), original);
}

export const sourceFilesToMigrate = Object.freeze([
  'src/content.config.ts',
  'src/data/characters.ts',
  'src/data/events.ts',
  'scripts/check-content-graph.mjs',
  'scripts/check-card-collections.mjs',
]);
