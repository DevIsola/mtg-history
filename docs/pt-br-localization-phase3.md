# PT-BR localization — phase 3: directory controls and contextual summaries

All four published Portuguese directories now offer client-side, accent-insensitive filtering and a live Portuguese result count. The filter UI is hidden until JavaScript initializes; the full static lists remain readable without JavaScript. Event group headings are hidden only when all entries in that group are filtered out. The reset button restores all entries and keyboard focus.

Ten concise, authored Portuguese era labels and summaries live in `src/utils/pt-catalog.mjs`. They describe navigation context without translating or duplicating English historical evidence. Existing English record titles, canonical IDs, source bibliographies and URLs stay authoritative; detail links retain `hreflang="en"`. This phase does not change English site pages, canonical card records, SEO alternate route coverage, or any historical data.

Acceptance: `node --test scripts/pt-catalog.test.mjs`, `pnpm run verify`, `pnpm exec playwright test`, then inspect `/mtg-history/pt-br/timeline/`, `/characters/`, `/events/`, `/archive/` at desktop and mobile widths. Confirm accent-insensitive search, empty-state feedback, clearing search, theme contrast, and fully readable lists with JavaScript disabled.
