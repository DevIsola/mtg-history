import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const chapter = read('src/content/chapters/otaria.mdx');
const people = ['kamahl', 'chainer', 'ixidor', 'jeska'];

const headings = [
  'The struggle for custody was not a single transfer',
  'What dementia magic meant in story and on cards',
  "Krosa's memory of Kamahl outlived the Mirari",
  'The original Akroma and her later alternatives',
  'One person, three names, and the danger of a compressed timeline',
  'From a device of observation to another future threat',
];

test('Wave 2C adds six narrative lenses without duplicating any heading', () => {
  for (const heading of headings) {
    assert.equal(chapter.split(`### ${heading}`).length - 1, 1, `${heading}: expected once`);
  }
  assert.match(chapter, /Kamahlite order/);
  assert.match(chapter, /_Akroma, Angel of Fury_/);
  assert.match(chapter, /_Jeska, Thrice Reborn_/);
});

test('Wave 2C biographies retain original identity, attribution and existing artwork', () => {
  const expected = {
    kamahl: '97ab4974-d0a4-4033-b150-8928b46dc626',
    chainer: '40342b11-1005-4ccc-bef4-9ea4c640b048',
    ixidor: '314d5e89-55f7-42b4-af19-d4d0f499a265',
    jeska: '1cf96a59-8b7d-4a5b-adfd-17eeedd95db5',
  };
  for (const id of people) {
    const entity = JSON.parse(read(`src/content/characters/${id}.json`));
    assert.equal(entity.featuredCardId, expected[id]);
    assert.ok(entity.biography.length >= 6, `${id}: at least six paragraphs`);
    assert.ok(entity.biography.every((paragraph) => paragraph.length >= 70), `${id}: avoid filler`);
    assert.match(entity.source.url, /^https:\/\/magic\.wizards\.com\//);
  }
  assert.deepEqual(JSON.parse(read('src/content/characters/jeska.json')).chapterIds, ['otaria', 'mending']);
});
