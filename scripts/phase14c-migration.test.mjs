import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { PORTUGUESE_BATCH_3 } from '../src/data/pt-chapter-batch3.mjs';
import { eventProvenance } from '../src/data/event-provenance.mjs';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';
import { loadCuratedChapters } from './load-curated-chapters.mjs';
import { extractCardSignificance } from './check-artwork-fidelity.mjs';

const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const ledger = JSON.parse(read('docs/phase14c-migration-identities.json'));
const json = (kind, id) => JSON.parse(read('src/content/' + kind + '/' + id + '.json'));

test('split preserves every event identity and its original printing across the Seedcore boundary', () => {
  assert.equal(readdirSync(new URL('../src/content/events/', import.meta.url)).length, 133);
  assert.equal(ledger.riseEvents.length, 7);
  assert.equal(ledger.warEvents.length, 6);
  assert.equal(new Set([...ledger.riseEvents, ...ledger.warEvents]).size, 13);
  for (const [chapter, ids] of [['new-phyrexia', ledger.riseEvents], ['march-of-the-machine', ledger.warEvents]]) {
    const mdx = read('src/content/chapters/' + chapter + '.mdx');
    const pt = PORTUGUESE_BATCH_3.find(c => c.id === chapter);
    assert.deepEqual([...pt.eventIds].sort(), [...ids].sort());
    for (const id of ids) {
      const event = json('events', id);
      assert.equal(event.chapterId, chapter, id);
      assert.ok(ledger.printings[chapter].some(p => p.id === event.cardId), id);
      assert.ok(mdx.includes('<HistoricalEventReference id="' + id + '"'), id);
    }
  }
  assert.equal(json('events', 'phyrexia-jin-kamigawa').cardId, json('events', 'phyrexia-tamiyos-last-story').cardId);
});

test('all exact printings and significance survive; only Tamiyo is shared across the split', async () => {
  const chapters = await loadCuratedChapters(new URL('../src/content/chapters/', import.meta.url).pathname, parseChapterEditorial);
  assert.equal(chapters.length, 11);
  assert.equal(chapters.reduce((n, c) => n + c.cards.length, 0), 136);
  assert.equal(new Set(chapters.flatMap(c => c.cards.map(p => p.scryfallId))).size, 132);
  assert.equal(readdirSync(new URL('../src/content/cards/', import.meta.url)).length, 133);
  for (const [id, expected] of Object.entries(ledger.printings)) {
    const chapter = chapters.find(c => c.id === id);
    assert.deepEqual(chapter.cards.map(c => c.scryfallId), expected.map(p => p.id));
    const captions = extractCardSignificance(read('src/content/chapters/' + id + '.mdx'), chapter.cards.map(c => c.name));
    expected.forEach((p, i) => {
      const significance = p.significance.split('>-')[1].trim().replace(/\s+/g, ' ');
      assert.equal(captions.get(chapter.cards[i].name), significance);
    });
  }
  const rise = new Set(ledger.printings['new-phyrexia'].map(p => p.id));
  assert.deepEqual(ledger.printings['march-of-the-machine'].filter(p => rise.has(p.id)).map(p => p.id), ['222a736e-d819-452d-aeda-eb848c4b2302']);
});

test('moved fragments have static onward links; chapter order and review blockers stay explicit', () => {
  const war = read('src/content/chapters/march-of-the-machine.mdx');
  for (const anchor of ledger.movedAnchors) {
    assert.ok(war.includes('id="' + anchor + '"'));
    assert.ok(war.includes('href="../new-phyrexia/#' + anchor + '"'));
  }
  for (const [id, order] of [['new-phyrexia', 9], ['march-of-the-machine', 10], ['omenpaths', 11]]) {
    assert.match(read('src/content/chapters/' + id + '.mdx'), new RegExp('^order: ' + order + '$', 'm'));
    assert.equal(PORTUGUESE_BATCH_3.find(c => c.id === id).number, String(order).padStart(2, '0'));
  }
  const open = Object.entries(eventProvenance).filter(([, r]) => r.unresolvedClaims?.length).map(([id]) => id).sort();
  assert.deepEqual(open, ['freyalise-seals-skyshroud', 'mending-venser-first-walk', 'spark-gideons-sacrifice']);
  assert.match(read('docs/artwork-fidelity-ledger.tsv'), /omenpaths\tThe Kenriths' Royal Funeral\tscene\tcontemporary\tcontext-assessed/);
});

test('automatic workflows run only on main and deployment waits for browser validation', () => {
  const files = readdirSync(new URL('../.github/workflows/', import.meta.url));
  for (const file of files) {
    const workflow = read('.github/workflows/' + file);
    const triggers = workflow.split('on:\n')[1].split('\npermissions:')[0];
    assert.doesNotMatch(triggers, /pull_request|branches-ignore/);
    if (file === 'deploy.yaml') assert.match(triggers, /push:\n    branches: \[main\]/);
    else assert.doesNotMatch(triggers, /\bpush:/);
  }
  assert.match(read('.github/workflows/deploy.yaml'), /needs: \[build, browser-quality\]/);
  assert.match(read('.github/workflows/browser-quality.yaml'), /workflow_call:/);
  assert.match(read('.github/workflows/browser-quality.yaml'), /A11Y_ENFORCE: "1"/);
  assert.doesNotMatch(read('.github/workflows/readme-screenshots.yaml'), /git push|git commit/);
});
