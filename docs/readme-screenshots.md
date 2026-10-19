# README screenshot capture

The README screenshots are evidence of the real rendered website, not hand-designed mockups. They are generated **locally** by Playwright with the production Astro preview and committed as images together with the Markdown that embeds them.

## Windows PowerShell workflow

```powershell
pnpm install
pnpm exec playwright install chromium
pnpm run screenshots:readme
Get-ChildItem docs/screenshots -Filter *.jpg
Start-Process (Resolve-Path docs/screenshots/home-desktop.jpg)
```

Inspect all six output files (home, timeline, Ice Age chapter, relationships, glossary, and mobile Ice Age). Make sure card images have loaded, links are not misrepresented, headings are visible and there are no empty or broken image areas. The script does not fabricate imagery or replace unavailable card images. If a third-party CDN is unavailable, repeat the capture when the exact printing is visible; do not invent a substitute.

Capture conditions: local production build, Chromium, desktop **1440×900**, mobile **Pixel 7** emulation, reduced motion, light mode, viewport-only JPEG at quality 80. The screenshot runner uses port 4326, distinct from the normal browser tests on port 4323. `pnpm run verify` does not automatically regenerate screenshots; update them intentionally after a visual change.

Run `git add README.md docs/screenshots docs/readme-screenshots.md` after reviewing the pictures. A new clone of the PR should show all README images without any build or external screenshot service. Avoid uploading raw full-resolution Scryfall assets separately. Every displayed Magic card and artwork retains its original rights-holder attribution on the site. The README footer continues to declare the unofficial fan-content status.
