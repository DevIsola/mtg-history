import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { migrateChapterCardSource, replaceOnce } from './chapter-card-migration-tools.mjs';
const ID = 'a736df42-18e9-4259-b0b8-54d21143e72e';
const PRINTING = { name: 'Glacian, Powerstone Engineer', setCode: 'cmr', collectorNumber: '72', artist: 'Magali Villeneuve' };
const SOURCE = `---
order: 1
cardIds:
  - ${ID}
cards:
  - name: "Glacian, Powerstone Engineer"
    setCode: "cmr"
    collectorNumber: "72"
    scryfallId: "${ID}"
    artist: "Magali Villeneuve"
    significance: >-
      Historically important powerstones.
sources:
  - title: Official
---
<HistoricalMoment card={frontmatter.cards[0]}>
Ancient technology.
</HistoricalMoment>
`;
const use = { ...PRINTING, scryfallId: ID, significance: '>-' };
function convert(source = SOURCE, cards = [use], ids = [ID], printings = new Map([[ID, PRINTING]])) {
  return migrateChapterCardSource(source, 'thran', cards, ids, printings);
}
test('only retains authored significance; card identity is canonical', () => {
  const {source, cards, moments} = convert();
  assert.equal(cards, 1); assert.equal(moments, 1);
  assert.match(source, /cards:\n  - significance: >-\n      Historically important powerstones\./);
  assert.match(source, /cardId=\{frontmatter\.cardIds\[0\]\}/);
  assert.match(source, /significance=\{frontmatter\.cards\[0\]\.significance\}/);
  assert.doesNotMatch(source, /^    (?:name|artist|setCode|collectorNumber|scryfallId):/m);
  assert.match(source, /Ancient technology\./);
});
test('rejects altered printing attribution and unknown canonical printing', () => {
  assert.throws(() => convert(SOURCE, [{...use, artist:'Other Artist'}]), /printing mismatch/);
  assert.throws(() => convert(SOURCE, [use], [ID], new Map()), /printing mismatch/);
});
test('rejects mismatched reference counts or repeated printing IDs', () => {
  assert.throws(() => convert(SOURCE, [use], []), /count does not match/);
  assert.throws(() => convert(SOURCE, [use,use], [ID,ID]), /unexpected card field order/);
});
test('rejects a second migration rather than rewriting significance', () => {
  assert.throws(() => convert(convert().source), /already migrated/);
});
test('does not accept unsupported or out-of-range historical illustration calls', () => {
  assert.throws(() => convert(SOURCE.replace('[0]}', '[8]}')), /out-of-range/);
  assert.throws(() => convert(SOURCE.replace('card={frontmatter.cards[0]}', 'card={otherCard}')), /unsupported HistoricalMoment/);
});
test('source transformations never silently skip or repeat an anchor', () => {
  assert.equal(replaceOnce('a b c','b','X','test'), 'a X c');
  assert.throws(() => replaceOnce('a b c','not here','X','test'), /missing or repeated/);
  assert.throws(() => replaceOnce('a b b','b','X','test'), /missing or repeated/);
});

// Regression: the event page was already migrated in Phase 2. Never require
// the earlier legacy type anchor as a Phase 3B preflight condition.
test('event detail page already uses the canonical chapter-card return type', () => {
  const source = readFileSync(new URL('../src/pages/events/[id].astro', import.meta.url), 'utf8');
  assert.match(source, /type Card = ReturnType<typeof chapterCardUse>;/);
  assert.doesNotMatch(source, /type Card = Chapter\['data'\]\['cards'\]\[number\];/);
});
