# Phase 14 — Post–Living Chapters roadmap audit

## Starting point

UX C1–F2 and Living Chapters 13.1–13.4 established the chapter reading layout, scroll revelations, native full-printing viewer, illustrated-moment navigation, reduced-motion behavior, and production performance measurements. This phase does **not** add another animation system, rewrite fiction, replace card images or change content identities.

The next decision must use the current repository as evidence. The existing `audit:consolidation` script is the canonical source of the event-source queue, unresolved ledgered claims, chapter matrix, and artwork scene candidates. This milestone reuses that report rather than trying to infer canonical accuracy from CI results. Current counts come from the local working tree when the audit runs; older numbers in documentation are reference snapshots.

## Prioritized roadmap (conditional on fresh report)

| Order | Workstream | Next action | Exit condition |
| --- | --- | --- | --- |
| P0 | Primary-fiction verification | Revisit the unresolved Venser, Freyalise and Gideon questions **if still open**. Treat Battle of Koilos as a separate pending *Invasion* primary-fiction worksheet, not automatically another unresolved ledger entry | Specific edition + passage, documented acceptance or explicitly retained uncertainty |
| P0 | Event provenance | Prioritize unreviewed event claims using the current high-priority risk queue | Substantiate claim-level sources, update event/narrative coherently, recalculate reviewed totals |
| P1 | Artwork fidelity | Manually inspect exact Scryfall printings, beginning with unverified scene candidates; compare image, card set, artist and significance | No portrait/object/symbol silently treated as event-scene proof; human visual acceptance recorded |
| P1 | PT-BR editorial parity | Check condensed reading editions against English originals, terminology and linked citations | Document equivalence gaps; keep honest adaptation notice unless full translations are reviewed |
| P1 | Performance and responsive acceptance | Compare at least three preserved production-preview baseline runs across desktop/mobile, then inspect chapter interactions | Recorded repeatable comparisons, justified future budgets; no claims of field Core Web Vitals from localhost |
| P2 | Publishing decision | Determine custom-domain timing and whether Cloudflare Pages parallel deployment provides measurable benefit; keep GitHub Pages as current deployment until verified | Written domain/provider decision, parity checks and rollback plan before adding a second workflow |

**Editorial gate:** automated structural tests can verify inventories, source record shape and exact printing identity. They cannot read inaccessible novels, prove lore, certify visual fidelity, certify accessibility or approve translation quality. Acceptance remains manual.

## Generate the Phase 14 packet (Windows PowerShell)

```powershell
cd "$HOME\Documents\Projects\mtg-history"
pnpm run verify

$review = "$HOME\Downloads\mtg-phase14-review"
New-Item -ItemType Directory -Force -Path $review | Out-Null

pnpm run audit:roadmap --markdown (Join-Path $review 'phase14-roadmap.md') --json (Join-Path $review 'phase14-roadmap.json')
pnpm run audit:consolidation --markdown (Join-Path $review 'editorial-acceptance.md') --json (Join-Path $review 'editorial-acceptance.json')
pnpm run review:artwork --gallery (Join-Path $review 'artwork-review.html')
pnpm run review:novel-evidence --output (Join-Path $review 'primary-novel-review.md')
pnpm run review:koilos-evidence --output (Join-Path $review 'koilos-review.md')

Invoke-Item (Join-Path $review 'phase14-roadmap.md')
Invoke-Item (Join-Path $review 'artwork-review.html')
```

The two primary-fiction worksheets refuse to overwrite existing reviewer files: use a fresh review directory for each new audit. Images in the gallery load live from Scryfall only when opened; no copyrighted artwork is saved to the repository by this step.

The report includes the full event-review queue and chapter matrix in JSON but shows only high-priority events in the concise Markdown. Koilos remains a distinct review boundary if the event is still absent from the claim-level provenance ledger. PT-BR identity coverage is checked against the current English chapter IDs; a matching count does **not** mean line-by-line translation parity. Deployment inspection checks tracked GitHub Actions files, not live DNS or externally configured hosting accounts.

## Release/acceptance review

1. Check that Phase 13.4 and the chapter disclosure usability fix have passed CI and are merged before baselining `main`.
2. Run `pnpm run audit:roadmap` and `pnpm run audit:consolidation`; compare observed counts with historical snapshots and investigate genuine discrepancies, not intentional content additions.
3. Review the open novel questions and Koilos worksheet with original publication passages where available; do not invent quotations or page numbers.
4. Open the artwork gallery and review exactly the depicted scene, crop, artist and specific historical interpretation. Record pending images without upgrading their evidence basis.
5. Compare representative PT-BR and English chapter content and validate outward source links and reading-mode notices.
6. Run `pnpm exec playwright test`, strict `A11Y_ENFORCE=1` browser tests, and the production performance suite. Save three performance output directories separately before comparing results.
7. For every requested correction, use a narrow content/UX PR with a dedicated regression test. Only record manual editorial sign-off after human evidence review.

## Next implementation wave

**Phase 14A — evidence closure** should be the next substantive wave after this read-only audit. Start with the highest-impact *open* primary-fiction claim for which the actual source passage is available. If a novel cannot be accessed, preserve the pending classification and instead take the highest-priority event claim supported by accessible official source text. Keep domain/parallel-hosting work behind an explicit comparison decision, not a feature assumption.

A Phase 14 roadmap report is a reviewer work queue, not a new source-of-truth dataset. Generated Markdown, JSON, and gallery outputs belong outside the repository until a human chooses to attach reviewed findings to an issue or PR.
