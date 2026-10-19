# Historical depth — Wave 2E: the Thran powerstone implantation

**Base:** `main` commit `ee76819a44e0e3f44f61bd8dd8b8f1d082652652` (PR #92 merged). Update your Windows working copy of `main` before creating the Wave 2E feature branch.

## Change

- Adds the canonical event `thran-glacian-stones-implanted`, expressly separated from **the invention of powerstones**, **Rebbec's sealing of the gateway**, and **Urza and Mishra's discovery of the stones**.
- Extends the Thran chapter with three interpretation sections and a linked event reference.
- Expands three existing biographies (Glacian, Rebbec and Yawgmoth) without altering their identity, source URL, chapter membership or curated portrait.
- Updates the generated event compatibility adapter and offline exact-count guards, including the Wave 2B test that asserts the current total.

**Expected counts:** 10 chapters / 88 characters / **130 events** / 118 relationships / 133 unique printings / 135 chapter card uses.

## Canon and artwork evidence

Primary official anchor: [The Legendary Characters of Commander Legends, Part 2](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-2-2020-11-06) explicitly states that Yawgmoth implanted the two halves of a broken powerstone in Glacian, that the stones leeched his life away, that Rebbec used them to seal Phyrexia, and that Urza and Mishra found them millennia later.

Supporting sources:

- [The Legendary Characters of Commander Legends, Part 1](https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30) — Rebbec's architecture, Glacian's illness, Yawgmoth's arrival, gateway closure.
- [The Known Multiverse](https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19) — Phyrexia existed before Yawgmoth and was reached with Dyfed's help.
- J. Robert King, *The Thran* (1999) — novel-era narrative; consult for deeper scene-level adjudication.

The existing exact printing of *The Mightstone and Weakstone* (`bro` #238; Ryan Pancoast) identifies the physical artifacts **retrospectively**. It is **not** a depiction of the surgical implantation. No artwork is downloaded, rehosted or reclassified; no release date is presented as an in-world date. No new sources are silently interpreted as independent eyewitness testimony.

## Windows QA checklist

```powershell
node --test scripts/thran-canon-wave2e.test.mjs
pnpm run verify
pnpm exec playwright test
pnpm run review:artwork --gallery "$env:USERPROFILE\Downloads\mtg-artwork-review.html"
Start-Process "$env:USERPROFILE\Downloads\mtg-artwork-review.html"
```

On desktop and mobile, inspect the Thran chapter, the new event page, and the Glacian, Rebbec and Yawgmoth profiles. Verify chapter ordering, graph links and credited canonical artwork before merging. The regression test checks content and linkage, **not** whether the artwork literally depicts the scene.

Wave 2D's README screenshot gallery is already merged. This wave preserves those six screenshots and does not alter the screenshot capture workflow.
