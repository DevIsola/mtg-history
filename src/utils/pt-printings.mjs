import { canonicalPrintingId, cardImageSrcsetForPrinting, cardImageUrlForPrinting } from './card-images.mjs';

const setCode = /^[a-z0-9]{2,8}$/i;
const number = /^[a-zA-Z0-9*+-]{1,16}$/;
const illustration = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A PT printing supplements a canonical UUID; it never replaces the historical record. */
export function localizedArchiveCard(canonical, manifest) {
  const canonicalId = canonicalPrintingId(canonical.scryfallId);
  const original = {
    canonicalId, printingId: canonicalId, name: canonical.name, artist: canonical.artist,
    setCode: canonical.setCode, collectorNumber: canonical.collectorNumber,
    imageUrl: cardImageUrlForPrinting(canonicalId),
    imageSrcset: cardImageSrcsetForPrinting(canonicalId),
    scryfallUrl: `https://scryfall.com/card/${canonical.setCode}/${canonical.collectorNumber}`,
    language: 'en', translated: false,
  };
  const entry = manifest?.cards?.[canonicalId];
  if (!entry) return original;
  if (entry.canonicalId !== canonicalId || entry.lang !== 'pt' ||
      entry.setCode?.toLowerCase() !== canonical.setCode.toLowerCase() ||
      String(entry.collectorNumber) !== String(canonical.collectorNumber) ||
      !setCode.test(entry.setCode) || !number.test(String(entry.collectorNumber)) ||
      !illustration.test(entry.illustrationId ?? '') ||
      typeof entry.printedName !== 'string' || !entry.printedName.trim() ||
      typeof entry.artist !== 'string' || !entry.artist.trim()) {
    throw new Error(`Invalid PT printing metadata for ${canonicalId}`);
  }
  const printingId = canonicalPrintingId(entry.id);
  return {
    ...original, printingId, name: entry.printedName, artist: entry.artist,
    imageUrl: cardImageUrlForPrinting(printingId),
    imageSrcset: cardImageSrcsetForPrinting(printingId),
    scryfallUrl: `https://scryfall.com/card/${entry.setCode}/${entry.collectorNumber}/pt`,
    language: 'pt', translated: true,
  };
}

/** A translated printing is eligible only with independent illustration-ID agreement. */
export function verifiedPortugueseVariant(canonical, original, localized) {
  if (!original || !localized || original.lang !== 'en' || localized.lang !== 'pt' ||
      original.id === localized.id) return null;
  if (original.id?.toLowerCase() !== canonical.scryfallId.toLowerCase()) return null;
  if (original.set?.toLowerCase() !== canonical.setCode.toLowerCase() ||
      localized.set?.toLowerCase() !== canonical.setCode.toLowerCase()) return null;
  if (String(original.collector_number) !== String(canonical.collectorNumber) ||
      String(localized.collector_number) !== String(canonical.collectorNumber)) return null;
  const artworkId = card => card.illustration_id ?? card.card_faces?.[0]?.illustration_id;
  const printed = localized.printed_name ?? localized.card_faces?.[0]?.printed_name;
  if (!illustration.test(artworkId(original) ?? '') ||
      artworkId(original) !== artworkId(localized) ||
      !localized.image_uris?.normal && !localized.card_faces?.[0]?.image_uris?.normal ||
      !original.image_uris?.normal && !original.card_faces?.[0]?.image_uris?.normal ||
      typeof printed !== 'string' || !printed.trim() ||
      typeof localized.artist !== 'string' || !localized.artist.trim()) return null;
  canonicalPrintingId(localized.id);
  return {
    canonicalId: canonical.scryfallId.toLowerCase(), id: localized.id.toLowerCase(), lang: 'pt',
    setCode: canonical.setCode.toLowerCase(), collectorNumber: String(canonical.collectorNumber),
    illustrationId: artworkId(original), printedName: printed, artist: localized.artist,
  };
}
