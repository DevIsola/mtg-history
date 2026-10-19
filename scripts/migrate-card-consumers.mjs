import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transformations, transformConsumer } from './card-consumer-migration-tools.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

/** Preflight every source before writing. This is intentionally a one-time migration. */
export async function planMigration(directory = root) {
  return Promise.all(Object.keys(transformations).map(async (path) => {
    const original = await readFile(join(directory, path), 'utf8');
    return { path, original, updated: transformConsumer(path, original) };
  }));
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const plans = await planMigration();
    for (const plan of plans) await writeFile(join(root, plan.path), plan.updated);
    for (const plan of plans) console.log(`Migrated canonical card rendering: ${plan.path}`);
    console.log('Check the diff and run pnpm run verify && pnpm exec playwright test.');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
