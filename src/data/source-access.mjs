/**
 * Review accessibility is NOT a source-verification verdict. These explicit
 * exceptions avoid treating risk score as a proxy for obtainable fiction.
 * Unlisted records remain NOT_ASSESSED, never assumed accessible.
 */
const novel = (work, note) => Object.freeze({
  status: 'BLOCKED_ORIGINAL_NOVEL', medium: 'novel', work, note,
});
const story = (title, url) => Object.freeze({
  status: 'WEB_ORIGINAL_AVAILABLE', medium: 'official-web-story', title, url,
});

export const SOURCE_ACCESS = Object.freeze({
  'battle-of-koilos': novel('Invasion (2000)', 'Separate original Koilos battle review; do not count as a fourth ledgered unresolved claim.'),
  'mending-venser-first-walk': novel('Time Spiral (2006); Planar Chaos (2007)', 'Verify the divergent-history first planeswalk with original passages.'),
  'freyalise-seals-skyshroud': novel('Planar Chaos (2007)', 'Verify the named rift and forest fate with original passages.'),
  'spark-gideons-sacrifice': novel('War of the Spark: Ravnica (2019)', 'Mechanics of the sacrificial transfer remain unverified.'),
  'omenpaths-loot-and-the-future': story('Outlaws of Thunder Junction — Epilogue 2: Bring the End, Part 2', 'https://magic.wizards.com/en/news/magic-story/epilogue-2-bring-the-end-part-2'),
  'omenpaths-desparking-consequences': story('March of the Machine: The Aftermath — She Who Breaks the World', 'https://magic.wizards.com/en/news/magic-story/she-who-breaks-the-world'),
  'omenpaths-thunder-junction-vault': story('Outlaws of Thunder Junction — Episode 6: The Ballad of Thieves and Thunderslingers', 'https://magic.wizards.com/en/news/magic-story/episode-6-the-ballad-of-thieves-and-thunderslingers'),
  'omenpaths-loot-discovered': story('Outlaws of Thunder Junction — Episode 6: The Ballad of Thieves and Thunderslingers', 'https://magic.wizards.com/en/news/magic-story/episode-6-the-ballad-of-thieves-and-thunderslingers'),
  'omenpaths-thunder-crossroads': story('Outlaws of Thunder Junction — Episode 6: The Ballad of Thieves and Thunderslingers', 'https://magic.wizards.com/en/news/magic-story/episode-6-the-ballad-of-thieves-and-thunderslingers'),
});

export const ARTWORK_REVIEW_DEPENDENCIES = Object.freeze({
  "war-of-the-spark/Gideon's Sacrifice": 'spark-gideons-sacrifice',
});

export function sourceAccessFor(id) {
  return SOURCE_ACCESS[id] ?? { status: 'NOT_ASSESSED', medium: 'unknown' };
}

export function annotateReviewQueue(rows) {
  return rows.map((row) => ({ ...row, sourceAccess: sourceAccessFor(row.id) }));
}

export function artworkReviewDependency(chapter, card) {
  return ARTWORK_REVIEW_DEPENDENCIES[`${chapter}/${card}`] ?? null;
}
