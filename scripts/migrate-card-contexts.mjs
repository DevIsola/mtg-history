import { readdir, readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';
import { migrateFeaturedCard, migrateEventCard, migrateSourceFile, sourceFilesToMigrate } from './card-context-migration-tools.mjs';

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== '--check')) {
  throw new Error('Usage: node scripts/migrate-card-contexts.mjs [--check]');
}
const dryRun = args[0] === '--check';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
async function jsonEntries(kind) {
  const folder = join(root, kind);
  const names = (await readdir(folder)).filter((name) => name.endsWith('.json')).sort();
  return Promise.all(names.map(async (name) => {
    const path = join(folder, name);
    return { path, id: name.slice(0, -5), data: JSON.parse(await readFile(path, 'utf8')) };
  }));
}

const [printings, characters, events] = await Promise.all([
  jsonEntries('cards'), jsonEntries('characters'), jsonEntries('events'),
]);
if (characters.length !== 87 || events.length !== 125 || printings.length !== 133) {
  throw new Error(`Unexpected catalog totals: ${characters.length} characters, ${events.length} events, ${printings.length} printings`);
}
const byPrinting = new Map(printings.map(({ id, data }) => [id, data]));
const chapterFiles = (await readdir(join(root, 'chapters'))).filter((f) => /\.mdx?$/.test(f));
if (chapterFiles.length !== 10) throw new Error(`Expected 10 chapters, found ${chapterFiles.length}`);
const chapters = new Map(await Promise.all(chapterFiles.map(async (filename) => {
  const id = filename.replace(/\.mdx?$/, '');
  const source = await readFile(join(root, 'chapters', filename), 'utf8');
  return [id, parseChapterEditorial(source, id).cards];
})));
const staged = [
  ...characters.map(({ path, id, data }) => ({ path, data: migrateFeaturedCard({ id, ...data }, byPrinting) })),
  ...events.map(({ path, id, data }) => ({ path, data: migrateEventCard({ id, ...data }, chapters, byPrinting) })),
];
// Preserve the original JSON schema (the filename owns the entity ID).
for (const entry of staged) delete entry.data.id;
// All records and source anchors are validated before the first disk write.
const sourceChanges = await Promise.all(sourceFilesToMigrate.map(async (file) => {
  const path = join(repositoryRoot, file);
  return { path, source: migrateSourceFile(file, await readFile(path, 'utf8')) };
}));
if (dryRun) {
  console.log(`Preflight passed: ${characters.length} portraits, ${events.length} event references and ${sourceChanges.length} source anchors ready; no files changed.`);
  process.exit(0);
}
// Stage each file first, avoiding a partially written source file.
const pending = [];
try {
  for (const { path, data } of staged) {
    const target = `${path}.card-context-pending`;
    await writeFile(target, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
    pending.push({ target, path });
  }
  for (const { path, source } of sourceChanges) {
    const target = `${path}.card-context-pending`;
    await writeFile(target, source, { flag: 'wx' });
    pending.push({ target, path });
  }
  for (const { target, path } of pending) await rename(target, path);
} catch (error) {
  await Promise.all(pending.map(({ target }) => unlink(target).catch(() => {})));
  throw error;
}
console.log(`Migrated ${characters.length} character portraits, ${events.length} event references, and ${sourceChanges.length} source files.`);
console.log('Run pnpm run check:cards, pnpm run verify, and pnpm exec playwright test.');
