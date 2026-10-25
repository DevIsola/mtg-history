# Phase 16 — Cloudflare Workers Static Assets

**Current preparation:** [Phase 16.4 — Cloudflare-only CI/CD](phase16.4-cloudflare-builds.md) prepares production at `https://mtg-history.dev-disola.workers.dev`. The earlier staging preparation was merged in PR #158; work continues on the same phase branch. Production activation, Actions retirement and final cutover remain pending explicit acceptance. The staging record below is historical and does not certify the current 488-page production candidate.

## Scope and entry exception

On 24 October 2026 the maintainer explicitly authorized: “Begin Phase 16 preparation; keep Phase 15 acceptance pending.” This is an exception for migration preparation and staging, not a Phase 15 visual sign-off or permission to retire GitHub Pages. The maintainer requested a free Cloudflare address because no custom domain is owned. Use a `workers.dev` address initially; no registrar purchase or DNS transfer is needed.

Keep the complete phase on `feature/phase16-cloudflare-static-assets`. This branch prepares portable builds, static serving, local parity and a reviewable staging release. Merge, canonical production cutover, removing staging noindex and retiring Pages require final acceptance. Historical evidence/artwork queues remain pending independently.

## Architecture

Astro still generates static HTML and Pagefind. There is no server-side application, database, KV namespace, asset proxy or application Worker handler. The approved roadmap specifies Wrangler Static Assets; use the pinned project-local Wrangler version for this migration. `wrangler.jsonc` targets the separately named `mtg-history-staging` Worker with no custom-domain routes or paid resources.

`config/hosting.mjs` supplies both Astro and SEO scripts. Defaults retain `https://devisola.github.io/mtg-history/`. Explicit `MTG_SITE_ORIGIN` and `MTG_SITE_BASE=/` produce root-host URLs. The ordinary Pages build/deployment workflow remains the rollback path. CLI environment variables, rather than a silently loaded local .env file, determine the build.

`pnpm run build:cloudflare` requires the intended origin, forces root base, builds the site and Pagefind, validates SEO/search/local links, then copies the Cloudflare-only `_headers` and `_redirects`. Fingerprinted `/_astro/*` assets are immutable; HTML and unversioned Pagefind bundles revalidate. Staging sends `X-Robots-Tag: noindex`. Static HTML routes use trailing slashes; missing paths return 404 rather than the homepage. There are no application bindings or Worker runtime types to generate, and no executable request handler to instrument with Workers Logs/Traces.

## Local verification and parity

Run the normal published-base checks first, preserving `dist/` outside the repository before the root build:

```sh
pnpm install --frozen-lockfile
pnpm run verify
MTG_REUSE_BUILD=1 A11Y_ENFORCE=1 pnpm exec playwright test --workers 2
# Copy dist/ into your external review directory as github-pages-build/.
pnpm run check:hosting
# The local hosting suite supplies a test-only workers.dev origin and runs real Wrangler local serving.
node scripts/check-hosting-parity.mjs /absolute/review/github-pages-build dist
```

The hosting suite checks English/Portuguese metadata, both themes, axe, overflow, Pagefind search/palette focus, redirects with query strings, HTTP 404s and cache headers against the local Cloudflare runtime. The parity gate compares every built HTML route, language, h1, fragment target and exact-printing reference. Existing built-link and SEO gates verify local assets, canonical/hreflang/OG/sitemap/robots URLs. A successful local run or packaging dry run does not certify the remote host.

## Staging procedure

1. Confirm the authenticated account and read its Workers list and account subdomain. Do not overwrite a Worker owned by another project. Resolve/register the free account subdomain, then record the actual address; never publish the test hostname as the accepted production destination.
2. Build for `https://mtg-history-staging.<account-subdomain>.workers.dev` with `MTG_SITE_ORIGIN=<actual-origin> pnpm run build:cloudflare`. Inspect `dist/robots.txt`, canonical/alternate/OG URLs, Pagefind paths and the staging noindex header.
3. Run `pnpm exec wrangler deploy --dry-run` and preserve its packaging output. Set `CLOUDFLARE_ACCOUNT_ID` to the verified account before any remote deployment. Deploy the reviewed artifact using `pnpm exec wrangler deploy`; this creates a public staging address and does not alter GitHub Pages.
4. Probe the returned HTTPS address: English/PT routes, deep links, migrated fragment onward links, full-card image/source links, shared search (including wasm/fragments), palette keyboard/focus, query-preserving redirects, trailing slashes, true 404, header caching, robots and sitemap. Compare production performance and repeat the visual matrix on the actual host. Retain evidence outside the repository.

Cloudflare MCP account/Workers read access and Wrangler authentication are separate. If the MCP write grant is unavailable, use the approved Wrangler deployment path after confirming its authenticated account. Never copy OAuth credentials into the repository or review logs.

