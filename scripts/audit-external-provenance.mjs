import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';

const chapterDirectory = fileURLToPath(new URL('../src/content/chapters/', import.meta.url));
const SCRYFALL_COLLECTION = 'https://api.scryfall.com/cards/collection';
const USER_AGENT = 'MTGHistoryProvenanceAudit/1.0 (https://github.com/DevIsola/mtg-history)';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadChapterProvenance(directory = chapterDirectory) {
  const files = (await readdir(directory)).filter((name) => /\.(md|mdx)$/.test(name)).sort();
  return Promise.all(files.map(async (file) => parseChapterEditorial(
    await readFile(join(directory, file), 'utf8'), file.replace(/\.(md|mdx)$/, ''),
  )));
}

function normalized(value) {
  return String(value ?? '').normalize('NFC').trim().replace(/\s+/g, ' ');
}

/** Compare a specific printed card, not just the Oracle card or its general title. */
export function comparePrinting(expected, actual) {
  const fields = [
    ['scryfallId', 'id'],
    ['setCode', 'set'],
    ['collectorNumber', 'collector_number'],
    ['name', 'name'],
    ['artist', 'artist'],
  ];
  return fields.flatMap(([local, remote]) =>
    normalized(expected[local]).toLowerCase() === normalized(actual?.[remote]).toLowerCase()
      ? [] : [{ field: local, expected: expected[local] ?? null, actual: actual?.[remote] ?? null }]);
}

function uniqueCardUses(chapters) {
  const byId = new Map();
  for (const chapter of chapters) {
    for (const card of chapter.cards) {
      const id = normalized(card.scryfallId).toLowerCase();
      if (!id) continue;
      const uses = byId.get(id) ?? [];
      uses.push({ chapter: chapter.id, card });
      byId.set(id, uses);
    }
  }
  return byId;
}

/** A manual, explicitly network-dependent audit. Never part of CI's offline verify gate. */
export async function auditScryfall(chapters, { fetchImpl = fetch, pause = sleep } = {}) {
  const byId = uniqueCardUses(chapters);
  const ids = [...byId.keys()];
  const issues = [];
  const checked = new Set();
  let batches = 0;

  // Scryfall accepts at most 75 identifiers in /cards/collection; allow
  // >= 650 ms between batches to stay below its more restrictive batch limit.
  for (let start = 0; start < ids.length; start += 75) {
    if (start > 0) await pause(650);
    const chunk = ids.slice(start, start + 75);
    const response = await fetchImpl(SCRYFALL_COLLECTION, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({ identifiers: chunk.map((id) => ({ id })) }),
      signal: AbortSignal.timeout(20_000),
    });
    batches += 1;
    if (!response.ok) {
      throw new Error(`Scryfall HTTP ${response.status} at batch ${batches}; no printings from this batch have been verified. Stop and retry later if rate-limited.`);
    }
    const body = await response.json();
    if (!Array.isArray(body?.data) || !Array.isArray(body?.not_found)) {
      throw new Error(`Unexpected Scryfall response in batch ${batches}; refusing to infer success.`);
    }
    for (const actual of body.data) {
      const id = normalized(actual.id).toLowerCase();
      if (!byId.has(id)) {
        issues.push({ type: 'unexpected-record', id, reason: 'Scryfall returned an unrequested ID' });
        continue;
      }
      if (checked.has(id)) issues.push({ type: 'duplicate-api-record', id });
      checked.add(id);
      for (const { chapter, card } of byId.get(id)) {
        for (const mismatch of comparePrinting(card, actual)) {
          issues.push({ type: 'printing-mismatch', chapter, card: card.name, id, ...mismatch });
        }
      }
    }
    // Missing IDs are counted as failures, including unexpected omissions not
    // explicitly listed in not_found. This prevents incomplete data passing.
    for (const id of chunk) {
      if (!checked.has(id)) {
        const declared = body.not_found.some((item) => normalized(item.id).toLowerCase() === id);
        issues.push({ type: 'unresolved-printing', id, chapters: byId.get(id).map((x) => x.chapter), declaredNotFound: declared });
      }
    }
  }

  return {
    provider: 'Scryfall /cards/collection',
    referencedCards: chapters.reduce((n, ch) => n + ch.cards.length, 0),
    uniquePrintings: ids.length,
    verifiedPrintings: checked.size,
    batches,
    issues,
  };
}

