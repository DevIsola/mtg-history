import { cardImageFallbackLabel, isScryfallCardImageUrl } from '../utils/card-image-recovery.mjs';

/** No remote retries, no tracking, and no image proxy: make failure accessible. */
function showMissingImage(image: HTMLImageElement): void {
  if (image.dataset.cardImageFallbackApplied === '1') return;
  if (!isScryfallCardImageUrl(image.currentSrc) && !isScryfallCardImageUrl(image.src)) return;

  image.dataset.cardImageFallbackApplied = '1';
  image.style.display = 'none'; // Inline style wins over component-scoped img styles.

  const placeholder = document.createElement('span');
  placeholder.className = 'card-image-fallback';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', cardImageFallbackLabel(image.alt));
  placeholder.textContent = 'Card image unavailable';
  image.insertAdjacentElement('afterend', placeholder);
}

document.addEventListener('error', (event: Event) => {
  if (event.target instanceof HTMLImageElement) showMissingImage(event.target);
}, true); // Image error events do not bubble.

// Cover images that failed before Astro's bundled module initialized.
for (const image of document.querySelectorAll<HTMLImageElement>('img')) {
  if (image.complete && image.naturalWidth === 0) showMissingImage(image);
}
