import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { localizedArchiveCard } from '../src/utils/pt-printings.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const uuid = '014af391-3b4a-4aab-a3e9-f60e61016985';
const original = { scryfallId: uuid, name: "Chainer's Edict", artist: 'Ben Thompson', setCode: 'tor', collectorNumber: '57' };

test('character portraits preserve canonical printings and locale-specific fallback', () => {
  const en = localizedArchiveCard(original, { version: 1, cards: {} });
  assert.equal(en.printingId, uuid);
  assert.equal(en.translated, false);
  const pt = localizedArchiveCard(original, { cards: { [uuid]: {
    canonicalId: uuid, id: 'a1d99289-7a54-4a8a-aa4a-6c69c04ed783', lang: 'pt',
    setCode: 'tor', collectorNumber: '57', illustrationId: 'aa9a6965-65a9-4a6c-a76b-26ae53d5a8ca',
    printedName: 'Édito de Chainer', artist: 'Ben Thompson',
  } } });
  assert.equal(pt.canonicalId, en.canonicalId);
  assert.equal(pt.translated, true);
  assert.equal(pt.name, 'Édito de Chainer');
});

test('both character directories use the same safe full-card portrait renderer', () => {
  const component = read('src/components/CharacterPortrait.astro');
  const english = read('src/pages/characters/index.astro');
  const portuguese = read('src/pages/pt-br/characters/index.astro');
  for (const key of ["getEntry('cards'", 'archiveCard(canonical, locale)' , 'data-canonical-id', 'data-printing-id',
    'data-language', 'card.imageSrcset', 'card.artist', 'significance', 'labels.language',
    'labels.fallback']) assert.ok(component.includes(key), key);
  const shared = read('src/components/pages/CharacterDirectory.astro');
  for (const route of [english, portuguese]) {
    assert.match(route, /components\/pages\/CharacterDirectory\.astro/);
    assert.match(route, /<Page \/>/);
  }
  assert.match(shared, /<CharacterPortrait printingId=\{character\.featuredCardId\}/);
  assert.match(shared, /locale=\{pageLocale\}/);
  assert.match(shared, /localized\('characters', record, pageLocale\)/);
  assert.match(shared, /data-character-card/);
  assert.match(shared, /data-search=\{searchText\}/);
});

test('profile retains biography, exact canonical illustration, sources and record navigation', () => {
  const p = read('src/components/pages/CharacterProfilePage.astro');
  for (const key of ["getEntry('cards', profile.featuredCardId)",
    'HistoricalCard card={featuredCard}', 'CharacterRelationships id={profile.id}',
    'profile.biography.map', 'profile.source.url', 'relatedEvents.map',
    'character-profile__sections', 'id="character-biography"', 'id="character-reference"']) {
    assert.ok(p.includes(key), key);
  }
});

test('responsive character cards honor visual accessibility floor', () => {
  for (const path of ['src/components/CharacterPortrait.astro', 'src/styles/_characters.scss']) {
    const css = read(path);
    for (const match of css.matchAll(/font-size:\s*(0?\.\d+)rem/g))
      assert.ok(Number(match[1]) >= .75, `${path}: ${match[0]}`);
  }
  assert.match(read('src/styles/_characters.scss'), /UX E1: artwork-first character directory/);
});
