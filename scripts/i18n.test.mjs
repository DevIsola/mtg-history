import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { homeAlternates, isTranslatedHome, uiFor } from '../src/utils/i18n.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('Brazilian Portuguese has a real local homepage and correct locale configuration', () => {
  const config = read('astro.config.mjs');
  assert.match(config, /locales: \['en', 'pt-br'\]/);
  assert.match(config, /prefixDefaultLocale: false/);
  const page = read('src/pages/pt-br/index.astro');
  assert.match(page, /locale="pt-BR"/);
  assert.match(page, /Uma história independente/);
  assert.match(page, /Tradução em andamento/);
});

test('localized copy is explicit about English-only destination routes', () => {
  const pt = uiFor('pt-BR');
  assert.equal(pt.navigation[0], 'Início');
  assert.deepEqual(pt.navigation.map((label) => label.endsWith('(EN)')), [false, true, false, false, false, false, true]);
  assert.deepEqual(pt.footerLinks.map((label) => label.endsWith('(EN)')), [false, true, true]);
  assert.throws(() => uiFor('fr'), /Unsupported locale/);
});

test('only actually translated homepages advertise locale alternates', () => {
  assert.equal(isTranslatedHome('/mtg-history/'), true);
  assert.equal(isTranslatedHome('/mtg-history/pt-br/'), true);
  assert.equal(isTranslatedHome('/mtg-history/chapters/thran/'), false);
  assert.equal(isTranslatedHome('/pt-br/'), false);
  assert.deepEqual(homeAlternates('https://devisola.github.io'), [
    { lang: 'en', href: 'https://devisola.github.io/mtg-history/' },
    { lang: 'pt-BR', href: 'https://devisola.github.io/mtg-history/pt-br/' },
  ]);
});

test('shared shell translates visible navigation and document language', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const header = read('src/components/SiteHeader.astro');
  const footer = read('src/components/SiteFooter.astro');
  for (const token of ['<html lang={locale}>', 'hreflang={lang}', '<SiteHeader locale={locale} />', '<SiteFooter locale={locale} />']) {
    assert.ok(layout.includes(token), `Missing ${token}`);
  }
  assert.match(header, /showLanguageSwitch/);
  assert.match(header, /ui\.navigation/);
  assert.match(footer, /ui\.footerIntro/);
});

test('build gate validates canonical home translations without duplicating English content', () => {
  const build = read('scripts/build-seo.mjs');
  assert.match(build, /!paths\.includes\('\/pt-br\/'\)/);
  assert.match(build, /Incorrect homepage language/);
  assert.match(build, /Missing homepage hreflang/);
  assert.match(build, /homeAlternates/);
});
