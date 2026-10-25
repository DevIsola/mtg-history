import { readdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = new URL('../', import.meta.url);
const slugPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export function auditGlossary({ terms, chapters, sources, component, page, schema, manifest }) {
  const errors = [];
  const slugs = new Set();
  for (const { id, data } of terms) {
    if (!slugPattern.test(id) || slugs.has(id)) errors.push(`invalid or duplicated glossary ID: ${id}`);
    slugs.add(id);
    for (const key of ['term', 'summary', 'details']) {
      if (typeof data[key] !== 'string' || data[key].trim().length < 12 && key !== 'term') errors.push(`${id}: missing ${key}`);
    }
    if (!chapters.includes(data.chapterId)) errors.push(`${id}: unknown chapter ${data.chapterId}`);
  }
  if (terms.length < 10) errors.push('Glossary must retain its initial ten curated entries');
  if (!schema.includes('const glossary = defineCollection(') || !schema.includes('chapterId: reference("chapters")') || !['chapters', 'cards', 'characters', 'events', 'relationships', 'glossary'].every(name => new RegExp(`\\b${name}\\b`).test(schema))) errors.push('Glossary collection must have a validated chapter reference');
  if (!component.includes("getEntry('glossary', id)") || !component.includes('data-lore-button') || !component.includes('data-lore-panel')) errors.push('GlossaryTerm component must use canonical collection and accessible controls');
  if (!page.includes("getCollection('glossary')") || !page.includes('id={entry.id}')) errors.push('Glossary index must render anchored collection entries');
  for (const [path, source] of Object.entries(sources)) {
    const matches = [...source.matchAll(/<GlossaryTerm\s+id=["']([a-z0-9-]+)["']/g)].map((m) => m[1]);
    if (matches.length && !source.includes('import GlossaryTerm from')) errors.push(`${path}: term references require GlossaryTerm import`);
    for (const id of matches) if (!slugs.has(id)) errors.push(`${path}: unknown glossary ID ${id}`);
  }
  if (!Object.values(sources).some((source) => source.includes('<GlossaryTerm id='))) errors.push('No curated glossary uses in published chapters');
  if (manifest?.scripts?.['check:glossary'] !== 'node scripts/check-glossary.mjs' || !manifest.scripts.verify.includes('pnpm run check:glossary')) errors.push('Verification must gate glossary integrity');
  return errors;
}

export async function checkGlossary() {
  const files = await readdir(new URL('src/content/glossary/', root));
  const chapters = (await readdir(new URL('src/content/chapters/', root))).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ''));
  const terms = await Promise.all(files.filter((f) => f.endsWith('.json')).map(async (f) => ({ id: f.slice(0, -5), data: JSON.parse(await readFile(new URL(`src/content/glossary/${f}`, root), 'utf8')) })));
  const chapterFiles = await readdir(new URL('src/content/chapters/', root));
  const sources = Object.fromEntries(await Promise.all(chapterFiles.filter((f) => /\.mdx?$/.test(f)).map(async (f) => [f, await readFile(new URL(`src/content/chapters/${f}`, root), 'utf8')])));
  const [component, page, schema, manifest] = await Promise.all([
    readFile(new URL('src/components/GlossaryTerm.astro', root), 'utf8'),
    readFile(new URL('src/components/pages/GlossaryPage.astro', root), 'utf8'),
    readFile(new URL('src/content.config.ts', root), 'utf8'),
    readFile(new URL('package.json', root), 'utf8').then(JSON.parse),
  ]);
  return { count: terms.length, errors: auditGlossary({ terms, chapters, sources, component, page, schema, manifest }) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { count, errors } = await checkGlossary();
  if (errors.length) { errors.forEach((e) => console.error(`- ${e}`)); process.exitCode = 1; }
  else console.log(`Lore glossary: ${count} terms, chapter references and authored uses validated.`);
}
