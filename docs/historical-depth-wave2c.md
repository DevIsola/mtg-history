# Historical depth — Wave 2C: Otaria's long consequences

Baseline: `main` after merged PR #90 (10 chapters / 88 characters / 129 events / 118 relationships).

## Purpose

The chapter already records the Mirari's principal owners and the transformations of Jeska. This increment expands the **reader-facing historical interpretation** with six additional subsections and enriches four existing character biographies. It distinguishes distinct institutions, primary events, later legacies, alternate-reality depictions, and the historical significance of the printed cards. It adds no invented timeline events and does not multiply entity IDs.

## Source anchors

- [Wizards — Quite Some Characters](https://magic.wizards.com/en/news/making-magic/quite-some-characters-2020-11-09) distinguishes Kamahl's red and green incarnations, Ixidor and Akroma, Phage, and the composite Karona; it treats later Akroma cards as retrospective or alternate designs.
- [Wizards — Kamahl, Heart of Krosa](https://magic.wizards.com/en/news/card-preview/kamahl-heart-krosa-2020-10-28) confirms the Mirari's influence, the wound to Jeska, Thriss's mentorship, and the later Kamahlite order.
- [Wizards — Commander Masters Storyteller, Part 1](https://magic.wizards.com/en/news/making-magic/commander-masters-storyteller-part-1) explains Chainer's original Torment role and the rules portrayal of dementia summoning.
- The existing Otaria chapter and entity sources retain novel-era event details, card significance and secondary editorial context.

## Safeguards

- **No new printings, art claims or chapter card uses.** 133 canonical printings and 135 uses remain unchanged.
- The original Legions Akroma remains distinct from the alternate Planar Chaos interpretation.
- Gameplay abilities are identified as adaptations of fiction, not literal accounts of scenes.
- Karn's original intent in creating the Mirari is not treated as knowledge available to Otaria's inhabitants.
- The three phases of Jeska's transformation remain chronological and do not become separate people.
- The hard cardinality gates remain 10 / 88 / 129 / 118; character IDs and original featured-card IDs are preserved.

## Windows acceptance

```powershell
node --test scripts/otaria-lore-depth-wave2c.test.mjs
pnpm run verify
pnpm exec playwright test
pnpm run review:artwork --gallery "$env:USERPROFILE\Downloads\mtg-artwork-review.html"
Start-Process "$env:USERPROFILE\Downloads\mtg-artwork-review.html"
```

After verification, review the Otaria chapter on mobile and desktop, its four expanded character pages, and the adjacent Mending chapter. Confirm section hierarchy, references and Scryfall credits before merging.
