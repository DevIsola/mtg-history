import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { historyPaths, pathsForChapter, validateHistoryPaths } from '../src/data/history-paths.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const ids = (folder, ext) => readdirSync(new URL(`../src/content/${folder}/`, import.meta.url))
  .filter((name) => name.endsWith(ext)).map((name) => name.slice(0, -ext.length));
const chapterIds = new Set([...ids('chapters', '.mdx'), ...ids('chapters', '.md')]);
const eventEntries = ids('events', '.json').map((id) => [id, JSON.parse(read(`src/content/events/${id}.json`))]);
const eventChapters = new Map(eventEntries.map(([id, entry]) => [id, entry.chapterId]));

test('curated paths use existing chapters and correctly attributed events', () => {
  assert.deepEqual(validateHistoryPaths(historyPaths, chapterIds, eventChapters), []);
  assert.equal(historyPaths.length, 4);
  assert.ok(historyPaths.every((path) => path.steps.length >= 2));
  assert.ok(historyPaths.some((path) => path.id === 'phyrexian-legacy'));
  assert.ok(historyPaths.some((path) => path.id === 'ravnicas-orders'));
});

test('editorial chronology cautions and next-step recommendations are stable', () => {
  for (const path of historyPaths) {
    assert.ok(path.chronology.length >= 50, `${path.id} needs a chronology caution`);
    for (const [index, step] of path.steps.entries()) {
      const match = pathsForChapter(step.chapterId).find((record) => record.path.id === path.id);
      assert.equal(match?.index, index);
      assert.equal(match?.next?.eventId ?? null, path.steps[index + 1]?.eventId ?? null);
    }
  }
  assert.ok(pathsForChapter('ice-age').some(({ path }) => path.id === 'changing-boundaries'));
  assert.deepEqual(pathsForChapter('nonexistent'), []);
});

test('invalid or editorially confused paths fail closed', () => {
  const bad = structuredClone(historyPaths.slice(0, 1));
  bad[0].steps[0].eventId = 'not-a-real-event';
  bad[0].steps[1].chapterId = 'otaria';
  const errors = validateHistoryPaths(bad, chapterIds, eventChapters);
  assert.ok(errors.some((message) => message.includes('unknown event')));
  assert.ok(errors.some((message) => message.includes('belongs to')));
  assert.ok(validateHistoryPaths([...historyPaths, historyPaths[0]], chapterIds, eventChapters)
    .some((message) => message.includes('Duplicate or invalid path ID')));
});

test('chapter integration and static reading-path hub are accessible without JavaScript', () => {
  const chapter = read('src/pages/chapters/[id].astro');
  const component = read('src/components/ChapterHistoryPaths.astro');
  const hub = read('src/pages/paths/index.astro');
  assert.match(chapter, /import ChapterHistoryPaths from/);
  assert.match(chapter, /<ChapterHistoryPaths chapterId=\{chapter\.id\} chapters=\{chapters\}/);
  assert.match(component, /aria-labelledby="history-paths-heading"/);
  assert.match(component, /withBase\(`events\/\$\{next\.eventId\}\//);
  assert.match(hub, /validateHistoryPaths\(/);
  assert.match(hub, /<ol>/);
  assert.match(hub, /withBase\(`events\/\$\{event\.id\}\//);
  assert.doesNotMatch(hub, /client:load|onClick|fetch\(/);
});
