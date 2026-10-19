/** Full-frame Scryfall images, keyed by exact printing ID; never crop attribution. */
const PRINTING_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const IMAGE_WIDTHS = Object.freeze({ small: 146, normal: 488, large: 672 });

export function canonicalPrintingId(id) {
  if (typeof id !== 'string' || !PRINTING_ID.test(id)) {
    throw new Error(`Invalid Scryfall printing UUID: ${String(id)}`);
  }
  return id.toLowerCase();
}

/** The normal version is the stable fallback when srcset is unsupported. */
export function cardImageUrlForPrinting(id, version = 'normal') {
  const uuid = canonicalPrintingId(id);
  if (!Object.hasOwn(IMAGE_WIDTHS, version)) {
    throw new Error(`Unsupported full-card image version: ${String(version)}`);
  }
  return `https://cards.scryfall.io/${version}/front/${uuid[0]}/${uuid[1]}/${uuid}.jpg`;
}

/** Full card, including printed artist credit, not art_crop/border_crop. */
export function cardImageSrcsetForPrinting(id) {
  const uuid = canonicalPrintingId(id);
  return Object.entries(IMAGE_WIDTHS)
    .map(([version, width]) => `${cardImageUrlForPrinting(uuid, version)} ${width}w`)
    .join(', ');
}

export const cardImageIntrinsicSize = Object.freeze({ width: 488, height: 680 });
