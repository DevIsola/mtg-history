# Phase 14E — Local hardening and release gate

The full verify pipeline checks regression tests, schemas, exact-printing references, provenance, editorial metadata, image handling, SCSS architecture, era contrast, glossary, Astro diagnostics, build, Pagefind and internal links.

The browser migration suite checks canonical URLs, honest language metadata, EN/PT exact-printing membership, both themes, desktop/mobile overflow, static legacy fragment links with JavaScript disabled, and serious/critical axe findings. Theme screenshots are retained with test output. Axe does not replace manual keyboard or assistive-technology review.

Playwright preview commands use --ignore-lock so Astro 7.3.8 does not automatically background an agent-launched preview and terminate Playwright’s server process. Playwright owns the foreground process and its teardown. This applies to browser, performance and README screenshot configurations.

The production performance suite samples existing baseline routes plus both split chapters on desktop/mobile. Preserve three output directories and compare them; these measurements describe local lab conditions, not field Core Web Vitals.

Release remains pending the human acceptance listed in phase14d-evidence-acceptance.md and phase14c-chapter-split.md. Follow implementation-workflow.md; do not merge an incomplete phase merely because code checks pass.

## Local verification — 23 October 2026

- Full verify: 433 Node tests pass; type diagnostics, content, artwork, schema, build, Pagefind and built links pass.
- Strict desktop/mobile browser suite: 422 pass, six existing device-specific skips. Both-theme serious/critical axe checks pass for all four split-chapter EN/PT routes.
- Three sequential performance runs: 22 tests pass per run; 66 JSON reports preserved. The split chapters show maximum measured desktop CLS of 0.0112 and mobile CLS of 0 in these local capture windows. No controlled pre-change sample exists, so these runs establish repeatability, not a demonstrated performance improvement.
- Sixteen first-viewport chapter screenshots and sixteen baseline axe reports are preserved outside the repository.
- Direct baseline comparison preserves all card metadata, event narratives, character biographies, relationship contexts and original artwork evidence classifications.

The review packet is in the chat workspace’s phase14-review folder. Human editorial, artwork, PT-BR and assistive-technology acceptance remains pending.
