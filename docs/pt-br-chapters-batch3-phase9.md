# PT-BR historical reading batch 3 — Phase 9

Completes **initial Brazilian Portuguese reading editions for all ten chapters**. The third batch covers chapters 08–10: `war-of-the-spark`, `march-of-the-machine`, and `omenpaths`.

**Scope:** 32 major sections; 64 narrative paragraphs; a three-chapter adaptation with direct access to all original chapter card-printing references, historical-event records and source bibliographies. Existing historical content collections remain unchanged. The number of distinct source records is calculated from the canonical collection in tests rather than maintained as an independent handwritten count.

| Chapter | Sections | Historical focus |
| --- | ---: | --- |
| 08 · War of the Spark | 11 | Bolas's tools and plans, the beacon, trapped walkers, Liliana, Gideon's sacrifice and aftermath |
| 09 · New Phyrexian Invasion | 11 | Praetor factions, the Seedcore failure, Realmbreaker, Mirran resistance, Zhalfir and victory's costs |
| 10 · Omenpath Era | 10 | Planar roads and changing sparks; Eldraine, Ixalan, Ravnica, Thunder Junction and the future of Loot |

All Portuguese pages remain explicitly labeled **editorial adaptations, not full translations**. The shared `/pt-br/chapters/[id]/` Astro route resolves companion content across all three batches. `/pt-br/chapters/thran/` remains the dedicated Thran adaptation. Chapter-level reciprocal `hreflang` is deliberately not enabled until complete bilingual editorial equivalence is approved.

## Verification and handoff

Run `node --test scripts/pt-chapter-batch1.test.mjs scripts/pt-chapter-batch2.test.mjs scripts/pt-chapter-batch3.test.mjs`, `pnpm run check:types`, `pnpm run verify`, and `pnpm exec playwright test`. Verify ten PT-BR chapter links and the original English chapter links from the timeline, including mobile and without JavaScript. Inspect each new reading page and the historical-card artwork gallery.

## Follow-on work

Initial coverage does not certify textual parity, art-scene fidelity or every historical interpretation. Plan a consolidated terminology audit and a chapter-aware **Reportar um problema** GitHub issue workflow for reader feedback. Bilingual Pagefind indexing can follow once the full set of ten adapted routes exists.
