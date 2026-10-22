/** On-demand Scryfall sync with progress, bounded requests, and resumable checkpoints.
 * No network calls are performed by build, verify, or imports of this module.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { verifiedPortugueseVariant } from '../src/utils/pt-printings.mjs';

const sourceDir = new URL('../src/content/cards/', import.meta.url);
const outputFile = new URL('../src/data/pt-printings.json', import.meta.url);
const checkpointFile = new URL('../node_modules/.cache/mtg-history/pt-printings-checkpoint.json', import.meta.url);
const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'MTG-History-Page/1.0 (static editorial PT-BR printing verification)',
};

export function parseSyncArgs(args) {
  if (args.length === 1 && (args[0] === '--help' || args[0] === '--status')) {
    return { mode: args[0].slice(2) };
  }
  const limitIndex = args.indexOf('--limit');
  const write = args.includes('--write');
  const allowed = write ? ['--write'] : [];
  if (limitIndex !== -1 && !write) allowed.push('--limit', args[limitIndex + 1]);
  if (args.length !== allowed.length || args.some((value, i) => value !== allowed[i])) {
    throw new Error('Usage: node scripts/sync-pt-printings.mjs --write | --limit N | --status | --help');
  }
  if (write) return { mode: 'write' };
  const limit = Number(args[1]);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) {
    throw new Error('--limit requires an integer between 1 and 1000');
  }
  return { mode: 'limit', limit };
}

async function atomicJSON(path, value) {
  const dest = fileURLToPath(path);
  await mkdir(dirname(dest), { recursive: true });
  const staging = dest + '.tmp';
  await writeFile(staging, JSON.stringify(value, null, 2) + '\n');
  await rename(staging, dest);
}

async function readCheckpoint(path, fingerprint) {
  let data;
  try { data = JSON.parse(await readFile(path, 'utf8')); }
  catch (error) {
    if (error?.code === 'ENOENT') return { version: 1, fingerprint, processed: {} };
    throw new Error(`Cannot read PT checkpoint: ${error.message}`);
  }
  if (data.version !== 1 || data.fingerprint !== fingerprint ||
      !data.processed || typeof data.processed !== 'object' || Array.isArray(data.processed)) {
    throw new Error('The PT checkpoint does not match the current card collection. Remove node_modules/.cache/mtg-history/pt-printings-checkpoint.json and restart.');
  }
  return data;
}

/** Fetch one Scryfall card; never automatically retry a 429 or failed request. */
export function makeLookup({ fetcher = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
  delayMs = 180, timeoutMs = 15000 } = {}) {
  let previous = 0;
  return async path => {
    const elapsed = Date.now() - previous;
    if (previous && elapsed < delayMs) await sleep(delayMs - elapsed);
    previous = Date.now();
    const url = `https://api.scryfall.com/cards/${path}`;
    let response;
    try {
      response = await fetcher(url, { headers: HEADERS, signal: AbortSignal.timeout(timeoutMs) });
    } catch (error) {
      throw new Error(`Scryfall request failed for ${path}: ${error.message}. Check connectivity; progress is saved.`, { cause: error });
    }
    if (response.status === 404) return null;
    if (response.status === 429) throw new Error('Scryfall returned 429 (rate limit). Stop the sync and reduce API use; do not automatically retry. Progress is saved.');
    if (!response.ok) throw new Error(`Scryfall HTTP ${response.status} for ${path}. Progress is saved; no final catalog written.`);
    let data;
    try { data = await response.json(); }
    catch (error) { throw new Error(`Invalid Scryfall JSON for ${path}: ${error.message}`); }
    if (data?.object !== 'card') throw new Error(`Unexpected Scryfall response for ${path}`);
    return data;
  };
}

