/**
 * Evidence-backed, non-editorial connections across existing historical chapters.
 * A bridge requires at least one character cited by a canonical event in BOTH
 * chapters. Character chapter metadata alone does not prove such a connection.
 * Documented relationships are displayed only as supplementary context.
 *
 * This is an index of shared evidence, NOT a claim about chronology, causation,
 * alliances across eras, or a replacement for the curated historyPaths routes.
 */
export function deriveEntityContinuity(chapters, characters, events, relationships) {
  const byChapter = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const byCharacter = new Map(characters.map((person) => [person.id, person]));
  const byEvent = new Map(events.map((event) => [event.id, event]));
  const errors = [];
  const appearances = new Map(chapters.map((chapter) => [chapter.id, new Map()]));

  if (byChapter.size !== chapters.length) errors.push('Duplicate chapter identity');
  if (byCharacter.size !== characters.length) errors.push('Duplicate character identity');
  if (byEvent.size !== events.length) errors.push('Duplicate event identity');

  for (const event of events) {
    const participating = appearances.get(event.chapterId);
    if (!participating) {
      errors.push(`Event ${event.id}: unknown chapter ${event.chapterId}`);
      continue;
    }
    if (!Array.isArray(event.characterIds)) {
      errors.push(`Event ${event.id}: missing character references`);
      continue;
    }
    for (const id of new Set(event.characterIds)) {
      if (!byCharacter.has(id)) {
        errors.push(`Event ${event.id}: unknown character ${id}`);
        continue;
      }
      const refs = participating.get(id) ?? [];
      refs.push(event.id);
      participating.set(id, refs);
    }
  }

  for (const relation of relationships) {
    if (!byCharacter.has(relation.a) || !byCharacter.has(relation.b) ||
        !byChapter.has(relation.chapterId)) {
      errors.push(`Relationship ${relation.a}/${relation.b}: unknown character or chapter`);
    }
  }
  if (errors.length) throw new Error(`Historical entity continuity:\n${errors.join('\n')}`);

  const ordered = [...chapters].sort((a, b) =>
    a.data.order - b.data.order || a.id.localeCompare(b.id));
  const pairs = [];
  for (let i = 0; i < ordered.length; i++) {
    for (let j = i + 1; j < ordered.length; j++) {
      const from = ordered[i];
      const to = ordered[j];
      const first = appearances.get(from.id);
      const second = appearances.get(to.id);
      const shared = [...first.keys()].filter((id) => second.has(id))
        .sort((a, b) => byCharacter.get(a).name.localeCompare(byCharacter.get(b).name))
        .map((id) => ({
          id,
          name: byCharacter.get(id).name,
          // Stable representative event IDs (not a claim of which came first).
          fromEventId: [...first.get(id)].sort()[0],
          toEventId: [...second.get(id)].sort()[0],
        }));
      if (!shared.length) continue;
      const sharedIds = new Set(shared.map((person) => person.id));
      const ties = relationships.filter((relation) =>
        sharedIds.has(relation.a) && sharedIds.has(relation.b) &&
        (relation.chapterId === from.id || relation.chapterId === to.id))
        .map(({ a, b, category, chapterId }) => ({ a, b, category, chapterId }))
        .sort((a, b) => [a.a, a.b, a.category, a.chapterId].join('|')
          .localeCompare([b.a, b.b, b.category, b.chapterId].join('|')));
      pairs.push({
        id: `${from.id}--${to.id}`,
        fromId: from.id,
        toId: to.id,
        fromTitle: from.data.title,
        toTitle: to.data.title,
        people: shared,
        ties,
      });
    }
  }
  return pairs.sort((a, b) =>
    b.people.length - a.people.length ||
    b.ties.length - a.ties.length ||
    a.id.localeCompare(b.id));
}

/** Same ordering for chapter suggestions and the full evidence index. */
export function entityConnectionsForChapter(chapterId, connections, limit = 3) {
  if (!Number.isInteger(limit) || limit < 0) throw new Error('Invalid continuity result limit');
  return connections.filter((entry) =>
    entry.fromId === chapterId || entry.toId === chapterId).slice(0, limit);
}
