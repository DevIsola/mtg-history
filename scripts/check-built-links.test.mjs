import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';
import { checkBuiltLinks } from './check-built-links.mjs';

const created = [];
afterEach(async () => {
  await Promise.all(created.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function fixture(files) {
  const root = await mkdtemp(join(tmpdir(), 'mtg-history-links-'));
  created.push(root);
  for (const [file, contents] of Object.entries(files)) {
    await mkdir(join(root, file, '..'), { recursive: true });
    await writeFile(join(root, file), contents);
  }
  return root;
}

const site = 'https://example.com';
const base = '/mtg-history/';

test('resolves base-prefixed, relative, root, and asset links', async () => {
  const distDir = await fixture({
    'index.html': '<a href="/mtg-history/chapters/thran/">Chapter</a><a href="/mtg-history/">Home</a>',
    'chapters/thran/index.html': '<a href="../../">Home</a><a href="#intro">Intro</a><img src="/mtg-history/favicon.svg"><a href="https://external.example/nope">External</a>',
    'favicon.svg': '<svg></svg>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.deepEqual(result, { pages: 2, checked: 5, errors: [] });
});

test('reports missing local destinations and paths outside the site base', async () => {
  const distDir = await fixture({
    'index.html': '<a href="/mtg-history/unknown/">Missing</a><a href="/other-app/">Wrong base</a>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /missing local target/);
  assert.match(result.errors[1], /escapes configured base/);
});

test('fails when the output has no generated HTML', async () => {
  const distDir = await fixture({ 'favicon.svg': '<svg></svg>' });
  await assert.rejects(checkBuiltLinks({ distDir, base, site }), /No generated HTML/);
});
