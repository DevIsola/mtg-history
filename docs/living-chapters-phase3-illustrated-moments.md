# Living Chapters — Phase 3: illustrated-moment navigation

## Purpose

The chapter reader already has a conventional section TOC, progressive headings/illustrations, and a canonical card viewer. Phase 3 adds a **secondary illustrated-moment trail** using only existing `<HistoricalMoment>` and `<HistoricalCard>` markup. It is not a new search engine, a replacement TOC, or a claim that card artwork literally depicts a particular scene.

- A small, collapsed-by-default native `<details>` enumerates the actual in-page card titles, artist/set/collector credits, and stable links back to their existing narrative paragraphs.
- The current moment is reflected in the trail as the reader scrolls; this is navigation state, not an invented story chronology.
- An optional checkbox emphasizes the currently active illustrated moment. The default remains the quiet editorial layout; no text, card or reference is hidden, moved, cropped differently or auto-opened.
- The full-card Scryfall viewer, historical significance captions, original external URLs, canonical UUIDs, and the existing section TOC remain unchanged.
- No artwork assets, additional data records, image requests, dependencies, or fictional links are added. The component stays hidden without JavaScript; the original prose and card links are always available.
- No persistent preferences or overlay are introduced. The existing reduced-motion mode and native focus behavior remain intact.

## Windows PowerShell acceptance

Run `node --test scripts/living-chapters-phase3.test.mjs` and `pnpm run verify`, then `pnpm exec playwright test`. For targeted browser checks: `pnpm exec playwright test tests/browser/living-chapters-phase3.spec.mjs`. Test Thran, Ice Age and War of the Spark at 320/390/1024/1440 pixels and in both themes. Check keyboard navigation, hash links after refresh, reduce-motion, no-JS fallback and exact printing attribution. If the full strict axe gate is already enabled, retain it.

The existing 10 chapters, 88 characters, 133 events and 118 relationships are unchanged. Editorial artwork interpretations still require human scrutiny before asserting exact scene fidelity.
