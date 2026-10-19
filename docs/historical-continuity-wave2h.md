# Historical continuity — Wave 2H: Entity-derived evidence index

## Why this exists

Wave 2G introduced four **curated** thematic reading paths. This independent
index helps readers discover where the existing canonical event records name the
**same historical character across chapters**, without implying that events
occurred consecutively or caused one another.

The implementation uses the existing canonical records through the generated
`src/data/{characters,events,relationships}.ts` adapters. It creates no new
entities, relationships, card printings, or chapters. In particular, it must
**not** turn a person's broad `chapterIds` metadata into a claimed historical
appearance: a character must be referenced by an actual event in **each**
chapter for the pair to appear.

A known relationship among two shared figures is supplementary evidence only;
the UI never infers that the relationship existed in every era mentioned. Each
identified character is linked to their canonical profile and to one existing
historical event in each chapter. Deterministic alphabetical selection of an
event is for stable linking, not in-world chronology.

## Editorial boundaries

- No inferred causation, allegiance, sequential dating, or literal depictions.
- No claims that story periods on different planes share one timeline.
- Curated 2G paths remain the primary narrative interpretation; generated
  connections are explicitly labeled as an evidence index.
- Relationships do not create chapter pairs by themselves.
- Original event and character records remain the only source of identity.
- The existing content, attribution, artwork, and link gates remain in force.

## Acceptance on Windows PowerShell

```powershell
node --test scripts/entity-continuity-wave2h.test.mjs
pnpm run verify
pnpm exec playwright test
```

Inspect `/mtg-history/paths/#entity-evidence` and the chapter readers for the
Thran, the Brothers' War, and Weatherlight on desktop and mobile. Verify the
cards' historical assertions remain with the chapters and each linked event is
canonical, then examine keyboard focus and wrapping at 390px.

Content totals remain at ten chapters, 88 characters, 133 events, 118 ties,
133 exact printings, and 135 curated chapter-card uses (post-Wave 2F).
