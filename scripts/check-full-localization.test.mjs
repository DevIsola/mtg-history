import test from 'node:test';
import assert from 'node:assert/strict';
import { chapterStructure, compareChapter, loadLocalization, validateLocalization } from './check-full-localization.mjs';

const dataset = await loadLocalization();
const validateMutation = mutate => {
  const changed = structuredClone(dataset);
  mutate(changed);
  return validateLocalization(changed).errors;
};

const english = `---
title: "The Empire"
subtitle: "The lost city"
eraId: "thran"
order: 1
plane: "Dominaria"
chronology:
  storyPeriod: "c. −5000 AR"
  storyDetail: "The city falls."
  publicationHistory: "The Thran novel (1999)"
relatedSets:
  - name: "The Brothers' War"
    year: 2022
cardIds:
  - a736df42-18e9-4259-b0b8-54d21143e72e
cards:
  - significance: "The inventor is shown."
sources:
  - title: "The Thran"
    kind: book
    author: "J. Robert King"
    year: 1999
  - title: "The Known Multiverse"
    kind: official
    url: "https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19"
---

import CharacterLink from "../../components/CharacterLink.astro";

## The fall

The empire fell.

<CharacterLink id="glacian">Glacian</CharacterLink> remained.

- The first warning
- The second warning

| The city | The fate |
| --- | --- |
| Halcyon | Ruin |
`;
const portuguese = english
  .replace('title: "The Empire"', 'title: "O império"')
  .replace('subtitle: "The lost city"', 'subtitle: "A cidade perdida"')
  .replace('plane: "Dominaria"', 'plane: "Dominária"')
  .replace('The city falls.', 'A cidade cai.')
  .replace('The Thran novel (1999)', 'Romance The Thran (1999)')
  .replace('The inventor is shown.', 'O inventor é retratado.')
  .replace('## The fall', '## A queda')
  .replace('The empire fell.', 'O império caiu.')
  .replace('</CharacterLink> remained.', '</CharacterLink> permaneceu.')
  .replace('The first warning', 'O primeiro aviso').replace('The second warning', 'O segundo aviso')
  .replace('The city | The fate', 'A cidade | O destino').replace('Halcyon | Ruin', 'Halcyon | Ruína');

test('complete fixture retains citation titles and canonical identities without requiring word ratios', () => {
  assert.deepEqual(compareChapter('fixture', english, portuguese), []);
  const shape = chapterStructure(portuguese);
  assert.equal(shape.prose.length, 2);
  assert.equal(shape.listBlocks, 1);
  assert.equal(shape.listItems, 2);
  assert.equal(shape.tableBlocks, 1);
  assert.equal(shape.tableRows, 3);
});

test('missing prose paragraph or section is rejected', () => {
  assert.ok(compareChapter('fixture', english, portuguese.replace('O império caiu.\n\n', '')).some(error => error.includes('prose block count')));
  assert.ok(compareChapter('fixture', english, portuguese.replace('## A queda\n\n', '')).some(error => error.includes('headingLevels')));
});

test('changed UUID, component identity, import and citation URL are rejected', () => {
  for (const [from, to, diagnostic] of [
    ['a736df42-18e9-4259-b0b8-54d21143e72e', 'b736df42-18e9-4259-b0b8-54d21143e72e', 'uuids'],
    ['id="glacian"', 'id="rebbec"', 'components'],
    ['../../components/CharacterLink.astro', '../../components/Other.astro', 'imports'],
    ['https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19', 'https://example.com/different-source', 'urls'],
  ]) assert.ok(compareChapter('fixture', english, portuguese.replace(from, to)).some(error => error.includes(diagnostic)), diagnostic);
});

test('omitted list item/table row and merged separate list blocks are rejected', () => {
  assert.ok(compareChapter('fixture', english, portuguese.replace('- O segundo aviso\n', '')).some(error => error.includes('listItems')));
  assert.ok(compareChapter('fixture', english, portuguese.replace('| Halcyon | Ruína |\n', '')).some(error => error.includes('tableRows')));
  const a = english + '\n- The third warning\n';
  const b = portuguese.replace('- O segundo aviso', '- O segundo aviso\n- O terceiro aviso');
  assert.ok(compareChapter('fixture', a, b).some(error => error.includes('listBlocks')));
});

