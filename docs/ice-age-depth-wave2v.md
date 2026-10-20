# Wave 2V — Civil institutions, Sarpadia and the long winter

## Editorial scope

This change deepens the already extensive **The Dark and the Ice Age** chapter with four discrete perspectives. The first connects the 69 AR Penregon siege to the social cost of prohibiting artifice. The second distinguishes Icatia's Farrelites from Vodalia's homarids. The third explains how *Fallen Empires* game mechanics evoke thallid and thrull populations without becoming independent proof of in-world dates. The fourth describes the work behind Jodah and Jaya's cross-faction cooperation. The existing 11 chapter printings, 12 existing event references, all event/character/relationship IDs, and the broader fictional chronology remain unchanged.

## Source boundaries and evidence tiers

1. [The Brothers' War — Episode 2: The Beginning](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-2-the-beginning), official narrative. The **69 AR Penregon** siege and the tension between Tawnos's civic machinery and Talite anti-artifice belong to one postwar city. The account is not an exhaustive catalogue of Dark Age communities.
2. [Faction Packed](https://magic.wizards.com/en/news/making-magic/faction-packed-2018-10-15), Mark Rosewater, 2018, existing chapter bibliography. **Design retrospective**, not primary historical fiction. It names the five Sarpadian monocolor powers and their respective pressures: Farrelites, homarids, thrulls, goblins/orcs, and thallids. It does not fix their collapse to a synchronized date.
3. [The History of Tokens, Part 1](https://magic.wizards.com/en/news/making-magic/the-history-of-tokens-part-1), Mark Rosewater, 2025, **new chapter bibliography entry**, design retrospective. Explicitly discusses *Fallen Empires* thallid spore counters creating Saproling tokens and *Breeding Pit*'s upkeep cost. These are informative ludonarrative analogies, not a direct scene of thallid invention, thrull rebellion, or their relative dates.
4. [The Legends You'll Find in Dominaria United](https://magic.wizards.com/en/news/feature/legends-youll-find-dominaria-united-2022-09-01), Roy Graham, 2022, existing bibliography. Broad character retrospective describing Jodah and Jaya's role in bringing together Kjeldoran and Balduvian rivals against Lim-Dûl, with later Argive nationhood. It does not specify the signing of a treaty, a universal year, or a continuity identity with Urza's ancient Argive polity.

## Manual acceptance

- Read the four subsections in their existing chapter flow; check that they do not duplicate the adjacent historical analysis.
- Confirm that the new source title and exact HTTPS URL appear once in the bibliography, and the old book entries remain intact.
- Keep mechanics-as-metaphor explicitly distinct from canonical narrative assertions; no use of newer publication years as in-world dates.
- Inspect the eleven existing chapter images, sources and event links. No card was added or reclassified in the artwork ledger.
- Run `node --test scripts/ice-age-depth-wave2v.test.mjs`, `pnpm run verify && pnpm exec playwright test`, and inspect the chapter on mobile and desktop before merging.

Expected totals remain **10 chapters, 88 characters, 133 events, 118 relationships, 133 canonical printings, 135 chapter card uses**, and **43 event provenance reviews**. The bibliography increases by exactly one item, from **133** to **134** chapter source references assuming the upstream Wave 2U count.
