/** Reviewed claim-level sources; this is a limited editorial pilot, not full fact certification. */
export const eventProvenance = {
  'thran-glacian-stones-implanted': {
    chronology: { precision: 'undated', label: 'Ancient Thran period, before Rebbec seals the gateway', basis: 'Official retrospective establishes sequence but not a common-calendar event year.' },
    sources: [{ title: 'The Legendary Characters of Commander Legends, Part 2', url: 'https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-2-2020-11-06', role: 'retrospective', supports: 'Describes Yawgmoth implanting two broken powerstone halves in Glacian and causing his death.' }],
    artworkNote: 'The Mightstone and Weakstone illustrates the surviving artifacts, not the implantation itself.',
  },
  'thran-stones-rediscovered': {
    chronology: { precision: 'relative', label: 'Millennia after the Thran catastrophe, before the Brothers’ War', basis: 'The retrospective says Urza and Mishra found the stones millennia later; no exact calendar year is established.' },
    sources: [{ title: 'The Legendary Characters of Commander Legends, Part 2', url: 'https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-2-2020-11-06', role: 'retrospective', supports: 'Names Urza and Mishra as the later discoverers who called the fragments the Mightstone and Weakstone.' }],
    artworkNote: 'The Brothers’ War printing is a later depiction; its publication year is not the date of the discovery.',
  },
  'zendikar-hedrons': {
    chronology: { precision: 'relative', label: 'Long before the first Eldrazi awakening in the Zendikar block', basis: 'Historical fiction establishes that the prison was built and sealed before its later failure, without a shared planar date.' },
    sources: [{ title: 'The Lithomancer', url: 'https://magic.wizards.com/en/news/magic-story/the-lithomancer', role: 'story', supports: 'Depicts Nahiri choosing Zendikar for the prison and describes construction of hedrons with Ugin and Sorin.' }],
    artworkNote: 'Nahiri’s later portrait is a character reference, not an eyewitness illustration of the original construction.',
  },
  'ravnica-guildpact-collapse': {
    chronology: { precision: 'relative', label: 'Ravnica’s Decamillennial crisis, before its nonmagical accord', basis: 'The event has a sequence in Ravnican civic history, not a universal timestamp for other planes.' },
    sources: [{ title: 'Ravnica, Then and Now', url: 'https://magic.wizards.com/en/news/feature/ravnica-then-and-now-2012-08-29-0', role: 'retrospective', supports: 'Explains how Szadek manipulated Agrus Kos’s arrest into the paradox that broke the original Guildpact.' }],
    artworkNote: 'Szadek’s portrait identifies the conspirator; it does not depict Kos making the arrest.',
  },
  'phyrexia-zhalfir-return': {
    chronology: { precision: 'relative', label: 'At the resolution of the New Phyrexian invasion', basis: 'The story reports the exchange of places and its consequences but gives no exact shared-calendar date.' },
    sources: [{ title: 'March of the Machine — Episode 10: The Rhythms of Life', url: 'https://magic.wizards.com/en/news/magic-story/episode-10-the-rhythms-of-life', role: 'story', supports: 'Describes Zhalfir returned to the Multiverse and New Phyrexia left beyond ordinary reach after the exchange.' }],
    artworkNote: 'The chosen card supplies editorial visual context, not independent proof of a historical date.',
  },
  'omenpaths-sparks-and-roads': {
    chronology: { precision: 'relative', label: 'After the invasion, at the start of the Omenpath era', basis: 'The sources establish the aftermath and altered travel conditions, without synchronizing dates across planes.' },
    sources: [
      { title: 'Doing the Aftermath', url: 'https://magic.wizards.com/en/news/making-magic/doing-the-aftermath', role: 'design-commentary', supports: 'Confirms that most planeswalkers lost their sparks and Omenpaths allow non-planeswalkers to cross worlds.' },
      { title: 'March of the Machine: The Aftermath — She Who Breaks the World', url: 'https://magic.wizards.com/en/news/magic-story/she-who-breaks-the-world', role: 'story', supports: 'Depicts Nissa after losing her spark and encountering an unfamiliar route between planes.' },
    ],
    artworkNote: 'The Nissa card illustrates recovery; it does not depict every planeswalker losing a spark.',
  },
};

/** Offline integrity only. Checks links and claim metadata, not the truth of article prose. */
export function validateEventProvenance(records, events, sourcesByChapter) {
  const errors = [];
  const byId = new Map(events.map((event) => [event.id, event]));
  const detailed = (value) => typeof value === 'string' && value.trim().length >= 35;
  for (const [id, record] of Object.entries(records)) {
    const scope = `provenance ${id}`;
    const event = byId.get(id);
    if (!event) { errors.push(`${scope}: unknown event`); continue; }
    if (!['relative', 'undated'].includes(record?.chronology?.precision)) errors.push(`${scope}: invalid chronology precision`);
    if (!detailed(record?.chronology?.basis) || typeof record?.chronology?.label !== 'string' || record.chronology.label.trim().length < 15) errors.push(`${scope}: incomplete time qualification`);
    if (!detailed(record?.artworkNote)) errors.push(`${scope}: missing artwork interpretation`);
    if (!Array.isArray(record?.sources) || record.sources.length < 1 || record.sources.length > 3) {
      errors.push(`${scope}: require one to three official claim sources`);
      continue;
    }
    const seen = new Set();
    const chapterSources = sourcesByChapter.get(event.chapterId) ?? [];
    for (const source of record.sources) {
      if (!detailed(source?.supports)) errors.push(`${scope}: citation needs a specific supported claim`);
      if (!['story', 'retrospective', 'design-commentary'].includes(source?.role)) errors.push(`${scope}: unsupported source role`);
      let url;
      try { url = new URL(source?.url); } catch { /* reported below */ }
      if (url?.protocol !== 'https:' || url.hostname !== 'magic.wizards.com' || url.username || url.password || url.search || url.hash) errors.push(`${scope}: expected a canonical Wizards HTTPS article URL`);
      if (seen.has(source?.url)) errors.push(`${scope}: duplicate citation`);
      seen.add(source?.url);
      if (!chapterSources.some((item) => item.kind === 'official' && item.title === source.title && item.url === source.url)) errors.push(`${scope}: source is absent from the chapter bibliography`);
    }
  }
  return errors;
}
