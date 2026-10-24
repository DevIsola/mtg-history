# Phase 16 — Cloudflare Workers Static Assets

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
A11Y_ENFORCE=1 pnpm exec playwright test --workers 2
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

Only after final acceptance should a later commit on this same phase branch replace the production deployment workflow, with verification/browser quality before deployment, documented old-origin handling and an explicit Pages retirement action. Preserve the existing rule that feature pushes/PRs do not trigger automatic Actions.

## Sources

- [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)
- [Free workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Astro configuration and environment variables](https://docs.astro.build/en/guides/environment-variables/)
