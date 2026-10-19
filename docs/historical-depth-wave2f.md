# Historical depth — Wave 2F: Three planes, three distinct decisions

Baseline: `main` after PR #93 (10 chapters / 88 characters / 130 events / 118 relationships / 133 printings / 135 curated uses).

## Editorial scope

This increment adds three separate, source-grounded historical events to the *Stories Across the Planes* chapter and deepens four existing character biographies. The focus is on important decisions that the existing narrative mentioned without treating them as independently indexed events. Ravnica, Zendikar and Innistrad have **different fictional calendars**; their appearance in one chapter does not mean the events were simultaneous.

### Ravnica: negotiated order after a magical constitution

The original Guildpact collapses during Agrus Kos's investigation. Later crises, including Project Kraj, precede Teysa Karlov's proposed nonmagical accord. Teysa's original *Guildpact* printing is a retrospective character portrait for this subsequent negotiation, not an illustration of a treaty-signing ceremony. The agreement must not be conflated with the later Living Guildpact.

Source: [Wizards — Ravnica, Then and Now](https://magic.wizards.com/en/news/feature/ravnica-then-and-now-2012-08-29-0).

### Zendikar: choosing a prison before constructing it

Ugin proposed containment; Nahiri initially resisted sacrificing her home world's safety; Sorin joined the undertaking. Her eventual choice preceded decades of building hedrons and the titans' subsequent imprisonment, and is separate from the much later Eye of Ugin rupture. The curated 2019 Nahiri portrait is retrospective, not an illustrated scene of the ancient consultation.

Source: [Wizards — The Lithomancer](https://magic.wizards.com/en/news/magic-story/the-lithomancer) (originally published 2014).

### Innistrad: the act of breaking the Helvault

Thalia broke the Helvault after Liliana threatened the cathars under her command. Griselbrand was Liliana's target, and Avacyn's release an unintended consequence. The existing *Helvault* artifact card is not scene-specific art. Thalia is explicitly named in the prose but cannot appear as a structured character reference until her own canonical collection entry has been researched and curated.

Sources: [Wizards — The Lunarch Inquisition](https://magic.wizards.com/en/news/magic-story/lunarch-inquisition-2016-05-04); [Planeswalker's Guide to Avacyn Restored, Part 2](https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-avacyn-restored-part-2); [You Had Me at Helvault](https://magic.wizards.com/en/news/making-magic/you-had-me-helvault-2012-03-29).

## Integrity guarantees

- Adds **three** events: expected totals 10 chapters, 88 characters, 133 historical events, 118 relationships.
- Maintains 133 canonical Scryfall printings and 135 chapter card uses without downloading or rehosting artwork.
- No invented in-world numerical dates or false card-scene attributions.
- Appends new event imports to the generated compatibility adapter; no previously curated event ID changes.
- Preserves existing printed character identities and historical attribution.

## Windows review

```powershell
node --test scripts/many-worlds-canon-wave2f.test.mjs
pnpm run verify
pnpm exec playwright test
pnpm dev
# Inspect /mtg-history/chapters/many-worlds/ and the three new event pages
```

Before merge, confirm the three reference blocks appear in historical order; inspect character biographies for Teysa, Nahiri, Griselbrand and Liliana; confirm that the selected card imagery is never presented as literal evidence of an unpainted event.
