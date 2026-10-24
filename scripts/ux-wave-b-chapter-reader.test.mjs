import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const css = read('src/styles/_reading.scss');
const card = read('src/components/HistoricalCard.astro');
const moment = read('src/components/HistoricalMoment.astro');

test('chapter switcher is in document flow and sticky offsets exclude its former height', () => {
  assert.match(css, /\.chapter-switcher-band\s*\{\s*position: relative;/);
  assert.match(css, /\.chapter-switcher\s*\{[^}]*min-height: 58px;/s);
  assert.match(css, /\.chapter-reader \.chapter-reading-sidebar \{ top: calc\(var\(--site-header-height\) \+ 0\.75rem\); \}/);
  assert.doesNotMatch(css, /\.chapter-switcher-band\s*\{\s*position: sticky;/);
});

test('mobile TOC remains opaque and touch-sized while requiring less vertical space', () => {
  assert.match(css, /\.chapter-toc__toolbar \{ display: none; \}/);
  assert.match(css, /\.chapter-toc\s*\{[^}]*background: var\(--paper-white\);[^}]*border: 1px solid var\(--line\);/s);
  assert.match(css, /\.chapter-reader \.chapter-reading-sidebar \{ top: var\(--site-header-height\); \}/);
  assert.match(css, /\.chapter-reader \.chapter-sources \{ scroll-margin-top: calc\(var\(--site-header-height\) \+ 5\.5rem\); \}/);
});

test('editorial plates keep original canonical printing and linked source', () => {
  assert.match(moment, /<HistoricalCard card=\{\{ scryfallId: printing\.id, significance \}\} compact \/>/);
  assert.match(card, /compact\?: boolean;/);
  assert.match(card, /historical-card--plate/);
  assert.match(card, /data-printing-id=\{printing\.id\}/);
  assert.match(card, /data-card-significance=\{card\.significance\}/);
  assert.match(card, /href=\{cardUrl\}/);
});

test('interpretation remains accessible with native details without JavaScript', () => {
  assert.match(card, /<details class="historical-card__interpretation">/);
  assert.match(card, /<summary>Art and historical context<\/summary>/);
  assert.match(card, /<p class="historical-card__significance">\{card\.significance\}<\/p>/);
  assert.match(css, /\.chapter-prose \.historical-moment__illustration \.historical-card img/);
  assert.match(css, /object-fit: contain;/);
  assert.doesNotMatch(moment, /<img/);
});
