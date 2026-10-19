import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalPrintingId, cardImageUrlForPrinting, cardImageSrcsetForPrinting,
} from '../src/utils/card-images.mjs';
import { auditImageSource } from './check-image-assets.mjs';

const ID = 'a736df42-18e9-4259-b0b8-54d21143e72e';
const validFiles = {
  'src/utils/card-images.mjs': 'cards.scryfall.io/',
  'src/components/HistoricalCard.astro': 'srcset={imageSrcset} sizes=',
  'src/pages/archive/index.astro': 'srcset={card.imageSrcset} sizes=',
  'src/pages/discover/index.astro': 'srcset={record.imageSrcset} sizes=',
  'src/pages/events/index.astro': 'srcset={imageSrcset} sizes=',
  'src/components/CardHoverPreview.astro': 'data-card-image-set={imageSrcset} image.srcset =',
  'src/utils/card-printings.ts': 'cardImageSrcsetForPrinting',
  'scripts/check-artwork-fidelity.mjs': 'cardImageUrlForPrinting(id)',
};

test('normalizes exact printing UUIDs and rejects invalid identities', () => {
  assert.equal(canonicalPrintingId(ID.toUpperCase()), ID);
  for (const invalid of ['', 'Glacian', '../card.jpg', null, 1234]) {
    assert.throws(() => canonicalPrintingId(invalid), /Invalid Scryfall printing UUID/);
  }
});

test('builds stable full-card images with a normal fallback', () => {
  assert.equal(cardImageUrlForPrinting(ID), `https://cards.scryfall.io/normal/front/a/7/${ID}.jpg`);
  assert.equal(cardImageUrlForPrinting(ID, 'small'), `https://cards.scryfall.io/small/front/a/7/${ID}.jpg`);
  assert.throws(() => cardImageUrlForPrinting(ID, 'art_crop'), /Unsupported full-card/);
  assert.throws(() => cardImageUrlForPrinting(ID, 'large/../png'), /Unsupported full-card/);
});

test('srcset retains all three full-card sizes with width descriptors', () => {
  const sources = cardImageSrcsetForPrinting(ID).split(', ');
  assert.deepEqual(sources.map((source) => source.split(' ').at(-1)), ['146w', '488w', '672w']);
  assert.equal(new Set(sources).size, 3);
  assert.ok(sources.every((source) => source.includes(`/front/a/7/${ID}.jpg`)));
});

test('source audit accepts canonical IDs and wired consumers', () => {
  assert.deepEqual(auditImageSource({ files: validFiles, ids: [ID] }), []);
});

test('source audit blocks duplicate/noncanonical UUIDs and raw CDN links', () => {
  const files = { ...validFiles, 'src/pages/new.astro': 'https://cards.scryfall.io/normal/' };
  const errors = auditImageSource({ files, ids: [ID, ID.toUpperCase()] }).join(' | ');
  assert.match(errors, /duplicate card printing/);
  assert.match(errors, /noncanonical lowercase/);
  assert.match(errors, /bypasses centralized provider/);
});

test('source audit rejects missing responsive tags, artwork hydration and unknown pages', () => {
  const files = { ...validFiles, 'src/pages/archive/index.astro': 'src={card.imageUrl}' };
  delete files['src/pages/discover/index.astro'];
  delete files['scripts/check-artwork-fidelity.mjs'];
  const errors = auditImageSource({ files, ids: [ID] }).join(' | ');
  assert.match(errors, /srcset=\{card.imageSrcset\}/);
  assert.match(errors, /missing image consumer/);
  assert.match(errors, /artwork review/);
});
