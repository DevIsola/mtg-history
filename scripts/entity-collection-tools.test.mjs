import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entitySpecs, recordId, prepareRecords, renderAdapter, compareDirectoryEntries } from './entity-collection-tools.mjs';

const [characters, events, relationships] = entitySpecs;

test('character and event filenames use stable, existing record IDs', () => {
  assert.equal(recordId(characters, { id: 'urza' }), 'urza');
  assert.equal(recordId(events, { id: 'mending-rift' }), 'mending-rift');
});

test('relationship filenames are order-independent and chapter-specific', () => {
  const a = { a: 'urza', b: 'mishra', category: 'rivalry', chapterId: 'brothers-war' };
  assert.equal(recordId(relationships, a), recordId(relationships, { ...a, a: 'mishra', b: 'urza' }));
  assert.notEqual(recordId(relationships, a), recordId(relationships, { ...a, chapterId: 'thran' }));
});

test('rejects malformed and duplicate IDs before migration writes', () => {
  assert.throws(() => prepareRecords(characters, [{ id: 'bad/slug' }]), /invalid filename/);
  assert.throws(() => prepareRecords(events, [{ id: 'same' }, { id: 'same' }]), /duplicate ID/);
});

test('adapters preserve record order and keep source data in independent JSON files', () => {
  const source = 'export interface HistoricalEvent { id: string; title: string; }\n\nexport const historicalEvents: HistoricalEvent[] = [\n {id: "a", title: "One"},\n {id: "b", title: "Two"},\n];\n';
  const entries = prepareRecords(events, [{ id: 'a', title: 'One' }, { id: 'b', title: 'Two' }]);
  const adapter = renderAdapter(events, source, entries);
  assert.match(adapter, /content\/events\/a\.json/);
  assert.match(adapter, /content\/events\/b\.json/);
  assert.ok(adapter.indexOf('id: "a"') < adapter.indexOf('id: "b"'));
  assert.ok(!adapter.includes('title: "One"'));
});

test('integrity gate detects orphaned files, missing files, and changed values', () => {
  const records = [{ id: 'a', title: 'One' }];
  const good = [{ id: 'a', data: { title: 'One' } }];
  assert.deepEqual(compareDirectoryEntries(events, records, good), []);
  assert.ok(compareDirectoryEntries(events, records, []).some(e => e.includes('missing')));
  assert.ok(compareDirectoryEntries(events, records, [{ id: 'a', data: { title: 'Wrong' } }]).some(e => e.includes('differ')));
  assert.ok(compareDirectoryEntries(events, records, [...good, { id: 'b', data: { title: 'Two' } }]).some(e => e.includes('not loaded')));
});
