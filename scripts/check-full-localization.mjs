import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseFrontmatter } from 'astro/markdown';
import { localizedArchiveCard } from '../src/utils/pt-printings.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
const uuid = /\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/gi;
const nonempty = value => typeof value === 'string' && Boolean(value.trim());
const normalized = value => value.replace(/\s+/g, ' ').trim();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ids = value => Object.keys(value ?? {}).sort();

/** Blank-line blocks plus line-level list/table counts catch removed or merged sections. */
export function chapterStructure(source) {
  const parsed = parseFrontmatter(source);
  const body = parsed.content.replace(/^import .*;\s*$/gm, '');
  const components = [...body.matchAll(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*?)?\s*\/?>/g)]
    .map(match => normalized(match[0]));
  const blocks = body.split(/\n\s*\n/).map(block => block
    .replace(/^\s*<\/?[A-Z][^>]*>\s*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '').trim()).filter(Boolean);
  const prose = blocks.filter(block => !/^(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|\||>|```|~~~)/.test(block));
  return {
    metadata: parsed.frontmatter,
    body,
    components,
    imports: [...parsed.content.matchAll(/^import .*;\s*$/gm)].map(match => match[0].trim()),
    uuids: [...source.matchAll(uuid)].map(match => match[0].toLowerCase()),
    urls: [...source.matchAll(/https?:\/\/[^\s"'<>)}]+/g)].map(match => match[0]),
    headingLevels: [...body.matchAll(/^(#{1,6})\s+.+$/gm)].map(match => match[1].length),
    headings: [...body.matchAll(/^#{1,6}\s+(.+)$/gm)].map(match => normalized(match[1])),
    prose: prose.map(normalized),
    listBlocks: blocks.filter(block => /^(?:[-*+]|\d+[.)])\s/.test(block)).length,
    tableBlocks: blocks.filter(block => /^\|/.test(block)).length,
    quoteBlocks: blocks.filter(block => /^>/.test(block)).length,
    listItems: [...body.matchAll(/^\s*(?:[-*+]|\d+[.)])\s+\S/gm)].length,
    tableRows: [...body.matchAll(/^\s*\|.*\|\s*$/gm)].length,
    quoteLines: [...body.matchAll(/^\s*>\s?\S/gm)].length,
    fences: [...body.matchAll(/^\s*(?:```|~~~)/gm)].length,
  };
}

/** Structural parity detects omissions; it cannot certify translation quality or canon. */
export function compareChapter(id, english, portuguese) {
  const errors = [];
  const fail = message => errors.push(`chapter ${id}: ${message}`);
  let en, pt;
  try { en = chapterStructure(english); pt = chapterStructure(portuguese); }
  catch (error) { return [`chapter ${id}: invalid frontmatter: ${error.message}`]; }
  for (const key of ['components', 'imports', 'uuids', 'urls', 'headingLevels']) {
    if (!same(en[key], pt[key])) fail(`${key} sequence differs from English source`);
  }
  for (const key of ['listBlocks', 'tableBlocks', 'quoteBlocks', 'listItems', 'tableRows', 'quoteLines', 'fences']) {
    if (en[key] !== pt[key]) fail(`${key} count differs (${en[key]} / ${pt[key]})`);
  }
  if (en.prose.length !== pt.prose.length) fail(`prose block count differs (${en.prose.length} / ${pt.prose.length})`);
  // Publication titles and standalone proper names are allowed to remain original.
  const unchanged = new Set(en.prose);
  for (const block of pt.prose) {
    if (unchanged.has(block) && /[.!?][*_]*$/.test(block) && /\b(?:the|and|was|were|with|their|that|this|from|into|could|would)\b/i.test(block)) {
      fail(`unchanged English prose block: ${block.slice(0, 110)}`);
    }
  }
  for (const key of ['eraId', 'order', 'cardIds', 'relatedSets', 'sources']) {
    if (!same(en.metadata[key], pt.metadata[key])) fail(`canonical ${key} changed`);
  }
  for (const key of ['title', 'subtitle', 'plane']) {
    if (!nonempty(pt.metadata[key])) fail(`missing ${key}`);
  }
  for (const key of ['storyPeriod', 'storyDetail', 'publicationHistory']) {
    if (!nonempty(pt.metadata.chronology?.[key])) fail(`missing chronology.${key}`);
  }
  for (const key of ['title', 'subtitle']) {
    if (en.metadata[key] === pt.metadata[key]) fail(`unchanged English ${key}`);
  }
  for (const key of ['storyDetail', 'publicationHistory']) {
    if (en.metadata.chronology?.[key] === pt.metadata.chronology?.[key]) fail(`unchanged English chronology.${key}`);
  }
  const a = en.metadata.cards ?? [], b = pt.metadata.cards ?? [];
  if (a.length !== b.length) fail(`card significance count differs (${a.length} / ${b.length})`);
  for (let i = 0; i < a.length; i++) {
    if (!nonempty(b[i]?.significance)) fail(`missing card significance ${i}`);
    else if (a[i].significance === b[i].significance) fail(`unchanged English card significance ${i}`);
  }
  return errors;
}

