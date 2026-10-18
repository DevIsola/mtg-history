import { isDeepStrictEqual } from 'node:util';

/**
 * One-off entity migration helpers. Keep this module dependency-free so it can
 * run before Astro synchronization and without loading the site's UI modules.
 */
export const entitySpecs = Object.freeze([
  { kind: 'characters', exportName: 'characters', typeName: 'CharacterProfile', hasId: true },
  { kind: 'events', exportName: 'historicalEvents', typeName: 'HistoricalEvent', hasId: true },
  { kind: 'relationships', exportName: 'characterRelationships', typeName: 'CharacterRelationship', hasId: false },
]);

const safeId = /^[a-z0-9][a-z0-9-]*$/;

export function recordId(spec, record) {
  if (spec.hasId) return record.id;
  const endpoints = [record.a, record.b].sort();
  return `${endpoints.join('--')}--${record.category}--${record.chapterId}`;
}

export function prepareRecords(spec, records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error(`${spec.kind}: expected a nonempty array`);
  }
  const seen = new Set();
  return records.map((record) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error(`${spec.kind}: expected a plain record`);
    }
    const id = recordId(spec, record);
    if (typeof id !== 'string' || !safeId.test(id)) {
      throw new Error(`${spec.kind}: invalid filename ID ${JSON.stringify(id)}`);
    }
    if (seen.has(id)) throw new Error(`${spec.kind}: duplicate ID ${id}`);
    seen.add(id);
    const data = { ...record };
    if (spec.hasId) delete data.id;
    return { id, data };
  });
}

/** Preserve original object order, which callers use for editorial chronology. */
export function renderAdapter(spec, originalSource, entries) {
  const declaration = `export const ${spec.exportName}: ${spec.typeName}[] = [`;
  const position = originalSource.indexOf(declaration);
  if (position < 0 || !originalSource.trimEnd().endsWith('];')) {
    throw new Error(`${spec.kind}: unexpected legacy registry shape; no files written`);
  }
  const preamble = originalSource.slice(0, position).trimEnd();
  const imports = entries.map(({ id }, i) =>
    `import entry${i} from '../content/${spec.kind}/${id}.json' with { type: 'json' };`
  );
  const items = entries.map(({ id }, i) => {
    const value = spec.hasId ? `{ id: ${JSON.stringify(id)}, ...entry${i} }` : `entry${i}`;
    return `  ${value} as ${spec.typeName},`;
  });
  return `${preamble}\n\n// Generated compatibility adapter. Edit src/content/${spec.kind}/*.json instead.\n` +
    `${imports.join('\n')}\n\n` +
    `export const ${spec.exportName}: ${spec.typeName}[] = [\n${items.join('\n')}\n];\n`;
}

export function compareDirectoryEntries(spec, records, actualEntries) {
  const errors = [];
  const seen = new Set();
  for (const { id, data } of actualEntries) {
    if (seen.has(id)) errors.push(`${spec.kind}: duplicate file ${id}`);
    seen.add(id);
    if (!safeId.test(id)) errors.push(`${spec.kind}: invalid file ID ${id}`);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      errors.push(`${spec.kind}/${id}: expected a JSON object`);
    }
  }
  const byId = new Map(actualEntries.map(({ id, data }) => [id, data]));
  for (const { id, data } of prepareRecords(spec, records)) {
    if (!byId.has(id)) {
      errors.push(`${spec.kind}: adapter contains ${id} but JSON file is missing`);
    } else if (!isDeepStrictEqual(data, byId.get(id))) {
      errors.push(`${spec.kind}/${id}: adapter and JSON differ`);
    }
    seen.delete(id);
  }
  for (const id of seen) errors.push(`${spec.kind}: JSON file ${id} is not loaded by adapter`);
  return errors;
}
