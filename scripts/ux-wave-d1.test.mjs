import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { paletteResultKind } from '../src/utils/search-palette.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const base = '/mtg-history/';

test('search results present distinct localized record types without changing Pagefind ranking', () => {
  assert.equal(paletteResultKind(base + 'chapters/thran/', base, 'en'), 'Chapter');
  assert.equal(paletteResultKind(base + 'events/brothers-war/', base, 'en'), 'Event');
  assert.equal(paletteResultKind(base + 'characters/urza/', base, 'en'), 'Character');
  assert.equal(paletteResultKind(base + 'pt-br/chapters/thran/', base, 'pt-BR'), 'Capítulo');
  assert.equal(paletteResultKind(base + 'pt-br/events/', base, 'pt-BR'), 'Acontecimento');
  assert.equal(paletteResultKind(base + 'pt-br/timeline/', base, 'pt-BR'), 'Cronologia');
  assert.equal(paletteResultKind('/different/site/', base, 'en'), 'Page');
});

test('palette is a structured list with independent type, title, excerpt and affordance', () => {
  const palette = read('src/components/SearchPalette.astro');
  for (const token of ['search-palette__result-kind', 'search-palette__result-copy',
    'search-palette__result-title', 'search-palette__result-excerpt', 'search-palette__result-arrow',
    'grid-template-columns:', 'overflow-wrap: anywhere']) assert.ok(palette.includes(token), token);
  assert.match(palette, /paletteResultUrl\(entry\.url/);
  assert.match(palette, /paletteResultKind\(url, base, locale\)/);
  assert.match(palette, /\.textContent =/);
  assert.doesNotMatch(palette, /\.innerHTML\s*=/);
  for (const [, value] of palette.matchAll(/font-size:\s*(0?\.\d+)rem/g))
    assert.ok(Number(value) >= .75, value);
});

test('timeline preserves filters and historical chronology while showing exact canonical illustration', () => {
  const timeline = read('src/components/pages/TimelinePage.astro');
  const artwork = read('src/components/TimelineArtwork.astro');
  assert.match(timeline, /<TimelineArtwork chapter=\{chapter\} \/>/);
  for (const token of ['data-timeline-explorer', 'data-timeline-event',
    'data-timeline-details', 'data-era-search', 'atlas-era__chronology',
    'publicationHistory', 'storyPeriod']) assert.ok(timeline.includes(token), token);
  for (const token of ['chapterCardUse(canonicalChapter, 0, printings)', 'archiveCard(canonical, locale)',
    'card.imageUrl', 'card.imageSrcset', 'card.scryfallUrl', 'significance',
    'card.artist', 'card.collectorNumber', 'data-canonical-id={card.canonicalId}'])
    assert.ok(artwork.includes(token), token);
});

test('D1 layout keeps optional art subordinate to legible narrative and event lists', () => {
  const styles = read('src/styles/_interactive-explorers.scss');
  assert.match(styles, /UX D1: editorial timeline/);
  assert.match(styles, /\.atlas-era__artwork\s*\{/);
  assert.match(styles, /max-width: 900px/);
  assert.match(styles, /\.atlas-era__events ol\s*\{/);
});
