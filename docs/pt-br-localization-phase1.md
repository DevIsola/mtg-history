# Brazilian Portuguese localization — Phase 1

## Scope

Astro native i18n routing now declares English (`en`) as the default, unprefixed locale and Brazilian Portuguese (`pt-br`) as an explicitly prefixed locale. The existing `/mtg-history/` English URLs remain unchanged. The **only translated page** in this milestone is `/mtg-history/pt-br/`.

Shared header/footer/skip links display Brazilian Portuguese on that page. Navigation links to untranslated content remain English routes and are labeled `(EN)` to avoid suggesting the chapters, events, search or other catalogs have been translated.

## SEO and search

The English and Portuguese homepages have self-canonical URLs and reciprocal `hreflang` (`en`, `pt-BR`) links. Other pages do **not** advertise untranslated language alternates. The existing sitemap includes the localized homepage. The build gate fails when either homepage is missing, improperly tagged, or lacks a reciprocal alternate.

Pagefind can index the localized landing page with `lang="pt-BR"`, but the English search interface and historical corpus remain English in this phase. Search UI localization and translated historical chapters are future work.

## Verification

Run `node --test scripts/i18n.test.mjs scripts/seo.test.mjs`, `pnpm run verify`, and `pnpm exec playwright test`. Manually inspect both homepages at desktop/mobile widths, keyboard navigation, navigation destinations, `hreflang`, and `dist/sitemap.xml`. No new dependencies or changed historical records.

## Future phases

Translate shared routes and directories incrementally, then curated chapters; create bilingual search and structured glossary experiences only when translations are actually published. Revisit language-specific metadata, `hreflang`, and redirect strategy for each new translated route.
