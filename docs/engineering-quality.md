# Engineering quality checks

The build continues to validate Astro Content Collection schemas and page generation.
These additional checks protect against broken internal navigation as the chapter,
character, and event archives grow.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run test          # Node built-in tests; no additional test dependency
pnpm run build         # Astro production build and content validation
pnpm run check:links   # Validate local routes/assets in dist/
pnpm run verify        # Run all three, in order
```

`check:links` loads the site origin and base path from `astro.config.mjs` and
checks `href` and `src` targets in generated HTML against files in `dist/`.
It reports missing internal route or asset targets, including same-origin links
that accidentally escape the configured GitHub Pages base path. External URLs
are intentionally excluded. Fragment identifiers, `srcset`, and CSS asset URLs
are not yet checked and should be handled by a later, focused enhancement.

`.github/workflows/quality.yaml` runs these checks on pull requests against
`main`. The Pages deployment uses the same `pnpm run verify` build command, so
new commits on `main` cannot deploy when the tests, build, or link validation fail.

## Follow-up quality improvements

- Add `astro check` and formatting/linting with explicit, pinned dev dependencies
  and a regenerated lockfile.
- Validate source-level character, event, chapter, and relationship references
  independently of page generation.
- Add browser tests for keyboard, touch, and pointer behavior of card previews,
  character navigation, timeline, and search.
- Add accessibility and production performance baselines before expanding content.
