# UX F1 — editorial homepage and E2 contrast refinement

## Scope

- The English and Portuguese homepages share a responsive illustrated editorial hero, a compact live collection overview, curated entry chapters and four clear discovery paths.
- All visible Magic card art resolves from a **canonical chapter printing UUID**, including artist, set and collector number. Full card frames are preserved. Interpretation remains tied to the chapter and can be expanded on demand. PT-BR artwork can display only a validated Portuguese variant from the D2 catalog. The PT interpretation remains marked in English.
- Collection totals are calculated from Astro content collections, not typed into the page.
- The relationship network preserves every edge and chapter provenance. Category edges use six stronger light/dark colors, thicker opaque strokes and varying dash patterns. Legend and cards use the same colors; accessible text remains the primary label.
- The original page routes, Ko-fi header and search remain unchanged. No new historical conclusions or relationships are added.

## QA

1. Apply on top of merged E2 PR #146; run `--check` first.
2. Run `node --test scripts/ux-wave-f1.test.mjs` and `pnpm run verify && pnpm exec playwright test`.
3. Inspect both homepages at 1440/1024/760/390/320 widths in dark and light themes; validate native card links and no clipping.
4. Inspect the six graph category strokes and node labels in dark/light modes. Check relationship cards, graph/card switches and filters, including browser Back/Forward.
5. Test with JavaScript disabled: home imagery and historical links still render, and the relationship cards are available.
