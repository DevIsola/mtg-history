# Historical depth — Wave 2D: Sarpadia and the frozen kingdoms

Baseline: `main` after PR #91 (10 chapters, 88 characters, 129 historical events, 118 relationships; 133 distinct card printings and 135 curated uses).

## Scope

Four narrative subsections in the Ice Age chapter and expanded profiles for **Jodah**, **Lim-Dûl**, **Thelon of Havenwood**, and **Endrek Sahr**. The material emphasizes differences between Sarpadia's five internal crises, the creation of thallids and thrulls, the political alliance against Lim-Dûl, and the dual effects of Freyalise's World Spell.

This is an editorial depth increment, not an assertion of newly documented events. It does not alter an ID, an event relationship, story dates, Scryfall printing identity, or artwork classification.

## Primary published anchors

- [Wizards — Faction Packed](https://magic.wizards.com/en/news/making-magic/faction-packed-2018-10-15) identifies the five Sarpadian factions and their separate internal opponents.
- [Wizards — Name Dropping](https://magic.wizards.com/en/news/making-magic/name-dropping-2006-11-13) explains why the retrospective _Time Spiral_ cards depict Thelon and Endrek Sahr; it identifies them with the thallids and thrulls respectively.
- [Wizards — The Legends You'll Find in Dominaria United](https://magic.wizards.com/en/news/feature/legends-youll-find-dominaria-united-2022-09-01) summarizes Jodah, Jaya, the Kjeldoran–Balduvian alliance and Lim-Dûl.
- The chapter's existing named Ice Age Cycle novels and World Spell sources remain the anchors for longer chronology. This change makes no new novel-exclusive or precisely dated claims.

## Editorial guardrails

1. _Fallen Empires_ published in 1994 is not an exact day-by-day calendar for Sarpadia's five internal struggles.
2. Thelon and Endrek are different makers in different societies. Their _Time Spiral_ legendary cards are retrospective character portraits, not images of their creations' uprisings.
3. The Lim-Dûl alliance is political as well as military. Jodah's later card is not a literal depiction of the negotiations.
4. The World Spell's effects on local winter conditions and on interplanar isolation should be distinguished. Publication in _Dominaria United_ does not move the event to 2022 in story time.
5. No new printings or chapter card references: artwork checks and all original hardcoded totals remain authoritative.

## Review commands

```powershell
node --test scripts/ice-age-depth-wave2d.test.mjs
pnpm run verify
pnpm exec playwright test
pnpm exec playwright install chromium
pnpm run screenshots:readme
```

Inspect the Ice Age chapter and the four relevant biographies on desktop and mobile. Inspect all six README image outputs before committing them to Git. A screenshot that fails to display third-party images is not accepted merely because the screenshot test completed successfully.