## Cutover and rollback gate

Before production cutover, record the final hostname, maintainer acceptance and any Phase 15 exceptions. A future custom domain is optional; choosing a permanent hostname later requires another canonical/hreflang/OG/sitemap build and redirect review. Remove staging noindex only from the accepted production build. Do not point the accepted site at a staging-name hostname accidentally.

The `_redirects` file handles `/mtg-history/...` requests arriving on the new host. It cannot redirect requests made to `devisola.github.io`: that origin is controlled by GitHub. Decide and test the old-origin redirect strategy before Pages retirement. The existing moved chapter fragments must continue resolving after redirect. Do not claim HTTP redirects preserve fragment targets without exercising browser navigation.

Keep the published Pages workflow and clean default build available through migration acceptance. Rehearse rollback by rebuilding at the original origin/project base and checking its canonical, locale, search and deep-link behavior. For a defective Cloudflare stage, leave Pages published; roll back the staged deployment to its recorded prior version if one exists. A newly created first deployment has no older Worker version to roll back to. Do not delete an unrelated Worker or disable account-wide workers.dev routes.

Phase 16.4 supersedes the proposed Actions-based production workflow: the accepted target is Workers Builds only, with full strict browser/performance checks local before merge. Retire all Actions definitions and disable Actions only after a Cloudflare candidate is proven and retirement accepted. Preserve Pages as the accepted legacy/rollback site until its separate retirement gate is met. See the Phase 16.4 activation sequence.

## Sources

- [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)
- [Free workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Astro configuration and environment variables](https://docs.astro.build/en/guides/environment-variables/)

## Verified staging release — 24 October 2026

- Free address: **https://mtg-history-staging.dev-disola.workers.dev**. Cloudflare's existing account subdomain resolved to `dev-disola`; no custom domain was purchased. The account had no pre-existing Workers, and this deployment created only the separately named staging Worker.
- Reviewed full-site version: `8e94b2f0-8e08-4019-9129-8ca2336b03a4`. A tiny noindex bootstrap was first used to provision the free address (version `f3c2a1ec-67b7-422c-876b-705e3cbdb2c2`), then replaced by the site built for its actual origin. The bootstrap is a staging fallback, not a production rollback target. The published Pages site remains available.
- Complete verification: 437 Node tests, type/content/printing/provenance/artwork/style/image checks, production build, Pagefind and local route/fragment checks passed. The full existing strict browser suite passed 456 tests, with six pre-existing skips.
- Cloudflare local serving: 32 desktop/mobile browser and strict accessibility checks passed, including both themes and EN/PT. All 262 built HTML routes, languages, h1s, authored fragment IDs and exact-printing references match the Pages baseline. Only existing randomly generated glossary-tooltip IDs are normalized (their count is retained); empty inventories fail closed.
- Public HTTPS artifact proof: **610 files**, including **262 HTML pages**, matched the preserved deployed artifact byte for byte, with no mismatches and staging noindex on every HTML page. `node scripts/check-hosting-http.mjs <origin> <deployed-build>` repeats this probe without redeploying.
- Public browser verification: **34 checks passed**, including all local checks plus actual browser preservation of moved EN/PT fragments through legacy-prefix redirects and no-JavaScript onward links. Use `MTG_HOSTING_URL=<actual-origin> MTG_SITE_ORIGIN=<actual-origin> pnpm run check:hosting` to test staging without starting a local server or rebuilding.
- Performance: three local Workers production runs passed 22 cases each; an additional public HTTPS run passed all 22. `MTG_HOSTING_URL=<actual-origin> pnpm exec playwright test --config playwright.hosting-performance.config.mjs` reuses the same production cases against staging. These are Chromium lab observations, not field Web Vitals; local comparisons use different server implementations and must not be described as causal speed claims.

The external review package is `/Users/devdisola/Documents/ChatGPT/MTG History Page/phase16-review`: exact Pages/staging artifacts, 52 live screenshots, axe reports, HTTP proof, deployment/verification logs, and local/public performance JSONs. The CLI deployment used the verified single account; the MCP connection could read Workers but rejected its subdomain write request, so no unsupported claim of MCP write access is made.

**State: staging implementation and verification complete; Phase 16 production migration remains open.** Maintainer staging/visual acceptance, final production hostname, old-origin redirect strategy, production workflow cutover, removal of noindex and Pages retirement are still pending. That staging preparation was subsequently merged in PR #158. Continue production work on the same phase branch and keep its new production-cutover PR in draft pending the Phase 16.4 acceptance gates. Phase 15 visual and Phase 14 historical/artwork acceptance remain pending as recorded.
