# UX Wave E2 — Relationship atlas, label clarity and contrast

## Changes

- Keep all canonical relationship cards and links; the graph is an enhancement over the evidence-backed record.
- Give the atlas a three-step reading guide and distinguish network controls, legend, inspector, and evidence cards.
- Every relationship category has an explicit name and short definition. The **perspective** displayed on a card belongs to the selected character; it is not a symmetric relationship claim.
- Node names default to the focused person and direct neighbors to reduce clutter. Users may show all names; this choice round-trips with `labels=all` in the URL.
- Relationship edges and legend swatches have separate contrast-checked colors for light and dark modes. Theme changes update graph colors without needing a reload.
- Node label halos improve visibility above crossing lines. Zoom and fit controls, chapter grouping, local-depth exploration, evidence inspector, and no-JS cards remain usable.

## Editorial boundaries

The chapter associated with a relationship is **where it is documented**, not its exact timestamp. Node chapter colors indicate each person's first indexed chapter, not origin, faction, or allegiance. A displayed line is an authored relationship only; no synthetic ties are generated from shared chapter appearances.

The atlas is currently an English-only route. PT-BR navigation must continue to label it `(EN)` rather than inventing untranslated records. No canonical character, event, relationship, or printing records change in E2.

## Verification / manual acceptance

1. `node --test scripts/ux-wave-e2.test.mjs`.
2. `pnpm run verify && pnpm exec playwright test`.
3. Check the graph at 1440, 960, 390 and 320 pixels in both themes, including legend swatch contrast, focus labels and overflow.
4. Switch all-label and focus-label modes and refresh / Back to check URL restoration.
5. Inspect links and directional labels for several relationship types, especially rivalry and creation; the cards must retain their original authored context.
6. With JavaScript disabled, all 118 canonical relationship cards and chapter references must remain visible and navigable.
