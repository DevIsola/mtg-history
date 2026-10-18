import assert from 'node:assert/strict';
import test from 'node:test';
import {
  planCards, addChapterCardIds, readChapterCardIds, compareCards,
} from './card-collection-tools.mjs';

const ID = 'a736df42-18e9-4259-b0b8-54d21143e72e';
const OTHER = '8690cbcc-f8fd-41f7-9e28-e61c12b04014';
const card = {
  name: 'Glacian, Powerstone Engineer', setCode: 'cmr', collectorNumber: '72',
  scryfallId: ID, artist: 'Magali Villeneuve', significance: 'A Thran engineer',
};
const second = { ...card, scryfallId: OTHER, name: 'Yawgmoth, Thran Physician' };
function source() {
  return {
    chapters: [{ id: 'thran', cards: [card, second] }],
    characters: [{ id: 'glacian', featuredCard: { ...card, significance: 'His portrait' } }],
    events: [{ id: 'thran-powerstone', chapterId: 'thran', cardName: second.name }],
  };
}

test('deduplicates the same exact printing while retaining distinct contextual significance', () => {
  const model = source();
  const plan = planCards(model.chapters, model.characters, model.events);
  assert.equal(plan.cards.length, 2);
  assert.deepEqual(plan.chapterIds.get('thran'), [ID, OTHER]);
  assert.equal(plan.featuredIds.get('glacian'), ID);
  assert.equal(plan.eventIds.get('thran-powerstone'), OTHER);
  assert.equal(plan.cards[0].data.significance, undefined);
});

test('rejects disagreement in artist, set, collector number, or title for an identical UUID', () => {
  for (const field of ['artist', 'setCode', 'collectorNumber', 'name']) {
    const model = source();
    model.characters[0].featuredCard[field] += ' altered';
    assert.throws(() => planCards(model.chapters, model.characters, model.events), /differs from/);
  }
});

test('rejects unknown events, duplicate card names, and invalid Scryfall IDs', () => {
  const a = source(); a.events[0].cardName = 'Uncurated Card';
  assert.throws(() => planCards(a.chapters, a.characters, a.events), /not curated/);
  const b = source(); b.chapters[0].cards.push({ ...card, scryfallId: OTHER });
  assert.throws(() => planCards(b.chapters, b.characters, b.events), /duplicate card name/);
  const c = source(); c.characters[0].featuredCard.scryfallId = 'not-a-uuid';
  assert.throws(() => planCards(c.chapters, c.characters, c.events), /invalid Scryfall/);
});

test('inserts stable chapter references without modifying historical body text', () => {
  const chapter = `---\ntitle: Test\ncards:\n  - name: "Glacian"\n---\n\nKeep body and <HistoricalMoment /> unchanged.\n`;
  const result = addChapterCardIds(chapter, [ID, OTHER], 'thran');
  assert.deepEqual(readChapterCardIds(result, 'thran'), [ID, OTHER]);
  assert.ok(result.includes('Keep body and <HistoricalMoment /> unchanged.'));
  assert.throws(() => addChapterCardIds(result, [ID], 'thran'), /already exist/);
});

test('detects mismatched chapter, character, event, orphan, and missing card records', () => {
  const model = source();
  const plan = planCards(model.chapters, model.characters, model.events);
  const chapter = new Map([['thran', addChapterCardIds('---\ncards:\n  - name: Card\n---\n', [ID, OTHER], 'thran')]]);
  const validChars = [{ ...model.characters[0], featuredCardId: ID }];
  const validEvents = [{ ...model.events[0], cardId: OTHER }];
  assert.deepEqual(compareCards(plan, plan.cards, chapter, validChars, validEvents), []);
  const badChapter = new Map([['thran', addChapterCardIds('---\ncards:\n  - name: Card\n---\n', [ID], 'thran')]]);
  const extra = [{ id: '00000000-0000-4000-8000-000000000001', data: { ...plan.cards[0].data } }, ...plan.cards.slice(1)];
  const errors = compareCards(plan, extra, badChapter,
    [{ ...validChars[0], featuredCardId: OTHER }],
    [{ ...validEvents[0], cardId: ID }]);
  assert.ok(errors.some((item) => item.includes('missing canonical printing')));
  assert.ok(errors.some((item) => item.includes('orphan canonical printing')));
  assert.ok(errors.some((item) => item.includes('cardIds disagree')));
  assert.ok(errors.some((item) => item.includes('featuredCardId')));
  assert.ok(errors.some((item) => item.includes('cardId does not match')));
});
