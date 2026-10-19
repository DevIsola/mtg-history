import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { entitySpecs, compareDirectoryEntries } from './entity-collection-tools.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const expectedCounts = { characters: 88, events: 133, relationships: 118 };
let failed = false;

for (const spec of entitySpecs) {
  const directory = join(root, 'src/content', spec.kind);
  const files = (await readdir(directory)).filter((f) => f.endsWith('.json')).sort();
  const actualEntries = await Promise.all(files.map(async (filename) => ({
    id: filename.slice(0, -5),
    data: JSON.parse(await readFile(join(directory, filename), 'utf8')),
  })));
  const sourceName = spec.kind === 'characters' ? 'characters' :
    spec.kind === 'events' ? 'events' : 'relationships';
  const module = await import(pathToFileURL(join(root, 'src/data', `${sourceName}.ts`)).href);
  const records = module[spec.exportName];
  const errors = compareDirectoryEntries(spec, records, actualEntries);
  if (files.length !== expectedCounts[spec.kind] || records.length !== expectedCounts[spec.kind]) {
    errors.push(`${spec.kind}: expected ${expectedCounts[spec.kind]}, got ${files.length} JSON files and ${records.length} adapter entries`);
  }
  if (errors.length) {
    failed = true;
    errors.forEach((error) => console.error(error));
  } else console.log(`Entity collection: ${spec.kind} ${files.length}/${expectedCounts[spec.kind]} checked`);
}
if (failed) process.exitCode = 1;
else console.log('Entity collections and compatibility adapters match.');
