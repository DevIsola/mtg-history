# External provenance audit — verified corrections (October 17, 2026)

## Evidence and scope

This correction uses the two exported local audit reports recorded at 2026-10-18T00:46Z. The Scryfall collection response returned all **132 distinct printing IDs** used by the chapters (135 references, including three legitimate cross-chapter reuses). It reported **11 field discrepancies**. The official-story URL audit found **92 of 92 unique links reachable**, all returning HTTP 200 at the time checked.

These figures describe identity and reachability, **not** independent proof of each depicted historical event or the claims in the linked articles. The reports remain user-held audit artifacts; they are not committed as build fixtures.

## Corrected printing metadata

| Chapter | Card | Field | Prior value | Confirmed Scryfall value |
| --- | --- | --- | --- | --- |
| 07 | Nahiri, the Harbinger | Set | `warm` | `med` |
| 07 | Nahiri, the Harbinger | Collector | `7` | `WS7` |
| 09 | Elesh Norn, Mother of Machines | Artist | Martina Fackova | Martina Fačková |
| 09 | Koth, Fire of Resistance | Collector | `138` | `138p` |
| 04 | Volrath the Fallen | Set | `nms` | `nem` |
| 04 | Ascendant Evincar | Set | `nms` | `nem` |
| 04 | Vindicate | Artist | Brian Snoddy | Brian Snõddy |

The corresponding character-directory featured cards for Nahiri, Elesh Norn, Koth, and Volrath were updated as well. Scryfall UUIDs and art selection did not change. The Nahiri entry still represents a later Mythic Edition portrait; `med` and `WS7` identify its specific printing. The Koth `pone/138p` entry is a promotional card.

## Front-face titles preserved deliberately

Four audited cards are multi-face printings. Scryfall's complete record name includes the reverse side or Adventure, while this archive deliberately displays the front face associated with the described scene:

- *Invasion of Kaldheim* // *Pyre of the World Tree*
- *Invasion of New Phyrexia* // *Teferi Akosa of Zhalfir*
- *Kellan, the Fae-Blooded* // *Birthright Boon*
- *Kellan, Inquisitive Prodigy* // *Tail the Suspect*

The manual auditor now accepts the shorter front-face name **only** if Scryfall provides a real multi-face `card_faces` array, the first face matches the local name, and the full printed name exactly equals the joined face names. Incorrect names, missing face data, and mismatched reverse faces remain reportable. This preserves the chapter reader's compact names and historical event links.

## Follow-up verification

Run the deterministic gates, then repeat the two online audits from a machine with Internet access:

```bash
pnpm run verify
pnpm exec playwright test
pnpm run audit:provenance --cards --json "$HOME/Downloads/mtg-scryfall-audit-after-fix.json"
pnpm run audit:provenance --sources --json "$HOME/Downloads/mtg-source-links-audit-after-fix.json"
```

**Expected:** 132 of 132 IDs returned, no printing mismatch issues, and a source-link status report. Reachability can change; report failed URLs for examination rather than automatically removing citations. Image-to-event provenance and complete claim-to-source fidelity are still separate editorial review tasks.
