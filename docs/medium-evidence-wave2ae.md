# Wave 2AE — Medium-priority source review, with an evidence boundary

## Scope

Review the next three queued events from the cross-chapter editorial audit:

1. `thran-dyfed-portal` — supported by **The Known Multiverse** (official Wizards retrospective).
2. `tocasias-death` — supported by **Act of War, Part 1** (official design commentary).
3. `battle-of-koilos` — **not marked source-reviewed**: the public official material checked so far does not directly establish the specific battle narrative or outcome. Preserve it for primary-fiction review rather than borrowing evidence from a general Coalition overview.

The first two records add narrowly described claim-level provenance. Their sources were already present in the corresponding chapter bibliographies. The Dyfed event is rewritten to distinguish creation of Phyrexia, construction of its portal, Yawgmoth's medical pretext, and the later closure of access without asserting uncited patient transfers or consent details.

## Source boundaries

- **Dyfed:** The Known Multiverse explicitly credits the earlier unnamed planeswalker with creating Phyrexia and Dyfed with opening the gateway. It describes Yawgmoth's original phthisis rationale and later takeover. It does not supply an exact in-world year, a census of people crossing the portal or their consent.
- **Tocasia:** Act of War, Part 1 identifies the fatal powerstone fight and its importance to the brothers' division, but is design commentary. It does not independently show the complete dialogue or fatal blow in Jeff Grubb's *The Brothers' War* (1998).
- **Koilos:** The Weatherlight chapter already lists *Invasion* (J. Robert King, 2000), *Planeshift* (2001) and official general overviews. The overviews support the Coalition's resistance to Phyrexia but do **not** independently verify the detailed Battle of Koilos. Read a primary-fiction passage and record edition/chapter before adding `battle-of-koilos` to the reviewed ledger. Do not infer a precise battle year or validate the card's scene from its printed name alone.

The existing three unresolved primary-fiction questions (Venser, Freyalise and Gideon) remain unchanged. No new card printing, artwork classification, chronology date, event ID, relationship or chapter is introduced. The source-reviewed baseline moves **46/133 → 48/133**; *Battle of Koilos* remains in the queue, and the 135 curated card uses remain untouched.

## Windows verification

```powershell
node --test scripts/medium-evidence-wave2ae.test.mjs
pnpm run verify
pnpm exec playwright test
pnpm run audit:consolidation
pnpm run audit:source-gaps
```

Expected: no provenance integrity errors, at least 48 of 133 event records carrying bounded provenance, and the same three outstanding primary-fiction questions. Editorial acceptance of Koilos requires reading the underlying fiction, not just passing software tests.
