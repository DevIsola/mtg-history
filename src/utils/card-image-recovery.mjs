/** Exact full-frame card image URLs only. Never classify unrelated images. */
const fullCard = /^\/(?:small|normal|large)\/front\/([a-f0-9])\/([a-f0-9])\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\.jpg$/i;

export function isScryfallCardImageUrl(value) {
  if (typeof value !== 'string' || !value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'cards.scryfall.io' ||
        url.search || url.hash || url.username || url.password) return false;
    const match = fullCard.exec(url.pathname);
    return Boolean(match && match[3][0].toLowerCase() === match[1].toLowerCase() &&
      match[3][1].toLowerCase() === match[2].toLowerCase());
  } catch {
    return false;
  }
}

/** Accessible label used only for the *missing image*, not a replacement card. */
export function cardImageFallbackLabel(alt) {
  const description = typeof alt === 'string' && alt.trim() ? alt.trim() : 'Magic: The Gathering card';
  return `${description} — image unavailable`;
}
