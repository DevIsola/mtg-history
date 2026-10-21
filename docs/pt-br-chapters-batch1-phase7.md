# PT-BR historical reading batch — Phase 7

This release introduces original, **condensed Portuguese narrative adaptations** for Chapters 02–04:

- `/pt-br/chapters/brothers-war/` (eight Portuguese narrative sections)
- `/pt-br/chapters/ice-age/` (ten Portuguese narrative sections)
- `/pt-br/chapters/weatherlight/` (thirteen Portuguese narrative sections)

The already published Thran reading companion remains unchanged. Every new page advertises its own canonical URL and is indexed by the existing static sitemap and Pagefind process. None claims full textual equivalence to the English chapter, and none advertises chapter `hreflang` alternates until editorial parity is accepted.

## Historical identity contract

English `src/content/chapters/*.mdx` remains the canonical source for publication bibliography, six-plus card identities, printing/significance metadata, English prose, and source citations. The Portuguese pages reuse these values through `getEntry('chapters', id)` rather than copying UUIDs or source links. Historical events remain English records. The new adaptations link **all 45 exact event references** associated with the three original chapters, with English-language notices. Card displays reuse **44 exact chapter printing references** in original source order; their original English historical-significance captions are explicitly identified as untranslated.

The three Portuguese narratives are authored as a typed data collection in `src/data/pt-chapter-batch1.mjs`; Astro generates static pages at the existing `pt-br` route base. Do not replace original English Markdown files, invent translations of Scryfall card titles, or mark language parity automatically.

## Deferred editorial acceptance

This batch prioritizes substantive initial coverage. A later editorial review must compare the adaptation to the original English chapter section by section, confirm terminology, inspect all original card illustrations and source contexts, and assess omissions. A future report-a-correction UI can turn reader feedback into a review queue, but no issue-submission feature is silently included in this patch. A complete translation, certification, or chapter `hreflang` pairing is **not** claimed by this release.

## Verification

Run `node --test scripts/pt-chapter-batch1.test.mjs`, `pnpm run verify`, and `pnpm exec playwright test`. Review all three Portuguese pages on desktop/mobile and with JavaScript disabled. Check the source counts: Chapters 02/03/04 have 11/11/22 card printings and 12/12/21 linked historical-event references, respectively. Ensure no changes to the original 10 chapters, 88 characters, 133 events, 118 relationships or 135 curated card uses.
