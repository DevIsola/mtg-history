import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  READING_PREFERENCES_KEY,
  DEFAULT_READING_PREFERENCES,
  normalizeReadingPreferences,
  readReadingPreferences,
  writeReadingPreferences,
} from '../src/utils/reading-preferences.mjs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

function fakeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('defaults preserve existing chapter typography', () => {
  assert.deepEqual(normalizeReadingPreferences(null), DEFAULT_READING_PREFERENCES);
  assert.deepEqual(normalizeReadingPreferences([]), DEFAULT_READING_PREFERENCES);
  assert.deepEqual(readReadingPreferences(fakeStorage()), DEFAULT_READING_PREFERENCES);
});

test('only known reading preference choices can affect the page', () => {
  const expected = { size: 'large', typeface: 'classic', spacing: 'relaxed' };
  assert.deepEqual(normalizeReadingPreferences(expected), expected);
  assert.deepEqual(normalizeReadingPreferences({ ...expected, size: '2000px', spacing: 'none' }),
    { size: 'regular', typeface: 'classic', spacing: 'comfortable' });
  assert.deepEqual(normalizeReadingPreferences({ size: '__proto__' }), DEFAULT_READING_PREFERENCES);
});

test('saved preferences round-trip across chapters', () => {
  const storage = fakeStorage();
  assert.equal(writeReadingPreferences(storage, { size: 'large', typeface: 'classic', spacing: 'relaxed' }), true);
  assert.equal(typeof storage.getItem(READING_PREFERENCES_KEY), 'string');
  assert.deepEqual(readReadingPreferences(storage), {
    size: 'large', typeface: 'classic', spacing: 'relaxed',
  });
});

test('corrupted or unavailable storage fails safely without changing defaults', () => {
  const corrupted = { getItem: () => '{broken' };
  const blocked = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } };
  assert.deepEqual(readReadingPreferences(corrupted), DEFAULT_READING_PREFERENCES);
  assert.deepEqual(readReadingPreferences(blocked), DEFAULT_READING_PREFERENCES);
  assert.equal(writeReadingPreferences(blocked, DEFAULT_READING_PREFERENCES), false);
  assert.equal(writeReadingPreferences(undefined, DEFAULT_READING_PREFERENCES), false);
});

test('preferences are scoped only to chapter reader and preserve no-JS reading', () => {
  const page = read('src/pages/chapters/[id].astro');
  const component = read('src/components/ChapterReadingControls.astro');
  const scss = read('src/styles/_reading.scss');
  assert.match(page, /data-chapter-reading-root/);
  assert.match(page, /<ChapterReadingControls \/>/);
  assert.match(component, /data-reading-controls hidden/);
  assert.match(component, /type="radio"/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /writeReadingPreferences\(storage, preferences\)/);
  assert.match(scss, /#chapter-reader\[data-reading-size='large'\] \.chapter-prose/);
  assert.match(scss, /#chapter-reader\[data-reading-typeface='classic'\] \.chapter-prose/);
  assert.match(scss, /#chapter-reader\[data-reading-spacing='relaxed'\] \.chapter-prose/);
  assert.doesNotMatch(scss, /#chapter-reader\[data-reading-size='large'\] \.chapter-toc/);
});
