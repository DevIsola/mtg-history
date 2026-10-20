# Wave 2AF — Battle of Koilos primary-fiction evidence boundary

## Purpose

Wave 2AE established a legitimate source-review boundary: public Wizards retrospectives describe the original Coalition's resistance to Phyrexia, but the specific victory and scene chronology at **Koilos** have not yet been traced to a passage of the original fiction. The event **must remain outside** the source-reviewed ledger until that comparison occurs.

Wave 2AF makes this limitation visible on `/events/battle-of-koilos/` and supplies a reproducible offline primary-fiction worksheet. The notice is scoped to Koilos only. It does **not** mark every unreviewed event as false and does not imply that any card mechanically proves what took place.

## Target and source distinction

- Event: `battle-of-koilos` (Weatherlight chapter); exact card ID `dd8ad3aa-3225-45ae-8343-5991f5b52269` (*Coalition Victory*, Invasion).
- Primary-fiction candidate already in the chapter bibliography: *Invasion* (J. Robert King, 2000). The *Planeshift* and *Apocalypse* novels may supply later-war context, but should not be substituted for the original Koilos battle scene.
- Distinct event: `brothers-koilos-stones` is Urza and Mishra's ancient discovery of the two stones, not the Coalition's original invasion-era battle.
- Distinct later setting: Karn's **Dominaria United**-era investigation of the Caves of Koilos is not evidence of the original Coalition victory.
- Present source classification: `PENDING_PRIMARY_FICTION`, **not** a claim-level reviewed provenance record.

The reading target is to establish the participants, location, battle outcome, relation to the Rathi Overlay, and whether the artwork commentary claims more than the novel supports. Record the actual edition, chapter and page or digital location before making changes. No fabricated page numbers or purported extracts are allowed.

## Windows workflow

```powershell
pnpm run review:koilos-evidence --output "$HOME\Downloads\mtg-koilos-wave2af-review.md"
notepad "$HOME\Downloads\mtg-koilos-wave2af-review.md"

node --test scripts/koilos-primary-review-wave2af.test.mjs
pnpm run verify
pnpm exec playwright test
pnpm run audit:consolidation
```

The worksheet is generated **only with an explicit output** and will refuse to overwrite an existing reviewer worksheet. It performs no network calls, accesses no copyright-protected novel text and makes no content mutation.

## Acceptance gates

1. `battle-of-koilos` remains absent from `eventProvenance`, with the exact curated card unchanged.
2. Reader displays the pending-evidence notice only for this explicitly queued event, alongside its existing narrative, without a counterfeit official citation.
3. Existing three unresolved provenance claims (Venser, Freyalise, Gideon) remain open. The new Koilos notice is a separate manual-research item, not a fourth entry in that ledger.
4. Expected totals remain 10 chapters, 133 historical event records, at least 48/133 claim-level reviewed event records, 135 curated chapter-card references, and three ledgered unresolved primary-fiction claims.
5. Once *Invasion* is directly examined, document the edition and specific passage, correct the event if required, add only defensible source classification, and remove this separate manual notice in the **same** subsequent editorial PR.

This milestone improves review integrity and reader transparency, not historical fact certification. Manual editorial acceptance remains outstanding.
