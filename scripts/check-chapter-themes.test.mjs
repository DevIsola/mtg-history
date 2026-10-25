import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { auditChapterThemes, checkChapterThemes, contrastRatio, extractChapterPalettes } from './check-chapter-themes.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const palette = read('src/styles/_chapter-themes.scss');
const chapters = [...readFileSync(new URL('../src/data/eras.ts', import.meta.url), 'utf8')
  .matchAll(/^\s+id: "([a-z0-9-]+)",/gm)].map((m) => m[1]);
const good = {
  scss: palette, chapters, eras: chapters,
  page: read('src/components/ChapterReader.astro'),
  globalStyles: read('src/styles/global.scss'),
  manifest: JSON.parse(read('package.json')),
};

test('all authored chapters have exactly one scoped palette', () => {
  assert.deepEqual(auditChapterThemes(good), []);
  assert.equal(extractChapterPalettes(palette).length, 11);
});
test('current real chapter files and editorial eras match', async () => {
  assert.deepEqual((await checkChapterThemes()).errors, []);
});
test('palette accents meet WCAG AA 4.5:1 text contrast against their surfaces', () => {
  for (const p of extractChapterPalettes(palette)) {
    assert.ok(contrastRatio(p.light, '#faf7f0') >= 4.5, p.id);
    assert.ok(contrastRatio(p.dark, '#172529') >= 4.5, p.id);
  }
});
test('rejects missing, duplicated, and orphan chapter themes', () => {
  assert.match(auditChapterThemes({ ...good, chapters: [...chapters, 'new-plane'] }).join(' '), /missing chapter palette/);
  assert.match(auditChapterThemes({ ...good, scss: palette.replace(/\n\);/, '\n  thran: (light: #775124, dark: #e7bd83, top: #334239, bottom: #142026),\n);') }).join(' '), /duplicate palette/);
  assert.match(auditChapterThemes({ ...good, chapters: chapters.filter((x) => x !== 'omenpaths'), eras: chapters.filter((x) => x !== 'omenpaths') }).join(' '), /orphan palette/);
});
test('rejects low contrast in either mode', () => {
  assert.match(auditChapterThemes({ ...good, scss: palette.replace('#775124', '#eeeeee') }).join(' '), /light accent contrast/);
  assert.match(auditChapterThemes({ ...good, scss: palette.replace('#e7bd83', '#181818') }).join(' '), /dark accent contrast/);
});
test('rejects missing chapter scope and verification gate', () => {
  assert.match(auditChapterThemes({ ...good, page: good.page.replace('data-era-theme={chapter.id}', 'data-era-theme="default"') }).join(' '), /wrapper/);
  assert.match(auditChapterThemes({ ...good, globalStyles: '' }).join(' '), /global.scss/);
});
