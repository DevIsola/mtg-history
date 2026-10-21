# PT-BR Phase 5 — Thran editorial-depth parity

This phase expands the Thran Portuguese **condensed reading edition** from thirteen major sections to the English chapter's full **thirteen-major / eleven-subsection editorial outline**. The new subsection passages cover Rebbec's architecture, Yawgmoth's route to political authority, the social complexity of the civil war, containment rather than restoration, the distinct history of Glacian's powerstone implant, Pyrulea's separate journeys and later invasion card, archaeological context, and the branching traditions of Thran artifice.

## Source and identity boundaries

- The canonical English chapter is still `src/content/chapters/thran.mdx`; no chapter frontmatter, authored history, cards, character records, event records, or bibliography entries are changed.
- The Portuguese reading page continues retrieving `chapter.data.cardIds[0..5]` and `chapter.data.sources`. It neither copies UUIDs nor changes the identity or order of illustrated references.
- All nine English `<HistoricalEventReference>` IDs are surfaced as direct links to the canonical English event pages, with `hreflang="en"`.
- The cross-lingual editorial outline is checked automatically against the **actual published English MDX headings**, so new or reordered English sections cause a test failure until Portuguese coverage is reviewed.
- Outline parity and source-reference coverage are **structural** checks only: they are not evidence of sentence-level completeness, literary equivalence, or independent primary-source verification. The Portuguese chapter remains explicitly labeled **not a full translation** and must not advertise a reciprocal chapter `hreflang` alternate.

## Acceptance

Run `node --test scripts/pt-thran-depth.test.mjs scripts/pt-thran.test.mjs`, `pnpm run verify`, then `pnpm exec playwright test`. Visually review `/mtg-history/pt-br/chapters/thran/` on mobile and desktop, inspect the nine event links and six Scryfall printings, and compare the new Portuguese editorial subsections against their English counterparts.

Before an eventual full-translation release, complete paragraph-level editorial comparison and terminology/style review, then explicitly approve equivalence; only then is reciprocal chapter `hreflang` appropriate. The next milestone is **full textual translation parity and reviewed language alternates**, not the remaining nine chapter adaptations.
