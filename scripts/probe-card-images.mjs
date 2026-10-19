import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cardImageUrlForPrinting } from '../src/utils/card-images.mjs';

const cardDir = fileURLToPath(new URL('../src/content/cards/', import.meta.url));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Manual, bounded HEAD sampling only. Never download or mirror artworks. */
export function parseProbeArgs(args) {
  let sample = 3;
  let output;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--sample' && /^\d+$/.test(args[i + 1] ?? '')) {
      sample = Number(args[++i]);
    } else if (arg === '--output' && typeof args[i + 1] === 'string' && args[i + 1] !== '') {
      output = args[++i];
    } else {
      throw new Error('Usage: node scripts/probe-card-images.mjs [--sample 1..10] [--output REPORT.json]');
    }
  }
  if (!Number.isSafeInteger(sample) || sample < 1 || sample > 10) {
    throw new Error('--sample must be an integer between 1 and 10');
  }
  return { sample, output };
}

export function selectProbeIds(ids, count) {
  const ordered = [...new Set(ids)].sort();
  if (ordered.length === 0) return [];
  const number = Math.min(count, ordered.length);
  return Array.from({ length: number }, (_, i) =>
    ordered[number === 1 ? 0 : Math.round(i * (ordered.length - 1) / (number - 1))]);
}

export async function probeImage(id, fetchImage = fetch) {
  const imageUrl = cardImageUrlForPrinting(id, 'normal');
  const started = performance.now();
  try {
    const result = await fetchImage(imageUrl, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'MTGHistoryImageReview/1.0 (+https://github.com/DevIsola/mtg-history)',
        'Accept': 'image/jpeg',
      },
    });
    const mime = result.headers.get('content-type');
    const bytesHeader = result.headers.get('content-length');
    const declaredBytes = bytesHeader && /^\d+$/.test(bytesHeader) ? Number(bytesHeader) : null;
    return {
      id, status: result.status,
      outcome: result.ok && mime?.startsWith('image/') ? 'reachable' : 'inconclusive',
      declaredBytes, contentType: mime, cacheControl: result.headers.get('cache-control'),
      elapsedMs: Math.round(performance.now() - started),
    };
  } catch (error) {
    return { id, status: null, outcome: 'inconclusive', declaredBytes: null,
      contentType: null, cacheControl: null,
      elapsedMs: Math.round(performance.now() - started), error: String(error?.message ?? error) };
  }
}

async function main() {
  const { sample, output } = parseProbeArgs(process.argv.slice(2));
  const ids = (await readdir(cardDir)).filter((p) => p.endsWith('.json')).map((p) => p.slice(0, -5));
  const selected = selectProbeIds(ids, sample);
  const results = [];
  for (const id of selected) {
    if (results.length) await wait(350);
    results.push(await probeImage(id));
  }
  const report = { sampled: results.length, generatedAt: new Date().toISOString(),
    method: 'HEAD', caveat: 'HEAD Content-Length is not browser transfer size; denied HEAD is inconclusive.',
    results };
  if (output) await writeFile(output, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
