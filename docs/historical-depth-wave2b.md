# Historical Depth — Wave 2B: carefully scoped new entities

Baseline: merged main commit `1e48b5a20bffe76ee42f613d50b123025b20ee1f` (PR #89).

## Scope

- **1 new character:** Selenia; existing exact Tempest printing `9c1624f7-8275-46d3-ab7e-7b162e27593f`.
- **4 new historical events:** Loran recovers the Sylex, Urza commissions Tawnos to preserve testimony, Crovax releases Selenia, and Gerrard leaves the Weatherlight before the Rath rescue.
- **2 relationships:** Crovax–Selenia and Mirri–Selenia. Their category `rivalry` describes a tragic confrontation, **not consent or freely chosen enmity**.
- Distinct events link from the Brothers' War and Weatherlight chapters. The existing event `selenia-curse-crovax` now explicitly links Selenia.
- No new artwork printings or chapter cards: **133 canonical printings and 135 uses remain unchanged**.

Expected updated counts: **10 chapters, 88 characters, 129 events, 118 relationships**. Update both collection adapters and exact-count integrity checks together.

## Canon and artwork cautions

| Record | Primary Wizards source | Artwork classification |
| --- | --- | --- |
| Selenia, Crovax releases Selenia | [Weather(light) Report](https://magic.wizards.com/en/news/making-magic/weatherlight-report-2007-12-03) | *Selenia, Dark Angel* is an **actual portrait**, but not an image of her release |
| Selenia at Stronghold | [Time After Time Spiral](https://magic.wizards.com/en/news/making-magic/time-after-time-spiral-2021-03-15) | Existing portrait is contextual, not the death scene; alternate *Mirri the Cursed* is noncanonical to this timeline |
| Loran recovers the Sylex | [Act of War, Part 1](https://magic.wizards.com/en/news/making-magic/act-of-war-part-1) | *Urza's Sylex* shows the weapon **retrospectively**, not Loran's rescue |
| Tawnos carries the testimony | [Brothers' War, Episode 5](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-5-as-cruel-as-necessary) | *Tawnos, the Toymaker* is a **portrait**, not the instruction scene |
| Gerrard leaves the Weatherlight | [Weather(light) Report](https://magic.wizards.com/en/news/making-magic/weatherlight-report-2007-12-03) | *Gerrard Capashen* is a **portrait**, not the departure |

Do not infer extra chronology from the publication year or mechanics of any retrospective card. This patch does not add Loran as a character record because none of the already curated Brothers' War card prints depicts her as a named character. Adding her properly would require a new exact Scryfall printing, artwork ledger review, and expanded chapter context instead of mislabeling *Urza's Sylex* as Loran's portrait.

## Manual review gate

1. Verify each new event is distinguishable from the existing events `sylex-blast`, `brothers-kaylas-reconstruction`, `selenia-curse-crovax`, and `weatherlight-rescue`.
2. Read the novel-era distinctions against published fiction; Wizards retrospective design articles establish high-level chronology but do not replace complete novel adjudication.
3. Run `node --test scripts/canonical-wave2b.test.mjs`, `pnpm run verify`, and `pnpm exec playwright test`.
4. Open the Brothers' War, Weatherlight, Selenia profile, and four event pages on desktop/mobile. Check working graph links and art credits.
5. Run exact manual PR creation and CI/merge workflow; no release automation.
