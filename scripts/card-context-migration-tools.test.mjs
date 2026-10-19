import assert from 'node:assert/strict';
import { test } from 'node:test';
import { migrateFeaturedCard, migrateEventCard } from './card-context-migration-tools.mjs';

const id = 'a736df42-18e9-4259-b0b8-54d21143e72e';
const printing = { name: 'Glacian, Powerstone Engineer', setCode: 'cmr', collectorNumber: '72', artist: 'Magali Villeneuve' };
const catalog = new Map([[id, printing]]);
const chapter = new Map([['thran', [{ ...printing, scryfallId: id }]]]);
const character = { id: 'glacian', name: 'Glacian', featuredCardId: id,
  featuredCard: { ...printing, scryfallId: id, significance: 'A Thran engineer.' } };
const event = { id: 'powerstone-revolution', chapterId: 'thran', cardId: id, cardName: printing.name, summary: 'Revolution' };

test('removes duplicate portrait printing fields without touching significance', () => {
  const result = migrateFeaturedCard(character, catalog);
  assert.deepEqual(result.featuredCard, { significance: 'A Thran engineer.' });
  assert.equal(result.featuredCardId, id);
  assert.equal(character.featuredCard.name, printing.name);
});
test('rejects incorrect artist or mismatched Scryfall UUID', () => {
  assert.throws(() => migrateFeaturedCard({ ...character, featuredCard: { ...character.featuredCard, artist: 'Someone else' } }, catalog), /does not match/);
  assert.throws(() => migrateFeaturedCard({ ...character, featuredCard: { ...character.featuredCard, scryfallId: '00000000-0000-0000-0000-000000000000' } }, catalog), /does not match/);
});
test('rejects portraits already migrated or with fields that would be lost', () => {
  assert.throws(() => migrateFeaturedCard({ ...character, featuredCard: { significance: 'Kept' } }, catalog), /already migrated/);
  assert.throws(() => migrateFeaturedCard({ ...character, featuredCard: { ...character.featuredCard, unreviewed: 'x' } }, catalog), /would be lost/);
});
test('removes event title only after verifying its exact chapter printing', () => {
  const result = migrateEventCard(event, chapter, catalog);
  assert.deepEqual(result, { id: event.id, chapterId: 'thran', cardId: id, summary: 'Revolution' });
  assert.equal(event.cardName, printing.name);
});
test('rejects missing, misplaced, or mismatched event printings', () => {
  assert.throws(() => migrateEventCard({ ...event, cardName: 'Wrong' }, chapter, catalog), /same curated/);
  assert.throws(() => migrateEventCard({ ...event, chapterId: 'future' }, chapter, catalog), /unknown chapter/);
  assert.throws(() => migrateEventCard({ ...event, cardId: '00000000-0000-0000-0000-000000000000' }, chapter, catalog), /unknown canonical/);
});
test('rejects rerunning the event migration', () => {
  const once = migrateEventCard(event, chapter, catalog);
  assert.throws(() => migrateEventCard(once, chapter, catalog), /already migrated/);
});

import { migrateSourceFile, sourceFilesToMigrate } from './card-context-migration-tools.mjs';

test('source transformer fails closed when any required anchor differs', () => {
  for (const file of sourceFilesToMigrate) {
    assert.throws(() => migrateSourceFile(file, 'different repository version'), /required unique source anchor/);
  }
});

test('event adapter removes the now-redundant name declaration', () => {
  const result = migrateSourceFile('src/data/events.ts', 'export interface HistoricalEvent {\n  cardName: string;\n  cardId: string;\n}\n');
  assert.match(result, /cardId: string;/);
  assert.doesNotMatch(result, /cardName/);
});

test('character adapter retains contextual significance only', () => {
  const input = 'import type { CollectionEntry } from "astro:content";\n\ntype HistoricalCard = CollectionEntry<"chapters">["data"]["cards"][number];';
  assert.equal(migrateSourceFile('src/data/characters.ts', input), 'type HistoricalCard = { significance: string };');
});
