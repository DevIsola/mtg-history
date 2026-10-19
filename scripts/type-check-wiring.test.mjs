import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

test('full verification gates deployment on Astro diagnostics before building', () => {
  assert.equal(packageJson.scripts['check:types'], 'astro check');
  assert.deepEqual(packageJson.scripts.verify.split(/\s*&&\s*/), [
    'pnpm run test',
    'pnpm run check:entities',
    'pnpm run check:cards',
    'pnpm run check:content',
    'pnpm run check:editorial',
    'pnpm run check:artwork',
    'pnpm run check:images',
    'pnpm run check:styles',
    'pnpm run check:types',
    'pnpm run build',
    'pnpm run check:links',
  ]);
});

test('Astro diagnostic dependencies are exact and compatible', () => {
  assert.equal(packageJson.devDependencies['@astrojs/check'], '0.9.10');
  assert.equal(packageJson.devDependencies.typescript, '5.9.3');
});
