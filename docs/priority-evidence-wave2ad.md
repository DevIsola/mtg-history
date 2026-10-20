# Wave 2AD — Three source-bounded high-priority event reviews

The first three high-priority event IDs from the Wave 2AC editorial report are now documented using exact official Wizards sources already in their chapter bibliographies.

- Dovin / Azorius: *War of the Spark: Ravnica — Rallying the Reluctant* and *Operation Desperation* directly document Dovin's guildmaster role, Bolas alignment, Immortal Sun guard, flight and Lavinia's interim leadership. The event narrative is narrowed to those facts, without asserting every Azorius member was loyal to Bolas.
- Penregon: *The Brothers' War — Episode 2: The Beginning* directly states 69 AR and narrates the Talite attacks, Kayla's decisions, and Tawnos's burning workshop. The original Witch Hunter artwork remains thematic, not a literal siege scene.
- Elderspell: *War of the Spark: Ravnica — Ashes* depicts stolen sparks converging on Bolas; *War Games* is commentary explaining the story mechanism and card design. Both roles remain distinct.

## Editorial boundaries

These citations are claim-level evidence, not blanket certification of the chapters. The three unresolved novel questions (Venser, Freyalise, Gideon) remain open. The nine priority scene illustrations still require pixel-level inspection. This PR changes no Scryfall printing identity, event ID, character ID, historical-year precision outside the directly attested 69 AR, or artwork-ledger classification.

## Verification

- node --test scripts/priority-evidence-wave2ad.test.mjs
- pnpm run verify
- pnpm exec playwright test
- pnpm run audit:consolidation
- Review Dovin's revised event on site before merging.
