# UX Wave E1 — Character encyclopedia

## Scope

- Display the character collection as editorial profile rows using the exact canonical featured card printing instead of generic letter badges.
- Keep the full card visible. Do not substitute cropped artwork for source evidence, or imply that the card proves the biography or one particular historical event.
- Retain artist, edition code, collector number, and profile-local significance, with canonical references resolved through Astro card collection IDs.
- Translate card *faces* in the PT-BR directory only where the existing verified `pt-printings.json` allows the same illustration. Otherwise, preserve the English printing and label it clearly. English-only biographies and links remain labeled English.
- Preserve 88 character routes, category/origin/chapter filters, actual relationship links, character biographies, events, and official sources.
- Add in-page navigation for long biographies without removing any content.
- Do not expand the historical editorial model or invent translated biography text.

## Acceptance

1. `pnpm run verify && pnpm exec playwright test` passes.
2. Inspect `/mtg-history/characters/`, `/mtg-history/pt-br/characters/`, and `/mtg-history/characters/urza/` at 1440px, 768px, and 320px.
3. Confirm filtering works, links are keyboard accessible, and each featured image is a full Scryfall card.
4. Verify a real PT card face and an English fallback, with their canonical UUID retained.
5. Confirm Ko-fi header, language controls, and global Pagefind palette are unchanged.

## Roadmap

E1 character encyclopedia → E2 relationships → F1 homepage → F2 QA. PT-BR in other card-facing pages still follows the separately tracked localization requirement.
