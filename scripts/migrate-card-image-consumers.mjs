import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

/** Fail closed on divergent anchors; plan every write before touching the tree. */
export function replaceExactlyOnce(source, before, after, path) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${path}: expected one source anchor, found ${count}: ${before.slice(0, 92)}`);
  return source.replace(before, after);
}

export function planImageMigration(files) {
  const plan = new Map(Object.entries(files));
  const replace = (path, before, after) => {
    if (!plan.has(path)) throw new Error(`${path}: missing source file`);
    plan.set(path, replaceExactlyOnce(plan.get(path), before, after, path));
  };

  replace('src/utils/card-printings.ts',
    "import type { CollectionEntry } from 'astro:content';",
    "import type { CollectionEntry } from 'astro:content';\nimport { cardImageUrlForPrinting, cardImageSrcsetForPrinting } from './card-images.mjs';");
  replace('src/utils/card-printings.ts',
    '  return `https://cards.scryfall.io/normal/front/${id[0]}/${id[1]}/${id}.jpg`;\n}',
    '  return cardImageUrlForPrinting(id);\n}\n\nexport function cardImageSrcset(cardId: string): string {\n  return cardImageSrcsetForPrinting(normalizeCardId(cardId));\n}');

  replace('src/components/HistoricalCard.astro',
    "import { getEntry } from 'astro:content';",
    "import { getEntry } from 'astro:content';\nimport { cardImageUrl, cardImageSrcset, cardScryfallUrl } from '../utils/card-printings';");
  replace('src/components/HistoricalCard.astro',
    'const id = printing.id;\nconst imageUrl =\n  `https://cards.scryfall.io/normal/front/${id[0]}/${id[1]}/${id}.jpg`;\nconst cardUrl =\n  `https://scryfall.com/card/${card.setCode}/${card.collectorNumber}`;',
    'const imageUrl = cardImageUrl(printing.id);\nconst imageSrcset = cardImageSrcset(printing.id);\nconst cardUrl = cardScryfallUrl(card);');
  replace('src/components/HistoricalCard.astro',
    '      src={imageUrl}\n      alt=',
    '      src={imageUrl}\n      srcset={imageSrcset}\n      sizes="(max-width: 600px) 85vw, 488px"\n      alt=');

  replace('src/pages/archive/index.astro',
    'import { chapterCardUse, cardImageUrl, cardScryfallUrl } from',
    'import { chapterCardUse, cardImageUrl, cardImageSrcset, cardScryfallUrl } from');
  replace('src/pages/archive/index.astro',
    'imageUrl: cardImageUrl(card.scryfallId), cardUrl: cardScryfallUrl(card)',
    'imageUrl: cardImageUrl(card.scryfallId), imageSrcset: cardImageSrcset(card.scryfallId), cardUrl: cardScryfallUrl(card)');
  replace('src/pages/archive/index.astro',
    '                    src={card.imageUrl}\n                    alt=',
    '                    src={card.imageUrl}\n                    srcset={card.imageSrcset}\n                    sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 320px"\n                    alt=');

  replace('src/pages/discover/index.astro',
    'import { chapterCardUse, resolvePrinting, cardImageUrl } from',
    'import { chapterCardUse, resolvePrinting, cardImageUrl, cardImageSrcset } from');
  replace('src/pages/discover/index.astro',
    '  imageUrl: string;\n  chapterIds:',
    '  imageUrl: string;\n  imageSrcset: string;\n  chapterIds:');
  replace('src/pages/discover/index.astro',
    '    imageUrl: illustration\n      ? cardImageUrl(illustration.scryfallId)\n      : \'\',\n    chapterIds:',
    '    imageUrl: illustration\n      ? cardImageUrl(illustration.scryfallId)\n      : \'\',\n    imageSrcset: illustration\n      ? cardImageSrcset(illustration.scryfallId)\n      : \'\',\n    chapterIds:');
  replace('src/pages/discover/index.astro',
    '      imageUrl: cardImageUrl(portrait.scryfallId),\n      chapterIds:',
    '      imageUrl: cardImageUrl(portrait.scryfallId),\n      imageSrcset: cardImageSrcset(portrait.scryfallId),\n      chapterIds:');
  replace('src/pages/discover/index.astro',
    '      imageUrl: cardImageUrl(card.scryfallId),\n      chapterIds:',
    '      imageUrl: cardImageUrl(card.scryfallId),\n      imageSrcset: cardImageSrcset(card.scryfallId),\n      chapterIds:');
  replace('src/pages/discover/index.astro',
    '                      src={record.imageUrl}\n                      alt=',
    '                      src={record.imageUrl}\n                      srcset={record.imageSrcset}\n                      sizes="(max-width: 600px) 80vw, (max-width: 900px) 42vw, 300px"\n                      alt=');

  replace('src/pages/events/index.astro',
    'import { resolvePrinting, cardImageUrl } from',
    'import { resolvePrinting, cardImageUrl, cardImageSrcset } from');
  replace('src/pages/events/index.astro',
    'return { event, cardName: card.name, imageUrl: cardImageUrl(event.cardId) };',
    'return { event, cardName: card.name, imageUrl: cardImageUrl(event.cardId), imageSrcset: cardImageSrcset(event.cardId) };');
  replace('src/pages/events/index.astro',
    'events.map(({ event, imageUrl, cardName }) => (',
    'events.map(({ event, imageUrl, imageSrcset, cardName }) => (');
  replace('src/pages/events/index.astro',
    '                    src={imageUrl}\n                    alt=',
    '                    src={imageUrl}\n                    srcset={imageSrcset}\n                    sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 320px"\n                    alt=');

  replace('src/components/CardHoverPreview.astro',
    'import { cardImageUrl } from',
    'import { cardImageUrl, cardImageSrcset } from');
  replace('src/components/CardHoverPreview.astro',
    'const imageUrl = cardImageUrl(printing.id);',
    'const imageUrl = cardImageUrl(printing.id);\nconst imageSrcset = cardImageSrcset(printing.id);');
  replace('src/components/CardHoverPreview.astro',
    '  data-card-image={imageUrl}\n  data-card-name=',
    '  data-card-image={imageUrl}\n  data-card-image-set={imageSrcset}\n  data-card-name=');
  replace('src/components/CardHoverPreview.astro',
    "    image.decoding = 'async';",
    "    image.decoding = 'async';\n    image.sizes = 'min(85vw, 300px)';");
  replace('src/components/CardHoverPreview.astro',
    "      image.src = wrapper.dataset.cardImage ?? '';",
    "      image.srcset = wrapper.dataset.cardImageSet ?? '';\n      image.src = wrapper.dataset.cardImage ?? '';");

  replace('scripts/check-artwork-fidelity.mjs',
    "import { loadChapterProvenance } from './audit-external-provenance.mjs';",
    "import { loadChapterProvenance } from './audit-external-provenance.mjs';\nimport { cardImageUrlForPrinting } from '../src/utils/card-images.mjs';");
  replace('scripts/check-artwork-fidelity.mjs',
    '    const img = `https://cards.scryfall.io/normal/front/${id[0]}/${id[1]}/${id}.jpg`;',
    '    const img = cardImageUrlForPrinting(id);');

  replace('package.json',
    '&& pnpm run check:artwork && pnpm run check:styles &&',
    '&& pnpm run check:artwork && pnpm run check:images && pnpm run check:styles &&');
  replace('package.json',
    '    "check:styles": "node scripts/check-style-architecture.mjs"',
    '    "check:styles": "node scripts/check-style-architecture.mjs",\n    "check:images": "node scripts/check-image-assets.mjs"');

  replace('scripts/type-check-wiring.test.mjs',
    "    'pnpm run check:artwork',\n    'pnpm run check:styles',",
    "    'pnpm run check:artwork',\n    'pnpm run check:images',\n    'pnpm run check:styles',");

  return plan;
}

