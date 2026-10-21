# UX Wave C1 — Shared navigation and responsive chapter reading

Baseline: d77e3c8a4dd74a4d1e07d3f5e984a93181695817 (PR #139).

This wave implements the first stage of the approved editorial mockup direction.
The shared header has Read, Explore and About; the Explore disclosure reaches
all existing destinations. Search links to the existing Pagefind page; it is
not another search engine. The always-visible language selector only offers
same-route switches for genuine locale pairs. On unpaired pages, it labels
each locale's home page explicitly. English-only destinations retain (EN).

At >=1440px, chapters have a TOC, an article with a 68ch maximum prose
measure, and a right context rail. Narrower desktop layouts put context below
the article; tablet and mobile become one column. The rail derives people
and events from the chapter's current canonical records. It intentionally does
NOT claim section-level or passage-level evidence. Reading preferences use a
native progressive disclosure; without JS the controls are absent but the
narrative remains visible.

Generated UI mockup imagery is an aesthetic reference, not verified Magic
artwork or evidence for dates, people, scenes or publication chronology.
This wave does not introduce new image assets, custom lore or new metadata.

Verification:

    node --test scripts/ux-wave-c1.test.mjs
    pnpm run verify
    pnpm exec playwright test tests/browser/ux-wave-c1.spec.mjs
    pnpm exec playwright test

Inspect 320, 390, 768, 1024, 1200, 1440 and 1600px, both themes,
English/PT-BR routes, tab focus, no-JS mode, TOC anchors and Scryfall links.
