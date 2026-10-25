import { canonicalPrintingId, cardImageSrcsetForPrinting, cardImageUrlForPrinting } from './card-images.mjs';

/** Model a viewer from an existing canonical printing, never a name lookup. */
export function buildCardArtworkViewerModel({ id, name, artist, setCode, collectorNumber, significance = '' }, locale = 'en') {
  const printingId = canonicalPrintingId(id);
  if (typeof name !== 'string' || !name.trim() ||
      typeof artist !== 'string' || !artist.trim()) {
    throw new Error('Card viewer requires a card name and credited artist');
  }
  if (typeof setCode !== 'string' || !/^[a-z0-9]{2,8}$/i.test(setCode) ||
      typeof collectorNumber !== 'string' || !/^[a-z0-9-]+$/i.test(collectorNumber)) {
    throw new Error('Card viewer requires canonical set and collector-number metadata');
  }
  const set = setCode.toLowerCase();
  return {
    printingId,
    title: name.trim(),
    alt: `${name.trim()}, ${locale === 'pt-BR' ? 'ilustrada por' : 'illustrated by'} ${artist.trim()}`,
    attribution: `${locale === 'pt-BR' ? 'Ilustrada por' : 'Illustrated by'} ${artist.trim()} · ${set.toUpperCase()} #${collectorNumber}`,
    significance: typeof significance === 'string' ? significance : '',
    imageUrl: cardImageUrlForPrinting(printingId),
    imageSrcset: cardImageSrcsetForPrinting(printingId),
    cardUrl: `https://scryfall.com/card/${set}/${encodeURIComponent(collectorNumber)}`,
  };
}

/** Respect explicit motion preferences, including browsers without View Transitions. */
export function shouldAnimateCardArtwork({ reducedMotion, supported, sourceLoaded }) {
  return supported === true && reducedMotion === false && sourceLoaded === true;
}
