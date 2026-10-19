import { readdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = new URL('../', import.meta.url);
const PAPER_LIGHT = '#faf7f0';
const PAPER_DARK = '#172529';

function toRgb(hex) {
  if (!/^#[\da-f]{6}$/i.test(hex)) throw new Error(`Invalid palette color: ${hex}`);
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

function luminance(hex) {
  const channels = toRgb(hex).map((value) => value <= 0.04045
    ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export function extractChapterPalettes(scss) {
  const entry = /^  ([a-z][a-z0-9-]*): \(light: (#[\da-f]{6}), dark: (#[\da-f]{6}), top: (#[\da-f]{6}), bottom: (#[\da-f]{6})\),?$/gim;
  const matches = [...scss.matchAll(entry)];
  return matches.map((match) => ({ id: match[1], light: match[2], dark: match[3], top: match[4], bottom: match[5] }));
}

/** Offline editorial and accessibility gate; no network or image requests. */
export function auditChapterThemes({ scss, chapters, eras, page, globalStyles, manifest }) {
  const errors = [];
  const entries = extractChapterPalettes(scss);
  const counts = new Map();
  for (const { id, light, dark } of entries) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
    if (contrastRatio(light, PAPER_LIGHT) < 4.5) errors.push(`${id}: light accent contrast below 4.5:1`);
    if (contrastRatio(dark, PAPER_DARK) < 4.5) errors.push(`${id}: dark accent contrast below 4.5:1`);
  }
  if (entries.length === 0) errors.push('No chapter palettes found');
  for (const [id, count] of counts) if (count !== 1) errors.push(`${id}: duplicate palette`);
  for (const id of chapters) if (counts.get(id) !== 1) errors.push(`${id}: missing chapter palette`);
  for (const id of eras) if (counts.get(id) !== 1) errors.push(`${id}: missing editorial era palette`);
  for (const id of counts.keys()) {
    if (!chapters.includes(id) || !eras.includes(id)) errors.push(`${id}: orphan palette`);
  }
  if (new Set(chapters).size !== chapters.length) errors.push('duplicate chapter IDs');
  if (new Set(eras).size !== eras.length) errors.push('duplicate editorial era IDs');
  if (!page.includes('data-era-theme={chapter.id}')) errors.push('chapter wrapper must use exact chapter ID');
  if (!globalStyles.includes('@use "./chapter-themes";')) errors.push('global.scss must include chapter-themes partial');
  if (manifest?.scripts?.['check:themes'] !== 'node scripts/check-chapter-themes.mjs' ||
      !manifest.scripts.verify.includes('pnpm run check:themes')) {
    errors.push('verification must include check:themes');
  }
  if (!scss.includes("[data-era-theme='#{$id}']") ||
      !scss.includes("[data-theme='dark']") || !scss.includes('--era-accent:')) {
    errors.push('palettes must be scoped to chapter and light/dark themes');
  }
  return errors;
}

export async function checkChapterThemes() {
  const [scss, page, globalStyles, erasSource, manifest, files] = await Promise.all([
    readFile(new URL('src/styles/_chapter-themes.scss', root), 'utf8'),
    readFile(new URL('src/pages/chapters/[id].astro', root), 'utf8'),
    readFile(new URL('src/styles/global.scss', root), 'utf8'),
    readFile(new URL('src/data/eras.ts', root), 'utf8'),
    readFile(new URL('package.json', root), 'utf8').then(JSON.parse),
    readdir(new URL('src/content/chapters/', root)),
  ]);
  const chapters = files.filter((file) => /\.mdx?$/.test(file)).map((file) => file.replace(/\.mdx?$/, ''));
  const eras = [...erasSource.matchAll(/^\s+id: "([a-z0-9-]+)",/gm)].map((match) => match[1]);
  return { errors: auditChapterThemes({ scss, chapters, eras, page, globalStyles, manifest }), count: chapters.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { errors, count } = await checkChapterThemes();
  if (errors.length > 0) { errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; }
  else console.log(`Chapter themes: ${count}/${count} palettes, light/dark contrast and SCSS ownership passed.`);
}
