import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { entitySpecs, prepareRecords, renderAdapter } from './entity-collection-tools.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const plans = [];

async function exists(path) {
  try { await access(path); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

// Complete validation and collision checks before writing any files.
for (const spec of entitySpecs) {
  // The legacy relationships registry exports `characterRelationships`, etc.
  const actualSource = spec.kind === 'characters' ? 'characters.ts' :
    spec.kind === 'events' ? 'events.ts' : 'relationships.ts';
  const path = join(root, 'src/data', actualSource);
  const original = await readFile(path, 'utf8');
  const module = await import(pathToFileURL(path).href);
  const records = module[spec.exportName];
  const entries = prepareRecords(spec, records);
  // Refuse transformations that would lose data (e.g. undefined properties).
  for (let i = 0; i < records.length; i++) {
    const decoded = JSON.parse(JSON.stringify(entries[i].data));
    const recovered = spec.hasId ? { id: entries[i].id, ...decoded } : decoded;
    if (!isDeepStrictEqual(recovered, records[i])) {
      throw new Error(`${spec.kind}/${entries[i].id}: JSON round-trip changed the source record`);
    }
  }
  const adapter = renderAdapter(spec, original, entries);
  const directory = join(root, 'src/content', spec.kind);
  if (await exists(directory)) {
    throw new Error(`${directory} exists: migration is intentionally one-time; do not overwrite editorial JSON`);
  }
  plans.push({ spec, path, directory, entries, adapter });
}

for (const { spec, path, directory, entries, adapter } of plans) {
  await mkdir(directory, { recursive: true });
  for (const { id, data } of entries) {
    await writeFile(join(directory, `${id}.json`), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
  }
  await writeFile(path, adapter);
  console.log(`Migrated ${entries.length} ${spec.kind} to independent Astro collection records`);
}
console.log('Run pnpm run check:entities, then pnpm run verify and pnpm exec playwright test.');
