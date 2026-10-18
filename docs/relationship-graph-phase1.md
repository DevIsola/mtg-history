# Character relationship graph — Phase 1

This enhancement adds a force-directed, canvas-rendered graph to the existing
Relationships page. It is a client-side progressive enhancement; historical
records remain the single source of truth in `src/data/relationships.ts`.

## Delivered

- Obsidian-inspired global network, one node per connected character and one
  edge per documented relationship. No inferred relationships.
- Node dragging, canvas panning, wheel/pinch zoom, explicit zoom and Fit controls.
- Node click selects the character in the existing focus controls, card panel,
  and shareable `?person=` URL.
- Existing relationship-category selector hides unmatched graph elements
  without rebuilding the underlying network layout.
- Graph / Relationship cards switcher; native HTML cards remain visible when
  JavaScript is unavailable or graph loading fails.
- Light/dark text/background palette and responsive fixed-height canvas.

This uses `vis-network/standalone` loaded dynamically on **this route only**;
installation and lockfile generation are performed with `pnpm add -E
vis-network@10.1.2`. No backend, schema migration or account system is added.

## Acceptance checklist

1. Verify build and Playwright suite on both desktop and mobile.
2. Check `/mtg-history/relationships/` for a visible canvas, all connected
   characters and documented edges, and no horizontal overflow at 320px.
3. Drag nodes, pan the empty background, wheel/pinch zoom, use `+`, `−`, Fit.
4. Select a node: character selector, biography link and browser URL update.
5. Change relationship type; only matching documented connections remain.
6. Switch to Relationship cards, inspect the original narrative context and
   chapter links, then switch back to Graph.
7. Disable JavaScript: original relationship cards still render.
8. Check both site themes and the console for failed dynamic imports.

## Explicitly deferred to Phase 2

Local neighborhood/depth controls, richer on-graph historical context, search
and search highlighting, node clustering, advanced physics settings and richer
URL state for active view. This phase does not claim the canvas is keyboard
navigable: the selector and relationship cards provide semantic alternatives.
