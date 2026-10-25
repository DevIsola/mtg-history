import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { deriveEntityContinuity, entityConnectionsForChapter } from '../src/data/entity-continuity.mjs';

const chapters = [
  { id: 'thran', data: { order: 1, title: 'The Thran' } },
  { id: 'brothers-war', data: { order: 2, title: 'The Brothers’ War' } },
  { id: 'weatherlight', data: { order: 4, title: 'The Weatherlight Saga' } },
];
const characters = [
  { id: 'yawgmoth', name: 'Yawgmoth', chapterIds: ['thran'] },
  { id: 'gix', name: 'Gix', chapterIds: ['brothers-war'] },
  // Metadata-only overlap should never create a recommended link.
  { id: 'observer', name: 'Observer', chapterIds: ['thran', 'weatherlight'] },
];
const events = [
  { id: 'early-yawgmoth', chapterId: 'thran', characterIds: ['yawgmoth', 'gix'] },
  { id: 'later-yawgmoth', chapterId: 'weatherlight', characterIds: ['yawgmoth', 'gix'] },
  { id: 'brothers-gix', chapterId: 'brothers-war', characterIds: ['gix'] },
  { id: 'thran-observer', chapterId: 'thran', characterIds: ['observer'] },
];
const relationships = [
  { a: 'yawgmoth', b: 'gix', category: 'alliance', chapterId: 'thran' },
  { a: 'yawgmoth', b: 'observer', category: 'rivalry', chapterId: 'thran' },
];
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('two chapter-level event citations are required, not just character metadata', () => {
  const pairs = deriveEntityContinuity(chapters, characters, events, relationships);
  assert.equal(pairs.length, 3);
  const match = pairs.find((pair) => pair.id === 'thran--weatherlight');
  assert.deepEqual(match.people.map((person) => person.id), ['gix', 'yawgmoth']);
  assert.ok(!match.people.some((person) => person.id === 'observer'));
  assert.deepEqual(match.people.find((person) => person.id === 'yawgmoth'), {
    id: 'yawgmoth', name: 'Yawgmoth', fromEventId: 'early-yawgmoth', toEventId: 'later-yawgmoth',
  });
  assert.deepEqual(match.ties, [{ a: 'yawgmoth', b: 'gix', category: 'alliance', chapterId: 'thran' }]);
});

test('results are deterministic and chapter recommendations stay bounded', () => {
  const original = deriveEntityContinuity(chapters, characters, events, relationships);
  const reversed = deriveEntityContinuity(
    [...chapters].reverse(), [...characters].reverse(), [...events].reverse(), [...relationships].reverse(),
  );
  assert.deepEqual(reversed, original);
  assert.equal(entityConnectionsForChapter('thran', original, 1).length, 1);
  assert.equal(entityConnectionsForChapter('thran', original, 0).length, 0);
  assert.deepEqual(entityConnectionsForChapter('missing', original), []);
  assert.throws(() => entityConnectionsForChapter('thran', original, -1), /Invalid continuity/);
});

test('orphan event or relationship references fail closed', () => {
  assert.throws(() => deriveEntityContinuity(chapters, characters,
    [{ id: 'nope', chapterId: 'wrong', characterIds: ['yawgmoth'] }], []), /unknown chapter/);
  assert.throws(() => deriveEntityContinuity(chapters, characters,
    [{ id: 'nope', chapterId: 'thran', characterIds: ['unknown'] }], []), /unknown character/);
  assert.throws(() => deriveEntityContinuity(chapters, characters, events,
    [{ a: 'gix', b: 'unknown', chapterId: 'thran' }]), /unknown character or chapter/);
  assert.throws(() => deriveEntityContinuity(chapters, characters, [...events, events[0]], []), /Duplicate event/);
});

test('editorial routes remain distinct from generated evidence and all links use canonical IDs', () => {
  const hub = read('src/components/pages/HistoryPathsPage.astro');
  const component = read('src/components/ChapterEntityConnections.astro');
  const chapter = read('src/components/ChapterReader.astro');
  assert.match(hub, /historyPaths\.map\(/);
  assert.match(hub, /deriveEntityContinuity\(/);
  assert.match(hub, /id="entity-evidence"/);
  assert.match(hub, /entityConnections\.map\(/);
  assert.match(hub, /events\/\$\{person\.fromEventId\}/);
  assert.match(component, /entityConnectionsForChapter\(/);
  assert.match(component, /events\/\$\{connection\.fromId === chapterId/);
  assert.match(component, /aria-labelledby="entity-continuity-heading"/);
  assert.match(chapter, /<ChapterHistoryPaths chapterId=\{chapter\.id\} chapters=\{chapters\}/);
  assert.match(chapter, /<ChapterEntityConnections chapterId=\{chapter\.id\} chapters=\{chapters\}/);
  assert.doesNotMatch(component, /fetch\(|client:load|dangerouslySetInnerHTML/);
});
