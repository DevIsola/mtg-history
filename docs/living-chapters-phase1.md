# Living Chapters — Phase 1: progressive narrative reveals

## Scope and ownership

Historical chapters progressively introduce **section headings** and existing
**HistoricalMoment** illustrated sidebars when they enter the viewport. Every
illustrated moment already sits at the relevant editorial paragraph in MDX.
This phase does **not** move cards, rewrite source paragraphs, alter canonical
printing identities or change attribution. Card-to-hero transitions and
additional scroll effects remain separate future milestones.

- `src/utils/living-chapters.mjs` is the only observer implementation. It is
  imported by the chapter page, not included on the homepage, archives or
  character pages. The utility is dependency-free and usable in Node tests.
- `_chapter-themes.scss` owns the motion treatment because MDX-rendered
  narrative markup intentionally requires page-level selectors. Styles are
  limited to `.chapter-theme .chapter-prose` and to elements bearing the
  runtime `data-living-reveal` attribute.
- The site starts **fully visible without JS**. Observation is an enhancement;
  unsupported browsers, reduced-motion users and already-visible headings
  remain untouched. Pending content is merely 92% opaque and shifted 10px;
  no text or illustration is `display:none` or otherwise blocked.
- The observer unobserves completed reveals. It skips zero-height elements
  and nodes already on screen during setup (including anchor navigation).
  No animation library or scroll handler is added.

## Acceptance

1. `node --test scripts/living-chapters.test.mjs` validates observer behavior,
   graceful degradation, and the source/style ownership contract.
2. `pnpm run verify && pnpm exec playwright test` covers desktop/mobile,
   reduced motion, JavaScript disabled, existing chapter navigation, card
   source labels, and the new reveal behavior.
3. Visually inspect Thran, Ice Age and War of the Spark on narrow and wide
   screens in light/dark modes. Confirm that the card art and caption are never
   masked, and that fast scrolling does not cause distracting movement.

Performance budgets are unchanged; test production preview separately before
introducing heavier animations. No new dependencies, copyrighted artwork or
content collection records are part of this phase.
