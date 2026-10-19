# Historical Depth — Wave 2A: Structured Canonical Context

This patch expands **ten existing canonical event records and ten existing character profiles**, one curated pair per chapter. It does **not** claim to add new named people or chronological events in the historical canon; new entities need a separate source-and-artwork review. It adds 60 substantial narrative and biographical paragraphs within the existing Astro content collections. The fields are unchanged, and existing printing IDs and event/character cross-links stay intact.

## Editorial guardrails

- New paragraphs are explanatory interpretations of the same stories rather than assertions of newly discovered scenes.
- A historical event printing can illustrate a participant without literally depicting the event. Do not silently reclassify artwork.
- Characters and events remain in the same chapter collections, and all IDs are preserved. `check:entities`, `check:content`, `check:cards`, `check:artwork`, and Astro Zod validation remain authoritative.
- These structured descriptions are meant to support the directory and event pages. They complement, rather than copy or replace, the expanded chapter prose from Wave 1.
- Where the historical record is retrospective, distinguish the account available to participants from what later stories reveal. Avoid claiming unavailable first-person knowledge.

## Curated review pairs

| Chapter | Event | Character | Editorial focus |
| --- | --- | --- | --- |
| Thran | Dyfed's portal | Rebbec | Access versus creation of Phyrexia; the seal |
| Brothers' War | Fall of Kroog | Kayla | Survivors, statecraft and testimony |
| Ice Age | World Spell | Freyalise | Supernatural winter and consequences of the thaw |
| Weatherlight | Serra's Realm | Radiant | Evacuation, guardianship and coerced decline |
| Otaria | Kirtar and the Mirari | Lieutenant Kirtar | Institutions and the temptation of certainty |
| Mending | Karn heals Tolaria | Venser | Rift repair and the new planeswalker generation |
| Many Worlds | First Guildpact breaks | Agrus Kos | Legal paradox and system collapse |
| War of the Spark | Dovin captures Azorius | Dovin Baan | Institutional capture before an invasion |
| March of the Machine | Urabrask dissents | Urabrask | Factional differences within New Phyrexia |
| Omenpaths | Ravnica investigation | Alquist Proft | Evidence, coercion and post-invasion trauma |

## Primary and existing reference anchors

- [The Legendary Characters of Commander Legends, Part 1](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30): Rebbec and Radiant.
- [The Brothers' War, Episode 1: The End](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-1-the-end): Kayla, Kroog and Penregon.
- [The Brothers' War, Chapter 2: Antiquities](https://magic.wizards.com/en/news/magic-story/the-brothers-war-chapter-2-antiquities): retrospection and the consequences of Kroog.
- [The Known Multiverse](https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19): artificial planes and Serra's Realm.
- [Ravnica, Then and Now](https://magic.wizards.com/en/news/feature/ravnica-then-and-now-2012-08-29-0): Szadek, Kos, Augustin IV and the Guildpact paradox.
- Existing character source URLs and chapter source lists cover Freyalise, Venser, Phyrexia and Omenpaths. Older novel-specific details still need book-level human canon review before additions to the entity graph.

## Acceptance

1. Run `node --test scripts/structured-entity-depth.test.mjs`.
2. Run `pnpm run verify && pnpm exec playwright test`.
3. Read the character and event pages on desktop/mobile; review narrative voice and source consistency.
4. Verify exact printing and artwork fidelity with the existing offline gate, then perform manual visual inspection where interpretation is uncertain.
5. Do **not** adjust hardcoded content totals: the counts remain 10 / 87 / 125 / 116 because this wave enriches existing records. A later Wave 2B can add new entities after selecting licensed/attributed exact artwork references and independent primary sources.
