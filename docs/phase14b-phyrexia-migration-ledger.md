# Phase 14B — New Phyrexian chapter split: pre-migration audit

## Decision boundary

Phase 14A's `ROADMAP.md` records the agreed intent to split the currently published `march-of-the-machine` chapter into **Rise of New Phyrexia** (`new-phyrexia`) and **March of the Machine** (retaining `march-of-the-machine`). This phase is **planning only**: the site still has ten published English chapters and ten Portuguese condensed adaptations. Nothing in this patch changes historical claims, card-printing IDs, live routes or chapter order.

The proposed event boundary is the failed strike at the Seedcore: the six records about Mirrodin, the praetors, sleeper warfare and the failed strike are candidates for the new chapter; the seven invasion/aftermath records remain in `march-of-the-machine`. The 17 curated original printing references are allocated **10 / 7** by their current indexed position and exact UUID, not by a new Scryfall lookup. The 11 current major sections have four initial rise candidates, four invasion candidates, and three requiring a deliberate cross-arc prose rewrite. These are recommendations, not automatic file moves or signed-off editorial chronology.

Do not automatically redistribute original chapter bibliography sources, relationship chapters, character memberships, or cross-referenced MDX links. Some belong in **both** new chapters; the source passages must be checked against the final prose. A new PT-BR condensed companion is mandatory before publishing the eleventh English chapter with claimed PT chapter parity.

## Windows PowerShell audit

From a clean feature branch after merging Phase 14A:

```powershell
node --test scripts/phase14b-phyrexia-split.test.mjs
pnpm run verify
pnpm exec playwright test

$out = Join-Path $HOME 'Downloads\mtg-phase14b-split'
New-Item -ItemType Directory -Force -Path $out | Out-Null
pnpm run audit:phyrexia-split --markdown (Join-Path $out 'migration-ledger.md') --json (Join-Path $out 'migration-ledger.json')
Invoke-Item (Join-Path $out 'migration-ledger.md')
```

The JSON reports the proposal for every existing event, printing and major section. Bibliography, characters and relationships are deliberately marked **UNASSIGNED_..._REVIEW**, not silently given chapter ownership. The preflight fails if a current event, printing or section is missing or duplicated; review unexpected source changes rather than editing counts to hide them. Outputs are generated under Downloads, not checked into the repository.

## Implementation wave — proposed Phase 14C

Only after human acceptance of the ledger should a separate content PR create `new-phyrexia.mdx` and remap events, art-ledger chapter columns, source bibliographies, inline historical moments, chapter headings and cross-links. Retain the `march-of-the-machine` slug for the battle and preserve exact printing UUIDs. Update `src/data/eras.ts`, source relationship/character JSON, the chapter-era palette, PT-BR edition and navigation, index/search, Open Graph/SEO, sitemap and hreflang paths, generated adapters and count-sensitive tests. Move or redirect existing section anchors as needed.

Target **11 English chapters, 11 PT-BR condensed editions**, with the same 133 events, 88 characters, 118 relationships and 133 unique printings, unless additional content is independently justified. The chapter-artwork reference count remains **135** only if all existing uses are preserved without duplication or deletion. Final publication requires full build, Playwright, strict axe accessibility, exact-printing and editorial acceptance, and a post-deploy deep-link review.

The separate Omenpaths review remains Phase 14A and should merge first. Novel-dependent questions such as Koilos, Venser, Freyalise and Gideon remain outside this split and are not automatically closed.
