import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { isPaletteShortcut, paletteResultUrl, validPaletteQuery, PALETTE_RESULT_LIMIT } from '../src/utils/search-palette.mjs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const base = '/mtg-history/';
const origin = 'https://devisola.github.io';

test('Cmd/Ctrl+K is deliberate and ignores extra modifiers', () => {
  assert.equal(isPaletteShortcut({key:'k',metaKey:true}), true);
  assert.equal(isPaletteShortcut({key:'K',ctrlKey:true}), true);
  for (const event of [{key:'k'}, {key:'x',metaKey:true}, {key:'k',altKey:true,metaKey:true}, {key:'k',shiftKey:true,ctrlKey:true}])
    assert.equal(isPaletteShortcut(event), false);
});
test('palette URL safety retains locale and GitHub Pages base isolation', () => {
  assert.equal(paletteResultUrl('/mtg-history/chapters/thran/', base, origin, 'en'), '/mtg-history/chapters/thran/');
  assert.equal(paletteResultUrl('/mtg-history/pt-br/chapters/thran/', base, origin, 'pt-BR'), '/mtg-history/pt-br/chapters/thran/');
  assert.equal(paletteResultUrl('/mtg-history/pt-br/events/', base, origin, 'en'), null);
  assert.equal(paletteResultUrl('/mtg-history/events/', base, origin, 'pt-BR'), null);
  for (const uri of ['//evil.example/mtg-history/', '/different/', 'https://evil.example/', '/mtg-history/%2fetc/'])
    assert.equal(paletteResultUrl(uri, base, origin, 'en'), null, uri);
});
test('query and quick result size use the existing Pagefind policy', () => {
  assert.equal(validPaletteQuery('    A   '), '');
  assert.equal(validPaletteQuery('  Urza   Mishra '), 'Urza Mishra');
  assert.equal(validPaletteQuery('x'.repeat(200)).length, 160);
  assert.equal(PALETTE_RESULT_LIMIT, 8);
});
test('global header provides full-search fallback and a single shared palette', () => {
  const header = read('src/components/SiteHeader.astro');
  const palette = read('src/components/SearchPalette.astro');
  const english = read('src/pages/search/index.astro');
  const portuguese = read('src/pages/pt-br/search/index.astro');
  assert.match(header, /data-search-palette-trigger/);
  assert.match(header, /<SearchPalette locale=\{locale\} \/>/);
  assert.match(palette, /<dialog[\s\S]*data-search-palette/);
  assert.match(palette, /data-pagefind-bundle=\{withBase\('pagefind\/pagefind\.js'\)\}/);
  assert.match(palette, /isPaletteShortcut/);
  assert.match(palette, /plainExcerpt/);
  assert.match(palette, /\.textContent =/);
  assert.doesNotMatch(palette, /\.innerHTML\s*=/);
  for (const page of [english, portuguese]) assert.match(page, /data-fulltext-search/);
  assert.match(read('scripts/pre-phase13-foundation.test.mjs'), /no component or SCSS microtype below/);
  assert.doesNotMatch(read('scripts/pre-phase13-foundation.test.mjs'), /import \{ join \} from 'node:path'/);
});
