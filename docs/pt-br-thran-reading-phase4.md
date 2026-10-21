# PT-BR — Phase 4: Thran historical reading companion

The Portuguese chapter URL `/pt-br/chapters/thran/` is a **condensed editorial adaptation** of the existing English narrative, **not a full translation**. The complete historical edition remains at `/chapters/thran/`. The distinction appears prominently on the PT-BR page and in the timeline link; no reciprocal `hreflang` equivalence is advertised for the chapters.

## Content and source boundaries

- The Portuguese reading companion covers the canonical narrative's thirteen major sections, including the historical distinction between Glacian's invention, Yawgmoth's implantation of the fractured stone, Rebbec's closing of the gateway, and Urza and Mishra's later recovery of the artifacts.
- Dyfed's visit to Pyrulea is not conflated with entry into Phyrexia or the later 2023 invasion card. The physician's political and medical actions remain distinct from the motives of marginalized Thran residents.
- Six `HistoricalMoment` components use the same ordered `chapter.data.cardIds` references as the original Thran collection entry. Each Portuguese caption differentiates character portraits, retrospective illustration, and literal scenes. No printing identifiers, artist metadata, source links, content collection entries, or underlying events are copied or changed.
- Sources are read from `chapter.data.sources`; the full original chapter is linked with `hreflang="en"`.
- All English chapter routes and existing Portuguese catalog filters remain intact. Timeline browsing offers the companion alongside the English chapter, not as its replacement.

## Verification and publication

Run `node --test scripts/pt-thran.test.mjs`, `pnpm run verify`, and `pnpm exec playwright test`. Inspect `/mtg-history/pt-br/chapters/thran/` at desktop/mobile widths, check the six historical illustrations and source links, and ensure that the condensed-edition disclaimer is prominent. The SEO sitemap includes the Portuguese route with its own canonical URL; no Portuguese/English chapter `hreflang` pair should appear until a full, editorially accepted translation exists.

The next localization milestone is a complete Portuguese chapter translation with parity checks for section coverage, source attributions, internal references, and card significance. Until that editorial work is complete, do not market this adaptation as a full chapter translation.
