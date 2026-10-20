# Wave 2X — Otarian history: ambition, institutional power, and false divinity

## Scope and baseline

Expand the established Otarian chapter with five focused editorial lenses. Do not change its 20 canonical chapter printing UUIDs, 20 illustrated HistoricalMoment uses, 15 existing event references, characters, storyPeriod, or source-reviewed provenance records. No new historical events or cards are claimed in this wave.

## Source-to-claim review

1. **Mirari and publication causality.** [Stories from Dominaria, Part 3](https://magic.wizards.com/en/news/making-magic/stories-dominaria-part-3-2018-04-30) is Mark Rosewater's 2018 first-person design history. He describes the Mirari as his intended Odyssey marquee card, its copy-spell mechanics and development changes, and the story team's decision to foreground it. This is a source on product design—not the in-world creation of Karn's probe or the precise mechanism of a particular tragedy.
2. **Aboshan and Laquatus.** The chapter already recounts the attempted imperial mastery of the seas and ensuing flood, plus Laquatus's political interventions. The new subsection draws a political interpretation from that existing account. The novel *Odyssey* (2001) remains the cited fiction for scene-level detail; no new exact dates, casualty counts, or words of dialogue were inferred from secondary accounts or card portraits.
3. **Torment and Chainer.** [Make It Black](https://magic.wizards.com/en/news/making-magic/make-it-black-2002-01-14) provides a contemporary development explanation for the black-heavy Torment set, its provisional title Vendetta, and the Chainer/Mirari/Cabal story hook. [Commander Masters Storyteller, Part 1](https://magic.wizards.com/en/news/making-magic/commander-masters-storyteller-part-1) already in the bibliography separately explains Chainer's intended central role and Nightmare mechanics. These are design claims, not replacements for the novel *Chainer's Torment* (2002).
4. **Akroma and Phage.** [Quite Some Characters](https://magic.wizards.com/en/news/making-magic/quite-some-characters-2020-11-09) documents the deliberate design contrast between the dream-born Akroma and death-touch Phage. The insertion identifies the preceding narrative causes—Ixidor's grief over Nivea and Jeska's involuntary transformation—without deriving novel plot solely from keywords or card abilities.
5. **Karona and Jeska.** [The Legendary Characters of Commander Legends, Part 1](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30) verifies the three constituents of Karona, betrayal by Sash and Waistcoat, death of Akroma and Zagorka, and ignition of Jeska's spark. The literary chronology remains the six-book Odyssey/Onslaught cycle; exact AR dating for the later events is intentionally withheld.

## Acceptance checklist

- Ensure all five new subsections are correctly positioned in the existing chapter and that the new bibliography entries match the two exact Wizards URLs.
- Verify the distinction between in-world canonical narrative, design commentary, and historical interpretation in the new passages.
- Check that the twenty chapter card identities, illustrated uses, existing event links and original character routes were not modified.
- Run the new six regression tests, `pnpm run verify`, and desktop/mobile `pnpm exec playwright test`.
- Inspect `/mtg-history/chapters/otaria/` on desktop and mobile and manually review the card illustrations/captions. Offline check passes do not establish image fidelity.
- The novel passages were not newly verified line-by-line; do not describe the expanded chapter as a full primary-fiction certification.

## Expected project totals

Ten chapters; 88 characters; 133 historical events; 118 relationships; 133 canonical printings; 135 chapter-card references. The source bibliography grows by two from 134 to **136** chapter references, provided no other branches modify source totals. Source-reviewed event coverage remains 43 of 133 and three primary-fiction questions remain open.
