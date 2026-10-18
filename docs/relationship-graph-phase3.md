# Character relationship graph — Phase 3: chapter grouping and performance

## Goal

Make the existing interactive graph easier to navigate across the ten historical chapters without replacing the structured source of truth. No content entries or links are fabricated, and the original accessible relationship cards remain available.

## Features

- **Documenting chapter**: filter graph edges to the historical chapter where the relationship is documented. This is not the same thing as shared character birthplace, faction, or chronological lifetime.
- **Character colors**: optional colored dots by each character's **first indexed chapter**. Characters appearing in multiple chapters receive a single display color; this does not imply a canonical allegiance.
- **Chapter clusters**: deterministic spatial arrangement of characters in ten chapter groups. The algorithm changes only node positions, never relationship endpoints, counts, or identity. Selecting Organic relationships restores the original graph positions.
- **Shareable state**: `chapter=<id>`, `colors=neutral`, and `layout=chapter` are optional query parameters. Existing `person`, `type`, `mode`, `depth`, and `view` parameters continue to work. Browser history and reset restore the controls.
- **Accessible fallback**: cards and their provenance links are unchanged. All options have labels; controls are accessible independently of the canvas. No-JavaScript behavior is unchanged.

## Bundle-size remediation

The Phase 2 graph loaded `vis-network/standalone` dynamically, but this standalone build contains its own large compiled dependency bundle. Phase 3 loads the **modular** `vis-network/esnext` and `vis-data/esnext` packages and imports the stylesheet explicitly. Rolldown module-boundary code splitting in `astro.config.mjs` groups the graph renderer, graph data, and input handlers into separately cacheable pieces rather than suppressing the size warning by changing its threshold.

Run the pinned `pnpm add -E` command from the handoff; commit **both** `package.json` and `pnpm-lock.yaml`. The extra packages are already supported peer dependencies of vis-network, but must be explicit for pnpm reproducibility.

**Acceptance condition**: inspect the actual `pnpm run build` output. No graph-related asset should exceed the 500 kB warning threshold. If a warning remains, inspect the generated chunk names and sizes; do not just increase `chunkSizeWarningLimit`. The modular dependency change and configuration must be verified on the user's checkout, not assumed from static syntax checks.

## Acceptance checklist

1. `pnpm run verify` and `pnpm exec playwright test` pass on desktop and mobile.
2. No unused `GraphScope` TypeScript hint remains. `astro check` reports no new diagnostics.
3. No 500 kB large-chunk warning attributable to graph code remains in the production build.
4. Filtering a chapter displays only edges explicitly labeled with that chapter.
5. Switching between Organic relationships and Chapter clusters does not change the edge count.
6. Switching character colors does not modify the relationship data.
7. URL state round-trips through refresh and browser Back/Forward.
8. At 320px, there is no horizontal overflow. Reduced-motion preference and theme switching remain functional.
9. Graph/Cards mode, local-depth traversal, search, inspector, and no-JavaScript fallback from Phases 1–2 still work.

## What Phase 3 does *not* claim

Character cluster placement is a visual organizational choice based on first-indexed chapter, not canonical chronology, faction membership, or plane identity. The graph makes no new story assertions. All connections continue to be backed by the 116 existing relationship records.
