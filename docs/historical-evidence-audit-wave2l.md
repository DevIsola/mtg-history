# Wave 2L — Historical evidence risk inventory

## Purpose

Inventory every **unreviewed** canonical historical event and prioritize the next editorial source reviews. This is an **offline, read-only triage instrument**, not a fact checker. A high score does not imply an error, and a low score does not imply an event is canonically verified.

At this milestone, 26 of 133 existing events have claim-level provenance entries. The tool inventories the other **107 events** and creates a reproducible Markdown queue and optional JSON machine-readable export. The event count, canonical printing count, cards, source corpus, prose, and artwork ledger remain untouched. Reviewed entries remain subject to manual source assessment: the existence of a bibliography citation alone is never proof that every sentence in an event is correct.

## Inputs and evidence boundaries

- `src/content/events/*.json` provides each event's authored narrative, chapter ID, participant references and canonical printing ID.
- `src/data/event-provenance.mjs` identifies events that already have curated claim-level source notes. Reviewed entries are **excluded** from the queue; the tool does not re-certify them.
- The existing chapter-collection loader and canonical printing files determine which exact card an event actually uses. No name-only printing approximation is accepted.
- `docs/artwork-fidelity-ledger.tsv` supplies editorial visual-role, time-context, and evidence classifications for the exact chapter/card pairing. The ledger is classified editorial context, not automatically verified image content.
- Chapter `sources` provide bibliographic **context**. Their presence does **not** constitute an event-specific source link. The report never invents an event-level citation.
- The cross-chapter participant indicator uses participation in **actual event records from more than one chapter**, not a character's broad chapter membership.

## Triage model

| Signal | Weight | Why human attention may help |
| --- | ---: | --- |
| Explicit in-world calendar notation | +4 | Requires specific authoritative evidence for a historical year |
| Contested/conflicting language | +3 | May need reconciliation of competing accounts |
| Contextual *scene* artwork not visually checked | +3 | The visible image may not substantiate the implied event |
| Named figure participating in events across chapters | +2 | A cross-era or cross-world continuity claim may matter |
| Interplanar consequence | +2 | Planar timing and consequences may need precision |
| Absolute or exclusive wording | +2 | Broad assertions need strong support |
| Causal language | +1 | Correlation and sequence should not be assumed to prove causation |
| Four or more narrative paragraphs | +1 | Longer events may contain multiple independently testable propositions |

Scores are additive **editorial priorities**, not confidence values or probabilities. **High:** 7+, **medium:** 4–6, **standard:** 0–3. Every unreviewed event remains in the inventory, regardless of score. False positives are acceptable; omitted events are not. The full queue is stably sorted by score, chapter order and event ID. Re-running on identical sources produces the same results.

Portraits and objects are documented in the artwork column but are not automatically treated as high-risk *scenes*. Actual scene classifications lacking a `visual-checked` basis receive a manual-review signal. Neither classification is a claim of historical authenticity.

## Mac commands

From the repository root:

```sh
node --test scripts/historical-risk-wave2l.test.mjs
pnpm run audit:history
pnpm run audit:history --markdown "$HOME/Downloads/mtg-history-risk-wave2l.md" --json "$HOME/Downloads/mtg-history-risk-wave2l.json"
open "$HOME/Downloads/mtg-history-risk-wave2l.md"
```

`pnpm run audit:history` is **deliberately separate** from the deployment-facing `pnpm run verify` chain. Its offline reference-integrity and coverage regression is included through the standard `node --test scripts/*.test.mjs` suite, so `pnpm run verify` still validates its core behavior. The CLI prints the ten highest-priority candidates and only writes reports when a user explicitly chooses destination paths. It performs no source fetches and edits no content files.

Expected baseline:

```text
Historical evidence triage: 107/133 events awaiting claim-level review; 26 source-reviewed.
```

The high/medium/standard counts are **derived from the current narrative text** and must not be fixed in documentation; they will change as events are revised or reviewed.

## Editorial workflow

1. Open the generated Markdown queue, starting with high-priority candidates while also sampling standard-priority ones. Use the linked published event pages for context.
2. Identify **specific propositions** in each event. Compare with official Magic fiction, relevant retrospectives, and the existing chapter bibliography. Distinguish directly narrated facts from summaries and designer commentary.
3. Record uncertainty explicitly: exact years, relative event ordering, postwar narrators and competing canonical accounts must not be silently reconciled.
4. Review exact card art against the event interpretation. A relevant character portrait or later reprint is not automatically a literal depiction of the scene.
5. Apply historically substantiated corrections in **small editorial PRs**. Add provenance only after verifying what the source actually supports; include source title/URL, source role, narrow claim, chronology qualification and artwork caveat.
6. Re-run the queue when those PRs merge. Validate that every unreviewed record remains accounted for and reviewed coverage changes only when the provenance ledger changes.

## Engineering safeguards

Unknown chapters, missing exact chapter printings, orphan provenance IDs, duplicate event IDs, duplicate artwork rows and missing artwork reviews fail closed. The audit reuses existing provenance and artwork validation before computing scores. Its report is always a snapshot of the repository state and requires no network access or external credentials.

**Deferred:** verifying the truth of all 107 narratives, identifying genuine canonical conflicts, adding 107 official event citations, or revising the historical timeline. These require source-by-source editorial review and are not implied by the new triage ranking.
