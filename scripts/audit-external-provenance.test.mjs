import test from 'node:test';
import assert from 'node:assert/strict';
import { auditScryfall, auditSources, comparePrinting, runAudit } from './audit-external-provenance.mjs';

const idA = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const idB = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const card = { name: 'Historical Card', setCode: 'abc', collectorNumber: '101', scryfallId: idA, artist: 'Historical Artist' };
const actual = { name: 'Historical Card', set: 'abc', collector_number: '101', id: idA, artist: 'Historical Artist' };
function chapters() {
  return [
    { id: 'chapter-1', cards: [card], sources: [{ kind: 'official', title: 'Story', url: 'https://magic.wizards.com/story' }] },
    { id: 'chapter-2', cards: [{ ...card }], sources: [{ kind: 'official', title: 'Story', url: 'https://magic.wizards.com/story' }] },
  ];
}
const response = (status, data, url = '') => ({ status, ok: status >= 200 && status < 300, url,
  json: async () => data });

test('compares the exact printing and artist, not just a matching title', () => {
  assert.deepEqual(comparePrinting(card, actual), []);
  const changes = comparePrinting(card, { ...actual, collector_number: '103', artist: 'Other Artist' });
  assert.deepEqual(changes.map((change) => change.field), ['collectorNumber', 'artist']);
});

test('batches unique Scryfall IDs and verifies every chapter use', async () => {
  let seen;
  const result = await auditScryfall(chapters(), { fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.scryfall.com/cards/collection');
    assert.equal(options.method, 'POST');
    seen = JSON.parse(options.body).identifiers;
    return response(200, { data: [actual], not_found: [] });
  } });
  assert.deepEqual(seen, [{ id: idA }]);
  assert.equal(result.referencedCards, 2);
  assert.equal(result.uniquePrintings, 1);
  assert.equal(result.verifiedPrintings, 1);
  assert.deepEqual(result.issues, []);
});

test('never treats omitted or not_found card IDs as verified', async () => {
  const ch = chapters(); ch[0].cards.push({ ...card, scryfallId: idB, name: 'Other Card' });
  const result = await auditScryfall(ch, { fetchImpl: async () => response(200,
    { data: [actual], not_found: [{ id: idB }] }) });
  assert.equal(result.verifiedPrintings, 1);
  assert.deepEqual(result.issues.map((x) => x.type), ['unresolved-printing']);
  assert.equal(result.issues[0].declaredNotFound, true);
});

test('respects Scryfall batch size and minimum spacing', async () => {
  const cards = Array.from({ length: 76 }, (_, i) => ({ ...card,
    scryfallId: `aaaaaaaa-aaaa-4aaa-8aaa-${String(i).padStart(12, '0')}`, name: `Card ${i}` }));
  let calls = 0; const pauses = [];
  const result = await auditScryfall([{ id: 'chapter', cards, sources: [] }], {
    pause: async (ms) => pauses.push(ms),
    fetchImpl: async (_url, options) => {
      calls++;
      const identifiers = JSON.parse(options.body).identifiers;
      assert.ok(identifiers.length <= 75);
      return response(200, { data: [], not_found: identifiers });
    },
  });
  assert.equal(calls, 2);
  assert.deepEqual(pauses, [650]);
  assert.equal(result.issues.length, 76);
});

test('throws on rate limits or unexpected API bodies instead of reporting success', async () => {
  await assert.rejects(auditScryfall(chapters(), { fetchImpl: async () => response(429, {}) }), /HTTP 429/);
  await assert.rejects(auditScryfall(chapters(), { fetchImpl: async () => response(200, { data: [] }) }), /Unexpected Scryfall/);
});

test('source checking deduplicates URLs and distinguishes blocked HEAD from confirmed GET', async () => {
  const calls = [];
  const result = await auditSources(chapters(), { fetchImpl: async (url, options) => {
    calls.push({ url, method: options.method });
    return options.method === 'HEAD' ? response(405, {}, url) : response(200, {}, url);
  } });
  assert.equal(result.checkedURLs, 1);
  assert.equal(result.reachable, 1);
  assert.deepEqual(calls.map((x) => x.method), ['HEAD', 'GET']);
  assert.equal(result.entries[0].usedBy.length, 2);
});

test('a source network failure remains unverified, not evidence of a broken citation', async () => {
  const result = await auditSources(chapters(), { fetchImpl: async () => { throw Error('Offline'); } });
  assert.equal(result.reachable, 0);
  assert.equal(result.entries[0].disposition, 'unverified-network-error');
});

test('defaults to card verification and allows an explicitly source-only audit', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push(url);
    if (url.includes('scryfall')) return response(200, { data: [actual], not_found: [] });
    return response(200, {}, url);
  };
  const a = await runAudit([], { chapters: chapters(), fetchImpl });
  assert.equal(a.scope.cards, true);
  assert.equal(a.scope.sources, false);
  const b = await runAudit(['--sources'], { chapters: chapters(), fetchImpl });
  assert.equal(b.scope.cards, false);
  assert.equal(b.scope.sources, true);
  assert.equal(calls.length, 2);
  const c = await runAudit(['--', '--sources'], { chapters: chapters(), fetchImpl });
  assert.equal(c.scope.sources, true);
});


test('rejects unsupported command-line options before making network calls', async () => {
  await assert.rejects(runAudit(['--unexpected'], { chapters: chapters() }), /Unknown option/);
  await assert.rejects(runAudit(['--json'], { chapters: chapters() }), /requires a path/);
});
