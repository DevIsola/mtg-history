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
const chapters = await Promise.all((await readdir(join(content, 'chapters')))
  .filter((name) => /\.(md|mdx)$/.test(name)).sort().map(async (filename) => {
    const id = filename.replace(/\.(md|mdx)$/, '');
    const source = await readFile(join(content, 'chapters', filename), 'utf8');
    chapterSources.set(id, source);
    return parseChapterEditorial(source, id);
  }));
const characters = (await rows('characters')).map(({ id, data }) => ({ id, ...data }));
const events = (await rows('events')).map(({ id, data }) => ({ id, ...data }));
const canonical = await rows('cards');
const plan = planCards(chapters, characters, events);
const errors = compareCards(plan, canonical, chapterSources, characters, events);
if (chapters.length !== 10 || characters.length !== 87 || events.length !== 125 ||
    chapters.reduce((total, chapter) => total + chapter.cards.length, 0) !== 135) {
  errors.push('Unexpected content totals: 10 chapters, 87 characters, 125 events, 135 curated chapter card references required');
}
if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Card collection: ${canonical.length} unique printings; 135/135 chapter uses, 87/87 character references, 125/125 event references.`);
  console.log('Exact printing identities and reference integrity passed (offline).');
}