async function checkSourceURL(url, { fetchImpl, timeoutMs }) {
  const request = async (method) => fetchImpl(url, {
    method,
    redirect: 'follow',
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html,application/xhtml+xml' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  try {
    let response = await request('HEAD');
    // Some publishers do not serve HEAD at all. For a 404 or access-denied
    // response, confirm with GET rather than asserting the source is missing.
    if ([403, 404, 405, 501].includes(response.status)) response = await request('GET');
    const status = response.status;
    const redirectedTo = response.url && response.url !== url ? response.url : null;
    if (response.body) await response.body.cancel();
    return { url, status, redirectedTo, disposition: status >= 200 && status < 400 ? 'reachable' : 'review-http-status' };
  } catch (error) {
    return { url, disposition: 'unverified-network-error', detail: error?.message ?? String(error) };
  }
}

export async function auditSources(chapters, { fetchImpl = fetch, timeoutMs = 12_000, concurrency = 3 } = {}) {
  const usedBy = new Map();
  for (const chapter of chapters) for (const source of chapter.sources) {
    if (source.kind !== 'official' || !source.url) continue;
    const uses = usedBy.get(source.url) ?? [];
    uses.push({ chapter: chapter.id, title: source.title });
    usedBy.set(source.url, uses);
  }
  const urls = [...usedBy.keys()];
  const entries = Array(urls.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
    while (next < urls.length) {
      const i = next++;
      entries[i] = { ...await checkSourceURL(urls[i], { fetchImpl, timeoutMs }), usedBy: usedBy.get(urls[i]) };
    }
  });
  await Promise.all(workers);
  return { checkedURLs: urls.length, reachable: entries.filter((x) => x.disposition === 'reachable').length, entries };
}

function usage() {
  return 'Usage: node scripts/audit-external-provenance.mjs [--cards] [--sources] [--json PATH]\n' +
    'Default: --cards. --sources checks reachable URLs only; it cannot prove a citation supports a claim.\n' +
    'Network-dependent and intentionally excluded from pnpm run verify / CI.';
}

export async function runAudit(args, { chapters = null, fetchImpl = fetch, pause = sleep } = {}) {
  // Also accept an npm-style separator even though pnpm run does not need it.
  if (args[0] === '--') args = args.slice(1);
  if (args.includes('--help')) return { help: usage() };
  const known = new Set(['--cards', '--sources', '--json']);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') { if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--json requires a path'); i++; continue; }
    if (!known.has(args[i])) throw new Error(`Unknown option: ${args[i]}\n${usage()}`);
  }
  const list = chapters ?? await loadChapterProvenance();
  const cards = args.includes('--cards') || !args.includes('--sources');
  const result = { checkedAt: new Date().toISOString(), chapters: list.length, scope: { cards, sources: args.includes('--sources') } };
  if (cards) result.printings = await auditScryfall(list, { fetchImpl, pause });
  if (args.includes('--sources')) result.sources = await auditSources(list, { fetchImpl });
  return result;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const result = await runAudit(process.argv.slice(2));
    if (result.help) console.log(result.help);
    else {
      console.log(`External provenance review: ${result.chapters} chapters.`);
      if (result.printings) {
        const r = result.printings;
        console.log(`Scryfall: ${r.verifiedPrintings}/${r.uniquePrintings} unique printings returned; ${r.referencedCards} chapter card references; ${r.issues.length} discrepancies or unresolved IDs.`);
        for (const issue of r.issues) console.log(`- ${JSON.stringify(issue)}`);
      }
      if (result.sources) {
        console.log(`Official URLs: ${result.sources.reachable}/${result.sources.checkedURLs} reachable; remaining statuses require investigation.`);
        for (const entry of result.sources.entries) if (entry.disposition !== 'reachable' || entry.redirectedTo) console.log(`- ${JSON.stringify(entry)}`);
      }
      const at = process.argv.indexOf('--json');
      if (at >= 0) { await writeFile(process.argv[at + 1], JSON.stringify(result, null, 2) + '\n'); console.log(`Report written to ${process.argv[at + 1]}`); }
      if (result.printings?.issues.length) process.exitCode = 1;
      // Broken links can be temporary or anti-bot responses; report, don't
      // automatically classify as bad citations or fail a development build.
    }
  } catch (error) {
    console.error('External verification incomplete:', error.message);
    process.exitCode = 2;
  }
}
