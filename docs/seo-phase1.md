# SEO and social metadata — phase 1

The site uses `Astro.site` and the configured GitHub Pages base for route-specific canonical URLs and HTML metadata. All `BaseLayout` pages emit Open Graph and Twitter text metadata from the existing, authored title and description.

After Astro builds, `scripts/build-seo.mjs` enumerates only prerendered `index.html` routes, requires a matching canonical link on each, then emits `dist/sitemap.xml` and `dist/robots.txt`. Pagefind indexes the unchanged HTML afterward. No external requests, server, or third-party sitemap dependency are used.

Validate with `node --test scripts/seo.test.mjs`, `pnpm run verify`, `pnpm exec playwright test`. Inspect `dist/sitemap.xml` and `dist/robots.txt` and check head tags in the production preview.

Future phase: a dedicated, properly licensed static 1200×630 social-card image and image-specific `og:image`/`twitter:image` tags. No image metadata is emitted until the actual image exists.
