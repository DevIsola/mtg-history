import test from 'node:test';
import assert from 'node:assert/strict';
import { auditGlossary, checkGlossary } from './check-glossary.mjs';

const sample = {
  terms: Array.from({ length: 10 }, (_, i) => ({ id: `term-${i}`, data: { term: `Term ${i}`, summary: 'A supported historical explanation.', details: 'Details grounded in the narrative.', chapterId: 'thran' } })),
  chapters: ['thran'],
  sources: { 'thran.mdx': 'import GlossaryTerm from "..."; <GlossaryTerm id="term-1">Term</GlossaryTerm>' },
  component: "getEntry('glossary', id) data-lore-button data-lore-panel",
  page: "getCollection('glossary') id={entry.id}",
  schema: 'const glossary = defineCollection( chapterId: reference("chapters") chapters, cards, characters, events, relationships, glossary',
  manifest: { scripts: { 'check:glossary': 'node scripts/check-glossary.mjs', verify: 'pnpm run check:glossary' } },
};

test('accepts canonical glossary IDs and authored references', () => {
  assert.deepEqual(auditGlossary(sample), []);
});
test('rejects unknown IDs and orphan chapter links', () => {
  const bad = structuredClone(sample);
  bad.sources['thran.mdx'] += ' <GlossaryTerm id="missing">?</GlossaryTerm>';
  bad.terms[0].data.chapterId = 'unpublished';
  assert.match(auditGlossary(bad).join(' | '), /unknown glossary ID missing/);
  assert.match(auditGlossary(bad).join(' | '), /unknown chapter unpublished/);
});
test('rejects missing imports, invalid records, and missing collection gate', () => {
  const bad = structuredClone(sample);
  bad.sources['thran.mdx'] = '<GlossaryTerm id="term-1">Term</GlossaryTerm>';
  bad.terms[0].data.summary = '';
  bad.schema = '';
  const messages = auditGlossary(bad).join(' | ');
  assert.match(messages, /require GlossaryTerm import/);
  assert.match(messages, /missing summary/);
  assert.match(messages, /validated chapter reference/);
});
test('repository glossary entries and curated chapter uses validate offline', async () => {
  const result = await checkGlossary();
  assert.equal(result.count, 10);
  assert.deepEqual(result.errors, []);
});
