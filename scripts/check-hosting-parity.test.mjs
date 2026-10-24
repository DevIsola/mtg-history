import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkHostingParity } from './check-hosting-parity.mjs';

test('hosting parity tolerates URL prefixes but rejects lost locale, fragment and printing identities', async () => {
  const root = await mkdtemp(join(tmpdir(), 'mtg-hosting-'));
  const a = join(root, 'pages'), b = join(root, 'workers');
  try {
    await mkdir(a); await mkdir(b);
    const html = '<html lang="pt-BR"><h1>História</h1><a href="/mtg-history/search/">Search</a><section id="evidence" data-printing-id="exact-printing"></section><aside id="lore-definition-670dea49-464a-405e-b83f-dd08b07aee34"></aside></html>';
    await writeFile(join(a, 'index.html'), html);
    const migrated = html.replace('/mtg-history/search/', '/search/').replace('670dea49-464a-405e-b83f-dd08b07aee34', '6d1aa50b-6c13-45c0-aafc-73a872c4c5ff');
    await writeFile(join(b, 'index.html'), migrated);
    assert.deepEqual(await checkHostingParity(a, b), { pages: 1 });
    for (const [from, to] of [['pt-BR', 'en'], ['id="evidence"', 'id="lost"'], ['exact-printing', 'wrong-printing']]) {
      await writeFile(join(b, 'index.html'), migrated.replace(from, to));
      await assert.rejects(checkHostingParity(a, b), /mismatch/);
    }
    await writeFile(join(b, 'index.html'), migrated);
    await writeFile(join(b, 'extra.html'), migrated);
    await assert.rejects(checkHostingParity(a, b), /inventories differ/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
