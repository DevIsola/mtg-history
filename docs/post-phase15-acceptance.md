# Post-Phase-15 acceptance register

Date prepared: **24 October 2026**. Scope: merged Phase 15 editorial redesign and its transition into the Phase 16 hosting program. **This is a verification and acceptance worksheet, not a certification or maintainer sign-off.**

## Release and evidence baseline

| Item | Evidence | State |
| --- | --- | --- |
| Phase 14 structural split | [PR #155](https://github.com/DevIsola/mtg-history/pull/155) | Merged |
| Phase 15 visual implementation | [PR #156](https://github.com/DevIsola/mtg-history/pull/156); commit `e6dd46d45` | Merged to `main` |
| Post-merge pipeline | [Actions run #161](https://github.com/DevIsola/mtg-history/actions/runs/40075601521) | Build/verification, browser-quality Chromium and deployment jobs all successful |
| Local pre-merge engineering | [Phase 15 record](phase15-design-revamp.md) | 433 Node tests; 456 strict browser passes and six known skips; 3 × 22 performance passes (reported in the merged release notes) |
| Screenshot/visual review assets | Release notes place 7 source mockups and 70 final captures in the maintainer's local `phase15-review` directory | Reported present locally; not inspected in this worksheet |
| Production HTTP content, card images and actual viewport rendering | GitHub Pages successful deployment is recorded; direct independent HTTP/visual inspection was unavailable while preparing this worksheet | **Not independently verified** |
| Maintainer visual and editorial acceptance | Signature and exception register below | **Pending** |

The workflow runs on `main` after merge; feature-branch pushes and PRs intentionally do not trigger CI. A successful deployment does not establish that every public route was personally reviewed. This acceptance step must distinguish documentation, automated tests, and actual human review.

## Seven approved mockup comparisons

Compare the **seven images provided by the maintainer** against the real production pages and the final local screenshot gallery. The mockups are visual targets, not canonical source material: they contain illustrative content, fictional counts, and unverified wording that must not be copied as history.

| Screen | Review path / experience | Human verification | Status |
| --- | --- | --- | --- |
| Home | `/mtg-history/` and `/mtg-history/pt-br/` | Hero/banner, CTAs, honest live totals, era navigation, featured chapter hierarchy, dark/light | Pending |
| Chapter reader | `/mtg-history/chapters/brothers-war/` and a PT-BR chapter | Left TOC, comfortable narrative width, contextual right rail, rail folding below article, card metadata and deep links | Pending |
| Search palette | Global `⌘K` / `Ctrl+K` and full search | One Pagefind source, result groups, locale scope, exact-printing thumbnails, keyboard/ESC/return focus, no-JS fallback | Pending |
| Explore | `/mtg-history/explore/` and `/mtg-history/pt-br/explore/` | Clearly discoverable events, characters, relationships, archive, glossary, paths and search | Pending |
| Timeline | `/mtg-history/timeline/` and PT-BR timeline | Real eras and dates, stable filters, mobile rail, publication vs. story order, no invented chronology | Pending |
| Character | `/mtg-history/characters/urza/` | Real character facts, exact credited card portrait, source-backed affiliations and related people/events | Pending |
| Archive | `/mtg-history/archive/` and PT-BR archive | Eleven chapter guides, 133 unique canonical printings / 136 chapter uses, accessible grid/list, source credits and full-frame viewer | Pending |

For each screen, inspect at **320, 390, 768, 1024, and 1440 px** in light and dark themes, and test English and PT-BR where implemented. Check image fallbacks, narrow layouts and actual card display when Scryfall is slow/unavailable. Use VoiceOver and keyboard-only navigation; automated axe passes do not replace interaction review.

## Editorial and provenance boundaries

- The shared atmospheric hero (`src/assets/phase15-atmosphere.jpg`) is explicitly decorative; do not imply it represents a verified event, plane, place or canonical character.
- Maintain exact Scryfall printing ID, set/collector number, artist credit, unaltered full-card context and editorial significance. A character portrait/symbol is not direct proof of a historical scene.
- The new Phyrexia split preserves 133 events, 133 unique printings, 136 chapter artwork uses and existing EN/PT routes. Do not edit counts merely to match older 10-chapter snapshots.
- Novel-dependent evidence remains open for Koilos (*Invasion*), Venser (*Time Spiral* / *Planar Chaos*), Freyalise (*Planar Chaos*) and Gideon (*War of the Spark: Ravnica*). Three source-ledger claims plus a separate Koilos worksheet require original edition/page or passage verification.
- *The Kenriths' Royal Funeral* (MAT #34) requires human exact-image acceptance. *Gideon's Sacrifice* artwork approval depends on the unresolved Gideon provenance claim.
- The eleven PT-BR chapters are condensed companion adaptations; they must not be represented as fully source-reviewed line-by-line translations.

## Performance and accessibility notes

Release notes report strict desktop/mobile Chromium tests passing with six skips, and three production performance samples passing. The maximum sampled CLS was approximately 0.022; timeline CLS was 0 in tested captures. The shared decorative JPEG added approximately 329–449 KiB of cold first-party transfer on sampled routes, with the JPEG itself about 367 KiB. These measurements are **local, unthrottled laboratory samples**, not field Core Web Vitals. Monitor perceived loading and LCP on representative mobile networks before treating performance as finally accepted.

## macOS reviewer protocol

Run from a **clean working tree** in the separate post-phase documentation branch. Production checks are also useful after a fresh dependency install:

```bash
cd ~/Documents/Projects/mtg-history
pnpm install --frozen-lockfile
pnpm run verify
A11Y_ENFORCE=1 pnpm exec playwright test --workers 2
pnpm exec playwright test --config playwright.performance.config.mjs
```

To generate the existing UX visual review matrix, first build and start the production preview in one terminal:

```bash
pnpm run build
pnpm exec astro preview --host 127.0.0.1 --port 4322
```

In another terminal:

```bash
cd ~/Documents/Projects/mtg-history
node scripts/review-ux-f2.mjs --out "$HOME/Downloads/mtg-post-phase15-review" --full
open "$HOME/Downloads/mtg-post-phase15-review/index.html"
pnpm run review:artwork --gallery "$HOME/Downloads/mtg-post-phase15-artwork.html"
open "$HOME/Downloads/mtg-post-phase15-artwork.html"
```

The UX matrix is an existing capture tool, not an exhaustive comparison against all seven reference mockups. Inspect the original seven target images and any saved Phase 15 review artifacts alongside its output. Preserve report files outside the repository until a reviewer deliberately chooses what to archive. Record screenshots and exact URLs for visual differences and cross-browser behavior. Check the live GitHub Pages routes after deployment; rerun public deep links and EN/PT routes with cache cleared or private browsing.

## Maintainer acceptance decision

- [ ] Seven mockup destinations reviewed against real deployment (or local production preview) and reference images
- [ ] Responsive and both themes reviewed at the target breakpoints
- [ ] EN/PT-BR navigation, Pagefind search, cards/printings, no-JS and keyboard interactions reviewed
- [ ] High-severity accessibility issues resolved; lower-severity exceptions documented
- [ ] Performance/artwork provenance caveats examined and accepted or corrected
- [ ] Confirm public URLs, asset loading, redirects and deep links after post-merge deployment
- [ ] Open Phase 14 source/artwork uncertainties explicitly carried forward, with no false sign-off
- [ ] Any follow-up defects documented with issue, scope, owner and acceptance result

**Decision:** `PENDING_MANUAL_ACCEPTANCE`
**Reviewer:** not recorded
**Review date:** not recorded
**Visual exceptions / links:** not recorded
**Blocking corrections:** not assessed

When reviewed, update this decision to `ACCEPTED`, `ACCEPTED_WITH_DOCUMENTED_EXCEPTIONS`, or `REJECTED_NEEDS_CORRECTIONS` and record concrete evidence. Never change it based on passing CI alone. Corrections belong in a focused feature branch and require fresh local validation and the normal full-feature merge policy.

## Next phase readiness

Phase 16 is Cloudflare Workers **Static Assets** migration, not another redesign. Begin a dedicated `feature/phase16-cloudflare-static-assets` branch only after recording Phase 15 acceptance or a specific maintainer exception. Before cutover: configure portable Astro site/base URLs for root domain, test EN/PT paths/Pagefind/SEO/OG/sitemap/redirects, stage Workers static assets, verify caching/headers and asset loading, document DNS+HTTPS, test rollback to GitHub Pages, and compare public performance. Retire Pages only when the new production host is independently accepted.

## Recorded Phase 16 entry exception — 24 October 2026

The maintainer explicitly authorized “Begin Phase 16 preparation; keep Phase 15 acceptance pending.” Preparation and staging may proceed on the dedicated Phase 16 branch. This does not change `PENDING_MANUAL_ACCEPTANCE`, close any historical/artwork queue, authorize production cutover, or retire Pages. See [the Phase 16 preparation record](phase16-cloudflare-static-assets.md).
