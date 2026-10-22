import { normalizeFullTextQuery, safeSearchResultUrl } from './pagefind-search.mjs';

export const PALETTE_RESULT_LIMIT = 8;

/** A palette shortcut must never steal ordinary typing or additional-modifier shortcuts. */
export function isPaletteShortcut(event) {
  return String(event?.key ?? '').toLowerCase() === 'k' &&
    Boolean(event?.metaKey || event?.ctrlKey) &&
    !event?.altKey && !event?.shiftKey;
}

/** Reuse the same URL safety policy as the existing Pagefind search pages. */
export function paletteResultUrl(url, base, origin, locale) {
  const safe = safeSearchResultUrl(url, base, origin);
  if (!safe) return null;
  if (locale === 'pt-BR') return safe.startsWith(`${base}pt-br/`) ? safe : null;
  return safe.startsWith(`${base}pt-br/`) ? null : safe;
}

export function validPaletteQuery(value) {
  const query = normalizeFullTextQuery(value);
  return query.length >= 2 ? query : '';
}

/** A readable record-type label; the index itself still owns search ranking. */
export function paletteResultKind(url, base, locale = 'en') {
  const pt = locale === 'pt-BR';
  const path = String(url ?? '').split(/[?#]/, 1)[0];
  const localizedRoot = base + (pt ? 'pt-br/' : '');
  if (!path.startsWith(localizedRoot)) return pt ? 'Página' : 'Page';
  const section = path.slice(localizedRoot.length).split('/')[0];
  const names = pt ? {
    chapters: 'Capítulo', events: 'Acontecimento', characters: 'Personagem',
    timeline: 'Cronologia', archive: 'Arquivo', explore: 'Explorar',
    search: 'Busca',
  } : {
    chapters: 'Chapter', events: 'Event', characters: 'Character',
    timeline: 'Timeline', archive: 'Archive', explore: 'Explore',
    relationships: 'Relationships', glossary: 'Glossary', paths: 'Reading path',
    discover: 'Directory', search: 'Search',
  };
  return names[section] ?? (pt ? 'Página' : 'Page');
}
