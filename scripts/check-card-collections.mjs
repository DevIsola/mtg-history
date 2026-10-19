import { loadCuratedChapters } from './load-curated-chapters.mjs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';
import { compareCards, planCards } from './card-collection-tools.mjs';

const content = fileURLToPath(new URL('../src/content/', import.meta.url));
async function rows(folder) {
  const filenames = (await readdir(join(content, folder))).filter((file) => file.endsWith('.json')).sort();
  return Promise.all(filenames.map(async (filename) => ({
    id: filename.slice(0, -5),
    data: JSON.parse(await readFile(join(content, folder, filename), 'utf8')),
  })));
}
const chapterSources = new Map();
const chapters = await loadCuratedChapters(
  join(content, 'chapters'), parseChapterEditorial, chapterSources,
);
const characters = (await rows('characters')).map(({ id, data }) => ({ id, ...data }));
const events = (await rows('events')).map(({ id, data }) => ({ id, ...data }));
const canonical = await rows('cards');
// Reconstruct legacy-shaped values only for the unchanged comparison engine.
// Canonical card JSON is the sole source of printing metadata.
const byPrinting = new Map(canonical.map(({ id, data }) => [id, data]));
const chaptersById = new Map(chapters.map((chapter) => [chapter.id, chapter]));
const comparedCharacters = characters.map((character) => {
  const { featuredCard, featuredCardId } = character;
  if (!featuredCard || Object.keys(featuredCard).length !== 1 ||
      typeof featuredCard.significance !== 'string' || !featuredCard.significance.trim()) {
    throw new Error(`character ${character.id}: portrait must contain significance only`);
  }
  const printing = byPrinting.get(featuredCardId);
  if (!printing) throw new Error(`character ${character.id}: missing printing ${featuredCardId}`);
  return { ...character, featuredCard: { ...printing, scryfallId: featuredCardId, significance: featuredCard.significance } };
});
const comparedEvents = events.map((event) => {
  if (Object.hasOwn(event, 'cardName')) throw new Error(`event ${event.id}: duplicate cardName must be removed`);
  const curated = chaptersById.get(event.chapterId)?.cards.find((card) => card.scryfallId.toLowerCase() === event.cardId);
  if (!curated) throw new Error(`event ${event.id}: printing not curated in its chapter`);
  return { ...event, cardName: curated.name };
});
const plan = planCards(chapters, comparedCharacters, comparedEvents);
const errors = compareCards(plan, canonical, chapterSources, characters, events);
if (chapters.length !== 10 || characters.length !== 88 || events.length !== 129 ||
    chapters.reduce((total, chapter) => total + chapter.cards.length, 0) !== 135) {
  errors.push('Unexpected content totals: 10 chapters, 88 characters, 129 events, 135 curated chapter card references required');
}
if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Card collection: ${canonical.length} unique printings; 135/135 chapter uses, 88/88 character references, 129/129 event references.`);
  console.log('Exact printing identities and reference integrity passed (offline).');
}
