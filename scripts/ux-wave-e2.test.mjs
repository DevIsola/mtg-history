import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { RELATIONSHIP_COLORS, relationshipColor, relationshipLabel } from '../src/utils/relationship-colors.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const luminance = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
  .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((a, b) => b - a); return (x + .05) / (y + .05); };

test('all six documented relationship kinds have clear, contrasting light/dark colors', () => {
  assert.deepEqual(Object.keys(RELATIONSHIP_COLORS), ['family', 'friendship', 'alliance', 'rivalry', 'mentorship', 'creation']);
  for (const [key, item] of Object.entries(RELATIONSHIP_COLORS)) {
    assert.ok(item.label.length > 3 && item.description.length > 3, key);
    assert.equal(relationshipLabel(key), item.label);
    assert.equal(relationshipColor(key, false), item.light);
    assert.equal(relationshipColor(key, true), item.dark);
    for (const background of ['#faf7f0', '#f4efe5']) assert.ok(contrast(item.light, background) >= 4.5, `${key} on ${background}`);
    for (const background of ['#203137', '#172529']) assert.ok(contrast(item.dark, background) >= 4.5, `${key} on ${background}`);
  }
  assert.equal(relationshipLabel('unknown'), 'Documented connection');
});

test('graph labels and colors respond to real focus, URL state and theme', () => {
  const graph = read('src/scripts/relationship-graph.ts');
  for (const fragment of ["#network-label-density", "params.get('labels')", "searchParams.set('labels'", 'nodeNames.get(node.id)',
    "relationshipColor(edge.category, document.documentElement.dataset.theme === 'dark')", "root.dataset.graphLabels", "labelDensity.addEventListener('change'"])
    assert.ok(graph.includes(fragment), fragment);
  assert.match(graph, /const adjacentToFocus = new Set/);
  assert.match(graph, /strokeColor: theme.background/);
});

test('network layout explains categories and separates graph from source-backed cards', () => {
  const page = read('src/components/pages/RelationshipAtlas.astro');
  const styles = read('src/styles/_interactive-explorers.scss');
  for (const token of ['network-steps', 'network-label-density', 'network-legend-heading', 'network-edge__perspective',
    'RELATIONSHIP_COLORS'])
    assert.ok(page.includes(token), token);
  assert.match(page, /role="group" aria-label=\{phrase\(pageLocale, "Relationship display mode"\)\}/);
  assert.match(page, /Relationship perspective/);
  assert.match(styles, /UX E2/);
  assert.match(styles, /max-width: 480px/);
  assert.match(styles, /network-section \[hidden\]/);
  for (const [kind, value] of Object.entries(RELATIONSHIP_COLORS)) {
    assert.ok(styles.includes(`.network-legend--${kind} { --legend-color: ${value.light}; }`), kind);
    assert.ok(styles.includes(`.network-legend--${kind} { --legend-color: ${value.dark}; }`), kind);
  }
  for (const [, size] of styles.matchAll(/font-size:\s*(0?\.\d+)rem/g)) assert.ok(Number(size) >= .75);
});
