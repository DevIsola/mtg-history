# Engineering quality checks

The site uses a layered verification pipeline. Each layer addresses a different
failure class; a successful Astro build alone does **not** establish TypeScript
correctness for `.astro` or TypeScript files.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run test          # Node regression tests (no dedicated test runner dependency)
pnpm run check:content # Validate the lore graph before a build
pnpm run check:types   # Astro diagnostics for .astro, TypeScript, and related files
pnpm run build         # Generate production pages and validate content schemas
pnpm run check:links   # Validate generated routes/assets/fragments in dist/
pnpm run verify        # Run all five checks in order
```

`check:types` runs `astro check` with the existing strict Astro TypeScript
configuration (`tsconfig.json`). `@astrojs/check` and `typescript` are **exactly
pinned dev dependencies**, allowing the lockfile to control the transitive
versions. Astro's build uses a transpilation step; it does not replace these
diagnostics. Errors must be fixed rather than suppressed or ignored.

`check:content` validates distinct era/chapter/character/event/category IDs,
published-era chapters, chapter and card references, character and event
associations, relationship endpoints and duplicates, and literal
`<CharacterLink id="...">` / `<HistoricalEventReference id="...">` references
in chapter MDX. It uses Node 22+ TypeScript type stripping rather than another
runtime dependency. Astro remains authoritative for YAML and MDX schema validation.

`check:links` loads the site origin and base path from `astro.config.mjs` and
checks `href`, `src`, and responsive-image `srcset` references in generated
HTML against files in `dist/`. It also validates local CSS `url(...)` assets,
resolving relative paths from the generated stylesheet location.
It reports missing internal route or asset targets, including same-origin links
that accidentally escape the configured GitHub Pages base path, and also checks
HTML fragment identifiers. External URLs, data URIs, CSS-only `#fragment`
references, and HTML asset fragments are intentionally excluded. This check
operates on generated output, not the source CSS import graph. It is not a
substitute for browser accessibility or visual regression testing.

`.github/workflows/quality.yaml` runs `pnpm run verify` for pull requests against
`main`; the Pages deployment uses the same verification command. A failing
type check, integrity check, build, or link check must prevent deployment.

## Repository housekeeping

The temporary `apply-phase-13.py` migration helper has served its purpose: its
Chapter 05 changes were merged, and the published content remains in
`src/content/chapters/otaria.mdx` and `src/data/`. Remove the helper with a
normal versioned deletion; do not rerun it against current registries.

Keep `pnpm-lock.yaml`, the `docs/assets/` illustrations, editor settings,
`AGENTS.md`, and the `CLAUDE.md` link to it. The `.gitignore` already excludes
macOS `.DS_Store` files, local dependencies, build output, and environment
files; ignored `.DS_Store` metadata is not a Git synchronization error.

For development on macOS:

```bash
pnpm install --frozen-lockfile
pnpm run verify
git diff --check
git status --short
```

No new runtime or development dependencies are required for the responsive
image and CSS URL checks. If a future change adds dependencies, update and
commit `pnpm-lock.yaml` in the same pull request. Never bypass a failing
quality check to force a deployment.

## Follow-up quality improvements

- Introduce formatting and linting with pinned tooling and a consistent style.
- Add browser tests for keyboard, touch, and pointer behavior of card previews,
  character navigation, timeline, and search.
- Establish accessibility and production-performance baselines before expanding
  content.
