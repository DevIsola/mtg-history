import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { ISSUE_CATEGORIES, reportIssueUrl } from '../src/utils/issue-report.mjs';
import { BATCH_1_IDS } from '../src/data/pt-chapter-batch1.mjs';
import { BATCH_2_IDS } from '../src/data/pt-chapter-batch2.mjs';
import { BATCH_3_IDS } from '../src/data/pt-chapter-batch3.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const dynamic = read('src/pages/pt-br/chapters/[id].astro');
const thran = read('src/pages/pt-br/chapters/thran/index.astro');
const component = read('src/components/IssueReporter.astro');
const ids = ['thran', ...BATCH_1_IDS, ...BATCH_2_IDS, ...BATCH_3_IDS];
const origin = 'https://devisola.github.io/mtg-history/pt-br/chapters/';

function report(id, category) {
  return new URL(reportIssueUrl({ chapterId: id, chapterTitle: `Capítulo histórico ${id}`, category, pageUrl: `${origin}${id}/` }));
}

test('every Portuguese chapter is eligible exactly once', () => {
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  assert.equal(ids[0], 'thran');
  assert.equal(ids.at(-1), 'omenpaths');
  assert.match(dynamic, /\.\.\.PORTUGUESE_BATCH_1, \.\.\.PORTUGUESE_BATCH_2, \.\.\.PORTUGUESE_BATCH_3/);
});

test('five accessible categories carry distinct identifiers', () => {
  assert.deepEqual(ISSUE_CATEGORIES.map(x => x.id), ['traducao', 'historico', 'arte', 'link', 'acessibilidade']);
  assert.equal(new Set(ISSUE_CATEGORIES.map(x => x.label)).size, 5);
  assert.match(component, /<details>/);
  assert.match(component, /<summary>Reportar um problema<\/summary>/);
  assert.match(component, /data-issue-category=\{category\.id\}/);
});

test('all fifty generated issue URLs target the authorized GitHub repository', () => {
  for (const id of ids) for (const category of ISSUE_CATEGORIES) {
    const target = report(id, category.id);
    assert.equal(target.origin, 'https://github.com');
    assert.equal(target.pathname, '/DevIsola/mtg-history/issues/new');
    assert.deepEqual([...target.searchParams.keys()].sort(), ['body', 'title']);
    assert.ok(target.searchParams.get('title').includes(category.label));
  }
});

test('issue drafts contain the exact chapter ID, Portuguese canonical URL and editable description sections', () => {
  for (const id of ids) {
    const text = report(id, 'historico').searchParams.get('body');
    assert.ok(text.includes(`(${id})`));
    assert.ok(text.includes(`${origin}${id}/`));
    for (const heading of ['Descrição do problema', 'Correção sugerida', 'Fontes ou evidências']) assert.ok(text.includes(heading));
  }
});

test('unsafe protocols and cross-chapter URLs are rejected', () => {
  const base = { chapterId: 'thran', chapterTitle: 'Os Thran', category: 'historico' };
  for (const pageUrl of ['javascript:alert(1)', 'https://example.com/something', `${origin}omenpaths/`]) {
    assert.throws(() => reportIssueUrl({ ...base, pageUrl }));
  }
  assert.throws(() => reportIssueUrl({ ...base, category: 'not-a-category', pageUrl: `${origin}thran/` }));
  assert.throws(() => reportIssueUrl({ ...base, chapterId: '../other', pageUrl: `${origin}thran/` }));
});

test('both Astro chapter types render the same reusable reporting component', () => {
  assert.match(dynamic, /import IssueReporter from '\.\.\/\.\.\/\.\.\/components\/IssueReporter\.astro';/);
  assert.match(thran, /import IssueReporter from '\.\.\/\.\.\/\.\.\/\.\.\/components\/IssueReporter\.astro';/);
  assert.match(dynamic, /<IssueReporter chapterId=\{companion\.id\} chapterTitle=\{companion\.title\} \/>/);
  assert.match(thran, /<IssueReporter chapterId="thran" chapterTitle="Os Thran e as origens de Phyrexia" \/>/);
  assert.match(component, /data-issue-report/);
});

test('progressive enhancement and editorial boundaries are preserved', () => {
  assert.match(component, /target="_blank" rel="noopener noreferrer"/);
  assert.match(component, /Nenhuma issue é enviada automaticamente/);
  assert.doesNotMatch(component, /<script|client:load|client:only|<form/);
  assert.match(dynamic, /não é uma tradução integral/);
  assert.match(thran, /Versão condensada, não tradução integral/);
  assert.doesNotMatch(component, /localStorage|fetch\(/);
});
