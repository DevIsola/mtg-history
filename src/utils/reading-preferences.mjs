/** Stored preferences only affect chapter prose. Unrecognized data is discarded. */
export const READING_PREFERENCES_KEY = 'mtg-history-reading-preferences-v1';
export const DEFAULT_READING_PREFERENCES = Object.freeze({
  size: 'regular',
  typeface: 'classic',
  spacing: 'comfortable',
});

const allowed = Object.freeze({
  size: ['compact', 'regular', 'large'],
  typeface: ['modern', 'classic'],
  spacing: ['comfortable', 'relaxed'],
});

export function normalizeReadingPreferences(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value : {};
  return Object.fromEntries(Object.entries(DEFAULT_READING_PREFERENCES)
    .map(([key, fallback]) => [key,
      allowed[key].includes(source[key]) ? source[key] : fallback]));
}

/** Storage access can throw (privacy modes or blocked storage). */
export function readReadingPreferences(storage) {
  try {
    const raw = storage?.getItem(READING_PREFERENCES_KEY);
    return normalizeReadingPreferences(raw ? JSON.parse(raw) : null);
  } catch {
    return normalizeReadingPreferences(null);
  }
}

/** Preference changes still work for this page if storage is unavailable. */
export function writeReadingPreferences(storage, preferences) {
  try {
    if (!storage) return false;
    storage.setItem(
      READING_PREFERENCES_KEY,
      JSON.stringify(normalizeReadingPreferences(preferences)),
    );
    return true;
  } catch {
    return false;
  }
}
