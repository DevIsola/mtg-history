# UX Wave C2 — Explore landing and discovery

## Goal

Make **Read · Explore · About** a usable information architecture rather than a navigation abbreviation. `/explore/` and `/pt-br/explore/` are lightweight landing pages connected to the already published record collections. They do not replace the existing `/discover/` structured encyclopedia or create a parallel full-text index.

## Editorial and technical decisions

- Featured reading entries are generated from published chapter records; their order is an editorial sequence, not a claim of one simultaneous, cross-plane historical calendar.
- The hero illustration is resolved by the chapter's exact curated Scryfall printing ID. The card name, artist, set code, collector number, and chapter-local significance remain together. This image is **illustrative context**, not independently established primary-source evidence.
- Collection counts are calculated from the current structured data; no metrics are hard-coded in the pages.
- EN and PT-BR landing pages have reciprocal canonical alternates. English-only destinations are labeled `(EN)` and use `hreflang="en"`.
- The established Pagefind English and Portuguese search pages remain the sole full-text engines. The `/discover/` page remains the existing record-filter directory.
- Layout collapses to a single column and is usable without JavaScript. No new runtime dependencies are introduced.

## Acceptance checks

1. Run `pnpm run verify` and `pnpm exec playwright test`.
2. Inspect `/mtg-history/explore/` and `/mtg-history/pt-br/explore/` in desktop and 320px mobile widths.
3. Check reciprocal EN/PT-BR language switching and all eight collection destinations.
4. Verify the featured card's exact printing and artist credit through the Scryfall link. Confirm its significance wording is presented as interpretation, not a literal claim that the image depicts a historical scene.
5. Confirm `/discover/`, `/search/`, and `/pt-br/search/` remain unchanged and functional.

## Roadmap position

C1 shared navigation and responsive reader → **C2 Explore landing** → C3 Pagefind-backed global search palette → D1 timeline → D2 illustrated archive → E1 characters → E2 relationships → F1 homepage → F2 final QA. Living chapters/Phase 13 follows redesign acceptance.
