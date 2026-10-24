# MTG History — Active roadmap

Updated: 23 October 2026. This file records implementation and remaining acceptance separately.

## Phase 14 — Finish the historical foundation

| Subphase | Scope | State |
| --- | --- | --- |
| 14.0 | Post–Living Chapters audit | Merged |
| 14A | Omenpaths original-source review | Source records merged; human editorial acceptance pending |
| 14B | New Phyrexia migration ledger | Merged planning baseline, PR #154 |
| 14C | Split New Phyrexia and March of the Machine | LOCAL IMPLEMENTATION, PENDING RELEASE |
| 14D | Historical evidence and artwork fidelity | Review packet generated; human source/artwork acceptance pending |
| 14E | Accessibility, editorial and performance hardening | Automated gates and three production runs pass; manual acceptance pending |

## Chapter split

Rise of New Phyrexia retains stable ID `new-phyrexia`, order 9. The invasion retains `march-of-the-machine`, order 10. Omenpaths moves from order 10 to order 11. Both English and PT-BR have eleven local chapter routes. These changes have not been published.

The Seedcore boundary moves seven events into the rise chapter and leaves six invasion/aftermath events in March of the Machine. This corrects the preflight placement of Melira’s Seedcore guidance. All 133 event IDs and 133 unique exact printings survive. Tamiyo’s original NEO printing is shared by both chapters because the compleation and final-story event records reference it: 136 chapter artwork uses instead of 135. No printing substitution or new event is introduced. Legacy moved EN/PT section fragments retain visible onward links without JavaScript. See docs/phase14c-chapter-split.md.

## Evidence and artwork acceptance

Source availability is separate from risk score. Koilos requires Invasion; Venser requires Time Spiral / Planar Chaos; Freyalise requires Planar Chaos; Gideon requires War of the Spark: Ravnica. Preserve the three ledgered unresolved claims and the separate Koilos worksheet until original edition-and-passage evidence is supplied. Do not replace these with summaries.

The Kenriths’ Royal Funeral remains context-assessed pending human inspection of exact MAT #34. Gideon’s Sacrifice visual acceptance depends on the unresolved sacrifice claim. Source-reviewed records and passing checks do not certify whole chapters, exact artwork interpretation or PT-BR textual parity.

## Implementation and release

Follow docs/implementation-workflow.md. Keep all phase 14 work on one branch, commit/push increments, and merge only after the complete feature and required acceptance. Automatic build/test runs occur after merge to main. Local verification remains required.

## Phase 15 — Website design revamp

After phase 14 acceptance, implement the complete design revamp using the separately approved mockups. Preserve historical identity, provenance and accessibility. Domain and parallel Cloudflare hosting remain separate decisions.
