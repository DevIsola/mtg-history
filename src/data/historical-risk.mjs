/**
 * Wave 2L: reproducible editorial triage, NOT a factual error detector.
 * Scores prioritize human review of events lacking claim-level provenance.
 * A signal never establishes that a claim is true, false, or dateable.
 */

const signalCatalog = Object.freeze({
  'calendar-claim': { weight: 4, why: 'Explicit in-world year needs a directly supporting chronological source.' },
  'contested-language': { weight: 3, why: 'The narrative mentions competing or uncertain interpretations.' },
  'contextual-scene': { weight: 3, why: 'The selected scene artwork is not independently visual-checked.' },
  'cross-chapter-figure': { weight: 2, why: 'A named participant also appears in historical events from another chapter.' },
  'interplanar-claim': { weight: 2, why: 'The narrative describes consequences across planes or the Multiverse.' },
  'absolute-language': { weight: 2, why: 'Broad or exclusive wording merits direct source comparison.' },
  'causal-claim': { weight: 1, why: 'The narrative asserts a causal or consequential sequence.' },
  'multi-paragraph': { weight: 1, why: 'Several narrative paragraphs may contain independently testable claims.' },
});

const signalPatterns = Object.freeze({
  'calendar-claim': /\b\d{1,4}\s*(?:AR|BCE|CE)\b/i,
  'contested-language': /\b(?:conflicting|contradictory|disputed|contested|uncertain|incompatible|competing accounts|conflicting accounts)\b/i,
  'interplanar-claim': /\b(?:multiverse|interplanar|cross-planar|across (?:many|multiple|other) planes|between (?:two|many|different) planes|planeswalker sparks?)\b/i,
  'absolute-language': /\b(?:only|every|always|never|entire|first|last|all|forever|nothing|completely)\b/i,
  'causal-claim': /\b(?:caused?|triggered?|led to|resulted in|brought about|enabled?|forced?|transformed?|culminated|destroyed?|ended?)\b/i,
});

function priorityFor(score) {
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'standard';
}

function checkUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`${label}: blank or invalid ID`);
    if (seen.has(value)) throw new Error(`${label}: duplicate ID ${value}`);
    seen.add(value);
  }
}

/**
 * @param {{ events: object[], chapters: object[], reviewed: object, artworkRows: object[] }} input
 * @returns {object} Editorial queue with deterministic ranking and complete coverage accounting.
 */
export function auditHistoricalRisk({ events, chapters, reviewed, artworkRows }) {
  if (!Array.isArray(events) || !Array.isArray(chapters) || !Array.isArray(artworkRows) || !reviewed || typeof reviewed !== 'object') {
    throw new Error('Historical risk audit requires events, chapters, artwork ledger and reviewed provenance.');
  }
  checkUnique(events.map((event) => event.id), 'events');
  checkUnique(chapters.map((chapter) => chapter.id), 'chapters');
  checkUnique(Object.keys(reviewed), 'provenance');
  const eventById = new Map(events.map((event) => [event.id, event]));
  const chapterById = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  for (const id of Object.keys(reviewed)) {
    if (!eventById.has(id)) throw new Error(`orphan reviewed event ${id}`);
  }
  const artworkByKey = new Map();
  for (const row of artworkRows) {
    const key = `${row.chapter}\0${row.card}`;
    if (artworkByKey.has(key)) throw new Error(`duplicate artwork ledger row ${row.chapter}/${row.card}`);
    artworkByKey.set(key, row);
  }
  const characterChapters = new Map();
  const knownPrintings = new Map();
  for (const chapter of chapters) {
    for (const card of chapter.cards ?? []) {
      if (!card.name || !card.scryfallId) throw new Error(`incomplete chapter card: ${chapter.id}`);
      const key = `${chapter.id}\0${card.scryfallId}`;
      if (knownPrintings.has(key)) throw new Error(`duplicate chapter printing ${key}`);
      knownPrintings.set(key, card);
      if (!artworkByKey.has(`${chapter.id}\0${card.name}`)) throw new Error(`missing artwork review: ${chapter.id}/${card.name}`);
    }
  }
  for (const event of events) {
    if (!chapterById.has(event.chapterId)) throw new Error(`event ${event.id}: unknown chapter ${event.chapterId}`);
    if (!Array.isArray(event.narrative) || !event.narrative.length || !Array.isArray(event.characterIds)) {
      throw new Error(`event ${event.id}: invalid narrative or character IDs`);
    }
    if (!knownPrintings.has(`${event.chapterId}\0${event.cardId}`)) {
      throw new Error(`event ${event.id}: printing ${event.cardId} is not curated in ${event.chapterId}`);
    }
    for (const person of new Set(event.characterIds)) {
      const found = characterChapters.get(person) ?? new Set();
      found.add(event.chapterId);
      characterChapters.set(person, found);
    }
  }

  const unreviewed = events.filter((event) => !Object.hasOwn(reviewed, event.id));
  const rows = unreviewed.map((event) => {
    const card = knownPrintings.get(`${event.chapterId}\0${event.cardId}`);
    const artwork = artworkByKey.get(`${event.chapterId}\0${card.name}`);
    const paragraphText = [event.title, event.summary, ...event.narrative].join(' ');
    const signals = [];
    for (const [code, pattern] of Object.entries(signalPatterns)) {
      if (pattern.test(paragraphText)) signals.push(code);
    }
    if (event.narrative.length >= 4) signals.push('multi-paragraph');
    const spanningPeople = [...new Set(event.characterIds)]
      .filter((person) => (characterChapters.get(person)?.size ?? 0) > 1)
      .sort();
    if (spanningPeople.length) signals.push('cross-chapter-figure');
    if (artwork.visualRole === 'scene' && artwork.basis !== 'visual-checked') signals.push('contextual-scene');
    const score = signals.reduce((total, signal) => total + signalCatalog[signal].weight, 0);
    return {
      id: event.id,
      title: event.title,
      chapterId: event.chapterId,
      score,
      priority: priorityFor(score),
      signals,
      spanningPeople,
      chapterSourceCount: (chapterById.get(event.chapterId).sources ?? []).filter((source) => source.kind === 'official').length,
      artwork: {
        card: card.name,
        role: artwork.visualRole,
        time: artwork.timeContext,
        basis: artwork.basis,
      },
    };
  });
  const chapterOrder = new Map(chapters.map((chapter, index) => [chapter.id, chapter.order ?? index + 1]));
  rows.sort((a, b) => b.score - a.score || chapterOrder.get(a.chapterId) - chapterOrder.get(b.chapterId) || a.id.localeCompare(b.id, 'en'));
  const byChapter = [...chapters].sort((a, b) => chapterOrder.get(a.id) - chapterOrder.get(b.id)).map((chapter) => {
    const all = events.filter((event) => event.chapterId === chapter.id);
    const queue = rows.filter((row) => row.chapterId === chapter.id);
    return {
      chapterId: chapter.id,
      total: all.length,
      reviewed: all.length - queue.length,
      queued: queue.length,
      high: queue.filter((row) => row.priority === 'high').length,
      medium: queue.filter((row) => row.priority === 'medium').length,
      standard: queue.filter((row) => row.priority === 'standard').length,
    };
  });
  const summary = {
    total: events.length,
    reviewed: Object.keys(reviewed).length,
    queued: rows.length,
    chapters: chapters.length,
    high: rows.filter((row) => row.priority === 'high').length,
    medium: rows.filter((row) => row.priority === 'medium').length,
    standard: rows.filter((row) => row.priority === 'standard').length,
  };
  if (summary.reviewed + summary.queued !== summary.total) throw new Error('Provenance coverage does not partition event collection');
  return { summary, byChapter, rows };
}

