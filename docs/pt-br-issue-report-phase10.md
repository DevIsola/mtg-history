# Phase 10 — Reader correction reporting (PT-BR)

The ten Portuguese historical reading editions expose a **Reportar um problema** disclosure after the source bibliography. Five choices open a pre-filled, **unsubmitted** GitHub issue draft under `DevIsola/mtg-history/issues/new`: Tradução, Precisão histórica, Arte e ilustração, Link quebrado, and Acessibilidade.

Each draft contains the chapter ID and title, canonical Portuguese page URL, selected category, and writable description, proposed correction, and supporting-evidence prompts. The links are generated at build time using `URLSearchParams`. No backend, cookies, account integration, client-side JavaScript, or GitHub issue mutation is introduced. A reader must sign into GitHub and explicitly submit a draft there; selecting a category does not publish an issue. Labels are deliberately not requested because the repository has no confirmed category labels.

The shared Astro component is used by the standalone Thran chapter and the three-batch dynamic route (other nine chapters). Historical text, card IDs and source records remain unchanged. Existing incomplete-translation notices and the lack of reciprocal chapter `hreflang` remain intentional.

## Verification

Run `node --test scripts/pt-issue-report.test.mjs`, `pnpm run verify`, and `pnpm exec playwright test`. Inspect the new browser regression test and test all categories on the Thran and Omenpaths editions. Confirm `target=_blank`, `noopener noreferrer`, and keyboard usability of `<details>` in desktop and mobile modes. The no-JavaScript browser test ensures accessible links remain usable.

## Follow-up

An optional future GitHub issue triage workflow may add validated labels, duplicate detection, and instructions in the repository README. Do not treat reader reports as automatically confirmed canon corrections.
