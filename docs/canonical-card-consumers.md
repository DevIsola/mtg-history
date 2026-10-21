# Canonical card consumers — Phase 2

> **Historical migration record.** This one-time migration was completed and its obsolete runner has been retired. Commands below document the original rollout and must **not** be executed against current `main`. For supported checks, use `pnpm run verify` and see [project maintenance](project-maintenance.md).


PR #76 created the exact-printing registry at `src/content/cards/<Scryfall-UUID>.json`.
This phase makes the reader-facing card renderers use that registry. Existing
chapter `cardIds`, event `cardId`, and character `featuredCardId` are the only
identities used for visual printing selection; never match a card by its name.

## One-time migration

On a clean feature branch based on `main`:

```sh
pnpm run migrate:card-consumers
pnpm run verify
pnpm exec playwright test
```

The migration tool checks the expected source of **every** consumer before
writing anything. It will reject a stale checkout or an already-migrated tree;
do not repeatedly run it. It edits these 11 existing files:

- historical card, historical moment, hover preview and character link components
- archive, discovery, event index, event detail and character detail pages
- the `characters.ts` and `events.ts` compatibility adapter interfaces

The central utility `src/utils/card-printings.ts` resolves a card UUID to its
canonical name, set, collector number and artist; it fails on missing UUIDs.
Chapter significance and character portrait significance stay attached to the
specific historical use. Existing page URLs, cards, and illustrations are
unchanged. Components can receive a legacy use object temporarily, but
**render the canonical printing**. Existing offline `check:cards` continues to
reject metadata drift and lost references.

## Remaining cleanup (separate PR)

The transitional objects are still present in chapter frontmatter and character
JSON, and `cardName` remains on event JSON for backwards compatibility.
The next change can remove those duplicated fields **only after** adapting
chapter-content authoring, provenance, artwork/editorial scripts and all
validation tests. The 135-use artwork ledger is not a claim of independent
image-level verification; its existing review process remains necessary.

## Manual acceptance

- Compare title, illustration, set code, collector number and artist against the
  canonical JSON for a Thran chapter card and the Urza portrait.
- Confirm historical significance captions did not change.
- Verify Archive, Discover and both event page forms render correct card images.
- Open character hover previews and the Relationships graph; confirm links work.
- Check narrow/mobile view and both themes.
