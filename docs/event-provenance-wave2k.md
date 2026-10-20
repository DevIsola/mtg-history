# Wave 2K — Source-led historical corrections and event provenance

## Editorial scope

This batch adds **eight event-level provenance reviews** to the existing 18, for **26/133 (19.5%)** reviewed event records. All prior reviews remain present. Reviewed means that a specific cited official publication was examined for a **narrow supporting claim** and its chronological limits were documented; it does not guarantee that every statement in the event narrative has been independently fact-checked.

Existing content cardinalities remain: 10 chapters, 88 characters, 133 events, 118 relationships, 133 exact canonical printings, and 135 chapter card references. No changes to cards, event IDs, characters, relationships, generated compatibility adapters, or layout dependencies are needed.

## New provenance entries

| Chapter | Event | Official article and bounded claim |
| --- | --- | --- |
| Brothers' War | `brothers-tawnos-carries-testimony` | *The Brothers' War — Episode 1: The End* depicts Tawnos reporting events to Kayla after the war. It **does not independently prove** Urza's earlier instructions to address the ivory towers. |
| Many Worlds | `innistrad-avacyn-created` | *Innistrad Plane Guide* credits Sorin with creating Avacyn to preserve humanity. |
| Many Worlds | `innistrad-helvault-imprisonment` | *Planeswalker's Guide to Avacyn Restored, Part 2* says Griselbrand drew Avacyn into the Helvault with him. |
| March of the Machine | `phyrexia-melira-resistance` | *Assault on New Phyrexia — Episode 2: Unstable Foundations* details Melira explaining the plane's nested geography and discussing the Seedcore mission. |
| March of the Machine | `phyrexia-meliras-last-gift` | *March of the Machine — Episode 10: The Rhythms of Life* depicts Melira and Karn's intervention to save Nissa and Ajani, at great personal cost. |
| Omenpaths | `omenpaths-eldraine-mourning` | *Wilds of Eldraine — Episode 1: Pure of Heart* depicts the aftermath of the Kenriths' deaths and Rowan's grief. |
| Omenpaths | `omenpaths-rowan-and-will-diverge` | The same primary story depicts Will and Rowan disagreeing over political stability and urgent magical intervention. |
| Omenpaths | `omenpaths-ravnica-investigation` | *Murders at Karlov Manor — Episode 9: Beauty in Destruction* documents the accusation of Oba and the importance of distinguishing coerced acts from voluntary guilt; it **does not claim to depict every earlier investigative step**. |

## Targeted canonical qualification — origin of the Golgothian Sylex

*The Brothers' War — Episode 5: As Cruel, As Necessary* explicitly recounts competing, incompatible accounts that ascribe the Sylex's origin to Feldon, Ashnod, or Gix. It does, however, treat Urza's activation on Argoth as the common account. The event narrative for `sylex-blast` now documents the uncertainty without selecting a single creator. Its provenance adds the episode as a second source, alongside the postwar account already present in Wave 2J.

The episode opens in **4562 AR**, but that is **Teferi's later investigation**, not a date for the Brothers' War or Sylex detonation. We do not assign an invented exact year. This is a clarification of ambiguous historiography, not a replacement of the established blast narrative.

## Verification and limitations

```sh
node --test scripts/event-provenance-wave2i.test.mjs scripts/event-provenance-wave2j.test.mjs scripts/event-provenance-wave2k.test.mjs
pnpm run check:provenance
pnpm run verify && pnpm exec playwright test
```

Expected offline summary: `Event provenance coverage: 26/133 reviewed event records; 0 integrity errors.` Offline validation checks references, chapter bibliographies, source URL shapes, chronology classifications, and lengths. It cannot establish the truth of every proposition in the linked articles or whether cards literally show a given fictional scene. Those remain editorial acceptance tasks.

Editorial review: revisit all eight new pages, the revised Sylex page, and the older `sylex-blast` Wave 2J citation; verify that each claim's scope and artwork disclaimer are faithful to the linked official publication. Continue auditing the other 107 event records in later batches rather than calling this partial coverage complete.
