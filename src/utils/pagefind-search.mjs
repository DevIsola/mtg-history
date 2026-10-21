/** Safe rendering helpers for the build-generated Pagefind search index. */
export const PAGEFIND_RESULT_LIMIT = 20;

export function normalizeFullTextQuery(input) {
  return String(input ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').slice(0, 160);
}

/** Pagefind excerpts may contain HTML emphasis; never render index HTML directly. */
export function plainExcerpt(input) {
  return String(input ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 420);
}

/** Reject cross-origin URLs and any path outside the configured Astro base. */
export function safeSearchResultUrl(value, base, origin) {
  if (typeof value !== 'string' || !value.startsWith('/')) return null;
  if (value.startsWith('//') || value.includes('\\')) return null;
  try {
    const root = new URL(base, origin);
    const url = new URL(value, root);
    if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return null;
    if (/[%]2f|[%]5c/i.test(url.pathname)) return null;
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}
