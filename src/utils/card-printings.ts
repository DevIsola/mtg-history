import type { CollectionEntry } from 'astro:content';

type Printing = CollectionEntry<'cards'>['data'];
type Chapter = CollectionEntry<'chapters'>;

const scryfallUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A card ID identifies one *printing*, never an Oracle card or name match. */
export function normalizeCardId(id: string): string {
  if (!scryfallUuid.test(id)) throw new Error(`Invalid Scryfall printing UUID: ${id}`);
  return id.toLowerCase();
}

export function resolvePrinting(
  cards: ReadonlyMap<string, Printing>,
  cardId: string,
  context: string,
) {
  const id = normalizeCardId(cardId);
  const printing = cards.get(id);
  if (!printing) throw new Error(`${context}: unknown canonical printing ${id}`);
  return { ...printing, scryfallId: id };
}

/** Resolve chapter-local significance by *position*, not by card title. */
export function chapterCardUse(
  chapter: Chapter,
  position: number,
  cards: ReadonlyMap<string, Printing>,
) {
  const reference = chapter.data.cardIds[position];
  const context = chapter.data.cards[position];
  if (!reference || typeof context?.significance !== 'string') {
    throw new Error(`chapter ${chapter.id}: missing curated card at position ${position}`);
  }
  const id = normalizeCardId(reference.id);
  if (context.scryfallId.toLowerCase() !== id) {
    throw new Error(`chapter ${chapter.id}: card reference and significance are misaligned at position ${position}`);
  }
  return {
    ...resolvePrinting(cards, id, `chapter ${chapter.id}`),
    significance: context.significance,
  };
}

export function cardImageUrl(cardId: string): string {
  const id = normalizeCardId(cardId);
  return `https://cards.scryfall.io/normal/front/${id[0]}/${id[1]}/${id}.jpg`;
}

export function cardScryfallUrl(card: { setCode: string; collectorNumber: string }): string {
  return `https://scryfall.com/card/${card.setCode}/${card.collectorNumber}`;
}
