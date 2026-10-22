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
