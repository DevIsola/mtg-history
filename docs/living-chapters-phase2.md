# Living Chapters — Phase 2: canonical card artwork viewer

This phase progressively enhances existing `HistoricalCard` references with a
single native HTML `<dialog>`, while preserving the original link around each
card image and the separate "View card on Scryfall" source link.

## Interaction contract

- The new "Enlarge card image" control is hidden without JavaScript. The
  ordinary Scryfall source link remains available in all circumstances.
- The dialog is populated only on demand from the canonical printing UUID,
  title, artist, set, collector number, and chapter-local significance.
- It displays **full-card art**, including printed attribution and frame, not
  art crops. No images are copied locally or downloaded during the build.
- Escape, a visible close button, and backdrop click close the native dialog.
  Focus returns to the same expand button. Dialog focus is handled natively.
- Where supported, a loaded source image uses the View Transitions API to grow
  into the larger image. Otherwise, or when `prefers-reduced-motion` is set,
  opening and closing occur with no animation.
- The shared image is not requested until the viewer opens. A failed CDN image
  preserves the metadata and external source link; the existing image-failure
  handler supplies the placeholder.
- The component is rendered once per page through `BaseLayout.astro`; it does
  not add a separate dialog for every card or duplicate canonical card data.

## Acceptance

Run `node --test scripts/card-artwork-viewer.test.mjs` then
`pnpm run verify && pnpm exec playwright test`. Visually review chapter images
in both themes, desktop and mobile, Escape/focus return, reduced motion, and
source links. The Playwright suite covers JavaScript-disabled fallback and
simulated image CDN failures.

This is an image-viewing enhancement, **not** automatic card expansion on scroll.
The Chapter Phase 1 reveal observer remains unchanged. The implementation does
not assert that any historical illustration has been visually certified as an
exact depiction of an event; the existing editorial ledger owns that judgment.

## Future phase

Consider optional card-to-hero navigations or a chapter glossary only after
measured accessibility and performance baselines; avoid disruptive transitions
between different historical printings.
