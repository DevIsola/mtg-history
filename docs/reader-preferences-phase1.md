# Reader Experience — Phase 1: Reading Preferences

## Product behavior

Each published chapter has a native, accessible reading-preferences panel for adjusting **text size** (smaller / standard / larger), **typeface** (modern sans-serif / classic serif), and **line spacing** (comfortable / relaxed). Defaults preserve the current design and do not change the chapter's headings, navigation, archival card metadata, chronology, or historical text.

Changes apply to `.chapter-prose` only and persist across all ten chapters using versioned localStorage. The state is validated against an allowlist; invalid or corrupted data falls back to current site defaults. Storage denial leaves the page functional for the current visit. Reset returns all three settings to their defaults.

The controls remain hidden until the client initializes. **Without JavaScript, chapters and cards remain fully readable**, as before. The feature introduces no analytics, user accounts, network calls, or new npm dependencies.

## Verification

On Windows PowerShell:

```powershell
node --test scripts/reading-preferences.test.mjs
pnpm run verify
pnpm exec playwright test
```

Manual acceptance: test keyboard radio navigation, reset focus and status feedback, light/dark themes, 320px mobile width, and preference persistence from one chapter to another. Test reduced motion and JavaScript disabled. The browser suite includes persistence, reset, mobile overflow, and no-JavaScript fallbacks.

## Next reader-experience work

This feature uses existing system typography. Future font decisions should be a separate, measured self-hosted-font PR with explicit license, font-display, subset size and mobile performance review. Do not introduce external font CDNs without consent. Other roadmap features (Pagefind full-text search, share previews, PT-BR localization, dual chronology) remain separate milestones.
