# Full Brazilian Portuguese localization

Status: complete translated content prepared for human editorial review. This work does not certify new historical claims, resolve pending evidence, or grant production acceptance.

## Scope and identity

The Portuguese reading experience covers all 11 complete chapters, 88 character profiles, 133 event records, 118 relationships, 10 glossary entries, four historical paths, 11 era descriptions, and the existing claim-level provenance explanations. Paragraphs, narrative items, uncertainty qualifications, citations and publication identities are preserved. English canonical content remains the authority for IDs, relationships, dates, source URLs and curated printing references.

The generated route manifest contains 244 exact English/Portuguese pairs, or 488 routes. It includes directories, information pages and every published chapter, character and event detail route. Language choices and alternate-language metadata use this manifest rather than assuming arbitrary paths exist. Compatibility aliases retain older Portuguese section fragments and provide onward links without JavaScript, including preparation sections moved to the New Phyrexia chapter.

Card display uses 120 verified official Portuguese printings and 13 explicitly identified original-language fallbacks. A Portuguese display printing supplements its canonical historical reference; it does not replace the original UUID or promote the artwork into independent evidence of an event. Original publication titles and bibliography identities remain in their cited language.

## Evidence and review status

The existing 53 provenance records retain their original source roles, chronology precision and evidence limits. All three unresolved claim/evidence pairs remain unresolved. The Battle of Koilos retains its separate pending primary-fiction review notice. Translation does not change manual-review statuses, supply missing novel evidence or turn an editorial interpretation into a verified fact.

Human editorial review should check Brazilian Portuguese fluency, consistent established terminology, quotation fidelity and the distinction between in-world chronology and publication history. This review remains pending.

## Verification and test maintenance

Redundant phased translation suites have been consolidated into maintained content, chapter-reading and navigation checks. The full localization gate owns corpus completeness, paragraph/section structure, citations and canonical identity checks; browser tests own rendered content, language navigation, search, accessibility and legacy links. The existing issue-report security checks remain.

Local verification on 2026-10-24:

- `pnpm run verify` passes, including all 425 Node tests, complete localization coverage, content/type checks, the 488-page build, search indexing and internal links.
- The strict `A11Y_ENFORCE=1` full browser run covered 466 desktop/mobile cases. Unaffected suites passed; the two chapter/gallery suites needed updated markup assertions. Their corrected reruns validate every remaining case: 460 passing cases overall and six existing device-specific skips. No browser failures remain unresolved.
- All 34 local Cloudflare Static Assets checks pass, including root URLs, Portuguese search, cache behavior and legacy migration links without JavaScript.
- Production-preview performance sampling passes: 22 existing checks plus four Portuguese archive/chapter samples. These are local lab measurements, not field Core Web Vitals certification.

Human editorial acceptance remains pending. Production deployment and the earlier phase acceptance queues are unchanged. Review logs and screenshots are retained outside the repository.
