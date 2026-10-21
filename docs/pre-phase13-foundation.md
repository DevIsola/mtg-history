# Pre-Phase 13 — Accessibility foundation and reader corrections

Baseline: eb49c8491f7427af5b7b17d6c7791513824bc130. This is the first PR in a deliberate UX remediation program.

## Included
- Centralized semantic text links and accent text across dark/light surfaces; dark `--link-color` is no longer inherited from light mode.
- Removed per-selector dark-mode overrides in favor of semantic component tokens.
- Paper-surface gold typography converted to accessible accent text; gold remains ornamental.
- All `font-size` declarations smaller than 0.75rem in SCSS and Astro files raised to 0.75rem.
- Fontsource **Source Sans 3 Variable** (body) and **Fraunces Variable** (display), both OFL-1.1, bundled locally by Vite. Font files are not externally hosted.
- Sticky mobile chapter TOC attaches to the header without a transparent gap; the reader measures 68ch at 1.72 line-height.
- Roman-prefixed H2 labels are not double-numbered in the TOC; glossary retains its accessible touch button and uses a normal underline rather than dotted plus question-mark styling.

## Verification
1. Install font packages with `pnpm add -E @fontsource-variable/source-sans-3@5.3.0 @fontsource-variable/fraunces@5.3.0` (updates package.json and pnpm-lock.yaml).
2. Run `node --test scripts/pre-phase13-foundation.test.mjs`.
3. Run `pnpm run verify && pnpm exec playwright test`.
4. Inspect light/dark chapter TOC, the first historical card dialog, Discover/Characters/Event/Archive text accents, and mobile sticky layout at 320/390px. Verify font files load from same-origin local assets and there is no CLS or regression in desktop/mobile text flow.

## Not part of this PR
The structural redesign of site-wide navigation, Discover/Search information architecture, timeline, relationship graph and archive tiles is intentionally staged into separate PRs. These require component-level markup changes, browser acceptance and screenshot review. The existing card art continues to use canonical un-cropped printings; do not silently replace them with alternative images or crops.
