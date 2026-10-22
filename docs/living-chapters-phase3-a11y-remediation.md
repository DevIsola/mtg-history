# Phase 13.3 — strict accessibility remediation (Windows)

## Findings

The 2026-10-22 strict axe run across desktop/mobile routes failed because
shared accessible names did not include visible text and normal-sized text
fell below 4.5:1 WCAG AA contrast on light-theme surfaces. Multiple chapter
failures arise from the same color tokens and a parent opacity of 0.92 during
illustration reveals; they are not independent historical-content defects.

## Remediation

- Include visible EN or PT text in the language selector accessible name.
- Include visible `Aa` in the chapter preferences accessible name.
- Darken the shared light-theme jade *text* token without changing dark-theme
  colors; use semantic `--link-color` for citation numbers and event headings.
- Keep illustrated historical moments fully opaque at all times while retaining
  their lightweight positional reveal. This protects nested captions, credits,
  links and buttons against contrast loss from group opacity.
- Leave Scryfall printing identities, historical interpretations, artwork,
  navigation, F2 strict-enforcement rules and Phase 13.3 functionality intact.

## Verification (Windows PowerShell)

```powershell
node --test scripts/living-chapters-phase3-a11y.test.mjs
pnpm run verify
pnpm exec playwright test
$env:A11Y_ENFORCE = '1'
try {
    pnpm exec playwright test tests/browser/accessibility.spec.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Strict accessibility check failed' }
} finally {
    Remove-Item Env:A11Y_ENFORCE -ErrorAction SilentlyContinue
}
```

Manual testing remains required for color contrast in both themes, keyboard
navigation, cropped card significance, scroll motion and screen-reader labels.
