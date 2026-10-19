import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Wave 2A deepens existing curated entities without fabricating additional
// identities, printings or scene-level artwork provenance.
const pairs = {
  thran: ['thran-dyfed-portal', 'rebbec'],
  'brothers-war': ['fall-of-kroog', 'kayla'],
  'ice-age': ['world-spell', 'freyalise'],
  weatherlight: ['weatherlight-serras-realm', 'radiant'],
  otaria: ['otaria-kirtar-and-the-order', 'lieutenant-kirtar'],
  mending: ['karn-heals-tolaria', 'venser'],
  'many-worlds': ['ravnica-guildpact-collapse', 'agrus-kos'],
  'war-of-the-spark': ['spark-dovin-azorius-control', 'dovin-baan'],
  'march-of-the-machine': ['phyrexia-urabrask-dissent', 'urabrask'],
  omenpaths: ['omenpaths-ravnica-investigation', 'alquist-proft'],
};

const read = (kind, id) => JSON.parse(readFileSync(new URL(
  `../src/content/${kind}/${id}.json`, import.meta.url), 'utf8'));

test('all ten chapter pairs have deeper structured records and stable artwork identities', () => {
  assert.equal(Object.keys(pairs).length, 10);
  for (const [chapter, [eventId, characterId]] of Object.entries(pairs)) {
    const event = read('events', eventId);
    const character = read('characters', characterId);
    const cards = readFileSync(new URL(`../src/content/chapters/${chapter}.mdx`, import.meta.url), 'utf8');
    const cardIds = cards.match(/^cardIds:\s*\n((?:^  - [0-9a-f-]{36}\r?\n)+)/m)?.[1] ?? '';
    assert.equal(event.chapterId, chapter, `${eventId}: chapter identity drift`);
    assert.ok(cardIds.includes(event.cardId), `${eventId}: printing not curated in chapter`);
    assert.ok(Array.isArray(event.narrative) && event.narrative.length >= 5,
      `${eventId}: expected at least five narrative paragraphs`);
    assert.ok(event.narrative.slice(-3).every(p => p.split(/\s+/).length >= 30),
      `${eventId}: newly added narrative is too thin`);
    assert.ok(event.characterIds.includes(characterId) || eventId === 'karn-heals-tolaria' ||
      eventId === 'omenpaths-ravnica-investigation', `${eventId}: unexpected character identity`);
    assert.ok(Array.isArray(character.biography) && character.biography.length >= 6,
      `${characterId}: expected at least six biography paragraphs`);
    assert.ok(character.biography.slice(-3).every(p => p.split(/\s+/).length >= 30),
      `${characterId}: newly added biography is too thin`);
    assert.match(character.featuredCardId, /^[0-9a-f]{8}-[0-9a-f-]{27}$/);
    assert.ok(character.chapterIds.includes(chapter), `${characterId}: missing chapter reference`);
    assert.ok(character.source.url.startsWith('https://'), `${characterId}: missing source`);
  }
});