function checkKeys(english, portuguese, expected, label, errors) {
  if (ids(english).length !== expected) errors.push(`${label}: expected ${expected} canonical records, found ${ids(english).length}`);
  if (!same(ids(english), ids(portuguese))) errors.push(`${label}: localized IDs differ from canonical IDs`);
}

function translatedText(english, portuguese, where, errors, allowIdentity = false) {
  if (!nonempty(portuguese)) errors.push(`${where}: missing translated text`);
  else if (!allowIdentity && english === portuguese) errors.push(`${where}: unchanged English text`);
}

function translatedParagraphs(english, portuguese, where, errors) {
  if (!Array.isArray(portuguese) || portuguese.length !== english.length) {
    errors.push(`${where}: paragraph count differs (${english.length} / ${Array.isArray(portuguese) ? portuguese.length : 'missing'})`);
    return;
  }
  english.forEach((text, i) => translatedText(text, portuguese[i], `${where}[${i}]`, errors));
}

export function validateLocalization(data) {
  const errors = [];
  const { chapters, characters, events, relationships, glossary, provenance, paths, cards, overlays, routes, printings } = data;
  checkKeys(chapters, overlays.chapters, 11, 'chapters', errors);
  for (const id of ids(chapters)) {
    if (overlays.chapters[id]) errors.push(...compareChapter(id, chapters[id], overlays.chapters[id]));
  }
  checkKeys(characters, overlays.characters, 88, 'characters', errors);
  for (const [id, en] of Object.entries(characters)) {
    const pt = overlays.characters[id]; if (!pt) continue;
    for (const key of ['name', 'origin']) translatedText(en[key], pt[key], `character ${id}.${key}`, errors, true);
    for (const key of ['title', 'role', 'summary']) translatedText(en[key], pt[key], `character ${id}.${key}`, errors);
    translatedParagraphs(en.biography, pt.biography, `character ${id}.biography`, errors);
    translatedText(en.featuredCard.significance, pt.featuredCard?.significance, `character ${id}.featuredCard.significance`, errors);
  }
  checkKeys(events, overlays.events, 133, 'events', errors);
  for (const [id, en] of Object.entries(events)) {
    const pt = overlays.events[id]; if (!pt) continue;
    for (const key of ['title', 'summary']) translatedText(en[key], pt[key], `event ${id}.${key}`, errors);
    translatedParagraphs(en.narrative, pt.narrative, `event ${id}.narrative`, errors);
  }
  checkKeys(relationships, overlays.relationships, 118, 'relationships', errors);
  for (const [id, en] of Object.entries(relationships)) {
    const pt = overlays.relationships[id]; if (!pt) continue;
    for (const key of ['labelForA', 'labelForB', 'context']) {
      translatedText(en[key], pt[key], `relationship ${id}.${key}`, errors, en[key] === 'Mentor');
    }
  }
  checkKeys(glossary, overlays.glossary, 10, 'glossary', errors);
  for (const [id, en] of Object.entries(glossary)) {
    const pt = overlays.glossary[id]; if (!pt) continue;
    translatedText(en.term, pt.term, `glossary ${id}.term`, errors, true);
    for (const key of ['summary', 'details']) translatedText(en[key], pt[key], `glossary ${id}.${key}`, errors);
  }
  checkKeys(provenance, overlays.provenance, 53, 'provenance', errors);
  for (const [id, en] of Object.entries(provenance)) {
    const pt = overlays.provenance[id]; if (!pt) continue;
    if (pt.chronology?.precision !== en.chronology.precision) errors.push(`provenance ${id}: canonical chronology precision changed`);
    for (const key of ['label', 'basis']) translatedText(en.chronology[key], pt.chronology?.[key], `provenance ${id}.chronology.${key}`, errors);
    translatedText(en.artworkNote, pt.artworkNote, `provenance ${id}.artworkNote`, errors);
    if (!Array.isArray(pt.sources) || pt.sources.length !== en.sources.length) {
      errors.push(`provenance ${id}: source count differs`); continue;
    }
    en.sources.forEach((source, i) => {
      for (const key of ['title', 'url', 'role', 'author', 'year']) {
        if (source[key] !== pt.sources[i]?.[key]) errors.push(`provenance ${id}.sources[${i}]: canonical ${key} changed`);
      }
      translatedText(source.supports, pt.sources[i]?.supports, `provenance ${id}.sources[${i}].supports`, errors);
    });
  }
  checkKeys(paths, overlays.paths, 4, 'paths', errors);
  for (const [id, en] of Object.entries(paths)) {
    const pt = overlays.paths[id]; if (!pt) continue;
    for (const key of ['title', 'summary', 'chronology']) translatedText(en[key], pt[key], `path ${id}.${key}`, errors);
    if (!Array.isArray(pt.steps) || pt.steps.length !== en.steps.length) { errors.push(`path ${id}: step count differs`); continue; }
    en.steps.forEach((step, i) => {
      for (const key of ['chapterId', 'eventId']) if (step[key] !== pt.steps[i]?.[key]) errors.push(`path ${id}.steps[${i}]: canonical ${key} changed`);
      translatedText(step.context, pt.steps[i]?.context, `path ${id}.steps[${i}].context`, errors);
    });
  }
  const expectedRoutes = ['', 'about/', 'archive/', 'characters/', 'events/', 'relationships/', 'discover/', 'explore/', 'glossary/', 'paths/', 'timeline/', 'search/',
    ...ids(chapters).map(id => `chapters/${id}/`), ...ids(characters).map(id => `characters/${id}/`), ...ids(events).map(id => `events/${id}/`)];
  if (!Array.isArray(routes) || routes.length !== 244 || !same([...routes].sort(), expectedRoutes.sort())) errors.push('routes: expected exactly 244 canonical translated route counterparts without omissions or duplicates');
  if (ids(cards).length !== 133) errors.push(`cards: expected 133 canonical printings, found ${ids(cards).length}`);
  if (printings.version !== 1 || ids(printings.cards).length !== 120) errors.push('printings: expected manifest version1 with120 verified PT variants');
  const displayedIds = new Set(); let fallback = 0;
  for (const [id, canonical] of Object.entries(cards)) {
    try {
      const localized = localizedArchiveCard({ ...canonical, scryfallId: id }, printings);
      if (localized.canonicalId !== id) errors.push(`printing ${id}: canonical identity changed`);
      if (localized.translated) {
        if (localized.printingId === id || displayedIds.has(localized.printingId)) errors.push(`printing ${id}: PT display ID must be distinct and unique`);
        if (localized.artist !== canonical.artist) errors.push(`printing ${id}: credited artist differs from canonical illustration`);
        displayedIds.add(localized.printingId);
      } else fallback++;
    } catch (error) { errors.push(`printing ${id}: ${error.message}`); }
  }
  for (const id of ids(printings.cards)) if (!cards[id]) errors.push(`printing ${id}: unsupported canonical printing`);
  if (fallback !== 13) errors.push(`printings: expected13 original EN fallbacks, found ${fallback}`);
  return {
    errors,
    counts: { chapters: ids(overlays.chapters).length, characters: ids(overlays.characters).length,
      biographyParagraphs: Object.values(overlays.characters).reduce((n, row) => n + (row.biography?.length ?? 0), 0),
      events: ids(overlays.events).length, narrativeParagraphs: Object.values(overlays.events).reduce((n, row) => n + (row.narrative?.length ?? 0), 0),
      relationships: ids(overlays.relationships).length, glossary: ids(overlays.glossary).length,
      provenance: ids(overlays.provenance).length, paths: ids(overlays.paths).length,
      routes: routes?.length ?? 0, portuguesePrintings: ids(printings.cards).length, englishFallbacks: fallback },
  };
}

