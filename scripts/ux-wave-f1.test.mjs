import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { RELATIONSHIP_COLORS, relationshipColor, relationshipDash } from '../src/utils/relationship-colors.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
function brightness(hex) {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function contrast(a, b) {
  const x = brightness(a), y = brightness(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
test('six network categories have distinct line colors, strong light/dark contrast, and non-color cues', () => {
  const entries = Object.entries(RELATIONSHIP_COLORS);
  assert.equal(entries.length, 6);
  assert.equal(new Set(entries.map(([, v]) => v.light)).size, 6);
  assert.equal(new Set(entries.map(([, v]) => v.dark)).size, 6);
  const variants = new Set();
  for (const [name, color] of entries) {
    assert.ok(contrast(color.light, '#faf7f0') >= 4.5, `${name} light`);
    assert.ok(contrast(color.dark, '#172529') >= 4.5, `${name} dark`);
    assert.equal(relationshipColor(name), color.light);
    assert.equal(relationshipColor(name, true), color.dark);
    const dash = relationshipDash(name);
    assert.ok(typeof dash === 'boolean' || Array.isArray(dash));
    variants.add(JSON.stringify(dash));
  }
  assert.ok(variants.size >= 4, 'non-color line patterns vary');
});
test('homepage illustration resolves one pinned chapter printing without fabricating an event scene', () => {
  const c = read('src/components/HomepageArtwork.astro');
  for (const token of ['getEntry(\'chapters\', chapterId)', 'chapterCardUse(chapter, 0, printings)', 'canonical.scryfallId',
    'archiveCard(canonical, locale)', 'displayed.imageSrcset', 'artworkAttributes(displayed, significance, locale)',
    'editorialChapter.data.cards[0].significance', 'data-canonical-id', 'data-displayed-id']) assert.ok(c.includes(token), token);
  assert.match(c, /not independent historical proof/);
  assert.match(c, /loading=\{variant === 'hero'/);
});
test('EN and PT-BR homepages share the editorial layout and live collection totals', () => {
  for (const path of ['src/pages/index.astro', 'src/pages/pt-br/index.astro']) {
    const home = read(path);
    assert.match(home, /homepage-hero__grid/);
    assert.match(home, /homepage-numbers/);
    assert.match(home, /homepage-era-card/);
    assert.match(home, /<HomepageArtwork/);
    assert.match(home, /getCollection\('relationships'\)/);
    assert.match(home, /homepage-journey-grid/);
  }
  const pt = read('src/pages/pt-br/index.astro');
  assert.match(pt, /const locale = 'pt-BR' as const/);
  assert.match(pt, /<BaseLayout locale=\{locale\}/);
  assert.match(pt, /name: t\(era\.name\)/);
  assert.match(pt, /localPath\('characters\/', locale\)/);
  assert.doesNotMatch(pt, /adaptação condensada|não é uma tradução integral/i);
});
test('the graph uses theme-aware saturated strokes and distinct line patterns', () => {
  const graph = read('src/scripts/relationship-graph.ts');
  const styles = read('src/styles/_interactive-explorers.scss');
  for (const token of ['relationshipDash', 'opacity: 1', 'dashes: relationshipDash(edge.category)', 'width: 2.8'])
    assert.ok(graph.includes(token), token);
  for (const name of Object.keys(RELATIONSHIP_COLORS)) {
    assert.ok(styles.includes(`network-legend--${name}`));
    assert.ok(styles.includes(`network-edge[data-category="${name}"]`));
    assert.ok(styles.includes(RELATIONSHIP_COLORS[name].light));
    assert.ok(styles.includes(RELATIONSHIP_COLORS[name].dark));
  }
});
