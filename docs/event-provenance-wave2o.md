# Wave 2O — Primary fiction and claim-level limits

## Scope

This increment deepens the **existing** Venser and Freyalise source reviews, adds one new source-backed event record for the failed Seedcore mission, and corrects the Seedcore sequence. Coverage becomes **43 of 133 events**; the remaining **90** still await claim-level provenance. Ten chapters, 88 characters, 133 events, 118 relationships, 133 unique printings and 135 chapter card uses remain unchanged.

Primary narrative support is prioritized where available. Neither publication date nor release year is converted into an in-world year, and the event’s exact *Nissa, Ascended Animist* printing is a compleation portrait, not artwork depicting the Sylex decision.

## Seedcore: separated canonical actions

The original event compressed the team's corruption, Realmbreaker's opening and Elspeth's departure. Two consecutive **primary fiction** accounts provide a better reconstruction:

1. **Assault on New Phyrexia — Episode 4: Impossible Odds:** the team reaches the Seedcore after Realmbreaker's connections begin; Elspeth, Jace, Kaya, Kaito, Koth and their allies have already suffered grave losses. The first connection is no longer preventable.
2. **Assault on New Phyrexia — Episode 5: Inevitable Resolutions:** Jace attempts to activate the new Sylex. Kaya and Kaito worry that the blast would propagate into worlds connected by the tree. Elspeth intervenes, takes the activated Sylex and vanishes with it. The fiction describes a destination **beyond the Blind Eternities**, but does not show the device detonating inside the Seedcore.

Both article URLs now belong to the event chapter's official bibliography, and the provenance ledger cites their **bounded** support. This is a correction of narrative sequence and causal risk, not a new event, new printing, or claim that Elspeth stopped the invasion.

## Venser: primary-fiction review outstanding

The official [Venser character page](https://magic.wizards.com/en/story/venser-planeswalker) confirms his teleportation talent and subsequent planeswalker spark. [A Double Take, Part 1](https://magic.wizards.com/en/news/making-magic/a-double-take-part-1) explicitly says the character was designed to transition from a non-planeswalker into a post-Mending planeswalker. Neither internet article recounts the **specific divergent-Dominaria scene** in the event narrative. The event makes that evidence gap visible. Comparing the *Time Spiral*, *Planar Chaos* and *Future Sight* novel text remains a manual primary-source task; the existing chapter bibliography contains those books, but their contents have not been independently checked here.

## Freyalise: site-specific detail remains unresolved

The official [Freyalise biography](https://magic.wizards.com/en/story/freyalise-planeswalker) confirms her sacrifice in defense of her people against a catastrophe threatening Dominaria. It **does not** name Skyshroud or state the exact rift location. The event now explicitly qualifies this narrower public evidence; no invented source or year is added. Review the Time Spiral block primary fiction before certifying the location-specific detail.

## Validation

```sh
node --test scripts/event-provenance-wave2o.test.mjs
pnpm run check:provenance
pnpm run audit:history
pnpm run verify && pnpm exec playwright test
```

Expected offline totals: **43/133 reviewed**, **90 awaiting review**, and zero provenance integrity errors. Source URL/bibliography integrity is verified offline, but accurate source interpretation and literal artwork fidelity still require manual review. Neither external link reachability nor primary novel text is verified by the CI checks.
