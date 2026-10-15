# Engineering quality checks

The build continues to validate Astro Content Collection schemas and page generation.
These additional checks protect against broken internal navigation as the chapter,
character, and event archives grow.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run test          # Node built-in tests; no additional test dependency
pnpm run check:content # Validate the lore graph before a build
pnpm run build         # Astro production build and schema validation
pnpm run check:links   # Validate local routes/assets in dist/
pnpm run verify        # Run all four, in order
```

`check:links` loads the site origin and base path from `astro.config.mjs` and
checks `href` and `src` targets in generated HTML against files in `dist/`.
It reports missing internal route or asset targets, including same-origin links
that accidentally escape the configured GitHub Pages base path. External URLs
are intentionally excluded. HTML fragment identifiers are also checked; `srcset` and CSS asset URLs
remain outside its scope.

`.github/workflows/quality.yaml` runs these checks on pull requests against
`main`. The Pages deployment uses the same `pnpm run verify` build command, so
new commits on `main` cannot deploy when tests, graph validation, builds, or link checks fail.

`check:content` validates distinct era/chapter/character/event/category IDs,
published-era chapters, chapter and card references, character and event
associations, relationship endpoints and duplicates, and literal
`<CharacterLink id="...">` / `<HistoricalEventReference id="...">` references
in chapter MDX. It uses Node 22+ TypeScript type stripping rather than a new
package dependency. Astro remains authoritative for YAML and MDX schema validation.
All checks are read-only and work with the existing GitHub Pages base path.

## Follow-up quality improvements

- Add `astro check` and formatting/linting with explicit, pinned dev dependencies
  and a regenerated lockfile.
- Add browser tests for keyboard, touch, and pointer behavior of card previews,
  character navigation, timeline, and search.
- Add accessibility and production performance baselines before expanding content.
