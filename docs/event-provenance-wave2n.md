# Wave 2N — Phyrexian and Time Spiral continuity, source-bound review

## Scope and guardrails

Adds **eight** official-source reviews to Wave 2M's 34, yielding **42 of 133** claim-reviewed events (31.6%) and **91** records still awaiting a claim-level source review. This milestone revisits four Mending-era events and four New Phyrexia events. It does **not** claim that each reviewed event's entire narrative has been verified; each citation states the narrow proposition supported by the publication.

One existing event, `teferis-phasing-decision`, receives a short, source-backed chronological qualification differentiating the original phasing of Shiv and Zhalfir, the restoration of Shiv at the cost of Teferi's spark, and Zhalfir's longer isolation. No established narrative paragraph is removed. All event IDs, chapter references, characters, relationships, card printings, and artwork references remain intact: **10 chapters, 88 characters, 133 events, 118 relationships, 133 printings, and 135 chapter-card uses**.

## Eight event reviews

| Event ID | Official source | Support and limit |
| --- | --- | --- |
| `teferis-phasing-decision` | [Return to Dominaria: Episode 6](https://magic.wizards.com/en/news/magic-story/return-dominaria-episode-6-2018-04-18) | Teferi describes Zhalfir and Jhoira recounts Shiv, followed by the cost to his spark; no synchronized year |
| `shivan-rift` | [Return to Dominaria: Episode 6](https://magic.wizards.com/en/news/magic-story/return-dominaria-episode-6-2018-04-18) | Jhoira identifies the Shivan rift repair and spark loss; she explicitly distinguishes Zhalfir's continuing absence |
| `mending-venser-first-walk` | [Venser](https://magic.wizards.com/en/story/venser-planeswalker) | Official profile confirms his teleportation expertise and awakened spark, **not** the exact divergent-world episode |
| `freyalise-seals-skyshroud` | [Freyalise](https://magic.wizards.com/en/story/freyalise-planeswalker) | Profile confirms protective sacrifice, **not** the exact Skyshroud location or full ritual |
| `phyrexia-urabrask-dissent` | [The Legends of Phyrexia: All Will Be One](https://magic.wizards.com/en/news/feature/the-legends-of-phyrexia-all-will-be-one) | Identifies Urabrask's alliance with Sheoldred and Kethek; **not** a scene of his later punishment |
| `phyrexia-elspeth-return` | [March of the Machine — Episode 7: Divine Intervention](https://magic.wizards.com/en/news/magic-story/episode-7-divine-intervention) | Primary fiction depicts angelic Elspeth intervening against Norn, supporting Chandra, Karn, Koth and the Mirran retreat |
| `phyrexia-jin-kamigawa` | [Planeswalker's Guide to March of the Machine](https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-march-of-the-machine) | Retrospective identifies Jin-Gitaxias's Kamigawa mission and planeswalker compleation technique, **not** the full Tamiyo scene |
| `phyrexia-mirran-survival` | [The Legends of Phyrexia: All Will Be One](https://magic.wizards.com/en/news/feature/the-legends-of-phyrexia-all-will-be-one) | Explains Kemba's leadership and coordination with Koth; **not** proof of all Melira actions |

Every source is already an official link in its chapter's bibliography. The existing validator enforces canonical Wizards HTTPS URLs, exact title/URL bibliography matching, nonempty supported-claim descriptions, bounded source counts, and only relative/undated chronology. The accompanying card is classified as contextual imagery, never accepted as a dated witness.

## Verification on macOS

```sh
node --test scripts/event-provenance-wave2n.test.mjs
pnpm run check:provenance
pnpm run audit:history
pnpm run verify && pnpm exec playwright test
```

Expected gate: `Event provenance coverage: 42/133 reviewed event records; 0 integrity errors.` Expected audit inventory: `91/133 events awaiting claim-level review; 42 source-reviewed.` The queue remains heuristic-only, and **42/133 is review coverage, not certified historical accuracy**.

Before merging, compare all eight annotated pages and the Teferi paragraph with the linked articles; pay attention to sources whose limited scope is explicitly noted. Check event-card artwork fidelity, fragment navigation, mobile and desktop themes, and regressions in the existing 34 reviewed events. Do not assign an exact AR year based on an article's publication date.
