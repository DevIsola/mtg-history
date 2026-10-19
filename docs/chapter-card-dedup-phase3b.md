# Chapter card metadata deduplication — Phase 3B

This completes the canonical printing migration without erasing chapter-specific
historical interpretation or the artwork fidelity ledger.

- `src/content/cards/<uuid>.json` is the only owner of printing metadata.
- A chapter's `cardIds` ordered Astro references identify exact printings.
- A chapter's equally ordered `cards` entries now contain **only** `significance`.
- `<HistoricalMoment>` receives the indexed `cardId` and significance separately;
  the existing narrative body and its location remain unchanged.
- An offline `loadCuratedChapters()` projection expands this minimal data for
  existing editorial, Scryfall provenance, and artwork-fidelity validation. It
  does not edit or certify those records and never uses the network.

## One-time migration

On a clean branch based on main, apply the implementation patch and run:

```sh
node --test scripts/chapter-card-migration-tools.test.mjs
node scripts/migrate-chapter-card-contexts.mjs --check
node scripts/migrate-chapter-card-contexts.mjs
pnpm run verify
pnpm exec playwright test
```

The `--check` run verifies 10 chapter sources, 135 curated card references,
132 `HistoricalMoment` uses and eight source consumer rewrites before writing. The event detail page
already uses `ReturnType<typeof chapterCardUse>` and requires no rewrite.
The migration rejects a second run. Do not run the migration on an already
partially changed worktree. If it fails, inspect the reported anchor or card ID.

## Editorial controls

The existing Scryfall audit remains an **optional network-dependent** audit;
`pnpm run verify` remains offline. The 135-row artwork ledger and its evidence
labels remain unchanged. A `context-assessed` label is not image-level visual
verification. The hydration layer supplies printing data for matching the
ledger and external provenance checks, not evidence about image interpretation.

Before merging, verify the Thran chapter, several later chapters, the archive,
events, character portraits, and graph, including preview cards and artist
credits. Confirm that the artwork gallery has all 135 curated references.
