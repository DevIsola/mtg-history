# UX Wave D2 — Illustrated Archive and PT-BR printing fidelity

## Scope

The English gallery retains its existing no-JavaScript browsing, filters, sorting, and canonical card identities. The editorial layout separates full-card illustrations from significance as interpretation, not historical proof. The Portuguese archive is now a full set of published chapter card uses rather than an English-only redirect index. Every entry explicitly links the original historical UUID and identifies whether the displayed face is Portuguese or the English fallback. The global Ko-fi button reuses the About-page destination and visual treatment; support is optional and never gates content.

## Reproducible PT printing lookup

Run `node scripts/sync-pt-printings.mjs --write` on a network-connected workstation. This **explicit** Scryfall request batch produces `src/data/pt-printings.json` after all results succeed; no network calls run at build time or during normal page viewing. Only PT printings with verified original and localized illustration IDs, set, collector number, printed name, and image are accepted. API errors abort the sync without overwriting the committed catalog. Missing, changed-art, or unverified versions use the canonical English printing with a label. The canonical artwork ledger, card collection, chapter significance and 135 historical card uses remain unchanged. This is not machine translation of card text.

The distributed patch begins with an empty catalog deliberately. The developer must run the explicit sync, review reported PT coverage, and commit the populated JSON before merging. The number of verified PT faces is not claimed until that operation succeeds.

## Acceptance

1. Run the PT sync with Internet connectivity, inspect the manifest and manually spot-check at least one supported Portuguese face and one English fallback against Scryfall.
2. Run `pnpm run verify && pnpm exec playwright test` and inspect English/PT-BR archive pages at desktop, 390px and 320px widths.
3. Verify existing filters/sort on English, Portuguese search/filter on PT page, light/dark contrast, links to exact local and canonical printings, full card (not art crop), and readable longer interpretations.
4. Confirm the Ko-fi link is visible and keyboard accessible in header at both languages and mobile widths; it never obscures search, language choice or navigation.

Remaining card-facing components (chapter plates, enlargement dialog, event and character references) continue using canonical English images. Propagate the verified catalog to those components in subsequent waves only after adding corresponding regression coverage.

## Sync reliability and diagnostics

The sync reports each card and saves its successful or missing-language result after each card to `node_modules/.cache/mtg-history/pt-printings-checkpoint.json`. The final `src/data/pt-printings.json` is **not** overwritten until all 133 canonical records finish. Interruptions and transient network failures can be resumed with `--write`. A stalled Scryfall request times out after 15 seconds; errors (especially HTTP 429) stop the run rather than retrying aggressively.

Start with `node scripts/sync-pt-printings.mjs --limit 5` to inspect a small sample without changing the published catalog. Then run `node scripts/sync-pt-printings.mjs --write` to resume and complete. `--status` reports progress and the final catalog count. A diagnostic sample finding zero translations is not evidence that the whole archive lacks Portuguese printings. If a 429 occurs, stop and reduce traffic; follow Scryfall's published API usage guidance. No background service or build-time network access is needed.
