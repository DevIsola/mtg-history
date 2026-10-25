import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PORTUGUESE_BATCH_1 } from '../src/data/pt-chapter-batch1.mjs';
import { PORTUGUESE_BATCH_2 } from '../src/data/pt-chapter-batch2.mjs';
import { PORTUGUESE_BATCH_3 } from '../src/data/pt-chapter-batch3.mjs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const aliases = JSON.parse(read('src/data/pt-br/legacy-anchors.json'));
const thranIds = ['antes-dos-irmaos','civilizacao','yawgmoth','phyrexia','queda','rebbec','glacian','publicacoes','intocaveis','medicina','dyfed','guerra','pedras'];
const prior = [{ id:'thran', sections: thranIds.map(id => ({id})) }, ...PORTUGUESE_BATCH_1, ...PORTUGUESE_BATCH_2, ...PORTUGUESE_BATCH_3];
test('all eleven earlier reading editions retain unique, resolvable section bookmarks', () => {
  assert.equal(prior.length, 11);
  assert.equal(new Set(prior.map(chapter => chapter.id)).size, 11);
  for (const chapter of prior) {
    const entries = aliases[chapter.id];
    assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length, chapter.id);
    for (const section of chapter.sections) assert.ok(entries.some(entry => entry.id === section.id), `${chapter.id}#${section.id}`);
    for (const entry of entries) {
      assert.match(entry.id, /^[a-z0-9-]+$/);
      if (entry.headingIndex !== undefined) {
        const target = read(`src/content/chapters-pt/${entry.targetChapterId ?? chapter.id}.mdx`);
        assert.ok([...target.matchAll(/^## .+$/gm)][entry.headingIndex], `${chapter.id}#${entry.id}: heading target`);
      } else assert.ok(entry.targetId && entry.label, `${chapter.id}#${entry.id}: named target`);
    }
  }
});
test('canonical chapter illustration and event inventories retain their established counts', () => {
  const expected = { thran:[6,9], 'brothers-war':[11,12], 'ice-age':[11,12], weatherlight:[22,21], otaria:[20,15], mending:[12,16], 'many-worlds':[11,11], 'war-of-the-spark':[11,11], 'new-phyrexia':[10,7], 'march-of-the-machine':[8,6], omenpaths:[14,11] };
  for (const [id,[cards,events]] of Object.entries(expected)) {
    const source = read(`src/content/chapters/${id}.mdx`);
    const cardBlock = source.match(/^cardIds:\s*\n([\s\S]*?)\ncards:/m)?.[1];
    const ids = [...cardBlock.matchAll(/^  - ([0-9a-f-]+)$/gm)].map(match => match[1]);
    assert.equal(ids.length,cards,id);
    assert.equal(new Set(ids).size,cards,id);
    assert.equal((source.match(/<HistoricalEventReference\b/g) ?? []).length,events,id);
  }
});
test('one complete static reader serves every translated chapter and keeps source/review boundaries explicit', () => {
  const route = read('src/pages/pt-br/chapters/[id].astro');
  assert.match(route,/getCollection\('chaptersPt'\)/);
  assert.match(route,/<ChapterReader chapter=\{chapter\} locale="pt-BR"/);
  assert.doesNotMatch(route,/PORTUGUESE_BATCH|companion|client:only|innerHTML|set:html/);
  const reader = read('src/components/ChapterReader.astro');
  for (const marker of ['<Content />','<ChapterToc','<ChapterSources','<PortugueseChapterAliases','complete-pending-review','Revisão editorial humana pendente']) assert.ok(reader.includes(marker),marker);
  const component = read('src/components/PortugueseChapterAliases.astro');
  assert.match(component,/headingIndex/);
  assert.match(component,/getEntry\('chaptersPt'/);
  assert.match(component,/id=\{link.id\}/);
  assert.match(component,/\.legacy-alias:target/);
});
