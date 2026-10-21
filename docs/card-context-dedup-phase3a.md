# Card model: contextual data deduplication (Phase 3A)

> **Historical migration record.** This one-time migration was completed and its obsolete runner has been retired. Commands below document the original rollout and must **not** be executed against current `main`. For supported checks, use `pnpm run verify` and see [project maintenance](project-maintenance.md).


After the canonical printing registry and consumers are merged, this migration
retires two now-redundant fields without changing the user-facing history:

- Event JSON uses `cardId` only, dropping the display-only `cardName`.
- Character JSON retains `featuredCardId` and a `featuredCard.significance`
  string, dropping duplicated name, set, collector number, Scryfall UUID and
  artist from each featured portrait.

**Source of truth:** `src/content/cards/<uuid>.json` owns exact printing
metadata. Historical significance remains with the applicable chapter or
character. The existing 135 chapter card uses and artwork review ledger stay
unchanged. This is intentionally not a visual-artwork verification.

## One-time migration

From a clean feature branch based on `main`, after applying the preparatory
patch, run:

```sh
node --test scripts/card-context-migration-tools.test.mjs
node scripts/migrate-card-contexts.mjs --check
node scripts/migrate-card-contexts.mjs
pnpm run check:entities
pnpm run check:cards
pnpm run verify
pnpm exec playwright test
```

The migration validates all 87 character portraits, 125 events and all five
source-file anchors **before writing**. It checks each portrait's complete
printing identity against its canonical record and each event against its
chapter's selected printing. It creates temporary files and renames them
in-place after successful validation. Refuses to rerun or to delete unexpected
fields. Do not rerun it after migrating.

The five code updates cover the Astro schemas, typed compatibility adapters,
content graph integrity check, and canonical card-collection check. Earlier
one-time card migration helpers remain untouched and their legacy fixtures
continue to work.

## Editorial rules

- Never identify an event image using only an English card name. Use `cardId`.
- Never copy printing metadata into a character portrait. Use
  `featuredCardId`, and retain `featuredCard.significance`.
- Continue to author chapter-local significance and existing curated card
  printings in the chapter frontmatter until Phase 3B.
- The offline checks cannot establish that a card's illustration actually
  depicts the event; manual editorial assessment remains required.

## Following phase

Phase 3B will remove the **remaining chapter-level printing fields** and adapt
all artwork, editorial metadata, provenance, and MDX authoring tooling to
read canonical printings, while keeping historical significance per use. That
is separate because the offline provenance and artwork tooling currently
reads chapter card metadata directly and must not be weakened in this step.
