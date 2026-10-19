import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/utils/card-printings.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { chapterCardUse, normalizeCardId } =
  await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);

const ID = 'a736df42-18e9-4259-b0b8-54d21143e72e';
const ALT = '8690cbcc-f8fd-41f7-9e28-e61c12b04014';
const catalog = new Map([[ID, {
  name: 'Glacian, Powerstone Engineer', setCode: 'cmr',
  collectorNumber: '72', artist: 'Magali Villeneuve',
}]]);
const chapter = {
  id: 'thran',
  data: {
    cardIds: [{ collection: 'cards', id: ID }],
    cards: [{ significance: 'A Thran historical interpretation' }],
  },
};

test('chapter card rendering resolves Astro reference objects by UUID', () => {
  assert.equal(normalizeCardId(ID), ID);
  assert.deepEqual(chapterCardUse(chapter, 0, catalog), {
    ...catalog.get(ID), scryfallId: ID, significance: 'A Thran historical interpretation',
  });
});

test('chapter context cannot reintroduce conflicting printing fields', () => {
  const corrupted = structuredClone(chapter);
  corrupted.data.cards[0].scryfallId = ALT;
  assert.throws(() => chapterCardUse(corrupted, 0, catalog),
    /unexpected duplicated printing fields/);
});

test('chapter references reject a missing canonical printing', () => {
  const corrupted = structuredClone(chapter);
  corrupted.data.cardIds[0].id = ALT;
  assert.throws(() => chapterCardUse(corrupted, 0, catalog),
    /unknown canonical printing/);
});

test('event consumers compare Astro reference IDs rather than reference objects', () => {
  const paths = [
    '../src/pages/discover/index.astro',
    '../src/pages/events/index.astro',
    '../src/pages/events/[id].astro',
  ];
  for (const path of paths) {
    const file = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.match(file, /reference\.id === event\.cardId/);
    assert.doesNotMatch(file, /cardIds\.(?:includes|indexOf)\(event\.cardId\)/);
  }
});

test('archive derives its URL from the canonical printing, not its reference object', () => {
  const file = readFileSync(new URL('../src/pages/archive/index.astro', import.meta.url), 'utf8');
  assert.match(file, /cardImageUrl\(card\.scryfallId\)/);
  assert.doesNotMatch(file, /cardImageUrl\(id\)/);
});
