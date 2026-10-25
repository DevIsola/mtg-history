import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { homeAlternates, isTranslatedHome, uiFor, translatedSuffix, routeAlternates, isTranslatedRoute } from '../src/utils/i18n.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const manifest = JSON.parse(read('src/data/translated-routes.json'));
test('all published locale pairs have reciprocal metadata under project and root bases', () => {
  assert.ok(manifest.length > 200);
  assert.equal(new Set(manifest).size, manifest.length);
  for (const base of ['/mtg-history/', '/']) for (const suffix of manifest) {
    for (const path of [base + suffix, base + 'pt-br/' + suffix]) {
      assert.equal(translatedSuffix(path, base), suffix);
      assert.equal(isTranslatedRoute(path, base), true);
      assert.deepEqual(routeAlternates(path, 'https://example.com', base), [
        { lang: 'en', href: `https://example.com${base}${suffix}` },
        { lang: 'pt-BR', href: `https://example.com${base}pt-br/${suffix}` },
      ]);
    }
  }
});
test('unpublished identities and paths outside the configured base cannot claim translations', () => {
  for (const path of ['/mtg-history/chapters/not-a-chapter/', '/mtg-history/characters/not-a-person/', '/mtg-history/events/not-an-event/', '/elsewhere/pt-br/', '/pt-br/']) {
    assert.equal(translatedSuffix(path), null, path);
    assert.deepEqual(routeAlternates(path, 'https://example.com'), []);
  }
  assert.equal(translatedSuffix(null), null);
  assert.equal(translatedSuffix('/mtg-history/', 'invalid'), null);
});
test('Portuguese navigation has no obsolete English-only fallback labels', () => {
  const pt = uiFor('pt-BR');
  assert.deepEqual(pt.navigation, ['Início','Descobrir','Buscar','Cronologia','Personagens','Arquivo','Sobre']);
  assert.deepEqual(pt.footerLinks, ['Linha do tempo','Glossário','Sobre o projeto']);
  assert.ok([...pt.navigation,...pt.footerLinks].every(label => !label.includes('(EN)')));
  assert.equal(uiFor('en').navigation[2], 'Search');
  assert.throws(() => uiFor('fr'), /Unsupported locale/);
});
test('home locale configuration and shared shell preserve language, canonical and search boundaries', () => {
  const config = read('astro.config.mjs');
  assert.match(config, /locales: \['en', 'pt-br'\]/);
  assert.match(config, /prefixDefaultLocale: false/);
  const home = read('src/pages/pt-br/index.astro');
  assert.match(home, /const locale = 'pt-BR'/);
  assert.match(home, /locale=\{locale\}/);
  assert.doesNotMatch(home, /Tradução em andamento|leituras adaptadas|permanecem em inglês/);
  const layout = read('src/layouts/BaseLayout.astro');
  for (const token of ['<html lang={locale}>','hreflang={lang}','<SiteHeader locale={locale} />','<SiteFooter locale={locale} />']) assert.ok(layout.includes(token), token);
  const header = read('src/components/SiteHeader.astro');
  assert.match(header, /const englishChoice = withBase\(suffix\)/);
  assert.match(header, /const portugueseChoice = localPath\(suffix, 'pt-BR'\)/);
  assert.match(header, /href=\{englishChoice\} hreflang="en"/);
  assert.match(header, /href=\{portugueseChoice\} hreflang="pt-BR"/);
  assert.match(header, /localPath\('search\/', locale\)/);
});
test('home-only helper remains strict while the build gate validates all actual translated pairs', () => {
  assert.equal(isTranslatedHome('/mtg-history/'), true);
  assert.equal(isTranslatedHome('/mtg-history/pt-br/'), true);
  assert.equal(isTranslatedHome('/mtg-history/chapters/thran/'), false);
  assert.deepEqual(homeAlternates('https://example.com'), [
    { lang: 'en', href: 'https://example.com/mtg-history/' },
    { lang: 'pt-BR', href: 'https://example.com/mtg-history/pt-br/' },
  ]);
  const build = read('scripts/build-seo.mjs');
  for (const marker of ['Incorrect homepage language','Missing homepage hreflang','False Portuguese alternate','routeAlternates','translatedSuffix']) assert.ok(build.includes(marker), marker);
});
