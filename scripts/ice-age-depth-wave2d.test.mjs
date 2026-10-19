import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const chapter = read('src/content/chapters/ice-age.mdx');
const ids = {
  jodah: '1ee86efa-248e-4251-b734-f8ad3e8a0344',
  'lim-dul': 'b8a3cdfe-0289-474b-b9c4-07e8c6588ec5',
  'thelon-of-havenwood': '92b0be6d-9183-4938-b7a1-ae7f04ba78a0',
  'endrek-sahr': '48eac047-f888-49c7-aa7e-339f900f558f',
};

test('Ice Age Wave 2D supplies four distinct editorial contexts beside pre-existing events', () => {
  for (const heading of [
    'Five factions, and five different crises of authority',
    'Retrospective portraits are not contemporary Sarpadian records',
    'Jodah and Jaya: memory, initiative, and political consent',
    'One spell, different witnesses',
  ]) assert.ok(chapter.includes(`### ${heading}`), heading);
  for (const id of [
    'sarpadian-factions-fracture', 'sarpadia-endrek-breeding',
    'alliance-against-lim-dul', 'ice-age-shard-dissolves',
  ]) assert.ok(chapter.includes(`<HistoricalEventReference id="${id}" />`), id);
});

test('four existing characters are enriched without replacing their canonical printing identity', () => {
  for (const [id, printing] of Object.entries(ids)) {
    const person = JSON.parse(read(`src/content/characters/${id}.json`));
    assert.equal(person.featuredCardId, printing, id);
    assert.ok(person.biography.length >= 6, id);
    assert.ok(person.biography.every((paragraph) => paragraph.length > 35), id);
    assert.ok(person.chapterIds.includes('ice-age'), id);
  }
});

test('README reflects SCSS, current routes, and reproducible screenshot names', () => {
  const readme = read('README.md');
  const config = read('playwright.readme.config.mjs');
  const spec = read('tests/screenshots/readme.spec.mjs');
  const pkg = JSON.parse(read('package.json'));
  assert.ok(readme.includes('Dart Sass / Astro-scoped SCSS'));
  assert.ok(!readme.includes('Tailwind CSS'));
  assert.equal(pkg.scripts['screenshots:readme'], 'playwright test --config playwright.readme.config.mjs');
  for (const name of [
    'home-desktop.jpg', 'timeline-desktop.jpg', 'ice-age-desktop.jpg',
    'relationships-desktop.jpg', 'glossary-desktop.jpg', 'ice-age-mobile.jpg',
  ]) {
    assert.ok(readme.includes(`docs/screenshots/${name}`), name);
    assert.ok(spec.includes(name), name);
  }
  assert.ok(config.includes('4326'));
  assert.ok(spec.includes('main#main-content'));
});
