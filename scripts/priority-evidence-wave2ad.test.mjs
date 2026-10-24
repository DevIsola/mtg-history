import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { eventProvenance } from '../src/data/event-provenance.mjs';
import { checkEventProvenance } from './check-event-provenance.mjs';
import { collectEvidenceGaps } from './audit-event-source-gaps.mjs';
import { runEditorialConsolidation } from './audit-editorial-consolidation.mjs';

const read = path =>
  readFileSync(new URL('../' + path, import.meta.url), 'utf8');

const ids = [
  'spark-dovin-azorius-control',
  'talite-siege-of-penregon',
  'spark-elderspell'
];

const records = ids.map(id => eventProvenance[id]);

test('three targeted evidence records have distinct, qualified sources', () => {
  assert.ok(records.every(Boolean));

  for (const record of records) {
    assert.equal(record.chronology.precision, 'relative');
    assert.ok(
      record.chronology.label.length > 15 &&
      record.chronology.basis.length > 35
    );
    assert.ok(record.artworkNote.length > 35);
    assert.ok(record.sources.every(s => s.supports.length > 35));
  }
});

test('Dovin is documented as guildmaster and Immortal Sun guard, not ruler of every Azorius', () => {
  const r = eventProvenance['spark-dovin-azorius-control'];
  assert.deepEqual(r.sources.map(s => s.role), ['story', 'story']);
  assert.match(r.sources[0].supports, /bylaws/);
  assert.match(r.sources[1].supports, /Lavinia/);

  const event = JSON.parse(
    read('src/content/events/spark-dovin-azorius-control.json')
  );

  assert.match(
    event.narrative.join(' '),
    /did not mean every Azorius member supported Bolas/
  );
  assert.doesNotMatch(
    event.narrative.join(' '),
    /defeating Bolas did not by itself restore civic confidence/
  );

  assert.equal(
    event.cardId,
    '45abf8eb-c583-4eec-a91f-0e58424a8b1c'
  );
});

test('69 AR is directly attested in the Talite siege primary fiction', () => {
  const r = eventProvenance['talite-siege-of-penregon'];

  assert.match(r.chronology.label, /69 AR/);
  assert.match(r.chronology.basis, /2022/);
  assert.equal(r.sources.length, 1);
  assert.equal(r.sources[0].role, 'story');
  assert.match(r.artworkNote, /thematic/);

  assert.equal(
    JSON.parse(
      read('src/content/events/talite-siege-of-penregon.json')
    ).cardId,
    '4eef9bb7-cd3c-422e-a93b-90d98684675a'
  );
});

test('Elderspell uses story fiction for witnessed battle and commentary for design meaning', () => {
  const r = eventProvenance['spark-elderspell'];

  assert.deepEqual(
    r.sources.map(s => s.role),
    ['story', 'design-commentary']
  );

  assert.match(r.sources[0].supports, /between his horns/);
  assert.match(r.sources[1].supports, /pre-Mending/);
  assert.match(r.artworkNote, /card mechanics/);

  assert.equal(
    JSON.parse(read('src/content/events/spark-elderspell.json')).cardId,
    'a3b16625-7faf-4de6-abf7-d397988e32fb'
  );
});

test('official citations match exact chapter bibliography entries', () => {
  for (const id of ids) {
    const event = JSON.parse(
      read('src/content/events/' + id + '.json')
    );

    const chapter = read(
      'src/content/chapters/' + event.chapterId + '.mdx'
    );

    for (const s of eventProvenance[id].sources) {
      assert.equal(
        chapter.split('  - title: "' + s.title + '"').length - 1,
        1,
        s.title
      );
      assert.equal(
        chapter.split('    url: "' + s.url + '"').length - 1,
        1,
        s.url
      );
    }
  }
});

test('full provenance and consolidation retain gaps, printing identities and event totals', async () => {
  const validation = await checkEventProvenance();

  assert.deepEqual(validation.errors, []);
  assert.equal(validation.totalEvents, 133);
  assert.ok(validation.reviewedEvents >= 46);
  assert.equal(collectEvidenceGaps().length, 3);

  const report = await runEditorialConsolidation();

  assert.equal(report.summary.events, 133);
  assert.equal(report.summary.cardUses, 136);
  assert.equal(
    report.summary.sourceReviewed,
    validation.reviewedEvents
  );
  assert.equal(
    report.summary.awaitingEventReview,
    133 - validation.reviewedEvents
  );
  assert.equal(report.summary.openPrimaryClaims, 3);
});
