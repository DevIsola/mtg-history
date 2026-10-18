# First-class cards — canonical printing collection (Phase 1)

Cards are indexed by **exact Scryfall printing UUID**, not their English names
or Oracle IDs. Two different printings of a card remain separate records.

`src/content/cards/<scryfall-uuid>.json` owns four printing fields:
`name`, `setCode`, `collectorNumber`, and `artist`. The filename is the card ID.
These canonical printing fields must agree across every use. Historical
`significance` is deliberately **not** canonical: one printing can be cited
in multiple chapters for different reasons. The 135 chapter card references
and artwork fidelity ledger remain intact.

## One-time migration

Run once from a clean branch based on main:

```sh
pnpm run migrate:cards
pnpm run check:cards
pnpm run verify
pnpm exec playwright test
```

The migration reads the 10 MDX chapter frontmatter lists, 87 character JSON
records, and 125 event JSON records. It creates a printing registry and adds:

- `chapter.data.cardIds`: exact ordered printing references, alongside the
  existing chapter-specific `cards` and `significance` entries.
- `character.data.featuredCardId`: printing reference, alongside existing
  `featuredCard` display metadata.
- `event.data.cardId`: resolved against the `cardName` in the event's own
  historical chapter, without global name guessing.

The Astro schemas use `reference("cards")` to validate the new links at
sync/build time. Existing page and graph components continue reading the
legacy display objects for now. This avoids an unrelated UI rewrite.

The migration refuses to run if `src/content/cards` already exists, refuses
ambiguous card names within a chapter, rejects conflicting printing identities,
and verifies all input links before writing. Do not rerun it after completion.
Changes to card records are checked by the offline `check:cards` gate, added
to the full `verify` pipeline. This gate is not a live Scryfall provenance
certificate or a visual artwork review.

## Editorial workflow

Edit a canonical printing's set, number, name, or artist in its JSON file,
then reconcile corresponding legacy chapter or featured-card metadata until
the migration's consistency gate passes. During this transitional phase,
editing only a canonical file intentionally fails validation. Do not infer
relationships or replace printing IDs from card names.

## Next migration stage

Move historical UI consumers to a centralized card lookup and eliminate the
remaining duplicated printing metadata. Preserve contextual `significance`
per chapter and per featured portrait; migrate events from `cardName` to
canonical `cardId` once consumers are updated. Afterwards, remove the
transitional equality checks while retaining provenance and editorial gates.
