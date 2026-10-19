# Historical chapter depth — Wave 1

This editorial release expands the existing ten chapters, **without replacing their
narratives**, creating additional canonical-printing objects or inventing event IDs.
It adds contextual sections on causes, competing motives, civilian consequences,
and the relationship between in-world chronology and publication history.

## Approach and scope

| Chapter | Added sections | New prose words (approx.) |
| --- | ---: | ---: |
| thran | 4 | 990 |
| brothers-war | 4 | 968 |
| ice-age | 4 | 955 |
| many-worlds | 5 | 1,124 |
| weatherlight | 4 | 922 |
| otaria | 4 | 869 |
| mending | 4 | 850 |
| war-of-the-spark | 4 | 846 |
| march-of-the-machine | 4 | 857 |
| omenpaths | 4 | 857 |
| **Total** | **41** | **9,238** |

All additions are in the original MDX reading sequence under existing numbered
sections. No frontmatter, chapter order, character/relationship/event definitions,
artwork selection, source lists, or card significance changes are included.
The standalone test enforces presence and minimum depth; `pnpm run verify` and
Playwright remain authoritative for the whole site.

## Editorial policy

The prose distinguishes known story events from interpretation of social and
political consequences. Interpretive discussion is not proof that an unnamed
character performed a specific act, and should not become a new structured
historical event without primary-source confirmation. The publication year of
artwork is not treated as the date of its depicted fictional event.

Existing per-chapter sources remain authoritative. Selected official primary
reference points reviewed for this wave:

- Wizards of the Coast, [The Legendary Characters of Commander Legends, Part 1](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30) — Rebbec, Halcyon and Yawgmoth.
- Wizards of the Coast, [The Brothers' War Mechanics](https://magic.wizards.com/en/news/feature/the-brothers-war-mechanics) — how the 2022 set represents the historical conflict.
- Wizards of the Coast, [Ravnica, Then and Now](https://magic.wizards.com/en/news/feature/ravnica-then-and-now-2012-08-29-0) — original Guildpact crisis, Szadek and Agrus Kos.
- Wizards of the Coast, [Weather(light) Report](https://magic.wizards.com/en/news/making-magic/weatherlight-report-2007-12-03) — the Legacy and crew character motivations.
- Wizards of the Coast, [The Bolas Arc, Part 1](https://magic.wizards.com/en/news/making-magic/bolas-arc-part-1-2019-10-28) and [War of the Spark: Ravnica—Ashes](https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12) — strategic setup and its consequences.
- Wizards of the Coast, [Planeswalker's Guide to March of the Machine](https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-march-of-the-machine) — the planes' different responses to invasion.
- Wizards of the Coast, [Doing the Aftermath](https://magic.wizards.com/en/news/making-magic/doing-the-aftermath) — distinctions among Omenpaths and historic portals.

For deep canon adjudication (especially pre-2000 fiction, novels, and the
Time Spiral cycle), human editorial review against the chapters' existing
book citations remains required. This release does not assert that every
interpretive passage has an independently verified sentence-level citation.

## Manual acceptance

1. Review the new paragraphs in chapter order: chronology and named actors must
   agree with the existing prose, especially Thran and the Mending.
2. Confirm new subheadings behave correctly in the sticky table of contents.
3. Confirm each cited card still supports its editorial significance and no
   visual attribution was changed.
4. Run `node --test scripts/chapter-depth-expansion.test.mjs`, then
   `pnpm run verify && pnpm exec playwright test`.
