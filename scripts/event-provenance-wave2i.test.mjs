import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const pilotIds = new Set([
  'thran-glacian-stones-implanted', 'thran-stones-rediscovered',
  'zendikar-hedrons', 'ravnica-guildpact-collapse',
  'phyrexia-zhalfir-return', 'omenpaths-sparks-and-roads',
]);
const entries = Object.entries(eventProvenance).filter(([id]) => pilotIds.has(id));
const pilotRecords = Object.fromEntries(entries);
const eventRows = entries.map(([id]) => ({ id, chapterId: ({
  'thran-glacian-stones-implanted': 'thran',
  'thran-stones-rediscovered': 'thran',
  'zendikar-hedrons': 'many-worlds',
  'ravnica-guildpact-collapse': 'many-worlds',
  'phyrexia-zhalfir-return': 'march-of-the-machine',
  'omenpaths-sparks-and-roads': 'omenpaths',
})[id] }));
const bibliography = new Map();
for (const [id, row] of entries) {
  const chapter = eventRows.find((event) => event.id === id)?.chapterId;
  bibliography.set(chapter, [
    ...(bibliography.get(chapter) ?? []),
    ...row.sources.map(({ title, url }) => ({ title, url, kind: 'official' })),
  ]);
}

test('six events receive specific source evidence without fabricating precise in-world years', () => {
  assert.equal(entries.length, 6);
  for (const [id, record] of entries) {
    assert.match(id, /^[a-z0-9-]+$/);
    assert.ok(['relative', 'undated'].includes(record.chronology.precision));
    assert.ok(record.sources.every(({ supports }) => supports.length > 35));
  }
  assert.deepEqual(validateEventProvenance(pilotRecords, eventRows, bibliography), []);
});

test('source-to-chapter mismatch, unsupported host and invented precise date fail closed', () => {
  const row = entries[0];
  const tampered = structuredClone(pilotRecords);
  tampered[row[0]].sources[0].url = 'https://example.com/something';
  tampered[row[0]].chronology.precision = 'exact';
  const errs = validateEventProvenance(tampered, eventRows, bibliography).join(' ');
  assert.match(errs, /HTTPS article URL/);
  assert.match(errs, /absent from the chapter bibliography/);
  assert.match(errs, /invalid chronology precision/);
});

test('orphan records, duplicate evidence and unsupported source claims are rejected', () => {
  const row = entries[0];
  const tampered = structuredClone(pilotRecords);
  tampered[row[0]].sources.push({ ...tampered[row[0]].sources[0], supports: 'too short' });
  tampered.orphan = structuredClone(row[1]);
  const errs = validateEventProvenance(tampered, eventRows, bibliography).join(' ');
  assert.match(errs, /unknown event/);
  assert.match(errs, /duplicate citation/);
  assert.match(errs, /specific supported claim/);
});

test('event page renders a qualified evidence panel and verification includes offline gate', () => {
  const page = read('src/components/pages/EventPage.astro');
  const panel = read('src/components/EventEvidence.astro');
  const packageJson = JSON.parse(read('package.json'));
  assert.match(page, /eventProvenance\[event.id\]/);
  assert.match(page, /localized\('provenance', \{ id: event\.id, \.\.\.sourceProvenance \}, pageLocale\)/);
  assert.match(page, /provenance && <EventEvidence entry=\{provenance\} \/>/);
  assert.match(panel, /aria-labelledby="event-evidence-heading"/);
  assert.match(panel, /Publication dates are not in-world dates/);
  assert.match(panel, /source\.supports/);
  assert.equal(packageJson.scripts['check:provenance'], 'node scripts/check-event-provenance.mjs');
  assert.match(packageJson.scripts.verify, /check:editorial && pnpm run check:provenance && pnpm run check:artwork/);
});
