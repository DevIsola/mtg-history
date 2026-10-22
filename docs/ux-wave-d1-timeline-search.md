# UX Wave D1 — timeline editorial hierarchy and search palette result layout

## Deliverables

- Timeline historical eras retain their established curated order, search/filter controls, event references and two separate time axes: story period versus real-world publication.
- One **exactly resolved** chapter card printing is placed alongside the era overview. Card identity is the canonical Scryfall UUID from the typed chapter collection; full-card imagery, artist, printing number and chapter-specific significance are linked. These images are illustrations, **not** claims that the pictured artwork is a literal scene of every linked event.
- The layout trades repetitive boxed cards for an editorial timeline with structured historical bands, contextual illustration, and compact event rows. Below 900 px it folds to a single main column. Controls retain no-JavaScript fallbacks.
- Global Pagefind search retains its query, limit, ranking, locale isolation, safe URLs and focus handling. Results now have consistent **record type → heading → two-line excerpt → opening affordance** presentation, using semantic text nodes rather than HTML injection.
- PT-BR localized card fetching remains a separate D2 implementation dependency as specified in `docs/pt-br-card-localization.md`; D1 does not silently replace historic printing identities or claim Portuguese artwork is already served.

## Acceptance

1. `pnpm run verify && pnpm exec playwright test` passes on macOS.
2. Review timeline at 1600, 1200, 900, 390 and 320 CSS pixels with dark and light themes.
3. Test era filter, keyword search, expand/collapse, in-page anchors and no-JavaScript event disclosures.
4. Validate 10 chapter illustrations' artist and exact printing links, ensuring the interpretation remains connected.
5. Search for `Yawgmoth` in English and `Phyrexia` in PT-BR; verify readable rows, correct locale, link destination, arrow keys and Escape.
6. Do not alter 10 chapters, 88 characters, 133 events, 118 relationships, or the 135 chapter illustration references.

## Roadmap

C3 search palette → **D1 timeline editorial design + search refinement** → D2 Illustrated Archive and PT-BR printing support → E1 Characters → E2 Relationships → F1 Home → F2 final QA → Phase 13 Living Chapters.
