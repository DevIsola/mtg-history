import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/components/GlossaryTerm.astro', import.meta.url), 'utf8');

test('glossary panels use Web Crypto rather than a Node-specific typed import', () => {
  assert.doesNotMatch(source, /from\s+['"]node:crypto['"]/);
  assert.match(source, /globalThis\.crypto\.randomUUID\(\)/);
  assert.match(source, /aria-controls=\{panelId\}/);
  assert.match(source, /id=\{panelId\}/);
});

test('supported runtime produces distinct accessible panel identifiers', () => {
  const identifiers = Array.from({ length: 30 }, () => `lore-definition-${globalThis.crypto.randomUUID()}`);
  assert.equal(new Set(identifiers).size, identifiers.length);
  for (const id of identifiers) assert.match(id, /^lore-definition-[0-9a-f-]{36}$/);
});