async function jsonFile(file) { return JSON.parse(await readFile(file, 'utf8')); }
async function collection(root, folder, extension = '.json') {
  const directory = join(root, 'src/content', folder);
  const filenames = (await readdir(directory)).filter(file => file.endsWith(extension)).sort();
  return Object.fromEntries(await Promise.all(filenames.map(async file => [file.slice(0, -extension.length), extension === '.json' ? await jsonFile(join(directory, file)) : await readFile(join(directory, file), 'utf8')])));
}

export async function loadLocalization(root = repository) {
  const [chapters, ptChapters, characters, events, relationships, glossary, cards, provenanceModule, pathsModule] = await Promise.all([
    collection(root, 'chapters', '.mdx'), collection(root, 'chapters-pt', '.mdx'), collection(root, 'characters'),
    collection(root, 'events'), collection(root, 'relationships'), collection(root, 'glossary'), collection(root, 'cards'),
    import(pathToFileURL(join(root, 'src/data/event-provenance.mjs')).href),
    import(pathToFileURL(join(root, 'src/data/history-paths.mjs')).href),
  ]);
  const overlays = Object.fromEntries(await Promise.all(['characters', 'events', 'relationships', 'glossary', 'provenance', 'paths'].map(async key => [key, await jsonFile(join(root, `src/data/pt-br/${key}.json`))])));
  return { chapters, characters, events, relationships, glossary, cards, provenance: provenanceModule.eventProvenance,
    paths: Object.fromEntries(pathsModule.historyPaths.map(row => [row.id, row])), overlays: { ...overlays, chapters: ptChapters },
    routes: await jsonFile(join(root, 'src/data/translated-routes.json')), printings: await jsonFile(join(root, 'src/data/pt-printings.json')) };
}

export async function checkFullLocalization(root = repository) { return validateLocalization(await loadLocalization(root)); }

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await checkFullLocalization();
    for (const error of result.errors) console.error(`- ${error}`);
    console.log(`Full PT-BR coverage: ${JSON.stringify(result.counts)}; ${result.errors.length} integrity errors.`);
    console.log('Offline field and structural coverage only. Publication titles and personal names may remain original. Human translation and historical-source review remain pending.');
    if (result.errors.length) process.exitCode = 1;
  } catch (error) { console.error(error); process.exitCode = 1; }
}
