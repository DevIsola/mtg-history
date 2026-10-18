import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';
import { addChapterCardIds, planCards } from './card-collection-tools.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const content = join(root, 'src/content');
const cardsPath = join(content, 'cards');

async function exists(path) {
  try { await access(path); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}
async function entries(folder) {
  const files = (await readdir(join(content, folder))).filter((f) => f.endsWith('.json')).sort();
  return Promise.all(files.map(async (filename) => ({
    id: filename.slice(0, -5),
    path: join(content, folder, filename),
    data: JSON.parse(await readFile(join(content, folder, filename), 'utf8')),
  })));
}
if (await exists(cardsPath)) {
  throw new Error('src/content/cards already exists: refusing to overwrite an established card registry');
}
const chapterFiles = (await readdir(join(content, 'chapters')))
  .filter((name) => /\.(md|mdx)$/.test(name)).sort();
const chapters = await Promise.all(chapterFiles.map(async (filename) => {
  const id = filename.replace(/\.(md|mdx)$/, '');
  const path = join(content, 'chapters', filename);
  const source = await readFile(path, 'utf8');
  return { ...parseChapterEditorial(source, id), path, source };
}));
const characterFiles = await entries('characters');
const eventFiles = await entries('events');
const characters = characterFiles.map(({ id, data }) => ({ id, ...data }));
const events = eventFiles.map(({ id, data }) => ({ id, ...data }));
if (chapters.length !== 10 || characters.length !== 87 || events.length !== 125) {
  throw new Error('Unexpected source totals: review content before migrating cards');
}
for (const row of characterFiles) if ('featuredCardId' in row.data) {
  throw new Error(`characters/${row.id} already has featuredCardId`);
}
for (const row of eventFiles) if ('cardId' in row.data) {
  throw new Error(`events/${row.id} already has cardId`);
}
const plan = planCards(chapters, characters, events);
const updates = [
  ...chapters.map((chapter) => ({ path: chapter.path,
    content: addChapterCardIds(chapter.source, plan.chapterIds.get(chapter.id), chapter.id) })),
  ...characterFiles.map(({ id, path, data }) => ({ path, content: JSON.stringify({
    ...data, featuredCardId: plan.featuredIds.get(id),
  }, null, 2) + '\n' })),
  ...eventFiles.map(({ id, path, data }) => ({ path, content: JSON.stringify({
    ...data, cardId: plan.eventIds.get(id),
  }, null, 2) + '\n' })),
];
// Preflight is complete. No existing file was modified before validation.
await mkdir(cardsPath, { recursive: false });
for (const card of plan.cards) await writeFile(join(cardsPath, `${card.id}.json`),
  JSON.stringify(card.data, null, 2) + '\n', { flag: 'wx' });
for (const update of updates) await writeFile(update.path, update.content);
console.log(`Migrated ${plan.cards.length} unique Scryfall printings from ${chapters.length} chapters and ${characters.length} profiles.`);
console.log('Added exact card references to 10 chapters, 87 characters, and 125 events.');
console.log('Run pnpm run check:cards, then the complete verification pipeline.');
