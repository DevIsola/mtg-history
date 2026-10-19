# Image asset ownership — Phase 1

The site owns **image selection, exact Scryfall printing identity, layout sizing,
loading behavior, descriptive context, and attribution**. It does not own the
copyrighted card art or the external image CDN.

## Current image delivery

- The canonical card collection (`src/content/cards/<UUID>.json`) identifies the
  selected printed card and the credited artist. Do not substitute a card name
  or Oracle ID for this UUID.
- `src/utils/card-images.mjs` is the **single provider** for browser-facing
  full-card URLs, emitting `small` (146w), `normal` (488w), and `large` (672w)
  variants. `normal` remains the `src` fallback; each `<img>` uses intrinsic
  488 × 680 dimensions, responsive `srcset`/`sizes`, lazy loading, and async
  decoding. Image variants preserve the card border and printed credits.
- Never use `art_crop`, `border_crop`, color filters, or text overlays on the
  card. Existing gallery/editorial attribution must remain in place.
- Card previews assign a source only when invoked. The artwork review gallery
  uses the same provider and remains a read-only manual review tool.
- The app still loads card artwork externally from Scryfall; we **do not**
  claim offline image availability or guaranteed image delivery. Broken remote
  images are not fixed by a local integrity test.

## Ownership and safeguards

`pnpm run check:images` checks the canonical printing IDs, central-provider
ownership, and responsive image markup. The existing `check:cards` and
`check:artwork` validate references, curatorial metadata, and the artwork
ledger separately. None of these automated checks proves that all 135
illustrations have passed human visual inspection.

Browser regression tests cover card image `srcset`/`sizes`, dimensions and
previews. Continue to test light/dark modes, desktop/mobile grid layouts, and
external-image failure behavior manually.

## Future decisions, not implemented in this patch

1. Investigate legal/attribution and licensing requirements before mirroring,
   downloading, transcoding or redistributing Wizards of the Coast artwork.
2. If rights permit self-hosting, add a controlled asset manifest keyed by
   printing UUID and checksum, with versioning, file-size budgets and explicit
   cache expiry. Do not trigger mass downloads in CI or the static build.
3. Compare actual production CDN availability and Core Web Vitals before
   choosing a hosting/cache provider. A `srcset` does not guarantee faster
   loading unless browser request timing and payload sizes improve.

Public references: https://scryfall.com/docs/api and
https://scryfall.com/docs/api/images. All Magic artwork remains attributed to
its respective artists and rights holders.
