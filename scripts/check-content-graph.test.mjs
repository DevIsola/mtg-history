import test from 'node:test';
import assert from 'node:assert/strict';
import { parseChapter, validateContentGraph } from './check-content-graph.mjs';

function fixture() {
  return {
    eras: [{ id: 'thran', status: 'published' }, { id: 'future', status: 'planned' }],
    chapters: [{ id: 'thran', eraId: 'thran', cardNames: ['History Card'], references: [
      { kind: 'CharacterLink', id: 'rebbec' },
      { kind: 'HistoricalEventReference', id: 'gateway' },
    ] }],
    characters: [{ id: 'rebbec', chapterIds: ['thran'] }, { id: 'yawgmoth', chapterIds: ['thran'] }],
    historicalEvents: [{ id: 'gateway', chapterId: 'thran', characterIds: ['rebbec'], cardName: 'History Card' }],
    characterRelationships: [{ a: 'rebbec', b: 'yawgmoth', category: 'rivalry', chapterId: 'thran' }],
    characterCategories: [{ id: 'leaders', characterIds: ['rebbec', 'yawgmoth'] }],
  };
}

test('accepts valid chapter, character, event, relationship and category links', () => {
  assert.deepEqual(validateContentGraph(fixture()), []);
});

test('rejects uncategorized characters before directory prerender', () => {
  const data = fixture();
  data.characterCategories[0].characterIds = ['rebbec'];
  const errors = validateContentGraph(data);
  assert.ok(errors.some((error) => error.includes('character "yawgmoth": missing directory category')));
});

test('rejects duplicate IDs and missing published chapters', () => {
  const data = fixture();
  data.characters.push({ id: 'rebbec', chapterIds: [] });
  data.eras.push({ id: 'lost', status: 'published' });
  const errors = validateContentGraph(data);
  assert.ok(errors.some((error) => error.includes('duplicate id "rebbec"')));
  assert.ok(errors.some((error) => error.includes('"lost": published without a chapter')));
});

test('rejects stale cross-links, unknown cards and duplicate references', () => {
  const data = fixture();
  data.chapters[0].references.push({ kind: 'CharacterLink', id: 'missing-person' });
  data.chapters[0].references.push({ kind: 'HistoricalEventReference', id: 'missing-event' });
  data.characters[0].chapterIds.push('missing-chapter');
  data.historicalEvents[0].cardName = 'Missing Card';
  data.historicalEvents[0].characterIds.push('unknown');
  data.characterCategories[0].characterIds.push('unknown');
  const errors = validateContentGraph(data);
  for (const expected of ['missing-person', 'missing-event', 'missing-chapter', 'Missing Card', 'unknown']) {
    assert.ok(errors.some((error) => error.includes(expected)), `missing diagnostic for ${expected}`);
  }
});

test('rejects self-relations, missing endpoints and duplicate undirected relations', () => {
  const data = fixture();
  data.characterRelationships.push(
    { a: 'yawgmoth', b: 'rebbec', category: 'rivalry', chapterId: 'thran' },
    { a: 'missing', b: 'missing', category: 'rivalry', chapterId: 'lost' },
  );
  const errors = validateContentGraph(data);
  assert.ok(errors.some((error) => error.includes('duplicated pair/category/chapter')));
  assert.ok(errors.some((error) => error.includes('self-link')));
  assert.ok(errors.some((error) => error.includes('unknown chapter "lost"')));
});

test('parses actual MDX-style YAML cards and component references', () => {
  const mdx = `---\ntitle: "The Thran"\neraId: "thran"\ncards:\n  - name: "History Card"\n    setCode: "mh1"\n  - name: 'Another Card'\n    setCode: "mh2"\nsources: []\n---\n<CharacterLink\n id="rebbec">Rebbec</CharacterLink>\n<HistoricalEventReference id='gateway' />\n`;
  assert.deepEqual(parseChapter(mdx, 'thran'), {
    id: 'thran', eraId: 'thran', cardNames: ['History Card', 'Another Card'],
    references: [ { kind: 'CharacterLink', id: 'rebbec' }, { kind: 'HistoricalEventReference', id: 'gateway' } ],
  });
});

test('rejects missing frontmatter or eraId', () => {
  assert.throws(() => parseChapter('# No metadata', 'thran'), /frontmatter/);
  assert.throws(() => parseChapter('---\ntitle: Test\n---\n', 'thran'), /eraId/);
});
