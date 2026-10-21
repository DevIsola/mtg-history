import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { routeAlternates, translatedSuffix, isTranslatedRoute, uiFor } from '../src/utils/i18n.mjs';
const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const base = '/mtg-history/';

test('only published locale-paired directories provide reciprocal alternatives', () => {
  for (const path of ['', 'timeline/', 'characters/', 'events/', 'archive/']) {
    assert.equal(translatedSuffix(base + path), path);
    assert.equal(translatedSuffix(base + 'pt-br/' + path), path);
    assert.deepEqual(routeAlternates(base + path, 'https://devisola.github.io'), [
      { lang: 'en', href: 'https://devisola.github.io' + base + path },
      { lang: 'pt-BR', href: 'https://devisola.github.io' + base + 'pt-br/' + path },
    ]);
  }
});

test('untranslated profiles, chapters and search cannot claim Portuguese equivalents', () => {
  for (const path of ['chapters/thran/', 'characters/urza/', 'events/brothers-war/', 'search/', 'discover/','about/', 'pt-br/chapters/thran/']) {
    assert.equal(isTranslatedRoute(base + path), false, path);
    assert.deepEqual(routeAlternates(base + path, 'https://devisola.github.io'), []);
  }
});

test('Portuguese navigation labels actual translated directories accurately', () => {
  const pt = uiFor('pt-BR');
  assert.deepEqual(pt.navigation, ['Início', 'Descobrir (EN)', 'Buscar (EN)', 'Cronologia', 'Personagens', 'Arquivo', 'Sobre (EN)']);
  assert.deepEqual(pt.footerLinks, ['Linha do tempo', 'Glossário (EN)', 'Sobre o projeto (EN)']);
});

test('all directory pages are genuine Portuguese shells backed by canonical records', () => {
  const bindings = { timeline: 'eras.map', characters: 'people.map', events: 'events.map', archive: 'chapters.map' };
  for (const [path, token] of Object.entries(bindings)) {
    const source = read(`src/pages/pt-br/${path}/index.astro`);
    assert.match(source, /locale="pt-BR"/);
    assert.ok(source.includes(token), path);
    assert.match(source, /hreflang="en"/);
    assert.match(source, /em inglês/);
    assert.ok(!source.includes('getStaticPaths'), path);
  }
});

test('site navigation, SEO and homepage cover the four translated catalog routes', () => {
  const header = read('src/components/SiteHeader.astro');
  const layout = read('src/layouts/BaseLayout.astro');
  const build = read('scripts/build-seo.mjs');
  const home = read('src/pages/pt-br/index.astro');
  assert.match(header, /isTranslatedRoute/);
  assert.match(layout, /routeAlternates/);
  assert.match(build, /translatedSuffix/);
  for (const dir of ['timeline', 'characters', 'events', 'archive']) assert.ok(home.includes(`pt-br/${dir}/`));
});