test('unchanged English prose and significance fail even when structural counts match', () => {
  assert.ok(compareChapter('fixture', english, portuguese.replace('O império caiu.', 'The empire fell.')).some(error => error.includes('unchanged English prose')));
  assert.ok(compareChapter('fixture', english, portuguese.replace('O inventor é retratado.', 'The inventor is shown.')).some(error => error.includes('unchanged English card significance')));
});

test('actual files cover all full chapter/record arrays,244 routes and120 verified printings', () => {
  const result = validateLocalization(dataset);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.counts, {
    chapters: 11, characters: 88, biographyParagraphs: 358, events: 133, narrativeParagraphs: 385,
    relationships: 118, glossary: 10, provenance: 53, paths: 4, routes: 244, portuguesePrintings: 120, englishFallbacks: 13,
  });
});

for (const kind of ['chapters', 'characters', 'events', 'relationships', 'glossary', 'provenance', 'paths']) {
  test(`missing ${kind} record is rejected`, () => {
    const errors = validateMutation(data => { delete data.overlays[kind][Object.keys(data.overlays[kind])[0]]; });
    assert.ok(errors.some(error => error.startsWith(`${kind}: localized IDs differ`)));
  });
}

test('biography and event narrative paragraph removal is rejected', () => {
  const errors = validateMutation(data => {
    data.overlays.characters.urza.biography.pop();
    data.overlays.events['tocasias-death'].narrative.pop();
  });
  assert.ok(errors.some(error => error.includes('urza.biography: paragraph count differs')));
  assert.ok(errors.some(error => error.includes('tocasias-death.narrative: paragraph count differs')));
});

test('untranslated character/event paragraphs and absent visible fields are rejected', () => {
  const errors = validateMutation(data => {
    data.overlays.characters.urza.biography[0] = data.characters.urza.biography[0];
    data.overlays.events['tocasias-death'].narrative[0] = data.events['tocasias-death'].narrative[0];
    delete data.overlays.characters.urza.featuredCard.significance;
    delete data.overlays.relationships['jeska--karn--mentorship--otaria'].context;
    delete data.overlays.glossary.planeswalker.details;
  });
  for (const field of ['urza.biography[0]: unchanged', 'tocasias-death.narrative[0]: unchanged', 'urza.featuredCard.significance: missing', 'jeska--karn--mentorship--otaria.context: missing', 'planeswalker.details: missing']) {
    assert.ok(errors.some(error => error.includes(field)), field);
  }
});

test('provenance source identities and chronology uncertainty cannot change', () => {
  const errors = validateMutation(data => {
    data.overlays.provenance['thran-dyfed-portal'].chronology.precision = 'exact';
    data.overlays.provenance['thran-dyfed-portal'].sources[0].url = 'https://example.com/replacement';
    data.overlays.provenance['thran-dyfed-portal'].sources[0].supports = '';
  });
  for (const text of ['canonical chronology precision changed', 'canonical url changed', '.supports: missing']) assert.ok(errors.some(error => error.includes(text)), text);
});

test('path steps require full context and preserve event/chapter references', () => {
  const errors = validateMutation(data => {
    data.overlays.paths['phyrexian-legacy'].steps[0].eventId = 'different-event';
    data.overlays.paths['phyrexian-legacy'].steps[0].context = '';
  });
  assert.ok(errors.some(error => error.includes('canonical eventId changed')));
  assert.ok(errors.some(error => error.includes('.context: missing')));
});

test('route omission or duplicate cannot be hidden by maintaining the total', () => {
  const errors = validateMutation(data => { data.routes[1] = data.routes[0]; });
  assert.ok(errors.some(error => error.startsWith('routes:')));
});

test('PT printing must refer to supported same-edition canonical metadata', () => {
  const errors = validateMutation(data => {
    const id = Object.keys(data.printings.cards)[0];
    data.printings.cards[id].setCode = 'different';
    data.printings.cards['11111111-1111-4111-8111-111111111111'] = { ...data.printings.cards[id] };
  });
  assert.ok(errors.some(error => error.includes('Invalid PT printing metadata')));
  assert.ok(errors.some(error => error.includes('unsupported canonical printing')));
});

test('an English or duplicate UUID cannot masquerade as an official PT printing', () => {
  const errors = validateMutation(data => {
    const [a, b] = Object.keys(data.printings.cards);
    data.printings.cards[a].id = a;
    data.printings.cards[b].lang = 'en';
  });
  assert.ok(errors.some(error => error.includes('PT display ID must be distinct')));
  assert.ok(errors.some(error => error.includes('Invalid PT printing metadata')));
});