const paths = [
  'src/utils/card-printings.ts',
  'src/components/HistoricalCard.astro',
  'src/pages/archive/index.astro',
  'src/pages/discover/index.astro',
  'src/pages/events/index.astro',
  'src/components/CardHoverPreview.astro',
  'scripts/check-artwork-fidelity.mjs',
  'scripts/type-check-wiring.test.mjs',
  'package.json',
];

export async function runImageMigration({ check = false, directory = root } = {}) {
  const files = Object.fromEntries(await Promise.all(paths.map(async (path) =>
    [path, await readFile(join(directory, path), 'utf8')])));
  const planned = planImageMigration(files);
  if (!check) {
    for (const [path, content] of planned) await writeFile(join(directory, path), content, 'utf8');
  }
  return { paths: paths.length, check };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== '--check')) {
    console.error('Usage: node scripts/migrate-card-image-consumers.mjs [--check]');
    process.exitCode = 1;
  } else {
    try {
      const result = await runImageMigration({ check: args[0] === '--check' });
      console.log(`${result.check ? 'Preflight passed' : 'Migrated'}: ${result.paths} source consumers; image data and editorial content unchanged.`);
      if (result.check) console.log('No files changed.');
      else console.log('Run pnpm run check:images && pnpm run verify && pnpm exec playwright test.');
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
  }
}
