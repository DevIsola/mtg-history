# Phase 15 — Approved editorial design revamp

Based on the seven approved homepage, chapter, timeline, Explore, character, archive and search mockups attached in Git Workflow Roadmap. The earlier design discussion requires responsive reader rails, visible Read / Explore / About and EN/PT controls, exact printing and evidence distinctions, one Pagefind search foundation, and metadata from real records.

## Implementation

- Compact dark header, paper surfaces, gold rules, large editorial headings and a single decorative landscape across banners. The existing Source Sans 3 and Fraunces Latin fonts preload to avoid late swaps moving the header and chronology. The generic landscape is explicitly identified on About and linked from the footer; it does not depict a canonical event, plane or character.
- Homepages: reading CTA, live collection totals, all eleven chapter links, topic cards, featured chapter printings and intact source/translation context.
- Chapter reader: real story/publication/section metadata, classic serif default, saved reader choices, responsive TOC/context and full-frame printing miniatures. The third reader rail continues to fold below the article at narrower widths.
- Timeline: filter space is reserved while JavaScript loads, with an inert pending state and a compact no-JavaScript fallback. A delayed-script browser check verifies the first era does not move when filters become active. An era rail and compact, credited full-frame printing beside the existing chronology and filterable event list. PT catalogs share the visual system and preserve their current language boundaries.
- Explore: collection tiles first, suggested chapters, and a palette trigger that reuses the site’s Pagefind index.
- Characters: real summaries, an exact-printing banner portrait, biography/facts/reference hierarchy and credited relationship miniatures. No mockup affiliations, dates or invented titles are copied into the data.
- Archive: all eleven chapter guide tiles above the existing complete gallery. All 136 chapter artwork uses and 133 collection printings remain intact.
- Search: suggested queries and small full-frame thumbnails from the printingId metadata stored in Pagefind. Existing ranking, query normalization, locale and URL safety remain authoritative.

## Asset provenance

Built-in imagegen generated src/assets/phase15-atmosphere.jpg. The source PNG was retained in the imagegen output directory; the project asset is a pre-encoded 1920px JPEG so the build requires no new optimizer dependency. See phase15-illustration-prompt.md for the complete prompt. This asset is decorative; historical card images still use the central full-card provider with no crop, filters or overlaid text.

## Acceptance

Run full verify, strict browser/axe checks and production performance sampling. Review the seven mockup destinations plus PT counterparts at desktop/mobile widths in both themes. Preserve screenshots and reports outside the repository. Check the background image fallback, full card/source links, Pagefind suggestions and keyboard/focus return, narrow layouts and responsive reader rails. Keep the entire phase on feature/phase15-design-revamp; commit/push increments and merge only when the complete phase is accepted.

The phase 14 PR merged as #155 and its Pages deployment succeeded. That merge does not invent primary-book evidence or upgrade pending artwork acceptance; the remaining evidence queue stays open while this separate visual phase proceeds at the maintainer’s request.

## Local validation — 24 October 2026

- `pnpm run verify`: 433 Node tests, type checks, canonical content/artwork/provenance/image/style validation, production build, bilingual Pagefind index and built route/fragment checks passed.
- `A11Y_ENFORCE=1 pnpm exec playwright test --workers 2`: 456 passed, six existing device-specific skips. Includes all approved design destinations in both themes on desktop/mobile, EN/PT paths, overflow at 320/768/1440px, keyboard/focus search behavior, exact-printing thumbnails and delayed-script timeline geometry.
- Three production performance runs: 22 passed per run, with 66 preserved JSON reports compared against three saved phase 14 runs. Timeline CLS was zero in all six desktop/mobile captures; maximum CLS across the final samples was about 0.022. These are local, unthrottled lab observations, not field Core Web Vitals.
- Cold first-party transfer increased by about 329–449 KiB across sampled routes. The shared 367 KiB decorative JPEG is fingerprinted and reused. External canonical card transfers are excluded from this metric.

Review artifacts are outside the repository at `/Users/devdisola/Documents/ChatGPT/MTG History Page/phase15-review`: the seven approved mockups, 70 final screenshots, strict accessibility reports, full verification/browser logs, performance comparison and raw measurements. Earlier failures and performance snapshots remain alongside the final results; an intermittent original desktop anchor-reload failure passed ten focused repetitions and the final full suite. The theme audit now waits for reduced-motion transitions to settle before sampling contrast.

Implementation and local verification were completed on the feature branch; the complete phase subsequently merged as [PR #156](https://github.com/DevIsola/mtg-history/pull/156) on 24 October 2026. The [post-merge Pages workflow](https://github.com/DevIsola/mtg-history/actions/runs/40075601521) passed build/verification, Chromium browser quality and deployment. **Maintainer visual acceptance is still not recorded**; consult [the post-Phase-15 acceptance register](post-phase15-acceptance.md). Phase 14 source and artwork sign-off queues remain open.
