# Feature — Static full-text search (Pagefind phase 1)

## Scope

Adds `/search/` with full-text indexing of static Astro pages. Unlike Discover's curated record fields, Pagefind indexes rendered chapter prose and full event/character pages after the Astro build. Search is performed entirely in the browser: no new server, analytics or cloud search provider.

- `main#main-content` provides the indexing boundary; site-wide navigation and footer remain outside it.
- `astro build && pagefind --site dist` generates `dist/pagefind/` before verification and deployment. The indexing CLI must be installed with `pnpm add -D -E pagefind@1.5.2`, committing the resulting package and lockfile together.
- The client applies `baseUrl: '/mtg-history/'` when using the Pagefind API and loads `pagefind.js` through the Astro base URL. This ensures GitHub Pages subpath links.
- Search results are constructed with DOM APIs and `textContent`, not untrusted `innerHTML`.
- The search UI is a progressive enhancement; Discover remains linked for no-JavaScript users.
- No historical content, card identities or source-review classification changes.

## Production and development

`pnpm dev` alone does not index generated HTML. To exercise search, run `pnpm run build` and `pnpm exec astro preview` after installing Pagefind. Both GitHub Pages and future Cloudflare Pages can serve the static `dist/pagefind/` assets. Pagefind's static index does not require an API or server process.

## Verification

```powershell
node --test scripts/pagefind-search.test.mjs
pnpm run verify
pnpm exec playwright test
```

The verification pipeline includes a post-build index gate checking the generated browser bundle, a nonempty fragment inventory, valid chapter index boundaries and the `/mtg-history/` URL prefix. Browser tests exercise search, clearing, a narrow mobile viewport and no-JavaScript navigation.

**Manual acceptance:** inspect representative terms such as `phthisis` and `Yawgmoth`, verify that result links stay inside `/mtg-history/`, test keyboard navigation, confirm both themes, and compare the search experience at 320px and desktop widths.

## Follow-up

Consider search term highlighting, keyboard shortcut (`/`), language-specific indexes after Portuguese localization, and a curated ranking/facet strategy in a later PR. Keep the first release dependency-light and static.
