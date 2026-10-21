# Project maintenance — repository hygiene (October 2026)

## Current source of truth

The published site has 10 historical chapters, 88 characters, 133 events, 118 relationships, 133 unique Scryfall printings (including 135 chapter artwork references), and 10 glossary terms. The English chapters are canonical; the 10 Portuguese reading editions remain editorial adaptations. Both search languages use static Pagefind. Reader issue reporting uses GitHub Issues without a backend.

## Retired one-time migration tooling

Card and entity collection migrations have already been applied. Phase 12 retires **13 obsolete migration executables, migration-only helpers, and their exclusive tests**, plus the three `migrate:*` package commands. These runners were non-idempotent and would fail or attempt obsolete transformations against the current collections.

The historical migration write-ups are **retained intentionally** as engineering provenance, with notices that their old execution instructions are not current operational guidance. The README screenshots, Scryfall artwork fidelity ledger, novel/evidence reviews, generated compatibility adapters, and regression suites are also retained intentionally. These are not safe cleanup candidates merely because they originated in an earlier phase.

## Supported current workflows

- Develop: `pnpm dev`
- Typecheck: `pnpm run check:types`
- Full verification: `pnpm run verify`
- Browser regression: `pnpm exec playwright test`
- Production preview (after build): `pnpm exec astro preview --host 127.0.0.1 --port 4322`
- Editorial integrity: `check:entities`, `check:cards`, `check:content`, `check:editorial`, `check:provenance`, and `check:artwork` are maintained by `verify`.

## Policy for future cleanup

Only retire files after checking import sites, package scripts, workflow references, tests, and documentation. Preserve historical evidence and licensing records. Do not delete generated compatibility adapters until live consumers are migrated and tests updated. Do not remove a historical event, card, relationship, or glossary entry solely because it is not visible on the landing page. Treat `dist/`, `.astro/`, `node_modules/`, and Playwright reports as local generated artifacts already excluded by `.gitignore`.
