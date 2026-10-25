import { localizedArchiveCard } from './pt-printings.mjs';
import { cardScryfallUrl } from './card-printings';
import type { Locale } from './locale';
import ptCatalog from '../data/pt-printings.json';

type CanonicalCard = {
  scryfallId: string;
  name: string;
  artist: string;
  setCode: string;
  collectorNumber: string;
};

/** A verified display variant supplements the unchanged historical reference. */
export function archiveCard(canonical: CanonicalCard, locale: Locale) {
  return {
    ...localizedArchiveCard(canonical, locale === 'pt-BR' ? ptCatalog : undefined),
    originalUrl: cardScryfallUrl(canonical),
  };
}

export function cardLabels(locale: Locale) {
  return locale === 'pt-BR' ? {
    artContext: 'Arte e contexto histórico',
    illustratedBy: 'Ilustração de',
    viewCard: 'Ver carta no Scryfall ↗',
    enlarge: 'Ampliar imagem da carta',
    language: 'Carta oficial em português (PT)',
    fallback: 'Imagem da edição original (EN)',
    original: 'Referência histórica: edição original ↗',
    interpretation: 'Interpretação editorial: ',
    close: 'Fechar imagem',
    record: 'Registro histórico ilustrado',
    viewPrinting: 'Ver impressão exata no Scryfall ↗',
    archive: 'Do arquivo ilustrado',
  } : {
    artContext: 'Art and historical context',
    illustratedBy: 'Illustrated by',
    viewCard: 'View card on Scryfall ↗',
    enlarge: 'Enlarge card image',
    language: 'Exact illustrated printing',
    fallback: 'Exact illustrated printing',
    original: 'Historical reference: original printing ↗',
    interpretation: 'Editorial interpretation: ',
    close: 'Close image',
    record: 'Illustrated historical record',
    viewPrinting: 'View exact printing on Scryfall ↗',
    archive: 'From the illustrated archive',
  };
}
