# Living Chapters — Phase 4: polish and measured performance acceptance

## Scope

Phase 13.3 introduced the in-chapter Illustrated Moments Trail, building entries exclusively from already-rendered canonical card references. This phase tightens its navigation lifecycle and presentation, rather than adding a new animation library, a speculative story illustration, or a new search path.

- The active illustration's decorative accent now uses an inset shadow, which does not change the card's border width and therefore does not move the historical paragraph or Scryfall link when follow mode is enabled.
- Scroll and resize events remain passive and coalesced to at most one queued animation frame. Only outgoing/incoming trail entries have current-state mutations; checkbox changes do not rewrite the entire list. Pending scroll and deep-link frames can be cancelled on disconnect; the panel can be cleanly re-initialized.
- Hover image lifts are suppressed for users requesting reduced motion, while keyboard focus and the original artwork viewer continue to work.
- No content collections, card printings, copyright images, source links, historical claims, source descriptions, or localization records change.

## Regression and browser gates (Windows PowerShell)

```powershell
node --test scripts/living-chapters-phase4.test.mjs
pnpm run verify
pnpm exec playwright test tests/browser/living-chapters-phase4.spec.mjs
$env:A11Y_ENFORCE = '1'
try {
  pnpm exec playwright test tests/browser/accessibility.spec.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Strict accessibility gate failed' }
} finally { Remove-Item Env:A11Y_ENFORCE -ErrorAction SilentlyContinue }
pnpm exec playwright test
```

Test at 320, 390, 768, 1024, 1440 pixels; check Thran, Ice Age and War of the Spark in both themes, with/without JavaScript and reduced motion. Verify original canonical Scryfall metadata and printable card links.

## Local production performance review

```powershell
pnpm run build
1..3 | ForEach-Object {
  pnpm exec playwright test --config playwright.performance.config.mjs
  if ($LASTEXITCODE -ne 0) { throw "Production performance sample $_ failed" }
}
```

The existing baseline suite records FCP/LCP/CLS and same-origin bytes on representative routes. The new `tests/performance/living-chapters-phase4.spec.mjs` records chapter interaction counts, first-party transfer bytes, lab CLS during a short scroll window, supported long-task observations, and horizontal overflow for desktop/mobile. Every test writes `living-chapter-performance.json` under the Playwright test output directory; retain each run's files elsewhere before the next run overwrites the output directory. The tests deliberately do not use invented score thresholds. Compare at least three runs per machine/browser, inspect regressions, and document the accepted baseline.

These measurements exclude cross-origin Scryfall images from first-party transfer totals and are **not** proof of real-device Core Web Vitals or WCAG certification. Chrome may not expose all performance entries in all environments. Review unsupported metrics as `null` and avoid making claims from one noisy run.

## Editorial acceptance

Compare exact printing UUIDs, art crops, card attribution, local historical interpretations, and original source links against the existing artwork ledger. Check responsive layout after using the illustration follow checkbox, deep-link reloads, keyboard navigation, focus return from the full-card dialog, and no-JS content. Do not merge if severe accessibility checks fail, or if new decorative states shift the prose.
