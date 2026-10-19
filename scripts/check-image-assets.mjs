import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { canonicalPrintingId, cardImageSrcsetForPrinting } from '../src/utils/card-images.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const consumers = Object.freeze({
  'src/components/HistoricalCard.astro': ['srcset={imageSrcset}', 'sizes='],
  'src/pages/archive/index.astro': ['srcset={card.imageSrcset}', 'sizes='],
  'src/pages/discover/index.astro': ['srcset={record.imageSrcset}', 'sizes='],
  'src/pages/events/index.astro': ['srcset={imageSrcset}', 'sizes='],
  'src/components/CardHoverPreview.astro': ['data-card-image-set={imageSrcset}', 'image.srcset ='],
});

export function auditImageSource({ files, ids }) {
  const errors = [];
  const seen = new Set();
  for (const id of ids) {
    try {
      const normalized = canonicalPrintingId(id);
      if (normalized !== id) errors.push(`noncanonical lowercase printing filename: ${id}`);
      if (seen.has(normalized)) errors.push(`duplicate card printing: ${normalized}`);
      seen.add(normalized);
      if (cardImageSrcsetForPrinting(normalized).split(', ').length !== 3) {
        errors.push(`missing responsive variants for ${normalized}`);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }
  if (seen.size === 0) errors.push('No canonical card printing files found');

  for (const [path, markers] of Object.entries(consumers)) {
    const source = files[path];
    if (typeof source !== 'string') {
      errors.push(`missing image consumer: ${path}`);
    } else {
      for (const marker of markers) if (!source.includes(marker)) {
        errors.push(`${path}: missing image contract ${marker}`);
      }
    }
  }
  for (const [path, source] of Object.entries(files)) {
    if (path === 'src/utils/card-images.mjs') continue;
    if (source.includes('cards.scryfall.io/')) {
      errors.push(`${path}: inline image CDN construction bypasses centralized provider`);
    }
  }
  if (!files['scripts/check-artwork-fidelity.mjs']?.includes('cardImageUrlForPrinting(id)')) {
    errors.push('artwork review must use the central exact-printing image provider');
  }
  if (!files['src/utils/card-printings.ts']?.includes('cardImageSrcsetForPrinting')) {
    errors.push('canonical card printing utility must expose responsive image sources');
  }
  return errors;
}

async function scan(dir, prefix, result) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) await scan(join(dir, entry.name), path, result);
    else if (/\.(?:astro|mjs|ts)$/.test(entry.name)) {
      result[path] = await readFile(join(dir, entry.name), 'utf8');
    }
  }
}

export async function checkImageAssets() {
  const files = {};
  await scan(join(root, 'src'), 'src', files);
  const review = 'scripts/check-artwork-fidelity.mjs';
  files[review] = await readFile(join(root, review), 'utf8');
  const ids = (await readdir(join(root, 'src/content/cards')))
    .filter((name) => name.endsWith('.json')).map((name) => name.slice(0, -5));
  return { ids, errors: auditImageSource({ files, ids }) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { ids, errors } = await checkImageAssets();
  if (errors.length) {
    errors.forEach((message) => console.error(`- ${message}`));
    process.exitCode = 1;
  } else {
    console.log(`Image ownership: ${ids.length} canonical full-card printings, responsive consumers and artwork review validated (offline).`);
  }
}
