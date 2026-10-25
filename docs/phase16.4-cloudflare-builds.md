# Phase 16.4 — Cloudflare-only CI/CD

## State and approved target

Prepared on `feature/phase16-cloudflare-static-assets`, based on merged `main` at `1e623cf` (PR #160). The maintainer selected **https://mtg-history.dev-disola.workers.dev** for the free production address. That hostname choice authorizes preparation, not live provisioning, merge, Actions shutdown or final cutover.

**No live settings have been changed.** GitHub Pages and all four Actions workflows remain enabled pending the proof and acceptance steps below. Production Workers Builds activation and actual post-merge deployment are not yet verified. Phase 14 evidence/artwork acceptance, Phase 15 visual acceptance and PT-BR human editorial review remain open.

## Read-only audit — 24 October 2026

| System | Observed state |
| --- | --- |
| Cloudflare | Only `mtg-history-staging` exists; account subdomain `dev-disola`; no build triggers attached to staging. Production Worker does not exist yet. |
| GitHub repository | `DevIsola/mtg-history`; Actions enabled, all Actions permitted. |
| Main protection | Branch-protection API returns “Branch not protected”; repository rulesets list is empty. No required status-check dependencies were found. Recheck immediately before activation. |
| Pages | `https://devisola.github.io/mtg-history/`, source `main`, build type `workflow`, HTTPS enforced. |
| Pages environment | `github-pages` permits deployments from `main`; no reviewer protection rule was returned. Preserve this environment until rollback/legacy handling is accepted. |

Active workflows:

| Definition | ID | Triggers / dependency |
| --- | --- | --- |
| `.github/workflows/deploy.yaml` | 381645076 | Push to `main`, manual dispatch; deployment requires `build` and `browser-quality`. |
| `.github/workflows/browser-quality.yaml` | 387200299 | Reusable workflow and manual dispatch; called by Pages deployment. |
| `.github/workflows/quality.yaml` | 385113900 | Manual site verification. |
| `.github/workflows/readme-screenshots.yaml` | 389862321 | Manual screenshots. |

These definitions are intentionally retained for now. Their Node 24/pnpm 10 setup differs from the new production pins: do not merge this preparatory state while relying on those unchanged workflows. Complete the approved removal stage before the final merge. Leaving them in place is a transition state, not the final Cloudflare-only architecture. Neither disabling individual workflows nor deleting just `deploy.yaml` satisfies the final requirement to disable **all** Actions.

## Prepared Cloudflare configuration

`hosting/cloudflare/workers-builds.json` is the reviewed settings specification. **Cloudflare does not automatically import this file.** Apply it in the dashboard after acceptance; do not mistake a committed file for a live repository connection. Workers Builds does not read Wrangler's custom `build.command` as its build settings.

| Setting | Value |
| --- | --- |
| Worker / Wrangler config | `mtg-history` / `wrangler.production.jsonc` |
| Git account / repository | `DevIsola` / `DevIsola/mtg-history`; grant the Cloudflare GitHub App access to this repository only. |
| Production branch | `main` |
| Automatic branch selection | Include exactly `main`, no other patterns; disable **Enable Preview Builds** under Settings → Build → Branch control. |
| Preview/version URLs | Disabled in production Wrangler configuration; this is separate from disabling non-production Builds. |
| Root directory | `/` |
| Dependency install | `SKIP_DEPENDENCY_INSTALL=true`; the build command explicitly runs one frozen install. |
| Build command | `pnpm install --frozen-lockfile && pnpm run ci:cloudflare:build` |
| Deploy command | `pnpm run ci:cloudflare:deploy` |
| Cache | Enable dependency/build caching; correctness does not depend on cached `dist/`. |
| Node / pnpm / Wrangler | `26.12.0` / `12.14.0` / `4.152.0`; pinned to the locally verified toolchain, not floating defaults. |
| Build variables | `NODE_VERSION=26.12.0`, `PNPM_VERSION=12.14.0`, `SKIP_DEPENDENCY_INSTALL=true`. Do not override `WORKERS_CI_BRANCH` or `WORKERS_CI_COMMIT_SHA`. |
| Plan / resources | Workers Free, static assets only; no paid plan, databases, SSR, React, KV, R2, bindings, deploy hooks or second automated pipeline. |

`.node-version`, `packageManager` and the exact Wrangler dependency pin the tools. pnpm 12 also records its package-manager bootstrap in a separate lockfile document; application dependencies are unchanged. The existing Sass audit now reads importer sections across both documents.

The build validates the Node/pnpm versions; runs offline Node/content/localization/printing/provenance/style checks and Astro diagnostics; invokes **one** Astro → SEO → Pagefind build; validates the built index, links, production metadata and headers; and records the artifact digest outside `dist/`. `wrangler.production.jsonc` has no custom build hook, so deployment cannot implicitly rebuild Astro.

The deploy command requires Workers Builds on `main`, an exact commit SHA, the matching successful receipt and unchanged asset bytes. It rechecks the artifact and runs the pinned local Wrangler against that same `dist/`. A failed validation exits nonzero and never creates a successful receipt. A feature build is rejected even if branch control is accidentally misconfigured. These guards supplement provider branch settings; they are not access control against someone authorized to change build code or variables.

Full strict Playwright and production performance checks remain mandatory **local pre-merge** gates. Chromium installation and browser/performance runs are deliberately excluded from cloud builds. The free Builds allowance currently includes 3,000 build minutes/month and one concurrent build; if the allowance is exhausted, stop and wait for the allowance reset rather than enabling paid usage.

Production uses `_headers.production`, allowing indexing and setting revalidation/immutable caching. Staging keeps its separate `wrangler.jsonc` and `noindex` headers. Default Pages builds still use the original origin/project base. No custom domain purchase or DNS transfer is needed.

## Local verification without activation

```sh
pnpm install --frozen-lockfile
pnpm run ci:cloudflare:build
# Uses exactly the production artifact above; no build in this test command:
MTG_HOSTING_PRODUCTION=1 MTG_SITE_ORIGIN=https://mtg-history.dev-disola.workers.dev pnpm run check:hosting
pnpm exec wrangler deploy --config wrangler.production.jsonc --dry-run --outdir /absolute/external/review/package
```

For public candidate proof after approval, use `MTG_HOSTING_PRODUCTION=1 node scripts/check-hosting-http.mjs https://mtg-history.dev-disola.workers.dev /absolute/review/production-artifact` and `MTG_HOSTING_PRODUCTION=1 MTG_HOSTING_URL=https://mtg-history.dev-disola.workers.dev MTG_SITE_ORIGIN=https://mtg-history.dev-disola.workers.dev pnpm run check:hosting`. Both probe the existing host; neither rebuilds nor deploys. Omit the production flag when probing staging so its noindex requirement remains enforced.

The production hosting suite checks both locales/themes, actual response headers, canonical URLs, search, the artwork viewer, true 404s and query/fragment migration paths. The deploy command is not a local convenience deploy: outside Workers Builds it deliberately refuses to deploy. Unit tests inject an executor to prove failures cannot invoke Wrangler; they never upload an intentionally broken release.

For the normal local release checks, run `pnpm run verify`, then `MTG_REUSE_BUILD=1 A11Y_ENFORCE=1 pnpm exec playwright test`, then the production performance suite. Preserve evidence outside the repository. After `verify`, `MTG_REUSE_BUILD=1` reuses its Pages-format artifact for browser tests, and performance tests reuse it too. Standalone browser runs still build by default. These are local checks, not cloud build steps. Return to `pnpm run ci:cloudflare:build` when reviewing a root-hosted production artifact.

## Verified local results — 24 October 2026

- Frozen install passes with pnpm 12.14.0; no application dependency version changes.
- `pnpm run verify` passes, including content/type/printing/provenance/style checks, the 488-page build, Pagefind and local links. The final full Node rerun passes **432 tests**, including the subsequently added HTTP-probe regression.
- Single production CI build passes for the approved root origin; its production artifact has all 488 correct canonical/OG/sitemap URLs and no staging noindex headers.
- Six CI guard tests cover source/build failures at every boundary, stale/changed artifacts, main-only identity, production SEO version/config pins and public HTTP indexing policy. A direct simulated feature-branch deploy exits nonzero before Wrangler is invoked.
- Production Wrangler local runtime: **34 desktop/mobile checks pass**, including both themes, EN/PT, search, artwork viewer, caching, 404s and old prefix/fragment links. It serves the same production artifact without rebuilding.
- Production packaging dry-run passes: 1,572 asset files read, no bindings, no upload/deployment.
- Full strict browser suite: **464 pass, six existing device-specific skips**. `MTG_REUSE_BUILD=1` reuses the verified Pages-format build; no additional build runs in the browser command.
- Local production-preview performance: **26 checks pass**, reusing that build. These are lab samples, not field Web Vitals.

Review artifacts are retained outside the repository. Feature-push observation, actual Builds settings, production provisioning, public candidate proof, merge-triggered deployment, a real remote failed-build event and final Actions shutdown must be recorded separately; none is inferred from the local results.

## Acceptance and activation sequence

1. **Review this branch and accept live preparation explicitly.** Record the accepted SHA, production hostname and open editorial/visual exceptions. Confirm Workers Free and the authenticated account. Preserve the last successful Pages artifact and the candidate artifact/digest externally. Recheck branch protection, repository rulesets and the `github-pages` environment; if required checks have since been added, list them and approve replacements before changing anything.
2. **Prove the Cloudflare candidate without removing Pages.** After approval, provision the separately named production Worker with the reviewed static artifact and verify its returned HTTPS address. A one-time operator-controlled Wrangler bootstrap is acceptable only with that approval; it is not a second automated deployment pipeline. Run public HTTP artifact verification and the hosting suite against the exact candidate origin, including indexing headers, all metadata, Pagefind, EN/PT and old bookmark fragments. Record the real Worker version. No production Worker/version is invented in this preparation record.
3. **Accept the legacy-link strategy before retiring Actions.** The conservative option is to retain the current Pages site as a frozen legacy/rollback archive. Test current indexed URLs and bookmarked EN/PT chapter anchors on that actual site before and after disabling Actions. Do not unpublish or delete Pages. If redirects from the old origin are required instead, prepare and approve a one-time legacy-site publication before disabling Actions, and test queries, fragments and no-JavaScript behavior. GitHub Pages cannot serve arbitrary HTTP 301 rules; a client-side redirect must not be represented as a server redirect. Cloudflare `_redirects` only handles requests that arrive on the new host and cannot redirect `devisola.github.io` traffic. Old-origin SEO consolidation remains open until the chosen strategy is accepted.
4. **After the Cloudflare deployment proof**, remove all four workflow definitions on this same feature branch and update the old workflow-specific assertions in `scripts/phase14c-migration.test.mjs` to require an empty/no workflows directory. Also reconcile the read-only workflow inspection in `scripts/audit-phase14-roadmap.mjs`; it currently assumes workflow files and the already-removed condensed Thran page, so its scanner is stale from earlier localization work. Do not reinterpret that stale inspection as historical/editorial acceptance. No replacement Actions workflow is allowed. Preserve the previous workflow files in the recorded Git commit/external review package for emergency restoration. This deferred removal is intentionally not performed before proof.
5. **Disable all GitHub Actions:** repository Settings → Actions → General → Actions permissions → **Disable actions** → Save. This is a live repository settings change requiring acceptance. Do not change GitHub Pages source settings or delete its environment as part of this action. Re-read the API (`GET /repos/DevIsola/mtg-history/actions/permissions`) and require `enabled: false`.
6. **Connect Workers Builds after approval**, using the exact settings above, with `main` as the only automatic branch and previews disabled. Use a Cloudflare-managed or narrowly scoped build deployment token for this Worker; never commit a secret or paste one into chat. Capture the actual Worker tag, repository connection, trigger UUID and sanitized settings as activation evidence. Connecting before the reviewed commands exist on `main` may cause an initial build to fail; do not weaken the gate or point production at the feature branch. The proven candidate must remain deployed if that happens.
7. **Push the final reviewed feature state and verify no automation fires on that branch.** Confirm no production version change, no Cloudflare feature build and no GitHub Actions run for its exact SHA. The current preparation push can prove only absence of feature automation in the current unconnected state; repeat after the real connection is configured.
8. **Merge only after explicit final acceptance.** Cloudflare must build `main` once and deploy the validated artifact. Require a successful Builds log with the exact merged SHA, one Astro/Pagefind build, matching production Worker/version, and no GitHub Actions run. Exercise the public production browser/HTTP checks. Do not call this test passed before the merge actually occurs.
9. **Verify failure behavior in the real connection.** Record any observed failed build preserving the prior deployment; otherwise use an explicitly approved non-deploying/manual failure rehearsal. Do not merge deliberately broken production content merely to test the gate. Local injected failures are already covered, but they are not proof of a remote Builds event.

The end state is Cloudflare as the only automated build/deploy system, GitHub as source control with Actions disabled and no workflow definitions, and Pages retained only as the accepted frozen legacy/rollback site. Production cutover, remote success/failure proof and final Actions retirement remain pending acceptance.

## Rollback

- **Before activation:** discard/revise this feature candidate; Pages and staging remain unchanged. No live rollback is necessary.
- **Candidate fails before final merge:** keep Pages live; correct the branch and rebuild once. Roll the production candidate back to its recorded prior working Worker version if one exists. A newly created first Worker has no previous version.
- **Cloudflare build fails after merge:** the deploy command is not run; verify that the last proven version is still serving. Fix/revert the source change through the same approved `main` path. A failed build does not undo a Git merge.
- **Deployment succeeds but public behavior fails:** pause/disconnect the Cloudflare build trigger with approval before rolling back so a queued push cannot overwrite the rollback. Use Cloudflare's recorded version rollback and re-test the public routes/SEO/search. A bad first deployment relies on the retained Pages site until corrected.
- **Emergency return to Pages publishing:** requires explicit approval to re-enable Actions and restore a coherent known-good Pages release (or another accepted publication mechanism). If restoring only workflow files onto the new code, reconcile their old Node/pnpm pins with the current packageManager; do not blindly restore the old pnpm 10 workflow against pnpm 12 source. Do not silently reactivate a second automated pipeline. The retained legacy site remains available without republishing; its old origin/base/anchors must be rechecked.

## Sources

- [Workers Builds configuration and injected CI identity](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Main/preview branch controls](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Tool versions and disabling automatic dependency installation](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [Builds free allowance](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)
- [GitHub Actions repository settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)
