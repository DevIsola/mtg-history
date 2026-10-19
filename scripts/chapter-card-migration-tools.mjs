const printingFields = ['name', 'setCode', 'collectorNumber', 'scryfallId', 'artist'];
const metadataPattern = /^  - name: [^\r\n]+\r?\n    setCode: [^\r\n]+\r?\n    collectorNumber: [^\r\n]+\r?\n    scryfallId: [^\r\n]+\r?\n    artist: [^\r\n]+\r?\n    significance: ([^\r\n]+)$/gm;
const inlinePattern = /<HistoricalMoment card=\{frontmatter\.cards\[(\d+)\]\}>/g;

/** Pure transformation with strict zero-loss preconditions. */
export function migrateChapterCardSource(source, chapter, curated, ids, printings) {
  if (curated.length !== ids.length || !ids.length) throw new Error(`${chapter}: card count does not match cardIds`);
  const parts = source.match(/^(---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))([\s\S]*)$/);
  if (!parts) throw new Error(`${chapter}: missing chapter frontmatter`);
  const [_, prefix, frontmatter, end, body] = parts;
  const cardSection = frontmatter.match(/^cards:\s*\r?\n([\s\S]*?)(?=^[a-zA-Z][\w-]*:|$(?![\s\S]))/m);
  if (!cardSection) throw new Error(`${chapter}: missing cards section`);
  const oldCards = cardSection[1];
  const matches = [...oldCards.matchAll(metadataPattern)];
  if (matches.length !== curated.length) throw new Error(`${chapter}: unexpected card field order or already migrated`);
  const seen = new Set();
  curated.forEach((card, i) => {
    const id = ids[i];
    const printing = printings.get(id);
    if (!printing || card.scryfallId !== id || seen.has(id) ||
        printingFields.some((field) => field !== 'scryfallId' && card[field] !== printing[field]) ||
        typeof card.significance !== 'string' || !card.significance.trim()) {
      throw new Error(`${chapter}: printing mismatch or missing significance at index ${i}`);
    }
    seen.add(id);
    const raw = matches[i][0];
    for (const field of printingFields) {
      if (!new RegExp(`^\\s+(?:- )?${field}:`, 'm').test(raw)) {
        throw new Error(`${chapter}: printing ${i} missing field ${field}`);
      }
    }
  });
  const leanCards = oldCards.replace(metadataPattern, (_whole, sig) => `  - significance: ${sig}`);
  if (/^\s+(?:- )?(?:name|setCode|collectorNumber|scryfallId|artist):/m.test(leanCards)) {
    throw new Error(`${chapter}: duplicated printing metadata remains`);
  }
  const moments = [...body.matchAll(inlinePattern)];
  if (!moments.length || (body.match(/<HistoricalMoment\b/g) ?? []).length !== moments.length) {
    throw new Error(`${chapter}: unsupported HistoricalMoment syntax`);
  }
  for (const occurrence of moments) {
    if (Number(occurrence[1]) >= ids.length) throw new Error(`${chapter}: out-of-range HistoricalMoment index`);
  }
  const newBody = body.replace(inlinePattern, (_old, index) =>
    `<HistoricalMoment cardId={frontmatter.cardIds[${index}]} significance={frontmatter.cards[${index}].significance}>`);
  const output = prefix + frontmatter.replace(cardSection[1], leanCards) + end + newBody;
  if (!output.includes('  - significance:') || /<HistoricalMoment card=/.test(output)) {
    throw new Error(`${chapter}: migration postcondition failed`);
  }
  return { source: output, cards: curated.length, moments: moments.length };
}

/** Replaces exactly one documented anchor; never silently skips a source edit. */
export function replaceOnce(source, before, after, name) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${name}: missing or repeated source anchor`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
}
