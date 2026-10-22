/**
 * UX F2 release matrix and offline checks. This module has no runtime/site
 * dependencies, so it can be used by Node regression tests and local tooling.
 */
export const REVIEW_ROUTES = Object.freeze([
  { id: 'home-en', route: '', locale: 'en' },
  { id: 'home-pt', route: 'pt-br/', locale: 'pt-BR' },
  { id: 'explore-en', route: 'explore/', locale: 'en' },
  { id: 'explore-pt', route: 'pt-br/explore/', locale: 'pt-BR' },
  { id: 'timeline-en', route: 'timeline/', locale: 'en' },
  { id: 'timeline-pt', route: 'pt-br/timeline/', locale: 'pt-BR' },
  { id: 'archive-en', route: 'archive/', locale: 'en' },
  { id: 'archive-pt', route: 'pt-br/archive/', locale: 'pt-BR' },
  { id: 'characters-en', route: 'characters/', locale: 'en' },
  { id: 'characters-pt', route: 'pt-br/characters/', locale: 'pt-BR' },
  { id: 'relationships-en', route: 'relationships/', locale: 'en' },
  { id: 'events-en', route: 'events/', locale: 'en' },
  { id: 'chapter-en', route: 'chapters/thran/', locale: 'en' },
  { id: 'search-pt', route: 'pt-br/search/', locale: 'pt-BR' },
]);

export const REVIEW_WIDTHS = Object.freeze({ mobile: 390, desktop: 1440 });
export const EXTENDED_WIDTHS = Object.freeze({ narrow: 320, tablet: 768 });
export const THEME_MODES = Object.freeze(['light', 'dark']);

const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const hex = /^#[a-f\d]{6}$/i;

export function luminance(color) {
  if (!hex.test(color)) throw new TypeError(`Expected 6-digit hex color, got ${color}`);
  const components = [1, 3, 5].map((n) => parseInt(color.slice(n, n + 2), 16) / 255);
  const linear = components.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
export function contrastRatio(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function readCssToken(source, token) {
  const found = source.match(new RegExp(`(?:^|\\n)\\s*--${token}:\\s*(#[a-f\\d]{6})\\s*;`, 'i'));
  if (!found) throw new Error(`Missing literal CSS token --${token}`);
  return found[1].toLowerCase();
}
/** No forced minimum for decorative art. Text must clear WCAG AA normal-text 4.5:1. */
export function reviewThemeContrast(lightCss, darkCss) {
  const issues = [];
  for (const [mode, css] of [['light', lightCss], ['dark', darkCss]]) {
    const background = readCssToken(css, 'paper-white');
    for (const textToken of ['ink', 'ink-soft', 'link-color', 'jade']) {
      const foreground = readCssToken(css, textToken);
      const ratio = contrastRatio(foreground, background);
      if (ratio < 4.5) issues.push(`${mode}: --${textToken} contrast ${ratio.toFixed(2)}:1 on --paper-white`);
    }
  }
  return issues;
}

/** Independently check the translated inventory without changing canonical UUIDs. */
export function reviewPrintingCatalog(printings, catalog) {
  const problems = [];
  if (!catalog || catalog.version !== 1 || typeof catalog.cards !== 'object' || !catalog.cards || Array.isArray(catalog.cards)) {
    return ['PT catalog must have version=1 and a cards object'];
  }
  const originalIds = new Set(Object.keys(printings));
  const translatedIds = new Set();
  for (const [id, entry] of Object.entries(catalog.cards)) {
    const original = printings[id];
    if (!uuid.test(id) || !originalIds.has(id) || !original) problems.push(`Unknown canonical reference: ${id}`);
    if (!uuid.test(entry?.id ?? '') || entry?.id === id) problems.push(`Invalid Portuguese printing ID for ${id}`);
    if (translatedIds.has(entry?.id)) problems.push(`Duplicate Portuguese printing ID for ${id}`);
    translatedIds.add(entry?.id);
    if (entry?.canonicalId !== id || entry?.lang !== 'pt') problems.push(`Incorrect original ID or language for ${id}`);
    if (original && (entry?.setCode !== original.setCode ||
        String(entry?.collectorNumber) !== String(original.collectorNumber) ||
        entry?.artist !== original.artist)) problems.push(`Mismatched set, collector, or artist for ${id}`);
    if (!uuid.test(entry?.illustrationId ?? '') || !entry?.printedName?.trim()) {
      problems.push(`Missing illustration provenance or PT printed name for ${id}`);
    }
  }
  return problems;
}
