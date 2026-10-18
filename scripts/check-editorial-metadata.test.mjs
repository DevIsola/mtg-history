import test from 'node:test';
import assert from 'node:assert/strict';
import { parseChapterEditorial, validateEditorialMetadata } from './check-editorial-metadata.mjs';

const sampleId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

function fixture() {
  const card = { name: 'History Card', setCode: 'mh1', collectorNumber: '100',
    scryfallId: sampleId, artist: 'Test Artist' };
  const source = { title: 'Official Story', kind: 'official', url: 'https://magic.wizards.com/en/story' };
  return [
    { id: 'thran', order: 1, cards: [card], sources: [source] },
    { id: 'brothers-war', order: 2, cards: [{ ...card }], sources: [{ ...source }] },
  ];
}

test('parses single-line metadata without treating folded narrative as fields', () => {
  const chapter = `---\ntitle: "The Thran"\norder: 1\ncards:\n  - name: 'History Card'\n    setCode: "mh1"\n    collectorNumber: "100"\n    scryfallId: "${sampleId}"\n    artist: "Test Artist"\n    significance: >-\n      Meaningful historical context.\nsources:\n  - title: "Official Story"\n    kind: official\n    url: "https://magic.wizards.com/en/story"\n  - title: "Novel"\n    kind: book\n    author: "Writer"\n    year: 1999\n---\n## Prose\n`;
  assert.deepEqual(parseChapterEditorial(chapter, 'thran'), {
    id: 'thran', order: 1,
    cards: [{ name: 'History Card', setCode: 'mh1', collectorNumber: '100',
      scryfallId: sampleId, artist: 'Test Artist', significance: '>-' }],
    sources: [
      { title: 'Official Story', kind: 'official', url: 'https://magic.wizards.com/en/story' },
      { title: 'Novel', kind: 'book', author: 'Writer', year: '1999' },
    ],
  });
});

test('accepts documented reuse of an identical printing across chapters', () => {
  assert.deepEqual(validateEditorialMetadata(fixture()), []);
});

test('rejects non-sequential or duplicated chapter order', () => {
  const chapters = fixture();
  chapters[1].order = 1;
  const errors = validateEditorialMetadata(chapters);
  assert.ok(errors.some((error) => error.includes('already used')));
  assert.ok(errors.some((error) => error.includes('missing chapter number 2')));
});

test('rejects duplicate source references and incomplete citations', () => {
  const chapters = fixture();
  chapters[0].sources.push({ ...chapters[0].sources[0] });
  chapters[0].sources.push({ title: 'Missing URL', kind: 'official' });
  chapters[0].sources.push({ title: 'Incomplete Novel', kind: 'book', year: '2001' });
  const errors = validateEditorialMetadata(chapters);
  assert.ok(errors.some((error) => error.includes('duplicate source')));
  assert.ok(errors.some((error) => error.includes('requires an HTTPS URL')));
  assert.ok(errors.some((error) => error.includes('requires an author')));
});

test('rejects inconsistent Scryfall printing metadata and duplicate chapter cards', () => {
  const chapters = fixture();
  chapters[1].cards[0].artist = 'Incorrect Artist';
  chapters[0].cards.push({ ...chapters[0].cards[0] });
  const errors = validateEditorialMetadata(chapters);
  assert.ok(errors.some((error) => error.includes('conflicts with')));
  assert.ok(errors.some((error) => error.includes('duplicate card name')));
  assert.ok(errors.some((error) => error.includes('duplicate set/collector printing')));
});

test('rejects missing official sources and incomplete printings', () => {
  const chapters = fixture();
  chapters[0].sources = [{ title: 'Novel', kind: 'book', author: 'Writer', year: '2001' }];
  chapters[0].cards[0].scryfallId = 'not-a-uuid';
  const errors = validateEditorialMetadata(chapters);
  assert.ok(errors.some((error) => error.includes('no official source')));
  assert.ok(errors.some((error) => error.includes('invalid printing metadata')));
});
