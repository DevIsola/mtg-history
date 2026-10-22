import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { makeLookup, parseSyncArgs, syncPortuguesePrintings } from './sync-pt-printings.mjs';

const uuid1 = '014af391-3b4a-4aab-a3e9-f60e61016985';
const uuid2 = '02aea379-b444-46a3-82f4-3038f698d4f4';
const variantId = 'f107891f-2b4a-4aab-b0e9-a60e61016216';
const artId = 'bc9aa591-0e19-4889-a3e9-f60e61016985';

const fixture = async fn => {
  const dir = await mkdtemp(join(tmpdir(), 'mtg-pt-sync-'));
  const path = filename => pathToFileURL(join(dir, filename));
  try {
    await mkdir(join(dir, 'cards'));
    await writeFile(join(dir, 'cards', uuid1 + '.json'), JSON.stringify({ name: 'Card One', setCode: 'bro', collectorNumber: '12', artist: 'Artist' }));
    await writeFile(join(dir, 'cards', uuid2 + '.json'), JSON.stringify({ name: 'Card Two', setCode: 'apc', collectorNumber: '52', artist: 'Artist' }));
    await writeFile(join(dir, 'pt.json'), '{"version":1,"cards":{}}\n');
    return await fn({ cardsDir: path('cards/'), target: path('pt.json'), checkpoint: path('cache/checkpoint.json') });
  } finally { await rm(dir, { recursive: true, force: true }); }
};

const en = { object: 'card', id: uuid1, lang: 'en', set: 'bro', collector_number: '12', illustration_id: artId, image_uris: { normal: 'https://example.org/en.jpg' } };
const pt = { object: 'card', id: variantId, lang: 'pt', set: 'bro', collector_number: '12', illustration_id: artId, image_uris: { normal: 'https://example.org/pt.jpg' }, printed_name: 'Carta Um', artist: 'Artist' };

test('CLI requires explicit full sync; a limited run is diagnostic only', () => {
  assert.deepEqual(parseSyncArgs(['--write']), { mode: 'write' });
  assert.deepEqual(parseSyncArgs(['--limit', '5']), { mode: 'limit', limit: 5 });
  assert.deepEqual(parseSyncArgs(['--status']), { mode: 'status' });
  assert.throws(() => parseSyncArgs([]), /limit/);
  assert.throws(() => parseSyncArgs(['--write', '--limit', '5']), /Usage/);
  assert.throws(() => parseSyncArgs(['--limit', '-1']), /limit/);
});

test('small diagnostic run logs, checkpoints, and does not replace the published catalog', async () => fixture(async paths => {
  const logs = [];
  const lookup = async url => url === 'bro/12/pt' ? pt : url === uuid1 ? en : null;
  const diag = await syncPortuguesePrintings({ ...paths, mode: 'limit', limit: 1, lookup, log: line => logs.push(line) });
  assert.deepEqual({ complete: diag.complete, processed: diag.processed, verified: diag.verified }, { complete: false, processed: 1, verified: 1 });
  assert.deepEqual(JSON.parse(await readFile(paths.target, 'utf8')).cards, {});
  const partial = JSON.parse(await readFile(paths.checkpoint, 'utf8'));
  assert.equal(partial.processed[uuid1].printedName, 'Carta Um');
  assert.ok(logs.some(line => line.includes('checkpoint saved')));
}));

test('full run resumes checkpoint and writes only verified, same-illustration PT printings', async () => fixture(async paths => {
  let canonicalQueries = 0;
  const lookup = async url => {
    if (url === 'bro/12/pt') return pt;
    if (url === uuid1) { canonicalQueries++; return en; }
    return null;
  };
  await syncPortuguesePrintings({ ...paths, mode: 'limit', limit: 1, lookup, log: () => {} });
  const done = await syncPortuguesePrintings({ ...paths, mode: 'write', lookup, log: () => {} });
  assert.equal(done.complete, true);
  assert.equal(done.verified, 1);
  assert.equal(canonicalQueries, 1, 'verified variants must be reused from checkpoint');
  const manifest = JSON.parse(await readFile(paths.target, 'utf8'));
  assert.deepEqual(Object.keys(manifest.cards), [uuid1]);
  await assert.rejects(() => readFile(paths.checkpoint, 'utf8'), { code: 'ENOENT' });
}));

test('network failure leaves published catalog intact and prior checkpoint resumable', async () => fixture(async paths => {
  await assert.rejects(() => syncPortuguesePrintings({ ...paths, mode: 'write', log: () => {}, lookup: async url => {
    if (url === 'apc/52/pt') throw new Error('network timeout');
    return null;
  } }), /network timeout/);
  assert.deepEqual(JSON.parse(await readFile(paths.target, 'utf8')).cards, {});
  const state = JSON.parse(await readFile(paths.checkpoint, 'utf8'));
  assert.ok(Object.hasOwn(state.processed, uuid1));
  assert.ok(!Object.hasOwn(state.processed, uuid2));
}));

test('bounded lookup rejects rate limits immediately and has an abort signal', async () => {
  let count = 0;
  const lookup = makeLookup({ fetcher: async (_url, { signal }) => {
    assert.equal(signal.aborted, false);
    count++;
    return { status: 429, ok: false };
  }, delayMs: 0 });
  await assert.rejects(lookup('bro/12/pt'), /429/);
  assert.equal(count, 1);
});
