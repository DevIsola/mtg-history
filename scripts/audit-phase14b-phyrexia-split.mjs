/**
 * Phase 14B migration preflight. Explicit planning assignments, not a content
 * migration or a claim that art/fiction is certified. Offline and read-only.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ORIGINAL_CHAPTER = 'march-of-the-machine';
export const RISE_CHAPTER = 'new-phyrexia';

// Story boundary: the failed Seedcore strike closes the preparation chapter.
// Event identities do not change; only their eventual chapterId would change.
export const EVENT_PROPOSALS = Object.freeze({
  [RISE_CHAPTER]: [
    'phyrexia-mirran-survival',
    'phyrexia-vorinclex-world-tree',
    'phyrexia-jin-kamigawa',
    'phyrexia-urabrask-dissent',
    'phyrexia-dominaria-sleeper-war',
    'phyrexia-seedcore-failure',
  ],
  [ORIGINAL_CHAPTER]: [
    'phyrexia-realmbreaker-invasion',
    'phyrexia-melira-resistance',
    'phyrexia-elspeth-return',
    'phyrexia-zhalfir-return',
    'phyrexia-norns-fall',
    'phyrexia-tamiyos-last-story',
    'phyrexia-meliras-last-gift',
  ],
});

// Indices into the current 17-entry chapter cardIds/cards paired arrays.
// The original exact UUID, printing, and existing significance are retained.
export const PRINTING_INDEX_PROPOSALS = Object.freeze({
  [RISE_CHAPTER]: [0, 1, 2, 3, 4, 12, 13, 14, 15, 16],
  [ORIGINAL_CHAPTER]: [5, 6, 7, 8, 9, 10, 11],
});

// These sections require actual prose refactoring; a section title alone cannot
// automatically decide how a mixed-era paragraph or artwork caption migrates.
export const SECTION_PROPOSALS = Object.freeze({
  [RISE_CHAPTER]: ['I', 'II', 'III', 'IV'],
  [ORIGINAL_CHAPTER]: ['V', 'VII', 'VIII', 'IX'],
  'CROSS_ARC_REWRITE': ['VI', 'X', 'XI'],
});

const unique = (items) => new Set(items).size === items.length;
const flat = (buckets) => Object.values(buckets).flat();
const sorted = (items) => [...items].sort((a, b) => String(a).localeCompare(String(b), 'en'));

export function parsePhase14bArgs(args) {
  const argv = args[0] === '--' ? args.slice(1) : args;
  if (argv.length === 1 && argv[0] === '--help') return { help: true };
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!['--json', '--markdown'].includes(key) || Object.hasOwn(opts, key)) {
      throw new Error(`Unsupported or duplicate option: ${key}`);
    }
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${key} requires output path`);
    opts[key] = resolve(value);
  }
  if (opts['--json'] && opts['--json'] === opts['--markdown']) {
    throw new Error('JSON and Markdown output paths must differ');
  }
  return opts;
}

function assertExactPartition(observed, proposed, label) {
  const actual = sorted(observed);
  const assigned = flat(proposed);
  if (!unique(assigned) || JSON.stringify(sorted(assigned)) !== JSON.stringify(actual)) {
    throw new Error(`${label} plan must assign every current item exactly once; inspect source drift`);
  }
}

/** A strict pre-migration manifest; fails if source state has changed. */
export function buildPhase14bSplitLedger({ chapter, events, printings, sources, relationships,
  characters, sections, hasPtCompanion, roadmapIntent }) {
  if (chapter !== ORIGINAL_CHAPTER || !roadmapIntent || !hasPtCompanion) {
    throw new Error('Expected published ten-chapter baseline, PT companion, and recorded split intent');
  }
  const ids = events.map((event) => event.id);
  if (events.some((event) => event.chapterId !== ORIGINAL_CHAPTER) || !unique(ids)) {
    throw new Error('Unexpected event chapter ownership or duplicated event identity');
  }
  assertExactPartition(ids, EVENT_PROPOSALS, 'Event');
  assertExactPartition(printings.map((_, index) => index), PRINTING_INDEX_PROPOSALS, 'Printing');
  assertExactPartition(sections.map((section) => section.number), SECTION_PROPOSALS, 'Section');
  if (!unique(printings.map((printing) => printing.scryfallId))) {
    throw new Error('Printing IDs duplicated in original chapter; review before migration');
  }
  if (!sources.length || !unique(sources.map((source) => source.title))) {
    throw new Error('Original chapter bibliography missing or duplicate titles');
  }
  if (relationships.some((r) => r.chapterId !== ORIGINAL_CHAPTER) ||
      characters.some((c) => !c.chapterIds.includes(ORIGINAL_CHAPTER))) {
    throw new Error('Unexpected relationship or character chapter assignment');
  }
  const proposedEvents = Object.fromEntries(Object.entries(EVENT_PROPOSALS).map(([target, list]) =>
    [target, list.map((id) => ({ id, from: ORIGINAL_CHAPTER, to: target }))]));
  const proposedPrintings = Object.fromEntries(Object.entries(PRINTING_INDEX_PROPOSALS).map(([target, indices]) =>
    [target, indices.map((index) => ({ index, ...printings[index], from: ORIGINAL_CHAPTER, to: target }))]));
  const sectionPlan = Object.fromEntries(Object.entries(SECTION_PROPOSALS).map(([target, numbers]) =>
    [target, numbers.map((number) => ({ ...sections.find((section) => section.number === number), proposedTarget: target }))]));
  return {
    status: 'PROPOSED_SPLIT_AWAITING_EDITORIAL_ACCEPTANCE',
    current: { id: ORIGINAL_CHAPTER, totalChapters: 10, events: events.length,
      curatedPrintings: printings.length, sources: sources.length,
      relationships: relationships.length, characters: characters.length,
      sections: sections.length },
    proposed: { newChapterId: RISE_CHAPTER, retainedChapterId: ORIGINAL_CHAPTER,
      expectedEnglishChapters: 11, expectedPortugueseEditions: 11,
      eventAssignments: proposedEvents, printingAssignments: proposedPrintings,
      sections: sectionPlan },
    requiresManualAssignment: {
      bibliography: sources.map(({ title, kind }) => ({ title, kind, target: 'UNASSIGNED_SOURCE_REVIEW' })),
      relationships: relationships.map(({ id, a, b, context }) => ({ id, a, b, context, target: 'UNASSIGNED_RELATIONSHIP_REVIEW' })),
      characters: characters.map(({ id, name, chapterIds }) => ({ id, name,
        existingChapterIds: chapterIds, target: 'UNASSIGNED_CHARACTER_REVIEW' })),
      crossArcSections: sectionPlan.CROSS_ARC_REWRITE,
    },
    migrationDependencies: [
      'src/data/eras.ts — add published rise era and renumber 09–11',
      'src/styles/_chapter-themes.scss — add both-theme accessible new era palette',
      'src/content/chapters/ — create new MDX; keep canonical /chapters/march-of-the-machine/ URL',
      'src/content/events/*.json — reassign only reviewed chapterId fields without renaming IDs',
      'src/content/relationships/*.json and src/content/characters/*.json — review chapter relationships and memberships',
      'src/data/events.ts and src/data/relationships.ts — inspect generated compatibility adapter consumers; regenerate only via supported tooling',
      'docs/artwork-fidelity-ledger.tsv — split chapter ownership without dropping any original exact printing',
      'src/data/pt-chapter-batch3.mjs and PT-BR chapter routes — create additional adaptation, renumber Omenpaths',
      'src/pages/ and src/components/ — verify chapter navigation, era filters, PT routing, timeline, SEO, sitemap and hreflang',
      'scripts/*.test.mjs and tests/browser/*.spec.mjs — update explicit 10-chapter inventories and 135-use coverage expectations',
      'Original section anchors and deep links — map moved anchors to the new chapter; maintain redirects where technically possible',
      'Review bibliography redistribution and exact story chronology; do not infer canon from card art',
    ],
  };
}

