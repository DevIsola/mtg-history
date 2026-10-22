import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
function hexVar(css, name) {
  const value = css.match(new RegExp(`--${name}:\\s*(#[a-fA-F0-9]{6})`));
  assert.ok(value, `Missing semantic ${name} token`);
  return value[1];
}
function luminance(color) {
  const channels = [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}

test('locale selector includes visible EN/PT in its accessible name', () => {
  const header = read('src/components/SiteHeader.astro');
  assert.match(header, /aria-label=\{pt \? 'PT — Escolher idioma' : 'EN — Choose language'\}/);
  assert.match(header, /\{pt \? 'PT' : 'EN'\}/);
});

test('chapter reading summary includes visible Aa in its accessible name', () => {
  const chapter = read('src/pages/chapters/[id].astro');
  assert.match(chapter, /summary aria-label="Aa Reading preferences"/);
});

test('jade and editorial links clear 4.5:1 on all light-theme paper surfaces', () => {
  const css = read('src/styles/_tokens.scss');
  const jade = hexVar(css, 'jade');
  const link = hexVar(css, 'link-color');
  for (const surface of ['paper', 'paper-white', 'paper-deep']) {
    const bg = hexVar(css, surface);
    assert.ok(contrast(jade, bg) >= 4.5, `jade on ${surface}: ${contrast(jade, bg)}`);
    assert.ok(contrast(link, bg) >= 4.5, `link text on ${surface}: ${contrast(link, bg)}`);
  }
});

test('illustration reveal preserves full text opacity while moving into view', () => {
  const scss = read('src/styles/_chapter-themes.scss');
  assert.match(scss, /\[data-living-reveal='pending'\]\s*\{\s*opacity:\s*1;/);
  assert.match(scss, /transform: translate3d\(0, 10px, 0\)/);
  assert.doesNotMatch(scss, /opacity:\s*0\.92/);
  assert.match(scss, /prefers-reduced-motion:\s*reduce/);
});

test('historical event labels use accessible text tokens, not decorative gold', () => {
  const component = read('src/components/HistoricalEventReference.astro');
  assert.match(component, /\.historical-event-reference__eyebrow\s*\{[^}]*color:\s*var\(--link-color\)/);
  assert.match(component, /\.historical-event-reference__link:hover strong\s*\{[^}]*color:\s*var\(--link-color\)/);
});

test('source numbers and pagination labels use semantic text contrast', () => {
  const css = read('src/styles/_reading.scss');
  assert.match(css, /\.chapter-sources__number\s*\{[^}]*color:\s*var\(--link-color\)/);
  assert.match(css, /\.chapter-pagination__link span\s*\{[^}]*color:\s*var\(--link-color\)/);
});
