# Canonical review — Phase 2, source-to-claim ledger

**Baseline:** `main` at `11fbd10a425253bcb20aba710c1cd4d746aced00` (after PR #64).

**Scope:** ten targeted claim checks against official Wizards of the Coast material, and a continuity correction to Squee's fate.

**Not an all-claims certification:** A source supporting one claim does not establish the accuracy of an entire chapter, all character biographies, or any printed-card metadata.

## Source-verified claims

| Chapter | Claim specifically checked | Source and audit result |
| --- | --- | --- |
| 01 — Thran | Glacian's powerstones, and Rebbec using the two stones to seal the Phyrexian gateway, connect the Thran to Urza and Mishra. | [Wizards — Legendary Characters of Commander Legends, Part 2](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-2-2020-11-06) — **corroborated**; a retrospective, not the original *The Thran* novel. |
| 02 — Brothers' War | Urza activated the Golgothian Sylex at Argoth in the final battle. | [Wizards — The Brothers' War, Episode 5](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-5-as-cruel-as-necessary) — **corroborated**; its conflicting accounts of the Sylex's origin caution against claiming a single certain origin. |
| 03 — Dark / Ice Age | Freyalise cast the World Spell to end Dominaria's Ice Age. | [Wizards — Dominaria United We Stand, Part 1](https://magic.wizards.com/en/news/making-magic/dominaria-united-we-stand-part-1) — **corroborated**. |
| 04 — Weatherlight | Yawgmoth's resurrection spell kept Squee alive, but in the 2022 renewal of the Phyrexian threat he chose to return for *one final life*, not endless regeneration. | [Wizards — Death and Salvation](https://magic.wizards.com/en/news/magic-story/death-and-salvation-2022-08-16) — **corroborated; continuity correction applied**. The story also establishes Ertai's involvement and the Salvation Sphere's role. |
| 05 — Otaria | Jeska became Phage after Kamahl's wound; Akroma, Phage, and Zagorka merged into Karona; and Jeska's spark ignited when Karona was divided. | [Wizards — Legendary Characters of Commander Legends, Part 1](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30) — **corroborated**. |
| 06 — Mending | Teferi spent his planeswalker spark repairing Shiv's rift, while Zhalfir remained inaccessible. | [Wizards — Return to Dominaria, Episode 7](https://magic.wizards.com/en/news/magic-story/return-dominaria-episode-7-2018-04-25) — **corroborated**, distinguishing the restoration of Shiv from the unresolved fate of Zhalfir. |
| 07 — Three Planes | Griselbrand tricked Avacyn into the Helvault; Thalia opened it, releasing both Avacyn and Griselbrand. | [Wizards — Commander Masters Storyteller, Part 1](https://magic.wizards.com/en/news/making-magic/commander-masters-storyteller-part-1) — **corroborated**; this is a retrospective overview, not original block fiction. |
| 08 — War of the Spark | Ral successfully shut down the Interplanar Beacon, ending its summons without preventing ordinary arrivals. | [Wizards — War of the Spark: Ravnica, Desperate Operatives](https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-desperate-operatives-2019-05-29) — **corroborated**. |
| 09 — New Phyrexia | Wrenn's intervention moved Zhalfir into New Phyrexia's place, contributing to the downfall of Norn's invasion. | [Wizards — March of the Machine, Episode 9](https://magic.wizards.com/en/news/magic-story/episode-9-the-old-sins-of-new-phyrexia) — **corroborated**. Chapter 09 now also acknowledges Squee's 2022 experience without treating it as a Weatherlight-era event. |
| 10 — Omenpaths | Oba was responsible for the Karlov Manor murder conspiracy, whereas Cim and Ses did not knowingly direct her actions. | [Wizards — Murders at Karlov Manor, Episode 9](https://magic.wizards.com/en/news/magic-story/episode-9-beauty-in-destruction) and [Episode 10](https://magic.wizards.com/en/news/magic-story/episode-10-roots-of-decay) — **corroborated**. |

## Corrections made in this patch

1. **Squee's status and chronology:** Update the Weatherlight retrospective, Chapter 09, character profile, and event record to distinguish centuries of involuntary resurrection from his later choice of one finite life. The original era's events remain in Chapter 04; the later change is described as a retrospective and linked in Chapter 09.
2. **Character-to-event participation:** In the Squee event, use Ertai instead of Karn. *Death and Salvation* directly depicts Ertai's actions; Karn does not take part in that scene. This is a specific attribution correction, not a change to Karn's role in the Legacy.
3. **Source traceability:** Add the specific 2022 story to Chapter 09's official bibliography.

## Open audit work — not verified by this patch

- Compare each event's complete narrative and character biography against the relevant original fiction, chapter by chapter. The table covers only selected key claims.
- Independently check every curated printing (set code, collector number, Scryfall UUID, credited artist, and art-to-event fit); the offline checks currently enforce internal consistency, **not** Scryfall truth.
- Verify all external bibliography URLs and whether each cited text supports the adjacent narrative statements. An HTTPS-format check does not detect removed pages or misleading citations.
- Revisit ambiguous dates and contemporaneity between planes; do not infer a universal calendar from publication order.
- Apply reviewed corrections in small patches and document primary versus retrospective sources separately, rather than silently rewriting scenes from secondary summaries.