const rootUrl = (path) => new URL('../' + path, import.meta.url);
const read = (path) => readFile(rootUrl(path), 'utf8');
const listJson = async (folder) => {
  const root = rootUrl(folder + '/');
  return Promise.all((await readdir(root)).filter((name) => name.endsWith('.json')).map(async (name) => ({
    id: name.slice(0, -5), ...JSON.parse(await readFile(new URL(name, root), 'utf8')),
  })));
};

export async function runPhase14bSplitAudit() {
  const [mdx, roadmap, ptBatch, eventList, relationshipList, characterList] = await Promise.all([
    read('src/content/chapters/march-of-the-machine.mdx'), read('ROADMAP.md'),
    read('src/data/pt-chapter-batch3.mjs'), listJson('src/content/events'),
    listJson('src/content/relationships'), listJson('src/content/characters'),
  ]);
  const idsBlock = mdx.match(/^cardIds:\r?\n((?:  - [^\r\n]+\r?\n)+)/m)?.[1];
  if (!idsBlock) throw new Error('Could not read canonical MDX cardIds block');
  const ids = [...idsBlock.matchAll(/^  - ([0-9a-f-]{36})$/gm)].map((match) => match[1]);
  const printings = await Promise.all(ids.map(async (scryfallId) => ({
    scryfallId, ...JSON.parse(await read(`src/content/cards/${scryfallId}.json`)),
  })));
  const sourcesBlock = mdx.split(/^sources:\s*$/m)[1]?.split(/^---\s*$/m)[0] ?? '';
  const sources = [...sourcesBlock.matchAll(/^  - title: ["']?(.+?)["']?\r?\n    kind: (official|book)\s*$/gm)]
    .map((match) => ({ title: match[1].replace(/["']$/, ''), kind: match[2] }));
  const sections = [...mdx.matchAll(/^## ([IVXLCDM]+)\. (.+)$/gm)]
    .map((match) => ({ number: match[1], title: match[2] }));
  return buildPhase14bSplitLedger({
    chapter: ORIGINAL_CHAPTER,
    events: eventList.filter((event) => event.chapterId === ORIGINAL_CHAPTER),
    printings, sources,
    relationships: relationshipList.filter((r) => r.chapterId === ORIGINAL_CHAPTER),
    characters: characterList.filter((c) => c.chapterIds?.includes(ORIGINAL_CHAPTER)),
    sections,
    hasPtCompanion: ptBatch.includes('"id": "march-of-the-machine"'),
    roadmapIntent: roadmap.includes('AGREED INTENT, NOT IMPLEMENTED') && roadmap.includes('`new-phyrexia`'),
  });
}

const escape = (value) => String(value).replace(/\|/g, '\\|').replace(/[\r\n]/g, ' ');
export function renderPhase14bMarkdown(report) {
  const p = report.proposed;
  return [
    '# Phase 14B — New Phyrexia chapter-split preparation ledger', '',
    `**Status: ${report.status}.** No migration has been performed; no source or artwork claim has been certified.`, '',
    `Current ${report.current.id}: ${report.current.events} events; ${report.current.curatedPrintings} exact chapter-card uses; ${report.current.sources} bibliography entries; ${report.current.relationships} relationships; ${report.current.characters} character memberships.`,
    `Target: ${p.expectedEnglishChapters} English chapters and ${p.expectedPortugueseEditions} PT-BR adaptations, pending full migration.`, '',
    '## Proposed event allocation (review boundary before changing chapterId)', '',
    '| Proposed chapter | Event identity |', '| --- | --- |',
    ...Object.entries(p.eventAssignments).flatMap(([target, rows]) => rows.map((r) => `| ${escape(target)} | ${escape(r.id)} |`)), '',
    '## Exact printing allocation (preserve UUID and significance)', '',
    '| Proposed chapter | Current index | Card | Set / collector | Scryfall UUID |', '| --- | ---: | --- | --- | --- |',
    ...Object.entries(p.printingAssignments).flatMap(([target, rows]) => rows.map((r) =>
      `| ${target} | ${r.index} | ${escape(r.name)} | ${r.setCode.toUpperCase()} #${escape(r.collectorNumber)} | ${r.scryfallId} |`)), '',
    '## Sections requiring a joint narrative rewrite', '',
    ...p.sections.CROSS_ARC_REWRITE.map((r) => `- [ ] Section ${r.number} — ${r.title}`), '',
    '## Manual redistribution queues (deliberately not auto-classified)', '',
    `- Bibliography: ${report.requiresManualAssignment.bibliography.length} items; retain source title, URL and claim support when splitting.`,
    `- Relationships: ${report.requiresManualAssignment.relationships.length} records; check historical scope and original context.`,
    `- Characters: ${report.requiresManualAssignment.characters.length} chapter memberships; a figure may legitimately occur in both chapters.`,
    '- Portuguese: create a new condensed companion edition; do not relabel the current translation as a full one.', '',
    '## Cross-project migration checklist', '',
    ...report.migrationDependencies.map((d) => `- [ ] ${d}`), '',
    '## Acceptance contract', '',
    '- [ ] Every original event ID is retained and occurs in exactly one proposed chapter.',
    '- [ ] Every original exact printing UUID and significance survives with explicit chapter ownership.',
    '- [ ] Review each bibliography item and character/relationship membership rather than blindly copying.',
    '- [ ] Preserve the existing March of the Machine URL, and map moved anchor links for the rise chapter.',
    '- [ ] Add eleventh PT-BR companion, era, palette and updated order/index; review language parity.',
    '- [ ] Update integrity tests and rerun verify, Playwright, strict axe, and human artwork review.',
    '- [ ] Do not merge the actual split without manual narrative and visual editorial acceptance.', '',
  ].join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const args = parsePhase14bArgs(process.argv.slice(2));
    if (args.help) {
      console.log('Usage: node scripts/audit-phase14b-phyrexia-split.mjs [--markdown PATH] [--json PATH]');
    } else {
      const report = await runPhase14bSplitAudit();
      console.log(`Phase 14B: ${report.current.events} event and ${report.current.curatedPrintings} printing assignments; migration NOT executed.`);
      if (args['--markdown']) await writeFile(args['--markdown'], renderPhase14bMarkdown(report) + '\n', 'utf8');
      if (args['--json']) await writeFile(args['--json'], JSON.stringify(report, null, 2) + '\n', 'utf8');
    }
  } catch (error) { console.error(error); process.exitCode = 1; }
}
