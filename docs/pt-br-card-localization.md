# PT-BR card display localization — requirement for future waves

## Product rule

When the reader selects PT-BR, prefer the **Portuguese-language Scryfall card printing and Portuguese printed name/text** for cards rendered on the site, when an appropriate official PT printing exists. Apply to the illustrated archive, chapter illustrations, event/character card references, enlargement dialog, and featured cards introduced by future updates. Keep original English printings available as the canonical historical/artwork reference.

## Artwork-fidelity guardrails

- Canonical historical references remain pinned to the existing Scryfall UUID and editorial significance ledger. A translated printing must never silently overwrite that identity, or imply that the art depicts a scene it does not.
- Resolve PT alternatives using verified Scryfall printing metadata: language, set, collector number, artist, illustration/artwork identity, and actual PT printed name/text. Prefer the same printing/illustration where a multilingual variant exists.
- Different artwork or printing = an explicitly attributed alternative representation, not an identical canonical artifact. Do not assume an English printing always has a Portuguese equivalent.
- If there is no verified matching PT printing, show the existing original English card with a discreet label such as `Imagem da edição original (EN)`. Do not machine-translate card faces or misrepresent translated text as official.
- Preserve Scryfall attribution and artist, set, collector number, printing-specific links and chapter significance. Editorial interpretation can be translated independently of the official card image but must retain its evidentiary classification.
- Prefer a reproducible build-time mapping/cache and bounded lookups rather than requesting every card from Scryfall on each page load. This static project must remain backend-free.

## Acceptance for D2 and all later card-facing updates

1. At least one verified PT card printing renders with correct Portuguese card face and exact provenance.
2. Missing PT variants fall back to the canonical English original with accurate labeling.
3. Swapping locale cannot change the historical event, canonical UUID, evidence ledger, artist credit, or interpretive claim.
4. PT and English readers can open the appropriate Scryfall printing; all navigation remains base-aware and keyboard accessible.
5. Cover CardArtworkViewer, chapter plates, archives, event cards, and future visuals in regression tests.

Status: **planned, not implemented by UX C3**. Implementation begins with the D2 illustrated archive work, then carries forward to every new card-facing feature.
