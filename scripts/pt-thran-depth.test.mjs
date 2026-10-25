import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const english = read('src/content/chapters/thran.mdx');
const portuguese = read('src/content/chapters-pt/thran.mdx');
const outline = source => [...source.matchAll(/^(#{2,3}) (.+)$/gm)].map(([,level,text]) => ({level:level.length,text}));
const expectedEnglishHeadings = [
  'I. Before the Brothers',
  'II. The Civilization of Powerstones',
  'Architecture of Ascension: power made visible',
  'III. The Arrival of Yawgmoth',
  'How a physician became a political authority',
  'An inventor was not exempt from the danger he helped create',
  'IV. The Discovery of Phyrexia',
  'V. The Fall of the Thran Empire',
  'A civil war with more than two sides',
  "VI. Rebbec's Final Decision",
  'Sealing the gate was containment, not restoration',
  'VII. The Legacy of Glacian',
  'The implantation was a separate Thran event',
  'Why the two powerstone halves mattered later',
  'VIII. How Magic Told This Story',
  'IX. Beneath Halcyon: The People the Empire Abandoned',
  'X. Medicine, Public Safety, and the Capture of the State',
  'XI. Dyfed and the Gate Beyond Dominaria',
  'Pyrulea: an earlier glimpse of planeswalking',
  'Pyrulea on a card is a different historical moment',
  'XII. The War for Halcyon',
  'Reading Thran history backward without distorting it',
  'XIII. The Two Stones That Outlived an Empire',
  'One inventor, two traditions of artifice',
];
test('Thran keeps the pinned thirteen major and eleven editorial headings in original order', () => {
  assert.deepEqual(outline(english).map(heading => heading.text),expectedEnglishHeadings);
  assert.deepEqual(outline(portuguese).map(heading => heading.level),outline(english).map(heading => heading.level));
  assert.equal(new Set(outline(portuguese).map(heading => heading.text)).size,24);
});
test('Thran preserves the named historical actors and distinguishes containment, creation and rediscovery', () => {
  for (const term of ['Pyrulea','Phyrexia','Intocáveis','Glacian','Yawgmoth','Rebbec','Koilos','Urza','Mishra','pedras de poder','Invasion of Pyrulea']) assert.ok(portuguese.includes(term),term);
  assert.match(portuguese,/contenção|conter/);
  assert.match(portuguese,/não criou o plano original de Phyrexia/);
  assert.match(portuguese,/Urza[\s\S]*Mishra[\s\S]*(?:encontraram|descobriram)/);
});
