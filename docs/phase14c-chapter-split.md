# Phase 14C — New Phyrexia chapter split

Local implementation based on merged PR #154 (a9248f9). Not published or manually accepted.

## Reviewed migration decisions

- Orders: new-phyrexia 9, march-of-the-machine 10, omenpaths 11.
- Events: seven rise, six invasion/aftermath. Melira Guides the Assault toward the Seedcore moves into the rise chapter because its original source and narrative describe that expedition, correcting the 14B proposal.
- Exact printings: ten rise uses, eight invasion uses. Tamiyo’s NEO printing is deliberately shared: two unchanged event records across the boundary reference it. Total chapter uses become 136; unique printings remain 133. All original significance text survives.
- Bibliography: Death and Salvation, A Whisper in the Wind, Assault episodes 2/4/5 and Dominaria legends follow the rise. March episodes 1/3/6/7/8/9/10, Zendikar’s side story and Aftermath sources follow the invasion. Legends of Phyrexia and the Planeswalker’s Guide support both arcs. Source title/URL pairs are preserved.
- Relationships: the Jaya betrayal/mentorship, praetor preparation/rivalry, Tamiyo compleation and Seedcore resistance ties move to the rise. The remaining eight ties retain their invasion/aftermath ownership. JSON filenames and compatibility imports change together. Character memberships follow linked prose, canonical event participants and relationship endpoints, permitting both chapters.
- PT-BR: split the existing adaptation at the same boundary, add a rise publication note, retain the invasion aftermath and honest condensed-adaptation notices. Original source/card/event metadata remains canonical and in English. No false reciprocal translation hreflang is added.
- Deep links: old moved heading fragments remain as visible links in the original EN/PT invasion route, including no-JavaScript browsing. Existing invasion headings keep their numbers to preserve their original fragment IDs.

## Verification and acceptance

Run pnpm run verify, the complete Playwright suite, A11Y_ENFORCE=1 accessibility checks and three preserved production performance samples. The focused phase14c test checks the migration ledger, printing/significance preservation, event ownership and legacy anchor destinations.

The old audit:phyrexia-split command is a pre-migration guard and intentionally rejects this changed working tree. Use audit:roadmap and audit:consolidation for current queues. Do not edit the old planning proposal to pretend it was an accepted migration.

Human narrative, artwork, PT-BR and keyboard/assistive-technology acceptance remains pending. All novel-dependent source questions remain open. Keep this phase branch unmerged until required acceptance.
