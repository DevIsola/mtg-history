# Wave 2G — historical reading paths

## Intent

The ten chapters are arranged in an **editorial reading order**, not a globally synchronized clock. Wave 2G makes meaningful relationships visible without inventing new historical records or moving a plot point out of its own chapter. Four curated reading paths provide a guided cross-chapter itinerary, while the existing Previous/Next controls continue to serve sequential reading.

## Content and evidence

Each step names an existing `events` collection ID within the exact chapter already assigned to that event. All historic claims are intentionally narrow and based on the existing chapter narratives and sources:

- **The long shadow of Phyrexia:** the Thran, the Brothers' War, the Weatherlight invasion, and the New Phyrexian attack. Source material is documented in `thran.mdx`, `brothers-war.mdx`, `weatherlight.mdx`, and `march-of-the-machine.mdx`. Yawgmoth's defeat is not equated with the later fall of New Phyrexia.
- **Jeska's rebirths:** the transformation at the end of Otaria's story and the final sacrifice of the Mending, as told in `otaria.mdx` and `mending.mdx`. Jeska, Phage, and Karona are distinct phases rather than independent characters.
- **Ravnica's orders:** the first Guildpact's collapse, Nicol Bolas's invasion, and a later post-invasion criminal conspiracy. Sources are in `many-worlds.mdx`, `war-of-the-spark.mdx`, and `omenpaths.mdx`. No precise interplanar synchrony is assumed.
- **Changing boundaries:** Freyalise's World Spell, the Mending, Realmbreaker, and the Omenpaths. This is a thematic comparison of **different** historical mechanisms, not a purported shared spell or common cause.

The curated record is `src/data/history-paths.mjs`. This version adds no new chapter frontmatter, event IDs, relationship edges, Scryfall images, or card attributions. Cardinality gates therefore remain at the latest merged totals.

## Engineering

- `validateHistoryPaths` is a pure function that rejects missing or mismatched event/chapter references, repeated steps, duplicate paths, and superficial interpretation.
- The `/paths/` page validates again at Astro build time against the actual content collections. Broken routes cause a build error, rather than silent navigation failures.
- Every published chapter automatically shows the relevant reading-path follow-ups. The hub provides chapter and event links and exposes chronology cautions.
- Links use the GitHub Pages base-path helper and ordinary HTML anchors. No JavaScript, account state, browser storage, added dependency, or external API is necessary.
- Accessible landmarks, keyboard focus states, and mobile-readable cards are part of the implementation.

## Windows acceptance

```powershell
node --test scripts/history-paths-wave2g.test.mjs
pnpm run verify
pnpm exec playwright test
```

Then inspect `/mtg-history/paths/` and the Thran, Otaria, Ice Age, Many Worlds, and Omenpaths chapter pages on desktop and mobile. Follow a route all the way through its events and chapters. Confirm that the historical cautions distinguish thematic comparisons from chronological sequences. This is an editorial acceptance step, not a request to relabel card art.
