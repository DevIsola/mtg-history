# Card-art-to-history fidelity — Chapters 01–10

**Repository baseline:** `main` after PR #67, commit `f95109c06ae0ff653236090882df03dac0b6195b`.

## What was reviewed

This pass classifies **all 135 chapter card uses** in [`artwork-fidelity-ledger.tsv`](./artwork-fidelity-ledger.tsv), including three specific printings legitimately reused across separate chapters. The ledger pairs every chapter/card title with a conservative statement of what its illustration supports and, just as importantly, what it **does not** establish about an event.

The classifications are: `portrait` (depicts a person or creature, not automatically an event); `object` (depicts a site, device, or artifact); `scene` (intended narrative moment or battle); and `symbol` (theme, spell, or institutional effect). Temporal descriptors distinguish contemporary-to-chapter publication, retrospectives, reused printings, foreshadowing, and earlier art reused to discuss a later conflict (`cross-era`).

**Evidence matters.** `context-assessed` means the editorial description, card identity, and story setting were assessed together; the actual pixels of that individual printing have **not** all been visually inspected. `source-confirmed` is used only where an official source explicitly links the art to the described narrative moment. `visual-checked` marks a picture visually reviewed in this pass. The existing live provenance report confirmed **132 of 132 Scryfall IDs returned**, subject to the corrections merged in PR #67, but a valid printing ID cannot validate the semantics of an image. **Do not interpret 135 classified rows as 135 visually certified scenes.**

## How to view every exact illustration

```bash
pnpm run check:artwork
pnpm run review:artwork --gallery "$HOME/Downloads/mtg-artwork-review.html"
open "$HOME/Downloads/mtg-artwork-review.html"
```

The optional HTML gallery reads your current chapter metadata and ledger to show the **exact Scryfall print** alongside its existing significance and the independent editorial note. It obtains images from Scryfall when opened and does not store image files in the repository. Check visually whether an image directly depicts the claimed incident; then revise the specific ledger entry and, when necessary, the MDX `significance` and corresponding `HistoricalMoment` prose. No claim is automatically upgraded to image-verified by merely generating the gallery.

## Confirmed findings and editorial guardrails

- *Brotherhood's End* illustrates the early conflict that caused Tocasia's death. Wizards' [Act of War, Part 1](https://magic.wizards.com/en/news/making-magic/act-of-war-part-1) explicitly describes its purpose. This is a legitimate narrative-scene example; the 2022 print is retrospective to the ancient war.
- *Vindicate* (`apc/126`) features forceful destruction imagery, not an independently established painting of the exact instant Gerrard died. Its flavor quotation and the Weatherlight narrative connect it thematically to the Legacy's conclusion. The chapter's significance should not imply a witnessed Gerrard-sacrifice scene.
- *Gideon's Sacrifice* and *Spark Harvest* are strong War of the Spark story-spotlight examples, whereas *Tezzeret, Master of the Bridge* and *Ral, Storm Conduit* are **character portraits**; they do not by themselves depict operation of a particular machine or beacon.
- *Urza's Sylex* illustrates the artifact, while *The Fall of Kroog* is used to evoke a destructive narrative event. The difference between illustrating an object and narrating its deployment is essential.
- Retrospective portraits (*Jeska, Thrice Reborn*, *Mairsil, the Pretender*, *Nahiri, the Harbinger*) must not be represented as original printings from the historical block they discuss.
- Story Battle/Adventure cards (*Invasion of Kaldheim*, *Invasion of New Phyrexia*, *Kellan, the Fae-Blooded*, *Kellan, Inquisitive Prodigy*) have distinct faces; the gallery shows the front face and the canonical provenance audit already checks exact multi-face identity.

## Automated checks and limitations

`pnpm run check:artwork` is an **offline completeness safeguard**. It fails if a chapter card is missing from the ledger, the ledger refers to a deleted card, the same card is recorded twice in a chapter, or a review row has an unknown classification or an empty note. This is added to `pnpm run verify`, and regression tests cover the behavior. It does **not** make an image-based judgment, verify external art pixels in CI, or claim to settle disputed lore interpretations.

The manual gallery is the review surface for remaining pixel-level judgments. A final individual-image sign-off would require actually viewing each of the 135 displayed printing images and, for disputed scenes, checking original Wizards story or art-direction material. Preserve the distinction between scene, subject, retrospective art, and interpretation in any future chapter expansion.

## Summary

- Ledger: **135/135** curated chapter references classified.
- Direct scene classifications: **9**; these are *candidate* narrative-scene illustrations, not all certified at image level.
- Other cards: portraits, sites/objects, and symbolic illustrations explicitly distinguishable from event depictions.
- All remaining visual sign-off is discoverable in the generated local gallery rather than silently assumed complete.
