# Browser quality — Phase 3

The browser suite complements the Node regression tests, content-graph validation,
Astro type diagnostics, production build, and generated-link checker. It does
not replace any of them. The reusable GitHub Actions workflow runs after merge to `main`. A failing
browser job blocks deployment; local checks and review must precede merge.
See [implementation-workflow.md](implementation-workflow.md).

## Local setup (macOS)

Requirements: Node 22.12+ (CI uses Node 24), pnpm 10, and a current lockfile.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run verify
pnpm exec playwright test
```

The Playwright configuration and starter smoke tests in the repository root
(`playwright.config.mjs` and `tests/browser/site.spec.mjs`) are prerequisites.
If you have not already added the dependency, run
`pnpm add -D -E @playwright/test` and commit **both** `package.json` and
`pnpm-lock.yaml` with the test changes. Never hand-edit lockfile resolutions.

Use `pnpm exec playwright test --project=desktop-chromium` or
`--project=mobile-chromium` for a focused run, and
`pnpm exec playwright show-report` to inspect an HTML report if generated.
Playwright builds the site and serves its **production output** through Astro
preview on `127.0.0.1:4323`. The browser suite deliberately uses a dedicated port
and does **not** reuse an existing development server, avoiding Vite hot reloads
interrupting accessibility scans. You do not need to start `astro dev` before
testing. If port 4323 is occupied, stop the previous process rather than
reusing it. The separate performance suite continues to use port 4322.

Accessibility scans wait for the document `load` event before injecting axe.
To reproduce a navigation-related failure without running unrelated tests:

```bash
pnpm exec playwright test tests/browser/accessibility.spec.mjs \
  --project=desktop-chromium --grep 'home:' --repeat-each=5 --workers=1
```

Do not test against the public GitHub Pages deployment or rely on Scryfall image
responses for correctness assertions.

## Coverage

- Base-prefixed routes and semantic landmarks (starter smoke suite).
- Keyboard skip link and chapter TOC anchors (starter smoke suite).
- Theme switching and persistence on navigation.
- Character and unified encyclopedia search, empty states, and reset behavior.
- Accessible card previews: keyboard focus, Escape, desktop pointer, mobile button.
- Mobile navigation and TOC dismissal.
- Representative chapter overflow on desktop and mobile (starter smoke suite).

The tests use real source selectors instead of image pixels or third-party network
assertions. Chromium desktop and emulated Pixel 7 mobile are included. Manual
screen-reader assessment, WCAG audits, Safari/Firefox compatibility, and
performance budgets are future work, not claimed by these tests.

## CI behavior

`.github/workflows/browser-quality.yaml` runs a job called by Pages after a merge to main, or by manual dispatch:
install reproducible dependencies, install Chromium and Linux libraries,
execute the browser suite, and upload Playwright traces/screenshots when a test
fails. A failing suite must be fixed; do not suppress or skip checks to merge.

`test-results/` and `playwright-report/` are generated diagnostics and should not
be committed. If CI tests fail, open the run and inspect its uploaded artifact.
