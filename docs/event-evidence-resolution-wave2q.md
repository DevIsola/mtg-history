# Wave 2Q — Two primary-fiction confirmations

## Editorial scope

Resolves **two** of the five explicit evidence questions introduced by Wave 2P. The other **three** remain open. Coverage remains **43/133** event-level source reviews: completing an unresolved question is not the same as reviewing a new event. No canonical printing identities, characters, events, relationships, or card reference totals change.

### Tawnos’s instruction from Urza

- Event: `brothers-tawnos-carries-testimony`.
- Direct primary fiction: [The Brothers' War — Episode 5: As Cruel, As Necessary](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-5-as-cruel-as-necessary).
- After the Sylex Blast, Urza explicitly asks Tawnos to go west and tell the surviving ivory-tower scholars what happened and what the brothers failed to prevent. This resolves the precise instruction previously left open.
- The earlier Episode 1 citation remains: it addresses **Tawnos’s later postwar testimony to Kayla** and is not substituted for the earlier dialogue.
- The curated Tawnos portrait is still not an illustration of the instruction.

### Ajani’s betrayal and Jaya Ballard’s death

- Event: `phyrexia-dominaria-sleeper-war`.
- Direct primary fiction: [Dominaria United — Episode 5: A Whisper in the Wind](https://magic.wizards.com/en/news/magic-story/episode-5-whisper-wind-2022-08-18).
- The story reveals Ajani as the compleated sleeper agent; he assaults Jaya and throws her over the edge of the Mana Rig. This directly substantiates the event’s earlier unsourced Ajani/Jaya claim.
- The existing *Death and Salvation* citation remains for **Ertai**, which is a separate part of the broader infiltration history.
- The publication year 2022 is not an in-world event year, and the selected card is not an eyewitness image of the scene.

## Still unresolved — do not remove without direct evidence

1. `mending-venser-first-walk`: identify the primary novel passage describing the divergent-Dominaria crossing.
2. `freyalise-seals-skyshroud`: verify the exact Skyshroud rift in primary Time Spiral fiction.
3. `spark-gideons-sacrifice`: verify the mechanism of Gideon protecting Liliana against Bolas’s contract; a later retrospective can confirm the sacrifice without independently narrating its magical mechanics.

## Quality gates on macOS

```sh
node --test scripts/event-evidence-gaps-wave2p.test.mjs scripts/event-evidence-resolution-wave2q.test.mjs
pnpm run check:provenance
pnpm run audit:source-gaps
pnpm run verify && pnpm exec playwright test
```

Expected coverage: **43/133** provenance reviews, **3** unresolved claims across **3** events, and one new chapter bibliography citation. Source accessibility and historical truth are independent of the offline format validator; review the linked fiction directly before final editorial acceptance.
