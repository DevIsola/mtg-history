import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
test('Read, Explore, About retain all navigational destinations', () => {
  const s=read('src/components/SiteHeader.astro');
  for(const v of ['Read', 'Explore', 'About', 'relationships/', 'events/', 'glossary/', 'paths/', 'archive/', 'characters/']) assert.ok(s.includes(v),v);
  assert.match(s,/data-site-explore-menu/);
  assert.match(s,/site-header__search/);
});
test('language control preserves complete translated route pairs', () => {
  const s=read('src/components/SiteHeader.astro');
  assert.match(s,/const englishChoice = withBase\(suffix\)/);
  assert.match(s,/const portugueseChoice = localPath\(suffix, 'pt-BR'\)/);
  assert.match(s,/site-header__languages/);
  assert.match(s,/hreflang="pt-BR"/);
});
test('context is grounded in chapter events rather than invented passage annotations', () => {
  const s=read('src/components/ChapterContextRail.astro');
  assert.match(s,/historicalEvents\.filter\(event => event\.chapterId === chapterId\)/);
  assert.match(s,/characters\.filter\(person => occurrences\.has\(person\.id\)\)/);
  assert.match(s,/Chapter-wide references/);
  assert.doesNotMatch(s,/People in this passage/);
});
test('layout adapts and settings never conceal content without JavaScript', () => {
  const s=read('src/components/ChapterReader.astro');
  const controls=read('src/components/ChapterReadingControls.astro');
  const style=read('src/styles/_ux-c1.scss');
  assert.match(s,/data-chapter-settings hidden/);
  assert.match(s,/ChapterContextRail chapterId=/);
  assert.match(controls,/closest\('details\[data-chapter-settings\]'\)/);
  assert.match(style,/min-width: 1440px/);
  assert.match(style,/max-width: 900px/);
  assert.match(style,/max-width: 360px/);
  assert.match(style,/\.chapter-prose \{ max-width: 68ch; \}/);
});
