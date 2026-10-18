# Editorial integrity baseline — Chapters 01–10

Baseline: `main` after PR #63 (October 17, 2026), commit
`aac82fcec89d0722dc11e7cc1649bb8f8c77d904`.

## Scope and verified repository observations

The archive has ten published chapters, sequentially numbered 01–10, with
87 character profiles, 125 historical events, and 116 relationships. The MDX
chapters cite 135 curated card printing references (some printings recur in more
than one chapter). All ten chapters include official Wizards of the Coast
sources. Chapter 03 cited *Faction Packed* twice; this change removes the
repeated bibliography entry while preserving the original citation.

Three card printing identifiers are intentionally repeated across different
chapters: *Gix, Yawgmoth Praetor* (Thran / Brothers' War), *The Mightstone and
Weakstone* (Thran / Brothers' War), and *Jeska, Thrice Reborn* (Otaria /
Mending). Their reuse is legitimate when the name, set code, collector number,
and artist identify the same printing. The automated check allows such reuse
and rejects conflicting metadata.

The information above describes **repository records**, not a claim that
all 135 card attributions or all narrative passages have been independently
verified against primary sources.

## Enforced checks

The verification pipeline adds `pnpm run check:editorial` after the structural
content-graph checker. Its deterministic, offline checks enforce:

- Positive, unique, continuous chapter ordering.
- Complete per-card identifying metadata and no repeated card names or
  set/collector pairs within a chapter.
- Consistent name, set, collector number, and artist when a Scryfall UUID is
  reused across chapters.
- At least one official source per chapter, HTTPS URLs for official sources,
  author/publication year for cited books, and no duplicate source entries.

The check deliberately reads a small subset of plain YAML fields; Astro's
content schema remains authoritative for general YAML parsing. No new runtime
or development dependency is introduced.

## Remaining editorial review (not yet certified)

1. **Canonical event verification:** Compare each event, important character
   biography, and decisive causal claim with the cited primary fiction. Mark
   disputed chronologies and separate interpretations from explicit canon.
2. **Card-art provenance:** Confirm all 135 references against Scryfall's
   actual printing records, including artist, collector number, release set,
   and whether artwork depicts the claimed scene or merely evokes it.
3. **Source availability and fidelity:** Check links to official stories for
   redirects, removed pages, and whether the source supports the specific
   assertion. Offline URL formatting checks do not measure live reachability.
4. **Cross-chapter consistency:** Revisit long-running characters and events
   that span chapters, distinguish publication from in-world order, and avoid
   repeating simplified explanations in ways that obscure later revelations.
5. **Accessibility and performance:** Review existing baseline violations and
   manual findings, and establish explicit budgets and regression gates before
   new interactive functionality.

A passing metadata check should **never** be represented as proof of canonical
accuracy. Record corrections as small, source-cited patches with tests where
an automatic regression guard is possible.
