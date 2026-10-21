# PT-BR Phase 6 — Thran long-form narrative fidelity

This milestone materially expands the existing Portuguese Thran **condensed adaptation**, rather than creating or copying a second historical content collection. Thirteen editorial sections gain twenty-six substantial Portuguese paragraphs, extending discussion of chronology, social inequality, medical authority, the origins of Phyrexia, the distinct Dyfed/Pyrulea journey, the closure of the gateway, and the later inheritance of Glacian's powerstones.

## Content integrity

- English `src/content/chapters/thran.mdx` remains the historical, bibliographic, and printing authority. No English source, event, relationship, card, or chapter entry changes.
- The PT-BR page still has 13 principal headings, 11 editorial subsections, six `HistoricalMoment` uses backed by the original ordered `chapter.data.cardIds`, and nine English event-record links.
- The 26 new paragraphs appear in the already published reading order, remain visible without JavaScript, and contain no new speculative in-world calendar dates or claims that card artwork literally depicts unrelated scenes.
- The language edition retains its prominent **not a complete translation** notice and link to the full English chapter. There is still **no reciprocal Thran `hreflang`** because prose expansion and structural parity do not independently establish full textual equivalence.

## Verification

Run `node --test scripts/pt-thran-text-fidelity.test.mjs scripts/pt-thran-depth.test.mjs scripts/pt-thran.test.mjs`, `pnpm run verify`, and `pnpm exec playwright test`. Inspect desktop/mobile presentation and cards; compare the new prose to the 24 English editorial headings and nine event references. Before any future promotion to a full translated counterpart, perform and record actual paragraph-level bilingual editorial acceptance, terminology review, and citation checks.

## Next roadmap decision

After this milestone merges, the remaining step for full Thran parity is a human-approved bilingual line/paragraph comparison and explicit qualification of editorial completeness. Do not introduce reciprocal chapter `hreflang` or remove the incomplete-translation notice until that is completed.
