# README screenshots

The README's feature tour shows the real rendered website, not mockups. [`tests/screenshots/readme.spec.mjs`](../tests/screenshots/readme.spec.mjs) builds the production site, opens each feature in a meaningful state, and saves viewport JPEGs (quality 82) to `docs/screenshots/`.

| File | Feature shown | State prepared by the spec |
| --- | --- | --- |
| `chapter-reader.jpg` | Chapter reader | The first card moment of *The Brothers' War*, just below the sticky chapter bar |
| `card-viewer.jpg` | Artwork viewer | The first card in *The Thran*, enlarged in the dialog |
| `glossary-term.jpg` | Inline lore glossary | The first glossary term in *The Thran*, opened by keyboard |
| `relationships.jpg` | Relationship explorer | `?person=urza`, local scope, 2 steps, fitted (1440×1500 frame) |
| `character-profile.jpg` | Character profile | Urza's biography and featured card |
| `timeline.jpg` | Timeline atlas | Coverage counts, search, era filter and the first era |
| `archive.jpg` | Illustrated archive | Filtered to *The Brothers' War*, gallery view |
| `discover.jpg` | Discovery index | Searching "Phyrexia" |
| `dark-mode.jpg` | Dark theme | *War of the Spark*, first card moment |
| `mobile-home.jpg` | Phone layout | Homepage at 390×844, 2× |
| `mobile-chapter.jpg` | Phone layout | *Weatherlight* card moment at 390×844, 2× |

## Capture conditions

Chromium, desktop **1440×900** (unless noted), phone **390×844 at 2×**, reduced motion, and a fresh browser context per image. The theme is forced through the site's own `mtg-history-theme` preference. The spec waits for fonts and for every card image in view. **If any visible card image fails to load, the run fails**: the script never fabricates or substitutes artwork. If the Scryfall CDN is unavailable, rerun the capture later.

## Running it

- **GitHub Actions (recommended):** push a branch that changes the spec (or start *README screenshots* manually from the Actions tab). The workflow installs Inter and the Microsoft core fonts, so the text matches what most readers see (Segoe UI/Inter body, Georgia headings), then commits the refreshed images back to the branch. Every run also uploads the images as an artifact.
- **Locally:** `pnpm exec playwright install chromium`, then `pnpm run screenshots:readme`. The output uses whichever fonts your system provides.

The runner serves the preview on port 4326, separate from the browser tests on port 4323. `pnpm run verify` does not regenerate screenshots, so recapture deliberately after any visual change.

## Review checklist

Before merging, open every image and check that card art is sharp and fully loaded. Check that the framing shows the feature named in the README, not a half-cut component, and that the README's alt text still describes what is actually in each picture. Card images remain the property of their artists and rights holders. The README footer states the project's unofficial fan-content status.
