# Wave 2R — Gideon source attribution and remaining novel verification

## Editorial decision

Official Wizards design commentary now **directly corroborates the outcome** of Gideon’s intervention, but the published primary-fiction scene is still not independently checked. Do not collapse those two levels of evidence into a claim of complete primary-fiction verification.

- Event: `spark-gideons-sacrifice`.
- Existing primary-fiction citation: [War of the Spark: Ravnica — Ashes](https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12), which recounts Gideon’s death and aftermath without narrating the whole protective exchange.
- Newly reviewed **design commentary**: [More War Games (April 29, 2019)](https://magic.wizards.com/en/news/making-magic/more-war-games-2019-04-29), by Mark Rosewater. Its section on *Gideon’s Sacrifice* explicitly describes Gideon taking the damage that would kill Liliana after she defies Bolas. The card’s redirection mechanic depicts that outcome; the article is not itself a fictional eyewitness scene.
- Exact curated printing: **Gideon’s Sacrifice**, *War of the Spark*, collector number **14**, printing ID `849c79ad-8bfc-4512-ab41-f213b6b285ab`. Card rules and illustration are a designed representation, not independent evidence of the exact form of Gideon’s last spell.
- **Still unresolved:** Read Greg Weisman’s *War of the Spark: Ravnica* (2019) for the exact in-scene magic, whether described as a named protective spell, pact redirection or another operation. Do not infer an unseen ritual from game rules.

## Other primary-source questions

- `mending-venser-first-walk`: the public Wizards biography supports Venser eventually becoming a planeswalker; it does not directly narrate the alternate-Dominaria crossing. The relevant primary text to check is the 2007 *Planar Chaos* novel by Scott McGough and Timothy Sanders, already listed in the chapter bibliography.
- `freyalise-seals-skyshroud`: Wizards’ Freyalise biography confirms sacrifice but does not name the Skyshroud rift. Verify the location-specific account against *Planar Chaos* before closing the gap.

Secondary lore summaries may help locate chapters, but **they do not replace primary-fiction inspection**. No new in-world dates, chapter events, relationship IDs, or card identities are introduced in this wave.

## Validation and review on Mac

```sh
node --test scripts/event-evidence-context-wave2r.test.mjs
pnpm run check:provenance
pnpm run audit:source-gaps
pnpm run verify && pnpm exec playwright test
```

Expected: 43/133 source-reviewed events and **three** explicit questions remain open. The only additional official chapter source is *More War Games*. Confirm its label appears as **Design commentary**, not **Story**, on `/events/spark-gideons-sacrifice/`.
