# External provenance audit — Phase 2, printing and citation checks

**Repository baseline:** `main` after PR #65 (commit `d54786c12a79576c29d64edf933790f7d5becef0`).

This work adds **manual, network-dependent verification tools**. These checks do not run automatically in CI or production builds: an unrelated network outage, publisher anti-bot block, or Scryfall rate limit must not destabilize the deterministic quality gate.

## Baseline and scope

The ten chapters currently contain **135 references to curated printings**. Three exact printings intentionally appear in two chapters, so an audit can request **132 distinct Scryfall IDs** rather than repeating every request. These numbers are an inventory of the repository, **not** a claim that any of those IDs has been independently confirmed.

The offline `pnpm run check:editorial` command validates internal metadata consistency. The new `pnpm run audit:provenance` command compares records to **external printing data**. Both are useful, but they answer different questions.

## Commands (run on your Mac with internet access)

```bash
# Read the usage text without accessing the network
pnpm run audit:provenance --help

# Default: card printings only. Save the report outside the Git working tree.
pnpm run audit:provenance --cards --json "$HOME/Downloads/mtg-scryfall-audit.json"

# Check the reachability of official bibliography links separately.
pnpm run audit:provenance --sources --json "$HOME/Downloads/mtg-source-links-audit.json"

# Both audits, in the same report, if desired.
pnpm run audit:provenance --cards --sources --json "$HOME/Downloads/mtg-external-audit.json"
```

The Scryfall audit uses `POST /cards/collection` in groups of at most 75, with a minimum 650-millisecond pause between batches, a descriptive `User-Agent`, and an `Accept` header. It compares each returned record's **Scryfall UUID, exact set code, collector number, card name, and credited artist** with every chapter that uses the printing. A missing record, partial API response, changed credit, or differing collector number is surfaced for editorial review rather than silently accepted. A 429, unexpected API body, or network failure aborts the online audit rather than claiming success.

This tool does **not** inspect card-image pixels or certify that an illustration literally depicts a specific canonical event. A correct Scryfall record establishes printing identity, not historical interpretation.

The source-link audit checks each unique official URL through `HEAD` and, if HEAD yields a potentially unsupported or ambiguous status, `GET`. It records redirect destinations and status codes without attempting to bypass publishers' access controls. `403`, `404`, `5xx`, timeouts, and blocked access are **review candidates**, not automatic proof of a false or dead citation. HTTP 200 also does not prove that a page supports the historical claim for which it is cited.

Reports use nonzero exit status for card mismatches, and exit status 2 when card verification was interrupted. Source-link findings are reported without breaking the build.

## Primary story links spot-checked in this pass

The following official Wizards pages were accessible during the review on October 17, 2026. This confirms page availability and title correspondence only; it does **not** certify every sentence in the relevant chapter.

| Chapter | Official source checked | Result |
| --- | --- | --- |
| 04 / 09 | [*Death and Salvation*](https://magic.wizards.com/en/news/magic-story/death-and-salvation-2022-08-16) | Accessible; story of Squee and his later choice |
| 07 | [*The Lithomancer*](https://magic.wizards.com/en/news/magic-story/the-lithomancer) | Accessible; historical Nahiri story |
| 09 | [*March of the Machine*, Episode 3: Mother, Son, and Story](https://magic.wizards.com/en/news/magic-story/episode-3-mother-son-and-story) | Accessible; Tamiyo's Kamigawa story |
| 10 | [*Murders at Karlov Manor*, Episode 10: Roots of Decay](https://magic.wizards.com/en/news/magic-story/episode-10-roots-of-decay) | Accessible; mystery aftermath |
| 10 | [*Outlaws of Thunder Junction*, Epilogue 1: Bring the End, Part 1](https://magic.wizards.com/en/news/magic-story/epilogue-1-the-invasion-tree) | Accessible; the URL slug differs from its displayed title |

## How to triage findings

1. **Printing mismatch:** compare the returned Scryfall record with the MDX metadata; check whether the chapter intended a different artwork variant or release. Correct `scryfallId`, `setCode`, `collectorNumber`, `name`, and `artist` together when replacing a printing. Then inspect the reader's card image and significance text.
2. **Unresolved printing ID:** do not guess a substitute ID. Search the named set/collector entry using Scryfall's website or the published set gallery, and verify the actual illustration.
3. **Inaccessible source:** open the URL in a browser and search Wizards' archive for the article's title. A 403 or missing HEAD endpoint is not automatically an editorial defect. If a page has truly moved, update the citation after confirming the destination contains the relevant text.
4. **Claim fidelity:** read the surrounding primary or retrospective fiction. Record a *claim → source passage → classification* in the canonical ledger. State whether the illustration is contemporary, retrospective, thematic, or a confirmed scene. Do not change canon solely because of a card's printed release year.
5. **After corrections:** run `pnpm run verify && pnpm exec playwright test`. Keep online checks manual until external-service behavior and source availability have been evaluated separately from build stability.

**Remaining work:** An end-to-end, source-by-source reading of all chapter claims and all card images is not completed by this script. A successful card metadata audit provides evidence of correct *printing identity*, not a full canonical review.
