# Wave 2T — Thran historical depth (editorial acceptance)

## Change scope

Expands `src/content/chapters/thran.mdx` **inside its existing thirteen-part narrative**, rather than adding unreviewed JSON events or pretending an uncurated card has been approved. Three narrative additions introduce Rebbec's architectural philosophy, Dyfed's visit with Yawgmoth to Pyrulea, and Glacian's divergent technical legacies. A fourth subsection distinguishes ancient Pyrulea from the `Invasion of Pyrulea` card issued for *March of the Machine* in 2023.

The archival scope is unchanged: ten chapters, 88 characters, 133 historical events, 118 relationships, 133 exact printing records, 135 curated chapter-card uses (including six in Thran), and 43 event-level source reviews as of the baseline. No new event ID, character ID, card printing, or edited image is introduced by this PR.

## Grounding and source boundaries

| Historical assertion | Directly relevant official source | Limitation |
| --- | --- | --- |
| Rebbec's Architecture of Ascension and floating Thran Temple at Halcyon | [The Legendary Characters of Commander Legends, Part 1](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30) | Architectural symbolism and vertical inequality are **editorial interpretation**, not quoted authorial intention. |
| Dyfed took Yawgmoth to Pyrulea, a forest world inside a sphere | [The Known Multiverse](https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19) | This retrospective does not independently provide the full *The Thran* scene or an AR date. |
| The Pyrulea visit demonstrated Dyfed's ability to planeswalk | [Choosing Your Battles, Part 3](https://magic.wizards.com/en/news/making-magic/choosing-your-battles-part-3) | A **design retrospective**, not a full transcription of *The Thran*. |
| *Invasion of Pyrulea* (2023) belongs to a later fictional era | [Choosing Your Battles, Part 3](https://magic.wizards.com/en/news/making-magic/choosing-your-battles-part-3) | Card art is not proof of the ancient Dyfed/Yawgmoth encounter; no new printing is curated. |
| Glacian's experiments informed both later Dominarian and Phyrexian artifice | [The Legendary Characters of Commander Legends, Part 2](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-2-2020-11-06) | A shared technical lineage does **not** establish responsibility, intention, a particular blueprint, or a precise chronology. |

The novel *The Thran* (J. Robert King, 1999) remains in the chapter bibliography. Its full text has **not** been independently examined for this PR; no unpublished novel dialogue, page numbers, or exact event dates have been invented.

## Reader and visual acceptance

1. Confirm the *Architecture of Ascension* subsection sits after the powerstone section and before Yawgmoth's arrival.
2. Confirm Dyfed's Pyrulea scene is separate from the artificial Phyrexian plane, and the two are never conflated.
3. Confirm the *Invasion of Pyrulea* reference is labeled as a later 2023 printing and is **not** added to the curated Thran artwork ledger.
4. Confirm the technical-inheritance discussion appears after the Koilos stone-recovery context, without implying that Glacian planned either the Brothers' War or Phyrexian compleation.
5. Compare the existing six Thran cards and captions against their previously approved significance and artwork classifications; no historical image was replaced.
6. Check mobile chapter headings, glossary keyboard access, and card links in both themes.

## Mac verification

```sh
node --test scripts/thran-historical-depth-wave2t.test.mjs
pnpm run check:editorial && pnpm run check:artwork && pnpm run check:content
pnpm run verify && pnpm exec playwright test
```

The first task validates deterministic editorial anchors and the original six printing IDs; only the complete local pipeline can validate the real Astro collection, accessibility and browser behavior. In a future PR, `Invasion of Pyrulea` can be proposed as an additional *contextual* image, but only after exact Scryfall-ID, artwork-scene, and significance checks.
