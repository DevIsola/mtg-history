# Implementation and deployment

Use one branch for the complete phase or feature. Merge only after implementation, local verification and required human acceptance are complete. Do not merge subphases individually. Phase 16.4 continues on `feature/phase16-cloudflare-static-assets`; its current preparation has one commit/push sequence. Do not edit `main` directly.

Before every release run `pnpm run verify`, the full Playwright suite with `MTG_REUSE_BUILD=1 A11Y_ENFORCE=1` after verification, and production performance sampling locally. Preserve review artifacts outside the repository. Successful automation is not human acceptance of historical evidence, artwork, translations or visual design.

## Current transition

GitHub Actions and Pages remain active until the Cloudflare candidate is proven and retirement is explicitly accepted. Feature pushes and PRs do not trigger automatic Actions under the current definitions. The existing `main` workflow still verifies and publishes Pages; do not describe it as already retired.

The exact live audit, proposed Builds settings, retirement sequence, rollback and pending remote tests are recorded in [Phase 16.4](phase16.4-cloudflare-builds.md). Do not merge, disable Actions, connect/change live deployment settings or perform production cutover without acceptance. Keep Pages and existing bookmark targets available.

## Accepted Cloudflare-only end state

Cloudflare Workers Builds is the only automated build and deployment system. GitHub supplies source control; all GitHub Actions are disabled in repository Settings and no workflow definitions remain. Only pushes to `main` start builds; non-production preview builds are disabled. No deploy hooks or duplicate pipelines are added.

The cloud build performs a frozen dependency install and inexpensive offline source/content/type gates, then one optimized Astro/SEO/Pagefind production build. Build failure prevents deployment. The deploy command validates the exact commit/artifact and deploys those same bytes with pinned Wrangler; it never rebuilds. Browser/strict accessibility and performance suites remain mandatory local pre-merge checks rather than cloud build workloads.

After an accepted merge, inspect the actual Cloudflare Builds log and production Worker version, verify public EN/PT routes, canonicals, indexing, Pagefind, viewer and legacy links, and confirm GitHub Actions did not execute. Never report a merge-triggered deployment as verified before the merge and remote evidence exist. A failed build leaves the previous deployment serving; it does not revert the source merge.

Pages retirement is separate from Actions retirement. Retain the accepted frozen Pages legacy/rollback site until its old-origin link and SEO strategy is proven and its final retirement is explicitly authorized. Re-enabling a Pages deployment pipeline during rollback also requires explicit approval.
