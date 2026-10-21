# PT-BR Pagefind search — Phase 11

The site now has `/search/` (English) and `/pt-br/search/` (Brazilian Portuguese), built by the same static Pagefind 1.5.2 process. Pagefind detects the document's `<html lang>` and indexes each language independently. The existing English search page is not replaced or redirected.

The Portuguese search reads the shared `pagefind/pagefind.js` bundle with `/mtg-history/` as its base. It searches PT-BR pages automatically, sanitizes excerpts via `textContent`, and only renders result links beneath `/mtg-history/pt-br/`. It does not merge English results as a fallback or misrepresent an English-only record as translated. The Portuguese page has local labels, asynchronous status messages, empty-results and short-query states, and a no-JavaScript link to the Portuguese timeline.

Portuguese navigation now uses `Buscar`, and the homepage offers Portuguese search alongside a clearly labeled English full-archive search. `/search/` and `/pt-br/search/` are functionally equivalent search interfaces and may advertise reciprocal `hreflang` alternates. Chapter translations remain editorial adaptations: no chapter-level reciprocal `hreflang` is added.

Build unchanged: `pnpm run build` produces the Pagefind bundle. Use `pnpm run verify && pnpm exec playwright test`. Test accent-insensitive queries (`reparacao` vs. `reparação`), verify Portuguese result URLs, check the EN/PT search language switch, a 320px viewport and no-JavaScript fallback. `pnpm dev` does not generate the index: use `pnpm exec astro preview` after a full build.

No account, server-side search, persistent user data, or new paid service is required.
