# PT-BR historical reading batch 2 — Phase 8

This batch introduces three condensed Portuguese **editorial adaptations**, not full translations: chapters 05–07 (`otaria`, `mending`, `many-worlds`). They appear alongside the original English chapters and retain an explicit disclaimer. The original texts and the underlying canonical records are unchanged.

## Inventory and chronology

| Chapter | Major Portuguese sections | Canonical printing references | Canonical event links |
| --- | ---: | ---: | ---: |
| The Mirari and Otaria | 15 | 20 | 15 |
| Time Spiral and the Mending | 16 | 12 | 16 |
| Stories Across the Planes | 13 | 11 | 11 |
| **Combined** | **44** | **43** | **42** |

`src/data/pt-chapter-batch2.mjs` contains only localized headings and narrative paragraphs plus canonical event IDs; chapter sources, exact Scryfall printing IDs, and card significance are read dynamically from the original Astro collections. The shared `[id].astro` route serves both batches without duplicating templates. The Portuguese timeline now links seven adapted chapters in order.

The narrative explicitly distinguishes events on Dominaria from independent cross-planar chronologies, the first damage to the Eye of Ugin from later Eldrazi releases, Jeska's different transformations, and Mending-era rifts from their earlier historical causes.

## Verification / acceptance

Run `node --test scripts/pt-chapter-batch2.test.mjs`, `pnpm run verify`, and `pnpm exec playwright test` in Windows PowerShell. Inspect desktop and mobile layouts, card attributions, all chapter links, and the canonical English bibliography. Validate progressive no-JS reading and ensure no chapter claims reciprocal `hreflang` before full textual parity review.

This release **defers close paragraph-level editorial certification** to a consolidated localization review after ten Portuguese chapter companions exist. It does not defer structural, link, printing-identity, or build integrity tests. A later reader-feedback workflow may produce a prefilled GitHub issue containing the affected URL and chapter.
