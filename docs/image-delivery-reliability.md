# Image delivery reliability — Phase 2

This phase keeps Scryfall hosting, exact printing IDs, **uncropped full-card art**, and
artist attribution. It adds a client-only failure state, not an image rehoster.

## Failure states

`src/scripts/card-image-fallback.ts` watches image `error` events in the capture
phase. The browser may fail to load card art due to CDN errors, network policy,
offline access, or blocking. The handler provides an accessible **Card image
unavailable** placeholder with the original image description; it does not retry
or silently substitute a different printing. The underlying Scryfall card link,
text and credited artist remain accessible.

Card-hover previews remove the prior placeholder before opening another preview.
The browser tests intentionally abort CDN image requests to verify behavior with
no network dependency. No availability status is inferred from build-time JSON.

## Opt-in delivery sampling

`pnpm run probe:images --sample 3` makes up to three sequential **HEAD** requests
for deterministically selected printing images (maximum ten, with 350 ms spacing).
Use `pnpm run probe:images --sample 5 --output "$HOME/Downloads/image-probe.json"`
to save an ephemeral local report. This is **not** part of CI, verification, or
the static build. No images are downloaded or added to the repository.

Reports include HTTP status, declared `Content-Length` if supplied, cache-control,
content type and observed request duration. HEAD restrictions, network errors,
access controls or missing metadata are **inconclusive**, not evidence that an
image is missing. Declared `Content-Length` is not a measured browser transfer
size, and the report is a bounded diagnostic, not ongoing availability monitoring.
For actual mobile payload and Core Web Vitals comparisons, measure with production
browser DevTools or the existing Playwright performance configuration on the
published site, including CDN requests.

## Hosting decision

Do not begin copying card imagery into `/public/` or a CDN without separately
reviewing image-use rules, copyright, storage costs, attribution and cache expiry.
Keep Scryfall as the external source for this phase. Preserve printed attribution,
full image boundaries and the exact UUID. The existing 135-entry artwork ledger
remains the editorial source of truth, not a visual-verification certificate.

References: https://scryfall.com/docs/api and https://scryfall.com/docs/api/images
