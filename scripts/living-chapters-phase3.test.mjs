import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ARTWORK_MOMENT_SELECTOR, chapterArtworkEntries, activeArtworkIndex, setupChapterArtworkTrail } from '../src/utils/chapter-artwork-trail.mjs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const mock = (name, credit, id) => ({
  querySelector(selector) {
    if (selector === '.historical-card__caption h3') return { textContent: name };
    if (selector === '.historical-card__credit') return { textContent: credit };
    if (selector === '[data-card-artwork-open]') return { dataset: { printingId: id } };
    return null;
  },
});

test('uses only real in-page card names, credits and printing IDs', () => {
  const root = { querySelectorAll(selector) {
    assert.equal(selector, ARTWORK_MOMENT_SELECTOR);
    return [mock('Vindicate', 'Illustrated by Brian Snoddy · APC #125', 'valid-id'), mock('Incomplete', '', '')];
  } };
  assert.deepEqual(chapterArtworkEntries(root).map(({ title, credit, printingId }) => ({ title, credit, printingId })), [{
    title: 'Vindicate', credit: 'Illustrated by Brian Snoddy · APC #125', printingId: 'valid-id',
  }]);
});

test('active location handles thresholds and empty chapters', () => {
  assert.equal(activeArtworkIndex([], 240), -1);
  assert.equal(activeArtworkIndex([310, 520, 890], 240), 0);
  assert.equal(activeArtworkIndex([-250, 180, 890], 240), 1);
  assert.equal(activeArtworkIndex([-500, -100, 180], 240), 2);
});

test('the enhancement is a no-op without a compatible chapter', () => {
  assert.equal(setupChapterArtworkTrail(null).count, 0);
  assert.equal(setupChapterArtworkTrail({ querySelector() { return null; } }).count, 0);
});

test('wiring preserves actual historical moments, full artwork, and accessibility', () => {
  const page = read('src/pages/chapters/[id].astro');
  const component = read('src/components/ChapterArtworkTrail.astro');
  const util = read('src/utils/chapter-artwork-trail.mjs');
  assert.match(page, /<ChapterArtworkTrail \/>/);
  assert.match(component, /data-chapter-artwork-trail hidden/);
  assert.match(component, /aria-labelledby="chapter-artwork-trail-heading"/);
  assert.match(component, /<details/);
  assert.match(component, /not independent historical evidence/);
  assert.match(util, /\.historical-card__credit/);
  assert.match(util, /\.historical-card__caption h3/);
  assert.match(util, /\[data-card-artwork-open\]/);
  assert.doesNotMatch(util, /fetch\(|localStorage|\.innerHTML\s*=/);
  assert.doesNotMatch(component, /<img|Scryfall API/);
});

test('chapter artwork trail uses theme tokens and does not hide existing prose', () => {
  const component = read('src/components/ChapterArtworkTrail.astro');
  assert.match(component, /--era-accent/);
  assert.match(component, /var\(--link-color\)/);
  assert.doesNotMatch(component, /\.historical-moment[^\n]*\{[^}]*display:\s*none/s);
});