export function signalExplanation(code) {
  if (!Object.hasOwn(signalCatalog, code)) throw new Error(`Unknown risk signal: ${code}`);
  return signalCatalog[code].why;
}

const md = (value) => String(value).replace(/[|\r\n]/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** A static file for local human editorial review; no article truth claims. */
export function renderHistoricalRiskMarkdown(audit) {
  const s = audit.summary;
  const lines = [
    '# MTG History — Historical evidence triage',
    '',
    `**Coverage:** ${s.reviewed}/${s.total} event-level provenance records; **${s.queued}** events remain in the manual review queue.`,
    '',
    `**Review priorities (heuristic only):** ${s.high} high, ${s.medium} medium, ${s.standard} standard.`,
    '',
    'This report **does not certify canon, detect factual errors, or verify URLs**. A chapter bibliography is not an event-level citation. Signals only help prioritize human reading of official sources and artwork.',
    '',
    '## Coverage by chapter',
    '',
    '| Chapter | Events | Reviewed | Queued | High | Medium | Standard |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...audit.byChapter.map((c) => `| ${md(c.chapterId)} | ${c.total} | ${c.reviewed} | ${c.queued} | ${c.high} | ${c.medium} | ${c.standard} |`),
    '',
    '## Signal glossary',
    '',
    ...Object.entries(signalCatalog).map(([id, { weight, why }]) => `- **${id} (+${weight}):** ${why}`),
    '',
    '## Unreviewed-event queue',
    '',
    '| Priority | Score | Chapter | Event | Review signals | Artwork context |',
    '| --- | ---: | --- | --- | --- | --- |',
    ...audit.rows.map((r) => `| ${r.priority} | ${r.score} | ${md(r.chapterId)} | [${md(r.title)}](https://devisola.github.io/mtg-history/events/${encodeURIComponent(r.id)}/) | ${md(r.signals.join(', ') || 'base provenance review')} | ${md(`${r.artwork.card} (${r.artwork.role}; ${r.artwork.time}; ${r.artwork.basis})`)} |`),
    '',
    '## How to review',
    '',
    '1. Open the event and chapter bibliography. Find official primary fiction or a clearly labeled retrospective for the specific claim, not merely a thematically adjacent card or designer article.',
    '2. Document the supported proposition, in-world date precision and uncertainties. Do not equate product publication dates with fictional dates.',
    '3. Compare the exact curated artwork with the assertion. A portrait, object, or thematic symbol is not necessarily a depiction of the event.',
    '4. Correct inaccuracies through a separate small editorial PR; add claim-level provenance only after source examination.',
    '5. Regenerate this report after merging corrections and reviews. Heuristic rankings may change as narratives change.',
    '',
  ];
  return lines.join('\n');
}
