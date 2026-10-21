# Entity content collections — migration 1: canonical records

> **Historical migration record.** This one-time migration was completed and its obsolete runner has been retired. Commands below document the original rollout and must **not** be executed against current `main`. For supported checks, use `pnpm run verify` and see [project maintenance](project-maintenance.md).


## Architecture

Character biographies, historical events, and relationship ties are now stored as
independent JSON records under `src/content/{characters,events,relationships}/`.
Astro's glob loader derives stable content IDs from filenames. The schemas in
`src/content.config.ts` validate data shapes and `reference()` relationships to
published chapter and character records. See Astro's documentation for querying
with `getCollection` or resolving references with `getEntry`.

`src/data/characters.ts`, `src/data/events.ts`, and `src/data/relationships.ts`
remain **generated compatibility adapters**. They import the JSON records in
original editorial order, preserving the existing synchronous imports used by
pages, graph renderer, MDX components, and the offline content-graph validator.
**Never edit the adapters by hand**. Edit the JSON records instead. When adding
an entity, add its JSON file and an import/entry in its adapter in the proper
editorial order (a later phase can eliminate these adapters when consumers have
migrated to Astro collection reads). The `check:entities` gate fails if a JSON
file is missing, orphaned, or differs from its loaded adapter.

The existing `check-content-graph.mjs` is deliberately retained to validate
editorial invariants that `reference()` does not express, such as relationship
pair uniqueness, chapter/cardName matching, and directory category coverage.

## One-time migration

On a clean feature branch after applying the preparatory patch:

```bash
pnpm run migrate:entities
pnpm run check:entities
pnpm run verify
pnpm exec playwright test
```

The migration is **intentionally non-idempotent**: if any destination collection
folder exists, it stops without overwriting author-edited records. Do not run
it again after the JSON files have been generated. The expected counts are
87 character JSON files, 125 event JSON files, and 116 relationship JSON files.

Review `git status --short` and `git diff --stat` after running migration; the
individual JSON files are new and must be staged to be included in the PR.
Review a representative sample of the generated JSON, especially the featured
card, source citation, chapter references, and relationship labels. Do not
silently change any historical claims as part of this data migration.

## Rollback and verification

Before committing, revert the feature branch's tracked changes and delete only
its newly generated `src/content/{characters,events,relationships}` directories
if necessary; never delete these folders after editorial work begins. Branch
history and the commit provide the long-term rollback point once merged.

Additional expected invariants: ten chapters, 135 chapter artwork references,
87 characters, 125 events, 116 relationships; no change to generated page count,
route slugs, category placement, historical interpretation, or artwork ledger.

## Next refactor

After this migration, switch server-side Astro consumers to `getCollection()`
and explicit `reference()` resolution, then remove the compatibility adapters.
The next data-model roadmap item is making cards a first-class collection keyed
by Scryfall UUID, avoiding repeated card objects and plain `cardName` links.
