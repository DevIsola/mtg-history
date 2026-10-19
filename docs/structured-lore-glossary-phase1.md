# Structured Lore Glossary — Phase 1

- The `glossary` Astro content collection owns ten curated definitions. Each entry is named by a stable kebab-case ID and references a published chapter using Astro `reference('chapters')`.
- `GlossaryTerm.astro` resolves the ID at build time. Place it only around explicitly selected words in authored MDX, rather than running a text-replacement script over historical prose.
- Every term is a normal link to `/glossary/#<id>` without JavaScript. The optional short definition panel opens via mouse hover, keyboard focus on the link, or the adjacent question-mark button on touch/mobile. Escape and outside clicks close the panel.
- The panel is an expandable definition **group**, not an ARIA tooltip, because it contains an interactive link. The canonical glossary page includes a fuller explanation and a link to the context chapter. Focus is not trapped.
- Continue preserving source citations within historical chapter narratives; glossary entries are editorial summaries, not independent proof of contested or speculative lore.
- Automated gate: `pnpm run check:glossary`, included in `pnpm run verify`; Playwright tests cover keyboard, touch activation, and no-JavaScript behavior. Preview at mobile and desktop widths and verify no overflow.
- Phase 2 may add curated cross-references and localization once definitions have completed editorial review. Do not automatically insert terms into all paragraphs.

No new dependencies, no card printing changes, and no change to historical event/character/relationship totals.
