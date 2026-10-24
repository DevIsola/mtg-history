# Chapter visual themes — Phase 1

Ten existing editorial chapters now have distinct, restrained color accents.
These are *narrative/era palettes*, not claims that an era or plane has a single mana
color. Multi-plane chapters use a broad editorial palette rather than arbitrary
plane-to-color equivalence. No historical content or artwork is changed.

- `_chapter-themes.scss` is the sole palette registry. `@each` emits static CSS
  selectors keyed to the exact chapter slug; colors are read through runtime
  custom properties. Do not create a parallel TS palette registry.
- `src/pages/chapters/[id].astro` sets `data-era-theme={chapter.id}` on a local
  wrapper. Global theme tokens and navigation remain untouched.
- Light and dark accent colors meet WCAG AA 4.5:1 against their corresponding
  `--paper-white` surfaces, enforced by `pnpm run check:themes`.
- Banner gradients remain dark enough for the existing light banner text.
  Validate contrast for any new gradients and interactive states manually.
- This intentionally changes chapter accent colors but not typography metrics,
  spacing, card prints, existing motion, sticky navigation, or content.
- The offline gate compares Sass map keys with chapter files and the editorial
  era registry. New chapters must add a palette and pass the same tests.
- Browser tests cover chapter identity and theme changes; visual review should
  check desktop/mobile at 600px, 680px, 900px, light/dark, and keyboard focus.

Follow-on phases: optional scroll-responsive narrative artwork that respects
`prefers-reduced-motion`, then structured glossary hover/focus cards. Avoid
WebGL until a lightweight static landing experience meets performance budgets.

## Release workflow

Follow [implementation-workflow.md](implementation-workflow.md). Keep one branch
for the complete phase, commit/push increments and run local verification, browser
tests and visual acceptance before merging. Automatic checks run only after merge
to main. Inspect the Pages deployment separately; a failed deployment does not
roll back the merge.
