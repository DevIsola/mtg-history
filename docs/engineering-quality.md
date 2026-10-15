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
checks `href` and `src` targets in generated HTML against files in `dist/`.
It reports missing internal route or asset targets, including same-origin links
that accidentally escape the configured GitHub Pages base path, and also checks
HTML fragment identifiers. External URLs are intentionally excluded. `srcset`
and CSS asset URLs remain outside its scope.

`.github/workflows/quality.yaml` runs `pnpm run verify` for pull requests against
`main`; the Pages deployment uses the same verification command. A failing
type check, integrity check, build, or link check must prevent deployment.

## One-time setup for this change

The `pnpm-lock.yaml` must be **regenerated and committed** whenever dependencies
change. This patch deliberately does not hand-edit pnpm's dependency resolution
or package integrity hashes. On the branch where this change is applied, run:

```bash
corepack enable
corepack prepare pnpm@10 --activate
pnpm install --no-frozen-lockfile
pnpm run check:types
pnpm run verify

git add package.json pnpm-lock.yaml docs/engineering-quality.md scripts/type-check-wiring.test.mjs
git commit -m "chore: enforce Astro diagnostics in verification"
```

If `check:types` reports existing errors, fix the source and rerun verification
before committing. Never bypass the checker with `|| true` or disable the CI
step. Subsequently, local clean installations and CI should use
`pnpm install --frozen-lockfile` for reproducible installs.

## Follow-up quality improvements

- Introduce formatting and linting with pinned tooling and a consistent style.
- Add browser tests for keyboard, touch, and pointer behavior of card previews,
  character navigation, timeline, and search.
- Establish accessibility and production-performance baselines before expanding
  content.
