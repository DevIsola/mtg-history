import assert from 'node:assert/strict';
import test from 'node:test';
import { transformations, transformConsumer } from './card-consumer-migration-tools.mjs';

test('every documented card consumer has exact, nonempty migration anchors', () => {
  assert.equal(Object.keys(transformations).length, 11);
  for (const [path, edits] of Object.entries(transformations)) {
    assert.ok(path.startsWith('src/'));
    assert.ok(edits.length > 0);
    for (const { from, to } of edits) {
      assert.ok(from.length > 8 && to.length > 8, `${path}: malformed edit`);
      assert.notEqual(from, to, `${path}: no-op edit`);
    }
  }
});

test('all consumer rewrites preserve neighboring text and apply exactly once', () => {
  for (const [path, edits] of Object.entries(transformations)) {
    const original = edits.map(({ from }, i) => `prefix_${i}\n${from}\nsuffix_${i}`).join('\n---\n');
    const result = transformConsumer(path, original);
    for (const { to } of edits) {
      assert.ok(result.includes(to), `${path}: replacement omitted`);
    }
    assert.ok(result.includes('prefix_0'));
    assert.ok(result.includes(`suffix_${edits.length - 1}`));
    assert.notEqual(result, original);
  }
});

test('missing or duplicated anchors reject the migration, not silently skip code', () => {
  assert.throws(() => transformConsumer('src/components/CharacterLink.astro', ''), /missing or ambiguous/);
  const path = 'src/components/CharacterLink.astro';
  const anchor = transformations[path][0].from;
  assert.throws(() => transformConsumer(path, `${anchor}\n${anchor}`), /missing or ambiguous/);
  assert.throws(() => transformConsumer('src/components/DoesNotExist.astro', ''), /Unrecognized/);
});

test('UI uses printing IDs; historical significance remains contextual', () => {
  const chapter = transformations['src/pages/archive/index.astro'].map(({ to }) => to).join('\n');
  const event = transformations['src/pages/events/[id].astro'].map(({ to }) => to).join('\n');
  const character = transformations['src/pages/characters/[id].astro'].map(({ to }) => to).join('\n');
  assert.match(chapter, /chapterCardUse\(chapter, index, cardCatalog\)/);
  assert.match(event, /chapter\.data\.cardIds\.indexOf\(event\.cardId\)/);
  assert.match(character, /profile\.featuredCardId/);
  assert.match(character, /significance: profile\.featuredCard\.significance/);
});
