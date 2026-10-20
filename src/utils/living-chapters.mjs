/**
 * Enhancement only: chapter text and cards are fully rendered and readable
 * before JavaScript runs. Never hide, remove or defer historical content.
 */
export const LIVING_REVEAL_SELECTOR = '.chapter-prose h2, .chapter-prose .historical-moment';

export function setupLivingChapterReveals(root, options = {}) {
  const Observer = options.Observer ?? globalThis.IntersectionObserver;
  const reducedMotion = options.reducedMotion ??
    (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const viewportHeight = options.viewportHeight ?? globalThis.innerHeight ?? 0;

  const noop = { count: 0, disconnect() {} };
  if (!root || reducedMotion || typeof Observer !== 'function') return noop;

  // Browsers may scroll to an incoming #fragment after module scripts run.
  // The initial viewport would be stale, leaving the eventual anchor content
  // with a pending reveal cue. Prefer fully readable, unanimated deep links.
  const incomingHash = options.locationHash ?? globalThis.location?.hash ?? '';
  if (incomingHash.startsWith('#')) return noop;

  // Do not animate currently displayed content (including a hash-targeted
  // heading), and do not touch hidden/collapsed content.
  const targets = [...root.querySelectorAll(LIVING_REVEAL_SELECTOR)].filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.height > 0 && rect.top >= viewportHeight;
  });
  if (targets.length === 0) return noop;

  const observer = new Observer((entries, currentObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.dataset.livingReveal = 'visible';
      currentObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  for (const element of targets) {
    element.dataset.livingReveal = 'pending';
    observer.observe(element);
  }

  return {
    count: targets.length,
    disconnect() {
      observer.disconnect();
      // Clear pending animation cues if the observer is stopped early.
      for (const element of targets) {
        if (element.dataset.livingReveal === 'pending') delete element.dataset.livingReveal;
      }
    },
  };
}
