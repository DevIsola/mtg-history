# Wave 2J — Provenance expansion across historical eras

## Scope and guarantees

Expands the curated **event-level** source provenance ledger from **6 to 18 reviewed events**, out of 133 existing events (13.5% coverage). This is a second **editorial source-review batch**; it does not independently certify all narrative claims or establish that the remaining 115 events have been fact-checked.

Each review identifies a narrowly supported claim, an official Wizards publication **already present in that chapter's bibliography**, whether that source is a story, retrospective, or design commentary, and a conservative in-world chronology note. Publication dates are not converted to in-world dates. Card artwork is explicitly distinguished from evidence about actions and timelines.

No chapter, historical event, character, relationship, printing, or chapter-card reference is created or renamed. Existing cardinality gates remain: **10 chapters, 88 characters, 133 events, 118 relationships, 133 unique printings, 135 chapter card references**.

## Wave 2J entries

| Chapter | Event | Narrow supported claim |
| --- | --- | --- |
| `thran` | `rise-of-yawgmoth` | Explains that Rebbec brought the physician Yawgmoth to Halcyon and his rise culminated in the Thran civil war. |
| `brothers-war` | `brothers-koilos-stones` | Lists splitting the powerstone as a pivotal childhood event that drives the brothers toward rivalry. |
| `brothers-war` | `sylex-blast` | Shows Kayla and Tawnos reckoning with the destruction of Argoth and worsening climate after the war ended. |
| `ice-age` | `alliance-against-lim-dul` | Identifies Jodah and Jaya as instrumental in uniting Kjeldoran and Balduvian factions against Lim-Dûl. |
| `weatherlight` | `weatherlight-barrin-obliteration` | States that Barrin cast a forbidden destructive spell at the occupied Tolarian Academy after losing Rayne and Hanna, killing himself. |
| `otaria` | `mirari-crisis` | Explains that the Mirari tempted wielders with extraordinary power and desires, repeatedly leading users toward ruin and magical chaos. |
| `mending` | `the-mending` | Explains that the Mending story fundamentally reduced and changed planeswalkers’ power as part of repairing a threatened Multiverse. |
| `many-worlds` | `innistrad-avacyn-restored` | Confirms that destroying the Helvault released both Avacyn and Griselbrand, the trapped angel and demon. |
| `war-of-the-spark` | `spark-gideons-sacrifice` | Depicts Gideon falling amid the confrontation with Bolas and later characters acknowledging his death; this source does not alone detail the protective transfer. |
| `march-of-the-machine` | `phyrexia-realmbreaker-invasion` | Describes Norn opening portals to multiple planes through Realmbreaker as the Phyrexian invasion spreads. |
| `march-of-the-machine` | `phyrexia-norns-fall` | Directly narrates Karn dismantling Elesh Norn as he accepts responsibility for the fate of his created plane. |
| `omenpaths` | `omenpaths-proft-uncovers-oba` | Shows Proft accusing Oba of orchestrating the murders and distinguishing the willing perpetrator from coerced participants. |

## Limits of source interpretation

- *The Brothers' War — Episode 1: The End* is a **postwar narrative**. It directly documents the destruction's aftermath but is not used to invent a date for the Sylex activation.
- *Act of War, Part 1* is **design commentary** on the storyline's act structure, not an eyewitness account of the brothers splitting the stones.
- *War of the Spark: Ravnica — Ashes* documents Gideon's death in the battle. It is **not, by itself, a detailed explanation of the protective transfer** from Liliana; the entry says so explicitly.
- *From the Vault: Lore* is retrospective: its overview supports a general Mirari influence, not the precise motives of every person who pursued it.
- All entries use `relative` rather than a specific AR year, even where individual source narratives mention years for scenes outside the indexed event.
- Sources from a designer's column are labeled `design-commentary`, rather than primary fiction.

## Quality gates

Run:

```sh
node --test scripts/event-provenance-wave2i.test.mjs scripts/event-provenance-wave2j.test.mjs
pnpm run check:provenance
pnpm run verify
pnpm exec playwright test
```

Expected terminal summary: `Event provenance coverage: 18/133 reviewed event records; 0 integrity errors.`

Manual editorial acceptance: open representative event pages from each reviewed chapter, follow the official references, confirm narrowly supported claims, and visually inspect contextual printing and source displays. Source-link and bibliography integrity are checked offline. External article access and canon accuracy require separate review.

## Subsequent work

Scale reviews in further limited batches, prioritizing narrative conflicts and dates with primary published fiction; separately inventory events still lacking event-level citations. Avoid turning this 18-record ledger into a false general certification of 133 records.
