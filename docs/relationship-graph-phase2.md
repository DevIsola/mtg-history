# Character relationship graph — Phase 2: navigation and historical context

Phase 2 builds on the merged Phase 1 `vis-network` renderer. It requires no new
packages, backend, data migration, generated graph ledger, or modification to
any existing relationship definition.

## Behavior

- **Entire network** renders all characters participating in the selected
  relationship category. **Connections around focus** renders the selected
  character and nodes reachable in one, two, or three documented links.
  Paths are undirected for discovery and filtered by category **before**
  traversal; a disconnected focus remains visible as an isolated node.
- Changing the focus via the existing character selector, a graph node, or the
  Find control keeps the graph and its direct relationship cards synchronized.
  A case-insensitive name search highlights matching nodes and Find focuses the
  first exact match or the first partial match. Search does not invent edges.
- Selecting a graph edge or an item in **Inspect a direct relationship** shows
  the context and canonical chapter link already present in the rendered cards.
  Selecting a character instead shows its existing editorial summary and a
  biography link. There is no synthetic AI-generated lore.
- `?person=`, `?type=`, `?mode=local`, `?depth=2|3`, and `?view=cards` are
  supported deep links. Mode, depth, and view update browser history and
  respond to Back/Forward. The default is the global graph; URLs omit default
  graph-state parameters. Graph reset returns to global, depth 1, graph view,
  and clears search, while retaining the Phase 1 focus/type reset behavior.
- Node placement remains the visitor's unless changing local scope/depth or
  character focus. Fit Graph adjusts the viewport around visible nodes.
- The original relationship-card fallback remains available for keyboard,
  screen-reader and no-JavaScript use. Canvas navigation itself is still
  pointer/touch oriented; these native controls remain the accessible path.

## Manual acceptance — before merging

1. Run `pnpm run verify && pnpm exec playwright test` on desktop/mobile.
2. Confirm the entire graph preserves the existing node and edge counts.
3. Select **Connections around focus**: verify one hop for Urza, then expand to
   two and three. Confirm the count is monotonically non-decreasing.
4. Change the relationship type: graph edges should reflect only documented
   relationships in that category, including while in local mode.
5. Search for `Yawgmoth`, press Find, and check the character selector, selected
   node, biography URL, and inspector. Search for a nonexistent name and verify
   the previous selection remains unchanged.
6. Select an edge or choose a direct relationship in the inspector. Check the
   wording against its original card and follow the historical chapter link.
7. Open `?person=urza&mode=local&depth=2&view=cards`, navigate between modes
   and use Back/Forward. Test Reset View.
8. Inspect desktop and 320px mobile widths, both color themes, touch behavior,
   and no-JavaScript relationship-card links. Check for console errors.

## Deferred

This phase deliberately does not add inferred relationships, automatic
community clustering, additional physics engines, plane-specific colors,
image-loaded graph nodes, or keyboard navigation on the canvas. Those are
possible follow-up refinements after the core views are editorially accepted.
