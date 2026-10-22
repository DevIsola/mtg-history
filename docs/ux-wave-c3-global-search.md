# UX Wave C3 — Pagefind-backed global search palette

## Scope

The existing Pagefind indexes remain the only full-text search system. The header search control still links to `/search/` or `/pt-br/search/` without JavaScript. With JavaScript, it opens one native `dialog`, using the exact deployed `/mtg-history/pagefind/pagefind.js` bundle, the same query normalization, excerpt sanitization, and base-aware URL safety policies as the full-search pages. Nothing is fetched from a new search service.

## Interaction and accessibility

- Cmd+K on macOS or Ctrl+K on Windows/Linux toggles the search palette; Escape closes the native modal.
- Focus starts in the search field and returns to the invoking control. Arrow Down from the input moves into results; arrows navigate available links; Enter follows the focused link.
- Search results are plain-text DOM nodes, never injected HTML. Late network responses cannot update a closed or superseded query.
- Search may load lazily and require a production build to function. The full search page remains available on every request, including with JavaScript disabled or an unavailable index.
- English and Portuguese documents remain isolated. Portuguese uses the existing `html[lang]` language-specific Pagefind index, with a secondary Portuguese-route guard.
- No new dependency, backend, duplicate index, card printing, or historical record is introduced.

## Verify

`pnpm run verify && pnpm exec playwright test`

Preview with `pnpm exec astro preview --host 127.0.0.1 --port 4322` and inspect desktop, 320px mobile, light/dark themes, both languages, no-JavaScript fallback, keyboard focus return, and 2-character search minimum.

## Next waves

D1 Timeline → D2 Illustrated Archive → E1 Characters → E2 Relationships → F1 Homepage → F2 visual QA. Track the PT-BR localized card-art requirement in `docs/pt-br-card-localization.md` for D2 and later artwork changes.
