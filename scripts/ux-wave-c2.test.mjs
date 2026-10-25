import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { routeAlternates, isTranslatedRoute } from '../src/utils/i18n.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('Explore exists in two genuine localized routes with reciprocal alternates', () => {
  const english = read('src/pages/explore/index.astro');
  const portuguese = read('src/pages/pt-br/explore/index.astro');
  assert.match(english, /<ExploreLanding \/>/);
  assert.match(portuguese, /<ExploreLanding locale="pt-BR" \/>/);
  assert.match(portuguese, /locale="pt-BR"/);
  assert.equal(isTranslatedRoute('/mtg-history/explore/'), true);
  assert.equal(isTranslatedRoute('/mtg-history/pt-br/explore/'), true);
  assert.deepEqual(routeAlternates('/mtg-history/explore/', 'https://devisola.github.io'), [
    { lang: 'en', href: 'https://devisola.github.io/mtg-history/explore/' },
    { lang: 'pt-BR', href: 'https://devisola.github.io/mtg-history/pt-br/explore/' },
  ]);
});

test('shared navigation promotes Explore but keeps the existing indexed directory', () => {
  const header = read('src/components/SiteHeader.astro');
  assert.match(header, /Explore home/);
  assert.match(header, /localPath\('explore\/', locale\)/);
  assert.match(header, /Encyclopedia directory/);
  assert.match(header, /discover\//);
  for (const path of ['timeline/', 'characters/', 'events/', 'relationships/', 'archive/', 'glossary/', 'paths/']) {
    assert.ok(header.includes(path), path);
  }
});

test('Explore metrics and illustrated interpretation derive from published records', () => {
  const source = read('src/components/ExploreLanding.astro');
  for (const marker of [
    "getCollection('chapters')", "getCollection('cards')", 'characters.length', 'historicalEvents.length',
    'characterRelationships.length', 'chapter.data.cardIds.length', 'chapterCardUse(', 'archiveCard(',
    'illustration.significance', 'displayed.artist', 'illustration.collectorNumber',
    'local(\'discover/\')', 'local(\'search/\')',
  ]) assert.ok(source.includes(marker), marker);
  assert.doesNotMatch(source, /fetch\(|new SearchIndex|new Worker/);
  assert.doesNotMatch(source, /englishOnly: pt/);
  assert.match(source, /local\('characters\/'/);
});
