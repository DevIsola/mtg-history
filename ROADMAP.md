# MTG History — Active roadmap

Updated: 24 October 2026 (Phase 16.4 preparation). **Implementation, deployment, and human acceptance are distinct states.**

## Release baseline and workflow

- **Merged source baseline:** `main` at `1e623cf` includes the historical split, Phase 15 redesign, complete PT-BR archive (PR #159) and direct image enlargement (PR #160). A merged SHA alone does not certify production publication or editorial acceptance.
- **Deployment:** GitHub Pages run [#161](https://github.com/DevIsola/mtg-history/actions/runs/40075601521) succeeded on 24 October 2026. The production build/verification, reusable Chromium quality suite, and deployment jobs all succeeded. This verifies the pipeline outcome, not a human inspection of the public pages.
- **Inventory at the Phase 15 baseline:** 11 English chapters, 11 condensed PT-BR companions, 88 characters, 133 events, 118 relationships, 133 unique printings and 136 chapter artwork references. Run `pnpm run audit:roadmap` to refresh observed counts rather than treating this snapshot as an invariant.
- **Branching policy:** one branch per cohesive phase or feature; commit and push throughout; run local gates and required manual review; merge into `main` once the whole scope is accepted. Feature pushes and PRs do not automatically run Actions. Post-merge Actions verify and deploy `main`, while diagnostic workflows remain manually callable. See [implementation workflow](docs/implementation-workflow.md).

## Phase 14 — Historical foundation

| Subphase | Scope | State |
| --- | --- | --- |
| 14.0 | Post–Living Chapters audit | Merged |
| 14A | Omenpaths original-source review | Source records merged; human editorial acceptance pending |
| 14B | New Phyrexia migration ledger | Planning merged in PR #154 |
| 14C | Rise of New Phyrexia / March of the Machine split | Merged in PR #155; deployment succeeded |
| 14D | Source evidence and exact artwork fidelity | Review materials exist; claim/artwork acceptance pending |
| 14E | Accessibility, editorial and performance hardening | Automated gates and three local production samples passed; human acceptance pending |

### Chapter split and preserved identities

Rise of New Phyrexia uses `new-phyrexia` (order 9), March of the Machine retains `march-of-the-machine` (order 10), and Omenpaths is order 11. The rise/invasion boundary assigns seven events to the rise and six to the invasion/aftermath. All 133 event IDs and 133 unique exact printings remain. Tamiyo's NEO printing is intentionally referenced by both chapters, so there are **136 chapter artwork uses**. Existing moved EN/PT fragment targets have no-JavaScript onward links. See [Phase 14C migration notes](docs/phase14c-chapter-split.md).

### Outstanding editorial acceptance (not automatically closed)

Original-novel passages are required for Koilos (*Invasion*), Venser (*Time Spiral* / *Planar Chaos*), Freyalise (*Planar Chaos*), and Gideon (*War of the Spark: Ravnica*). Three unresolved provenance claims plus the separate Koilos worksheet remain pending. Do not use retellings as substitutes for edition-and-passage evidence. *The Kenriths' Royal Funeral* (MAT #34) remains context-assessed pending exact-image manual review; *Gideon's Sacrifice* artwork sign-off remains coupled to the unresolved narrative claim. All 11 full PT-BR chapters and record translations are now implemented; human terminology, fidelity and editorial acceptance remain pending.

These source-dependent items should remain explicitly tracked and should not be silently marked accepted merely to advance independent engineering phases.

## Phase 15 — Complete editorial website redesign

**Merged in [PR #156](https://github.com/DevIsola/mtg-history/pull/156) and deployed in [run #161](https://github.com/DevIsola/mtg-history/actions/runs/40075601521); human visual acceptance remains to be recorded.**

The release implements the seven approved mockup destinations: homepage, chapter reader, global Pagefind palette, Explore landing, illustrated archive, timeline, and character profiles. It includes the compact dark navigation, paper/gold editorial surfaces, responsive reader context, full-frame exact-printing imagery, and EN/PT paths. Decorative generated scenery is disclosed and is not historical evidence. Canonical identity and source boundaries remain unchanged. See [Phase 15 implementation](docs/phase15-design-revamp.md).

The Phase 15 local release record reports `pnpm run verify` passing (433 Node tests), strict Playwright passing (456 tests, six pre-existing skips), and three performance runs (22 tests each). The post-merge workflow's build, browser-quality and deploy jobs each passed. These are engineering results, not independent visual/canonical artwork certification. Cold first-party transfer increased approximately 329–449 KiB in sampled routes, largely due to a shared 367 KiB decorative image; reevaluate on real devices if needed.

**Post-release action:** complete and sign [the Phase 15 acceptance register](docs/post-phase15-acceptance.md). Reconcile the deployed site with the seven actual reference mockups across both themes, EN/PT, phone/tablet/desktop, no-JavaScript behavior, true card-printing credit, and keyboard navigation. Record any corrective work in a narrow branch; do not edit the historical evidence ledger to conceal open questions.

## Forward roadmap

| Phase | Workstream | Primary deliverables | Entry / exit gate |
| --- | --- | --- | --- |
| **16** | Cloudflare Workers Static Assets migration — preparation active under recorded maintainer exception | Hosting architecture and root-path configuration; Wrangler static assets; parity/staging; custom domain, redirects, caching, DNS/HTTPS, rollback and Pages retirement | Start after Phase 15 acceptance or a documented explicit exception; only cut over after URL/locale/search/SEO parity and rollback rehearsal |
| **17** | Historical evidence and lore transparency | Claim confidence/provenance UI, contradictions and retcons, corrections history, uncertainty labels | Every public label sourced; novel-blocked claims remain marked unresolved |
| **18** | Reader and publication features | Print styles, curated update feeds, local-only reading/bookmark options, accessible sharing | Progressive enhancement, no mandatory accounts/backend |
| **19** | Dual chronology explorer | Compare fictional historical order with publication/reinterpretation dates and supporting citations | No unsupported precision or invented in-universe dates |
| **20** | Multiverse atlas | Source-backed geographic and historical relationships, beginning with Dominaria, with accessible list alternatives | Place and event evidence reviewed; no invented canon cartography |
| **21** | PT-BR parity and editorial expansion | Terminology review, chapter depth, faithful localized evidence and status labels | Preserve explicit human translation-review and evidence status distinctions |
| **22** | Optional experimental enhancements | Offline reading feasibility, guided history paths, quizzes, restrained motion concepts | Feature-specific approval, performance and accessibility budgets; no release blocker for the historical archive |

### Prioritized execution sequence

1. Finish the Phase 15 post-release acceptance register, record decisions, and open targeted corrective commits only if needed. Update older Phase 15 documents that still describe the feature as unmerged.
2. Preserve Phase 14 source/artwork/PT-BR editorial queues, closing individual items only with reviewed evidence. They can continue independently without blocking unrelated work if honestly identified.
3. Continue Phase 16 on **`feature/phase16-cloudflare-static-assets`**. Treat its hosting migration and domain cutover as one reviewed release with explicit rollback conditions; do not silently introduce parallel production hosting as the final architecture.
4. Progress through Phases 17–21 as independently releasable scopes. Phase 22 remains optional.

For all phases, release readiness requires local verification, browser/strict accessibility checks, performance comparison when relevant, review of changed historical printings/sources, and final maintainer acceptance **before** merging. Successful post-merge CI is confirmation of the merge's build/deployment, not retrospective human approval.

### Phase 16 preparation exception

On 24 October 2026 the maintainer authorized Phase 16 preparation with Phase 15 acceptance still pending and requested a free workers.dev address initially. Work continues on `feature/phase16-cloudflare-static-assets`; see [scope, staging and rollback gates](docs/phase16-cloudflare-static-assets.md). Production cutover and Pages retirement remain subject to acceptance.

Phase 16 staging is now available at https://mtg-history-staging.dev-disola.workers.dev (free Workers address; noindex). Portable builds, all-262-route identity parity, full existing browser checks, local/live Workers checks, public artifact verification and performance sampling passed. Production migration remains open; the phase branch and PR stay in draft until staging acceptance and the documented cutover gates are resolved. See the [verified staging record](docs/phase16-cloudflare-static-assets.md#verified-staging-release--24-october-2026).


### Phase 16.4 — Cloudflare-only CI/CD

**Prepared for acceptance, not activated.** Production target selected by the maintainer: `https://mtg-history.dev-disola.workers.dev`. The current inventory is 244 routes per language (488 total), 11 complete chapters per language, 88 characters, 133 events, 118 relationships, 133 exact canonical printings and 136 artwork uses.

The prepared pipeline pins Node/pnpm/Wrangler, validates inexpensive source/content/type gates, builds Astro/SEO/Pagefind once and deploys only the validated matching main-branch artifact. Non-production Builds must be disabled; strict Playwright and performance remain local pre-merge requirements. Production indexing headers are separate from staging noindex.

The live audit found four active workflows, no main branch protection/rulesets, a main-only Pages environment and no production Worker/Builds connection. Keep those live settings unchanged until accepted. After Cloudflare candidate deployment proof, retire all four workflow definitions and disable all Actions in Settings. Preserve Pages and bookmarked anchors through the accepted legacy-link/rollback strategy. Remote main-trigger, failed-build preservation and no-Actions proofs remain pending approval and actual events; local tests do not close them.

See [Phase 16.4 configuration, retirement, test matrix and rollback](docs/phase16.4-cloudflare-builds.md). Historical evidence/artwork, Phase 15 visual and PT-BR editorial acceptance tasks remain outstanding.
