# Wave 2AC — Cross-chapter historical consolidation

## Purpose

This is an editorial acceptance workflow following the nine-arc historical-depth expansion across ten existing chapters.

It consolidates the existing offline provenance, historical-risk, artwork-fidelity, and unresolved-evidence audits into a reproducible reviewer queue.

It does not certify historical truth, inspect original novels, validate external URLs, or visually inspect artwork automatically.

## Baseline

- Ten chapters.
- 133 historical events.
- 43 claim-level source-reviewed events.
- Three unresolved primary-source questions: Venser, Freyalise, and Gideon.
- 135 curated chapter-card references.
- All artwork ledger classifications remain editorial assessments, not automatic image verification.

Counts must be read from current repository data when generating the report. Baseline numbers are reference points, not hard-coded success criteria for the audit.

## Windows workflow

Run the full verification pipeline first.

Then:

    pnpm run audit:consolidation --markdown "$HOME\Downloads\mtg-editorial-acceptance.md" --json "$HOME\Downloads\mtg-editorial-acceptance.json"

Review the Markdown checklist and JSON queue.

For an exact-printing visual review:

    pnpm run review:artwork --gallery "$HOME\Downloads\mtg-artwork-review.html"

For the Time Spiral primary-novel evidence worksheet:

    pnpm run review:novel-evidence --output "$HOME\Downloads\mtg-novel-review.md"

No report is written to the repository by default. Generated review outputs should not be committed as evidence of completed acceptance.

## Editorial review sequence

1. Start with explicitly unresolved primary-fiction questions. Preserve them if no original passage is available.
2. Review high-priority unreviewed event claims. Scores are triage heuristics, not error likelihoods.
3. Visually inspect exact scene printings and check all other artwork as appropriate.
4. Examine chronology independently: publication date, in-world ordering, and cross-planar uncertainty.
5. Read all ten chapters for repetition, unsupported causal transitions, inconsistent names, and character continuity.
6. Record required corrections as narrow follow-up pull requests. Update provenance and artwork significance only with evidence.
7. Rebuild this acceptance packet and complete the human checklist.

## Definition of done

The tool can demonstrate complete *inventory coverage* and check data integrity. It cannot demonstrate that all narrative sentences have been checked against canonical fiction.

The final editorial acceptance decision remains manual. Keep any unreviewed claims or unverified artwork explicitly qualified.
