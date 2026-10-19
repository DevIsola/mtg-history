import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';
import { loadCuratedChapters } from './load-curated-chapters.mjs';
import { extractCardSignificance } from './check-artwork-fidelity.mjs';

const directory = fileURLToPath(new URL('../src/content/chapters/', import.meta.url));

test('135 chapter uses hydrate from canonical printing records without duplicate fields', async () => {
  const chapters = await loadCuratedChapters(directory, parseChapterEditorial);
  assert.equal(chapters.length, 10);
  assert.equal(chapters.reduce((sum, chapter) => sum + chapter.cards.length, 0), 135);
  for (const chapter of chapters) for (const card of chapter.cards) {
    assert.match(card.scryfallId, /^[a-f0-9]{8}-/);
    assert.ok(card.name && card.artist && card.setCode && card.collectorNumber);
    assert.equal(card.significance, '>-');
  }
});

test('visual review captions retain every authored folded historical significance', async () => {
  const chapters = await loadCuratedChapters(directory, parseChapterEditorial);
  for (const chapter of chapters) {
    const mdx = await readFile(join(directory, `${chapter.id}.mdx`), 'utf8');
    const captions = extractCardSignificance(mdx, chapter.cards.map((card) => card.name));
    assert.equal(captions.size, chapter.cards.length, `chapter ${chapter.id}`);
    for (const card of chapter.cards) {
      assert.ok(captions.get(card.name)?.length > 12, `${chapter.id}: ${card.name}`);
    }
  }
});
