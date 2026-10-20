# Wave 2P — Source-review coverage versus unresolved claims

## Editorial decision

Keep the existing **43/133 event-level provenance coverage** distinct from the strength of support for individual assertions. Prior reviews intentionally cite *narrow claims*, and some events still include scene-specific assertions absent from the public article attached to the record. A citation's existence cannot certify the entire narrative, even if the linked source is an official Wizards publication.

This wave adds an optional `unresolvedClaims` array to the existing provenance ledger. Every entry contains the **specific claim still awaiting confirmation** and the **primary evidence needed** to decide it. The event reader displays unresolved claims under the citation panel, not as a verdict that they are false. Existing chronology qualifiers, URL/bibliography integrity and the artwork ledger remain unchanged.

No source, fictional year, chapter, character, event, relationship, or printing has been added or changed. Totals remain 10 chapters, 88 characters, 133 events, 118 relationships, 133 canonical printings, 135 card uses, and 43 claim-level reviewed events.

## Five focused evidence gaps

| Event | Evidence requiring review |
| --- | --- |
| `mending-venser-first-walk` | The official Venser character profile confirms his spark, and design commentary confirms his planned transformation, **not** the exact divergent-Dominaria crossing. Compare *Time Spiral*, *Planar Chaos*, and *Future Sight* narrative passages as applicable. |
| `freyalise-seals-skyshroud` | Wizards' Freyalise biography confirms sacrifice, **not** the rift's exact name or location. Compare the Time Spiral block primary-fiction account. |
| `phyrexia-dominaria-sleeper-war` | *Death and Salvation* describes Ertai and Squee, but **not independently** the specific Ajani/Jaya scene. Find the direct *Dominaria United* story scene. |
| `spark-gideons-sacrifice` | *Ashes* accounts for the aftermath of Gideon's death without detailing the transfer of Liliana's punishment. Locate the direct confrontation account. |
| `brothers-tawnos-carries-testimony` | *The Brothers' War — Episode 1: The End* supports Tawnos's postwar testimony to Kayla; it does not explicitly establish Urza's particular ivory-tower instructions. Compare the book or other primary account. |

The five items are **open questions, not confirmed mistakes**. Resolving an entry requires citing a source that directly answers it, adjusting the narrative if necessary, updating the provenance review, and removing the gap together. Avoid replacing a specific assertion with generic design commentary.

## Mac review workflow

```sh
node --test scripts/event-evidence-gaps-wave2p.test.mjs
pnpm run check:provenance
pnpm run audit:source-gaps \
  --markdown "$HOME/Downloads/mtg-primary-evidence-questions.md" \
  --json "$HOME/Downloads/mtg-primary-evidence-questions.json"
open "$HOME/Downloads/mtg-primary-evidence-questions.md"
pnpm run verify && pnpm exec playwright test
```

Expected CLI summary: `Open primary-source questions: 5 across 5 reviewed events.` The optional Markdown and JSON reports are generated **only** when destination paths are supplied, outside the repository by default. The full source and artwork validation remains an offline integrity test, not a remote lore-verification system. The browser test verifies an event with an open question and a reviewed event without one, on desktop and mobile.

## Next editorial PRs

Prioritize checking actual novel passages and primary Wizards stories for these five claims, especially Venser's first walk and Freyalise's death. Once a gap is substantiated or corrected, update the source metadata and narrative in the same PR with a regression test. The audit command should then show fewer outstanding questions **because evidence was examined**, not because the queue was simply cleared.