export async function syncPortuguesePrintings({ mode = 'write', limit,
  cardsDir = sourceDir, target = outputFile, checkpoint = checkpointFile,
  lookup = makeLookup(), log = console.log } = {}) {
  const names = (await readdir(cardsDir)).filter(name => name.endsWith('.json')).sort();
  if (names.length === 0) throw new Error('No canonical card records found');
  const cards = await Promise.all(names.map(async file => {
    const record = JSON.parse(await readFile(new URL(file, cardsDir), 'utf8'));
    return { ...record, scryfallId: file.slice(0, -5).toLowerCase() };
  }));
  const fingerprint = createHash('sha256').update(JSON.stringify(cards.map(c =>
    [c.scryfallId, c.name, c.setCode, c.collectorNumber, c.artist]))).digest('hex');
  const state = await readCheckpoint(checkpoint, fingerprint);
  const processed = state.processed;
  const total = cards.length;
  const eligible = mode === 'limit' ? cards.slice(0, limit) : cards;
  const done = cards.filter(card => Object.hasOwn(processed, card.scryfallId)).length;
  log(`PT-BR sync: ${total} canonical cards; ${done} already checked (checkpoint); ${eligible.length} in this run.`);
  for (const [index, card] of eligible.entries()) {
    const id = card.scryfallId;
    if (Object.hasOwn(processed, id)) {
      log(`[${index + 1}/${eligible.length}] ${card.setCode.toUpperCase()} #${card.collectorNumber}: cached`);
      continue;
    }
    const path = `${encodeURIComponent(card.setCode)}/${encodeURIComponent(card.collectorNumber)}/pt`;
    log(`[${index + 1}/${eligible.length}] ${card.name} (${card.setCode.toUpperCase()} #${card.collectorNumber}): checking PT printing…`);
    const localized = await lookup(path);
    let variant = null;
    if (localized) {
      const original = await lookup(encodeURIComponent(id));
      if (!original) throw new Error(`Canonical Scryfall printing ${id} was not found; progress is saved.`);
      variant = verifiedPortugueseVariant(card, original, localized);
    }
    processed[id] = variant;
    await atomicJSON(checkpoint, state);
    const result = variant ? `verified ${variant.printedName}` : (localized ? 'PT variant rejected by artwork-fidelity rules' : 'no PT variant (404)');
    log(`  → ${result}; checkpoint saved (${Object.keys(processed).length}/${total}).`);
  }
  const verified = Object.values(processed).filter(Boolean).length;
  if (mode !== 'write') {
    log(`Diagnostic finished: ${verified} verified so far; the published catalog was NOT replaced. Continue with --write.`);
    return { complete: false, verified, processed: Object.keys(processed).length, total };
  }
  if (Object.keys(processed).length !== total) throw new Error('Incomplete PT sync; published catalog was not replaced.');
  const output = { version: 1, cards: Object.fromEntries(Object.entries(processed).filter(([, value]) => value)) };
  await atomicJSON(target, output);
  await rm(checkpoint, { force: true });
  log(`PT-BR printing sync complete: ${verified} verified, ${total - verified} English fallbacks; ${total} cards checked. Catalog updated.`);
  return { complete: true, verified, processed: total, total };
}

async function status() {
  try {
    const data = JSON.parse(await readFile(checkpointFile, 'utf8'));
    console.log(`PT-BR checkpoint: ${Object.keys(data.processed ?? {}).length} checked, ${Object.values(data.processed ?? {}).filter(Boolean).length} verified.`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    console.log('No in-progress checkpoint.');
  }
  const data = JSON.parse(await readFile(outputFile, 'utf8'));
  console.log(`Published PT-BR catalog: ${Object.keys(data.cards ?? {}).length} verified printings.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseSyncArgs(process.argv.slice(2));
    if (args.mode === 'help') console.log('Usage: node scripts/sync-pt-printings.mjs --write | --limit N | --status | --help');
    else if (args.mode === 'status') await status();
    else await syncPortuguesePrintings(args);
  } catch (error) {
    console.error(`PT-BR sync stopped: ${error.message}`);
    process.exitCode = 1;
  }
}
