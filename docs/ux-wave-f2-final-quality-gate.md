# UX F2 — Final editorial UX and accessibility acceptance

## Purpose

Audit the responsive redesign from C1 through F1 before starting Living Chapters. This wave introduces no historical content or image substitutions. A successful script run verifies the tests it actually performs; it is **not a WCAG certification**, a substitute for editorial review, or proof of remote artwork availability.

## Deliverables

- `src/utils/ux-f2-audit.mjs`: central route/view matrix, deterministic theme color ratios, PT printing identity checks.
- `scripts/ux-wave-f2.test.mjs`: offline integrity gate for site theme contrast, relationship legend colors, canonical content totals, and localization catalog references.
- `tests/browser/ux-wave-f2.spec.mjs`: browser smoke tests for EN/PT routes, 320/390/768/1440px overflow, skip link and locale navigation, homepage illustration fidelity, graph fallback, and no-JavaScript relationship evidence.
- `scripts/review-ux-f2.mjs`: local-only, deterministic first-viewport screenshot matrix. Outputs an HTML gallery, PNG images and a machine-readable JSON issue report outside the repository.

## Required commands (macOS)

```sh
cd ~/Documents/Projects/mtg-history
node --test scripts/ux-wave-f2.test.mjs
pnpm run verify
pnpm exec playwright test
```

The existing `tests/browser/accessibility.spec.mjs` collects WCAG axe findings as baseline JSON; its normal mode does **not** fail the suite on issues. To check unresolved severe findings deliberately:

```sh
A11Y_ENFORCE=1 pnpm exec playwright test tests/browser/accessibility.spec.mjs
```

If this fails, preserve the report, remediate confirmed serious/critical findings, and rerun. Do not turn off enforcement to claim approval. The existing performance suite runs separately with a built `dist/`:

```sh
pnpm exec playwright test --config playwright.performance.config.mjs
```

Compare performance reports against a prior controlled run; no laboratory measurement is a field Core Web Vitals result.

## Produce the visual review gallery

After `pnpm run build` or `pnpm run verify`, serve the production preview in one terminal:

```sh
pnpm exec astro preview --host 127.0.0.1 --port 4322
```

In a second terminal:

```sh
node scripts/review-ux-f2.mjs --out "$HOME/Downloads/mtg-f2-review" --full
open "$HOME/Downloads/mtg-f2-review/index.html"
```

The default screenshot matrix covers 14 routes × 2 themes × 2 widths (390/1440px) = 56 captures. `--full` adds 320/768px, generating 112 captures. The preview must be serving the intended build. The renderer reports every checked route and writes files incrementally; it never silently claims success. It exits nonzero for HTTP, missing heading, image-alt, incorrect locale/theme, or horizontal-overflow findings. It records only the first viewport of each page; inspect further down long pages manually. Remote Scryfall imagery is not considered canonical fidelity evidence merely because it appears on screen.

## Required editorial and UX manual sign-off

1. **Global header:** discoverability of Read / Explore / About; Ko-fi; EN/PT selector; keyboard focus; search palette and Escape/Tab behavior. Confirm focus never disappears behind the sticky header.
2. **Responsive:** inspect at 320, 390, 768, 1024 and 1440px. Check horizontal overflow, text wrapping, narrow button targets, overlays, event grids, chapter sidebar folding, and search-result rows.
3. **Accessibility:** use keyboard-only navigation and VoiceOver on macOS; check labeled form controls, live region updates, native dialog focus return, meaningful link names and reduced-motion behavior. Axe misses many interaction problems.
4. **Theme contrast:** inspect dark/light page surfaces, fine print, disabled controls, selected items, hover/focus outlines and the six relationship line colors and dash patterns. Automated token contrast is not sufficient to verify graph readability at every zoom level.
5. **Historical provenance:** verify exact Scryfall UUID, set/collector number, illustrator, crop/printing, and significance text in the homepage, chapter, character, timeline and archive. Never treat a character portrait or symbolic object as literal event-scene evidence.
6. **Localization:** compare EN/PT artwork for the same canonical historical reference, validate official PT printing where available, and confirm English fallback labels and EN-only chapter links are explicit. Do not imply PT historical editorial content is translated if it remains English.
7. **Graphs and search:** test Graph/Cards switches, focused and global labels, URL state, chapter filters, name finder, color/line legend, inspector links, and graph-failure fallback. Pagefind palette and full search must continue to share the same index.
8. **No-JS and low connectivity:** relationship records must stay readable without JS; link destinations and no-JS search must not disappear. Scryfall outages must leave recoverable image fallback and canonical metadata.
9. **Quality artifacts:** retain `index.html`, `report.json`, screenshots and accessibility/performance output with the PR or release ticket (not committed automatically). Record each remediation with before/after comparison.

## Acceptance decision

- Code gates: `pnpm run verify`, complete Playwright suite and severe/critical axe enforcement pass.
- Release review: visual gallery reviewed in both themes; manual keyboard and mobile checks complete; artwork fidelity checked against the card-printing ledger; no unresolved critical/serious accessibility findings; any moderate/minor findings documented.
- Existing expected inventory: 10 chapters, 88 characters, 133 historical events, 118 relationships, 133 unique card-printing records and 135 chapter-card references. These figures are from the current editorial snapshot, not a target to silently change.
- Only then start Phase 13 Living Chapters. Any defect discovered during F2 should be resolved with a targeted corrective commit and regression test before acceptance.
