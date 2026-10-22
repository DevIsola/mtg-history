# Phase 14A — Original-story evidence closure: Omenpaths

This is a source-bounded review, not an automatic certification of the whole chapter. The five previously queued Omenpaths events use story passages available directly on Wizards' site; all five retain their IDs, text, characters and exact card printings. A claim-level provenance record tracks what each cited original scene establishes, and separates editorial synthesis from exact fictional depiction.

## Five existing event records

| Event | Supporting original text | Review boundary |
| --- | --- | --- |
| `omenpaths-loot-and-the-future` | *Outlaws of Thunder Junction* Epilogue 2: Bring the End, Part 2 (2024) | Jace and Vraska discuss a renewed Multiverse and approach Loot as an individual; their plans are **their perspective**, not an objective endorsement. |
| `omenpaths-desparking-consequences` | *She Who Breaks the World* (2023), supported by *Doing the Aftermath* design commentary | Nissa experiences desparking and retained abilities after the invasion; other planeswalkers' experiences cannot all be inferred from one scene. |
| `omenpaths-thunder-junction-vault` | *Outlaws of Thunder Junction* Episode 6 (2024), plus Epilogue 2 | Oko's crew, Kellan's confrontation and the raid are directly depicted. Later Fomori context is not retroactive proof of every artifact's history. |
| `omenpaths-loot-discovered` | *Outlaws of Thunder Junction* Episode 6 | Jace, disguised as Ashiok, reveals the child in the chamber; the card portrait is **not** an illustration of the vault opening. |
| `omenpaths-thunder-crossroads` | *Outlaws of Thunder Junction* Episode 6 | The crew's diverse origins and the struggle over the vault are depicted; the broader economic interpretation is commentary rather than a universal historical law. |

Original story URLs and exact claimed support appear with the entries in `src/data/event-provenance.mjs` and the chapter bibliography. Do not substitute later summaries for those originals.

## Exact-printing visual review: The Kenriths' Royal Funeral

- Curated collection ID: `4569fb73-3555-4eb8-933a-130770dd56d1`, *March of the Machine: The Aftermath* (`mat`) #34, artist Manuel Castañón.
- Wizards' official announcement displays the card's artwork: `https://magic.wizards.com/en/news/announcements/a-first-look-at-march-of-the-machine`.
- Visible illustration: two crowned, armored funerary effigies lie together, surrounded by mourners and swords in a memorial setting. This supports depiction of **commemoration and grief**, not the circumstances, exact time or firsthand depiction of the Kenriths' deaths.
- The cited *Wilds of Eldraine* Episode 1 establishes the family's losses and the subsequent twin conflict. It must remain independent of any visual claim inferred from a card image.
- Keep the ledger's `basis` **`context-assessed`** until the maintainer checks the exact MAT #34 image and significance in `pnpm run review:artwork --gallery ...`, then explicitly accepts or corrects the category/interpretation. Generating a gallery or seeing a generic image search result is not automatic visual sign-off.

## Blocked historical questions (not in this wave)

The three ledgered questions require the original *Planar Chaos*, *Time Spiral*, and *War of the Spark: Ravnica* texts. Battle of Koilos separately requires *Invasion*. They are not eligible for source-reviewed promotion based on web retrospectives or fan plot summaries. *Gideon's Sacrifice* final visual sign-off depends on the unresolved `spark-gideons-sacrifice` claim. An existing manual classification of artwork is not evidence that the event's magical mechanism was verified.

## Structural roadmap decision

The New Phyrexian Invasion **remains one published chapter in the current data**, but the planned two-chapter split is recorded in `ROADMAP.md`. Do not alter chapter IDs or totals as an incidental consequence of this Omenpaths-only source PR. The split requires a standalone content migration after scope, redirects, tests and PT-BR companion impacts are inventoried.

## Acceptance

1. Run `pnpm run check:provenance`, `node --test scripts/phase14a-source-access.test.mjs`, `pnpm run verify`, and the full Playwright suite.
2. Run `pnpm run audit:roadmap` and `pnpm run audit:consolidation`: the five events should leave the unreviewed queue; all existing novel-dependent questions remain unresolved.
3. Open the canonical MAT #34 artwork; compare the memorial against the current `significance`, event narrative and ledger description; record manual acceptance separately.
4. Use strict `A11Y_ENFORCE=1` and no-JS keyboard checks as part of the baseline site quality review.
5. Do not claim the chapter is fully historically accepted merely because its event-record provenance reaches 12/12. Human acceptance still includes prose and image context.
