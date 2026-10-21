# Brazilian Portuguese — Phase 2: exploration directories

Four new Portuguese catalog interfaces live at `/pt-br/timeline/`, `/pt-br/characters/`, `/pt-br/events/` and `/pt-br/archive/`, alongside the Portuguese homepage. Their headings, instructions and navigation are in Brazilian Portuguese. Underlying English titles and canonical records are deliberately **not translated**: links to English-only chapter/event/character/archive detail pages use `hreflang="en"` and an explicit English label.

All five paired routes publish reciprocal `hreflang="en"` and `hreflang="pt-BR"`. Untranslated profile, chapter, detail and search routes emit no Portuguese alternate. The existing, unprefixed English paths stay unchanged. The sitemap includes Portuguese catalog pages and build-time SEO validation checks the deployed locale pairs.

This phase adds no translated narratives, cards, or new historical facts, and no runtime dependencies. The full data inventories (10 chapters, 88 characters, 133 events and 135 chapter card uses) are still derived from existing canonical data.

Verification: `node --test scripts/i18n.test.mjs scripts/i18n-directories.test.mjs`, `pnpm run verify`, `pnpm exec playwright test`. Inspect all four Portuguese routes, language switches, no false translated detail pages, and mobile layout in the production preview.

Next: translate directory record summaries and controls more fully, then curated chapter narratives and bilingual Pagefind search once translated corpus is substantive.
