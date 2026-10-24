import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import test from 'node:test';
import routes from '../src/data/translated-routes.json' with { type: 'json' };
import aliases from '../src/data/pt-br/legacy-anchors.json' with { type: 'json' };
import { translatedRoutes } from './generate-translated-routes.mjs';
import { translatedSuffix, routeAlternates, isTranslatedRoute, uiFor } from '../src/utils/i18n.mjs';
import { PORTUGUESE_BATCH_1 } from '../src/data/pt-chapter-batch1.mjs';
import { PORTUGUESE_BATCH_2 } from '../src/data/pt-chapter-batch2.mjs';
import { PORTUGUESE_BATCH_3 } from '../src/data/pt-chapter-batch3.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

test('every published canonical route has an exact Portuguese counterpart in the manifest', () => {
  assert.deepEqual(routes, translatedRoutes());
  assert.equal(new Set(routes).size, 244);
  for (const collection of ['chapters', 'characters', 'events']) {
    const extension = collection === 'chapters' ? '.mdx' : '.json';
    const files = readdirSync(new URL(`src/content/${collection}/`, root)).filter(file => file.endsWith(extension));
    for (const file of files) assert.ok(routes.includes(`${collection}/${file.slice(0, -extension.length)}/`));
  }
  for (const chapter of routes.filter(route => route.startsWith('chapters/'))) {
    assert.ok(existsSync(new URL(`src/content/chapters-pt/${chapter.split('/')[1]}.mdx`, root)));
  }
});

test('all 244 route pairs have reciprocal alternatives under a project base and at the root', () => {
  for (const base of ['/mtg-history/', '/']) {
    for (const suffix of routes) {
      const expected = [
        { lang: 'en', href: `https://example.com${base}${suffix}` },
        { lang: 'pt-BR', href: `https://example.com${base}pt-br/${suffix}` },
      ];
      for (const path of [`${base}${suffix}`, `${base}pt-br/${suffix}`]) {
        assert.equal(translatedSuffix(path, base), suffix);
        assert.deepEqual(routeAlternates(path, 'https://example.com', base), expected);
      }
    }
  }
});

test('unpublished, malformed, out-of-base and invented detail routes never claim translations', () => {
  for (const path of ['/mtg-history/characters/not-a-character/', '/mtg-history/chapters/not-a-chapter/', '/mtg-history/events/not-an-event/', '/mtg-history/pt-br/pt-br/', '/mtg-history/chapters/thran', '/elsewhere/chapters/thran/', '/pt-br/', '/mtg-history/search/?q=urza']) {
    assert.equal(isTranslatedRoute(path), false, path);
    assert.deepEqual(routeAlternates(path, 'https://example.com'), [], path);
  }
  assert.equal(translatedSuffix('/mtg-history/', ''), null);
  assert.equal(translatedSuffix('/mtg-history/', null), null);
  assert.equal(translatedSuffix(undefined), null);
  assert.equal(uiFor('pt-BR').navigation.some(label => label.includes('(EN)')), false);
  assert.equal(uiFor('pt-BR').footerLinks.some(label => label.includes('(EN)')), false);
});

test('all old Portuguese chapter section IDs are preserved with valid complete-chapter destinations', () => {
  const thranIds = ['antes-dos-irmaos', 'civilizacao', 'yawgmoth', 'phyrexia', 'queda', 'rebbec', 'glacian', 'publicacoes', 'intocaveis', 'medicina', 'dyfed', 'guerra', 'pedras'];
  for (const id of thranIds) assert.ok(aliases.thran.some(entry => entry.id === id));
  for (const chapter of [...PORTUGUESE_BATCH_1, ...PORTUGUESE_BATCH_2, ...PORTUGUESE_BATCH_3]) {
    for (const section of chapter.sections) assert.ok(aliases[chapter.id].some(entry => entry.id === section.id), `${chapter.id}#${section.id}`);
  }
  for (const [chapterId, entries] of Object.entries(aliases)) {
    assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length, chapterId);
    for (const entry of entries) {
      const target = entry.targetChapterId ?? chapterId;
      const headings = [...read(`src/content/chapters-pt/${target}.mdx`).matchAll(/^## (.+)$/gm)].map(match => match[1]);
      if (entry.headingIndex !== undefined) assert.ok(headings[entry.headingIndex], `${chapterId}#${entry.id}`);
      else assert.ok(['chapter-reader', 'chapter-sources', 'chapter-sources-title', 'chapter-artwork-trail-heading'].includes(entry.targetId));
    }
  }
  for (const id of ['o-inimigo-que-permaneceu', 'cinco-pretores-projetos-conflitantes', 'a-guerra-oculta-em-dominaria', 'a-missao-ao-nucleo-semente']) {
    assert.equal(aliases['march-of-the-machine'].find(entry => entry.id === id).targetChapterId, 'new-phyrexia');
  }
});
