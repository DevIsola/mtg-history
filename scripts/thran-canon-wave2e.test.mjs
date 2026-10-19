import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const eventId = 'thran-glacian-stones-implanted';
const printingId = '02aea379-b444-46a3-82f4-3038f698d4f4';
const chapter = read('src/content/chapters/thran.mdx');

test('the Thran implant is distinct from invention, sealing and later rediscovery', () => {
  const event = json(`src/content/events/${eventId}.json`);
  assert.equal(event.chapterId, 'thran');
  assert.equal(event.cardId, printingId);
  assert.deepEqual(event.characterIds, ['yawgmoth', 'glacian', 'rebbec']);
  assert.equal(event.narrative.length, 4);
  assert.ok(event.narrative.every((paragraph) => paragraph.trim().split(/\s+/).length >= 25));
  assert.match(event.narrative.at(-1), /does not literally illustrate/);
  assert.match(chapter, new RegExp(`<HistoricalEventReference id="${eventId}" \/>`));
  assert.equal(chapter.split(`<HistoricalEventReference id="${eventId}" />`).length - 1, 1);
  const seal = chapter.indexOf('<HistoricalEventReference id="rebbec-seals-phyrexia" />');
  const implantation = chapter.indexOf(`<HistoricalEventReference id="${eventId}" />`);
  const rediscovery = chapter.indexOf('<HistoricalEventReference id="thran-stones-rediscovered" />');
  assert.ok(implantation >= 0 && implantation < seal && seal < rediscovery);
});

test('artwork stays the exact previously curated 2022 printing, not a claimed scene', () => {
  const card = json(`src/content/cards/${printingId}.json`);
  assert.equal(card.name, 'The Mightstone and Weakstone');
  assert.equal(card.setCode, 'bro');
  assert.equal(card.collectorNumber, '238');
  assert.match(chapter, new RegExp(`^  - ${printingId}$`, 'm'));
  assert.match(chapter, /not the medical scene/);
});

test('existing character identities and the generated adapter remain stable', () => {
  const printings = {
    glacian: 'a736df42-18e9-4259-b0b8-54d21143e72e',
    yawgmoth: '8690cbcc-f8fd-41f7-9e28-e61c12b04014',
    rebbec: '46975250-950f-4f5d-a7c5-f61aec8e40ad',
  };
  for (const [id, expectedCard] of Object.entries(printings)) {
    const person = json(`src/content/characters/${id}.json`);
    assert.equal(person.featuredCardId, expectedCard);
    assert.ok(person.chapterIds.includes('thran'));
    assert.ok(person.biography.length >= 6);
    assert.match(person.source.url, /^https:\/\/magic\.wizards\.com\//);
  }
  const adapter = read('src/data/events.ts');
  assert.match(adapter, /import entry129 from '\.\.\/content\/events\/thran-glacian-stones-implanted\.json'/);
  assert.match(adapter, /id: "thran-glacian-stones-implanted", \.\.\.entry129/);
  assert.match(read('scripts/check-entity-collections.mjs'), /characters: 88, events: 133, relationships: 118/);
  assert.match(read('scripts/check-card-collections.mjs'), /133\/133 event references/);
});
