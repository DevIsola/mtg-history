/**
 * Curated cross-chapter reading routes. These are editorial connections, not
 * a literal shared clock for worlds whose histories can overlap.
 * The event IDs point to the canonical event collection, not new records.
 */
export const historyPaths = [
  {
    id: 'phyrexian-legacy',
    title: 'The long shadow of Phyrexia',
    summary: 'Follow a threat from its Thran origins, through two Dominarian wars, to the invasion of many worlds.',
    chronology: 'A story of recurring Phyrexian ambitions across distinct conflicts, not one continuous campaign.',
    steps: [
      { chapterId: 'thran', eventId: 'rise-of-yawgmoth', context: 'A physician acquires power in Halcyon and becomes the master of Phyrexia.' },
      { chapterId: 'brothers-war', eventId: 'gix-influences-mishra', context: 'Gix exploits Mishra during a war whose causes were not originally Phyrexian.' },
      { chapterId: 'weatherlight', eventId: 'legacy-weapon', context: 'The Legacy ends Yawgmoth’s invasion; it does not erase later Phyrexian history.' },
      { chapterId: 'march-of-the-machine', eventId: 'phyrexia-realmbreaker-invasion', context: 'New Phyrexia uses Realmbreaker to assault multiple planes.' },
    ],
  },
  {
    id: 'jeskas-rebirths',
    title: 'Jeska: from Otaria to the Mending',
    summary: 'Trace how a personal tragedy during the Mirari crisis connects to the repair of Dominaria’s temporal rifts.',
    chronology: 'These events concern the same person in two different eras; Phage and Karona are not separate biographies.',
    steps: [
      { chapterId: 'otaria', eventId: 'jeska-spark', context: 'Jeska survives Karona’s fall and becomes a planeswalker.' },
      { chapterId: 'mending', eventId: 'jeskas-final-sacrifice', context: 'She gives her life to repair the final temporal rift.' },
    ],
  },
  {
    id: 'ravnicas-orders',
    title: 'Ravnica: power, law, and aftermath',
    summary: 'Observe how the same city responds to the end of an ancient contract, Bolas’s invasion, and a later murder conspiracy.',
    chronology: 'Three distinct Ravnican crises; do not read later guild politics back into the first Guildpact.',
    steps: [
      { chapterId: 'many-worlds', eventId: 'ravnica-guildpact-collapse', context: 'The first Guildpact collapses when Szadek’s conspiracy comes to light.' },
      { chapterId: 'war-of-the-spark', eventId: 'spark-ravnica-invasion', context: 'Bolas turns Ravnica into a battleground for stolen planeswalker sparks.' },
      { chapterId: 'omenpaths', eventId: 'omenpaths-ravnica-investigation', context: 'A later investigation unfolds amid the city’s post-invasion tensions.' },
    ],
  },
  {
    id: 'changing-boundaries',
    title: 'How the boundaries between worlds changed',
    summary: 'Compare extraordinary changes in isolation, planeswalker power, invasion routes, and interplanar travel.',
    chronology: 'A thematic comparison of different mechanisms; the World Spell, the Mending, Realmbreaker, and Omenpaths are not the same phenomenon.',
    steps: [
      { chapterId: 'ice-age', eventId: 'world-spell', context: 'Freyalise ends the supernatural winter and changes the Shard’s isolation.' },
      { chapterId: 'mending', eventId: 'the-mending', context: 'The repair of reality permanently changes planeswalker power.' },
      { chapterId: 'march-of-the-machine', eventId: 'phyrexia-realmbreaker-invasion', context: 'Realmbreaker enables a forced assault across planar boundaries.' },
      { chapterId: 'omenpaths', eventId: 'omenpaths-sparks-and-roads', context: 'Omenpaths make new routes available to people without planeswalker sparks.' },
    ],
  },
];

export function pathsForChapter(id) {
  return historyPaths.flatMap((path) => {
    const index = path.steps.findIndex((step) => step.chapterId === id);
    return index < 0 ? [] : [{ path, index, current: path.steps[index], next: path.steps[index + 1] ?? null }];
  });
}

/** Pure reference integrity validation, shared by Node tests and Astro builds. */
export function validateHistoryPaths(paths, chapterIds, eventChapters) {
  const errors = [];
  const seenPaths = new Set();
  for (const path of paths) {
    if (!/^[a-z][a-z0-9-]+$/.test(path.id) || seenPaths.has(path.id)) errors.push(`Duplicate or invalid path ID: ${path.id}`);
    seenPaths.add(path.id);
    for (const field of ['title', 'summary', 'chronology']) {
      if (typeof path[field] !== 'string' || path[field].trim().length < 20) errors.push(`${path.id}: missing substantive ${field}`);
    }
    if (!Array.isArray(path.steps) || path.steps.length < 2) {
      errors.push(`${path.id}: a route must connect at least two chapters`);
      continue;
    }
    const chapters = new Set();
    for (const step of path.steps) {
      if (!chapterIds.has(step.chapterId)) errors.push(`${path.id}: unknown chapter ${step.chapterId}`);
      if (chapters.has(step.chapterId)) errors.push(`${path.id}: repeated chapter ${step.chapterId}`);
      chapters.add(step.chapterId);
      if (!eventChapters.has(step.eventId)) errors.push(`${path.id}: unknown event ${step.eventId}`);
      else if (eventChapters.get(step.eventId) !== step.chapterId) errors.push(`${path.id}: ${step.eventId} belongs to ${eventChapters.get(step.eventId)}, not ${step.chapterId}`);
      if (typeof step.context !== 'string' || step.context.trim().length < 35) errors.push(`${path.id}: event ${step.eventId} needs editorial context`);
    }
  }
  return errors;
}
