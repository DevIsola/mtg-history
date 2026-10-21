# Pre–Phase 13: UX Wave B — editorial chapter reading

## Intent

The English chapter reader now favors uninterrupted historical narrative over a
stack of boxed controls and full-card frames. The chapter switcher participates in
normal document flow rather than adding a second sticky desktop navigation band.
The sticky TOC stays attached to the global header, with a shorter mobile control.

Historical moments now use a quiet editorial plate: a cropped **detail of the
same exact Scryfall printing** appears beside the historical prose. The full
uncropped printing remains available through the existing artwork dialog and
through the original direct Scryfall image link. Artist, set, collector number,
source URL, and local historical significance remain preserved in the DOM.
The historical interpretation is accessible in a native `<details>` disclosure,
including without JavaScript. Only moments in English MDX use compact mode;
archive, events, character profiles, and Portuguese canonical reference cards
retain their existing full-card presentation.

## Editorial and accessibility boundaries

- No source narrative, printing UUID, event, relationship, ledger, or source URL changes.
- No JavaScript dependencies, scroll listeners, or automatic opening/closing.
- Keyboard and touch users can open the native context disclosure.
- The image's original alt text and the card viewer's full source artwork remain.
- The cropped visual is an editorial preview, **not** an assertion that the
  underlying painting depicts the stated historical event.
- Chapter scroll-reveals and reduced-motion behavior are unchanged.
- The full Pagefind and localized Portuguese routes are unaffected.

## Verification

Run `node --test scripts/ux-wave-b-chapter-reader.test.mjs`,
`pnpm run verify`, and `pnpm exec playwright test`. Inspect Thran,
Weatherlight and War of the Spark, in both themes, at 1280px and 390px widths.
Check keyboard operation of the interpretation disclosure, direct Scryfall
link, zoom dialog focus return, deep links and the mobile TOC. The visual
acceptance should explicitly verify that art cropping does not present a
misleading historical scene; adjust crop placement if needed.
