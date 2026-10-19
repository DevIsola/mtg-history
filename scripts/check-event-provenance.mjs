import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';

const content = fileURLToPath(new URL('../src/content/', import.meta.url));
export async function checkEventProvenance() {
  const eventFiles = (await readdir(join(content, 'events'))).filter((name) => name.endsWith('.json'));
  const events = await Promise.all(eventFiles.map(async (name) => ({
    id: name.slice(0, -5),
    ...JSON.parse(await readFile(join(content, 'events', name), 'utf8')),
  })));
  const chapterFiles = (await readdir(join(content, 'chapters'))).filter((name) => name.endsWith('.mdx'));
  const sourcesByChapter = new Map(await Promise.all(chapterFiles.map(async (name) => {
    const id = name.slice(0, -4);
    const chapter = parseChapterEditorial(await readFile(join(content, 'chapters', name), 'utf8'), id);
    return [id, chapter.sources];
  })));
  return {
    totalEvents: events.length,
    reviewedEvents: Object.keys(eventProvenance).length,
    errors: validateEventProvenance(eventProvenance, events, sourcesByChapter),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const result = await checkEventProvenance();
    for (const error of result.errors) console.error(`- ${error}`);
    console.log(`Event provenance pilot: ${result.reviewedEvents}/${result.totalEvents} reviewed event records; ${result.errors.length} integrity errors.`);
    if (result.errors.length) process.exitCode = 1;
    else console.log('Event citations, date precision and chapter bibliographies match (offline).');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
