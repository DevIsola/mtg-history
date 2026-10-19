import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { planImageMigration, replaceExactlyOnce, runImageMigration } from './migrate-card-image-consumers.mjs';

const originals = {
  'src/utils/card-printings.ts': `import type { CollectionEntry } from 'astro:content';
  return \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`;
}`,
  'src/components/HistoricalCard.astro': `import { getEntry } from 'astro:content';
const id = printing.id;
const imageUrl =
  \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`;
const cardUrl =
  \`https://scryfall.com/card/\${card.setCode}/\${card.collectorNumber}\`;
      src={imageUrl}
      alt=`,
  'src/pages/archive/index.astro': `import { chapterCardUse, cardImageUrl, cardScryfallUrl } from
imageUrl: cardImageUrl(card.scryfallId), cardUrl: cardScryfallUrl(card)
                    src={card.imageUrl}
                    alt=`,
  'src/pages/discover/index.astro': `import { chapterCardUse, resolvePrinting, cardImageUrl } from
  imageUrl: string;
  chapterIds:
    imageUrl: illustration
      ? cardImageUrl(illustration.scryfallId)
      : '',
    chapterIds:
      imageUrl: cardImageUrl(portrait.scryfallId),
      chapterIds:
      imageUrl: cardImageUrl(card.scryfallId),
      chapterIds:
                      src={record.imageUrl}
                      alt=`,
  'src/pages/events/index.astro': `import { resolvePrinting, cardImageUrl } from
return { event, cardName: card.name, imageUrl: cardImageUrl(event.cardId) };
events.map(({ event, imageUrl, cardName }) => (
                    src={imageUrl}
                    alt=`,
  'src/components/CardHoverPreview.astro': `import { cardImageUrl } from
const imageUrl = cardImageUrl(printing.id);
  data-card-image={imageUrl}
  data-card-name=
    image.decoding = 'async';
      image.src = wrapper.dataset.cardImage ?? '';`,
  'scripts/check-artwork-fidelity.mjs': `import { loadChapterProvenance } from './audit-external-provenance.mjs';
    const img = \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`;`,
  'package.json': `&& pnpm run check:artwork && pnpm run check:styles &&
    "check:styles": "node scripts/check-style-architecture.mjs"`,
  'scripts/type-check-wiring.test.mjs': `    'pnpm run check:artwork',
    'pnpm run check:styles',`,
};

test('all migration consumers have a unique matching anchor', () => {
  const result = planImageMigration(originals);
  assert.equal(result.size, 9);
  assert.match(result.get('src/pages/archive/index.astro'), /imageSrcset: cardImageSrcset/);
  assert.match(result.get('src/pages/discover/index.astro'), /imageSrcset: string/);
  assert.match(result.get('src/components/HistoricalCard.astro'), /srcset=\{imageSrcset\}/);
  assert.match(result.get('scripts/check-artwork-fidelity.mjs'), /cardImageUrlForPrinting\(id\)/);
  assert.match(result.get('package.json'), /pnpm run check:images/);
});

test('migration cannot silently rerun or miss a consumer', () => {
  const result = planImageMigration(originals);
  assert.throws(() => planImageMigration(Object.fromEntries(result)), /expected one source anchor/);
  const missing = { ...originals };
  delete missing['src/pages/discover/index.astro'];
  assert.throws(() => planImageMigration(missing), /missing source file/);
});

test('duplicate anchors reject instead of replacing the first match', () => {
  assert.throws(() => replaceExactlyOnce('abcabc', 'abc', 'xyz', 'example'), /found 2/);
  assert.throws(() => replaceExactlyOnce('nonsense', 'abc', 'xyz', 'example'), /found 0/);
});

test('dry-run changes no files, full run changes all files, repeat run fails closed', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'mtg-image-fixture-'));
  try {
    for (const [path, content] of Object.entries(originals)) {
      const dest = join(directory, path);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, content, 'utf8');
    }
    assert.equal((await runImageMigration({ check: true, directory })).paths, 9);
    assert.equal(await readFile(join(directory, 'package.json'), 'utf8'), originals['package.json']);
    assert.equal((await runImageMigration({ directory })).paths, 9);
    assert.match(await readFile(join(directory, 'package.json'), 'utf8'), /check:images/);
    await assert.rejects(runImageMigration({ directory }), /expected one source anchor/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
