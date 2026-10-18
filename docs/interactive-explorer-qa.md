# Interactive explorers — targeted QA and editorial acceptance

This checklist covers the timeline, relationships, Archive, and Discover pages. It does not introduce a new data layer or modify canonical chapter content.

## Automated checks

```bash
pnpm run verify && pnpm exec playwright test
```

The browser suite covers filters, reset, sorting, network traversal, URL history, native event disclosures, no-JavaScript fallbacks, and narrow-screen document overflow. The existing accessibility suite includes the relationship explorer. `A11Y_ENFORCE=1 pnpm exec playwright test tests/browser/accessibility.spec.mjs` is an optional stricter gate if the existing project accessibility baseline is clear.

## Manual visual acceptance

Review these pages in **light and dark themes**, on desktop (at least 1280px), tablet (768px), and small mobile widths (320px and 375px). Use Playwright projects or the browser responsive-device emulator. Run the same checks with a keyboard (Tab, Shift+Tab, Enter and Space where appropriate).

| Page | Acceptance criteria |
| --- | --- |
| `/timeline/` | The era number sits on the timeline rail; controls and headings are readable without clipping; search by an event title expands and narrows its event list; filters reset without losing records; event summaries open with Enter or Space; era anchor links work without JS. |
| `/relationships/?person=urza` | A selected figure is reflected in the focus panel and active connections; selecting a category updates `?type=...`; Back/Forward restores the previous selection; all profile and historical chapter links lead to the right destination; no-JS still shows the complete documented relationship list. |
| `/archive/` | Collection overview, chapter navigation, filters, cards, and image alt text remain readable; switching to Compact creates no overflow; sorting is chapter-local; Reset returns to the curated Gallery view. |
| `/discover/` | Section links jump to visible headings and activate the matching filter; section counts change with filtering; sorting works within groups; Reset restores the curated order. |

Also check focus contrast, long chapter/character titles, 200% zoom, reduced-motion preferences, empty results, and cards whose remote Scryfall artwork is slow or unavailable. Content remains readable even when image requests fail.

## Merge acceptance

- `git diff --check` is clean.
- `pnpm run verify && pnpm exec playwright test` passes on the Mac checkout.
- No serious/critical accessibility regressions relative to the recorded baseline.
- A manual pass of the four pages finds no clipped content or keyboard traps.
- Editorial entity totals and provenance/artwork ledgers are unchanged.

Record any visual finding as a narrowly scoped follow-up issue rather than expanding this patch into an architecture or content-schema change.
