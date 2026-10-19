# Wave 2I — Historical event provenance and chronology precision

This wave introduces a **claim-level provenance pilot** for 6 of the existing 133 events. It does not mark the remaining 127 events as verified or change their historical narrative, event IDs, printings, or relations.

## Editorial contract

- **In-world time is not publication history.** Label events as `relative` or `undated` unless a reliable canonical source establishes a precise calendar system and conversion. No precise years are asserted here.
- Each reviewed source must be an official Wizards HTTPS article already listed in its chapter bibliography. The `supports` sentence identifies the narrow claim derived from it.
- Distinguish original story fiction, retrospective historical summaries, and design commentary. A source can establish an event's sequence or a world-building change without verifying every sentence of an event narrative.
- A card's image and publication year do not prove the depicted historical act took place on that date. Include an explicit artwork caveat for each pilot event.
- `pnpm run check:provenance` verifies local source identities, supported-claim metadata, and date precision **offline**. It does not test external network availability or establish the truth of published fiction.

## First reviewed events

| Event ID | Source | Chronology |
| --- | --- | --- |
| `thran-glacian-stones-implanted` | Commander Legends legendary characters part 2 | Undated Thran era, before gateway sealing |
| `thran-stones-rediscovered` | Same retrospective | Millennia later; before the Brothers' War |
| `zendikar-hedrons` | The Lithomancer | Before Zendikar's Eldrazi awakening |
| `ravnica-guildpact-collapse` | Ravnica, Then and Now | Decamillennial crisis before later guild accord |
| `phyrexia-zhalfir-return` | March of the Machine Episode 10 | End of the invasion |
| `omenpaths-sparks-and-roads` | Doing the Aftermath; She Who Breaks the World | Post-invasion Omenpath era |

All official URLs are maintained in `src/data/event-provenance.mjs`; each is linked from the event's detail page.

## Extend coverage

1. Read an authoritative official source or clearly attributed book and verify the particular historical assertion.
2. Add the source to the chapter bibliography if not already listed; cite the exact article, not a general homepage.
3. Add a new keyed entry to the event provenance ledger with supported claims, precision, rationale, and artwork context.
4. Expand regression fixtures where new chronology distinctions require guarding. Avoid converting publication years into in-world event years.
5. Run `pnpm run verify` and `pnpm exec playwright test`. Visually inspect event pages in both themes and on mobile.

## No content cardinality changes

10 chapters; 88 characters; 133 events; 118 relationships; 133 canonical card printings; 135 chapter card references. The six reviewed events are a subset of the 133, not new event records.
