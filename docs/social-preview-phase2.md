# Social preview image — phase 2

The project now includes an original, static `public/social-preview.png` (1200 × 630 px) with a dark celestial diagram and the independent-archive title. It does not reproduce Wizards of the Coast card artwork, official logos, or Scryfall images. The illustration is project-created and may be used as the social preview for this site.

`src/layouts/BaseLayout.astro` publishes an absolute, base-aware `og:image` and `twitter:image` URL for every static route, along with image size, type, alt text, and a `summary_large_image` Twitter card. Page titles and descriptions remain route-specific.

The existing `scripts/build-seo.mjs` gate now rejects a missing, undersized, malformed, or incorrectly dimensioned social image and verifies that every generated page references the public image. It continues to emit the sitemap and robots file before Pagefind indexing. Run `pnpm run verify` and `pnpm exec playwright test` before merging.

Manually inspect the 1200 × 630 image at 100% and verify the generated HTML for the home page and representative chapter, character, and event pages. After GitHub Pages deployment, paste a public URL into social-link-preview validators. Some services cache old cards; initial previews may take time to refresh.
