import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import {
  REVIEW_ROUTES, REVIEW_WIDTHS, EXTENDED_WIDTHS, THEME_MODES,
  contrastRatio, reviewThemeContrast, reviewPrintingCatalog,
} from '../src/utils/ux-f2-audit.mjs';
import { RELATIONSHIP_COLORS, relationshipDash } from '../src/utils/relationship-colors.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const entries = dir => readdirSync(new URL('../' + dir, import.meta.url)).filter(p => p.endsWith('.json'));

test('F2 audit routes cover both locales and all redesigned discovery areas', () => {
  const keys = new Set(REVIEW_ROUTES.map(p => p.id));
  const paths = new Set(REVIEW_ROUTES.map(p => p.route));
  assert.equal(keys.size, REVIEW_ROUTES.length);
  assert.equal(paths.size, REVIEW_ROUTES.length);
  assert.ok(paths.has('relationships/') && paths.has('chapters/thran/'));
  for (const path of ['', 'archive/', 'characters/', 'timeline/', 'explore/']) {
    assert.ok(paths.has(path), `English route missing: ${path}`);
    assert.ok(paths.has('pt-br/' + path), `Portuguese route missing: ${path}`);
  }
  assert.deepEqual(THEME_MODES, ['light', 'dark']);
  assert.equal(REVIEW_WIDTHS.mobile, 390);
  assert.equal(REVIEW_WIDTHS.desktop, 1440);
  assert.equal(EXTENDED_WIDTHS.narrow, 320);
  assert.equal(EXTENDED_WIDTHS.tablet, 768);
});

test('site theme text colors meet WCAG AA normal-text ratios on main surfaces', () => {
  assert.ok(contrastRatio('#000000', '#ffffff') > 20);
  assert.deepEqual(reviewThemeContrast(read('src/styles/_tokens.scss'), read('src/styles/_theme.scss')), []);
});

test('relationship legend has six distinguishable colors and non-color edge patterns', () => {
  assert.equal(Object.keys(RELATIONSHIP_COLORS).length, 6);
  for (const theme of ['light', 'dark']) {
    const bg = theme === 'light' ? '#faf7f0' : '#172529';
    const seen = new Set();
    for (const [category, item] of Object.entries(RELATIONSHIP_COLORS)) {
      assert.ok(!seen.has(item[theme]), `Duplicate ${theme} color: ${category}`);
      seen.add(item[theme]);
      assert.ok(contrastRatio(item[theme], bg) >= 4.5, `${category} ${theme} edge contrast`);
      assert.ok(typeof relationshipDash(category) === 'boolean' || Array.isArray(relationshipDash(category)));
    }
  }
});

test('canonical editorial counts and verified PT printing identities remain unchanged', () => {
  const counts = [
    ['src/content/characters/', 88], ['src/content/events/', 133],
    ['src/content/relationships/', 118], ['src/content/cards/', 133],
  ];
  for (const [dir, expected] of counts) assert.equal(entries(dir).length, expected, dir);
  const chapters = readdirSync(new URL('../src/content/chapters/', import.meta.url))
    .filter(name => /\.(?:md|mdx)$/.test(name));
  assert.equal(chapters.length, 11, 'chapter count');
  const ledger = read('docs/artwork-fidelity-ledger.tsv').trimEnd().split(/\r?\n/).slice(1);
  assert.equal(ledger.length, 136, 'curated chapter-artwork references');
  const cards = Object.fromEntries(entries('src/content/cards/').map(file => [
    file.slice(0, -5), JSON.parse(read('src/content/cards/' + file)),
  ]));
  const catalog = JSON.parse(read('src/data/pt-printings.json'));
  assert.deepEqual(reviewPrintingCatalog(cards, catalog), []);
  assert.equal(new Set(Object.keys(cards)).size, 133);
});

test('F2 screenshot review and browser gates are independent of network-hosted services', () => {
  const script = read('scripts/review-ux-f2.mjs');
  const browser = read('tests/browser/ux-wave-f2.spec.mjs');
  const doc = read('docs/ux-wave-f2-final-quality-gate.md');
  for (const text of ['REVIEW_ROUTES', 'REVIEW_WIDTHS', 'THEME_MODES', 'page.screenshot', 'report.json', 'index.html']) {
    assert.ok(script.includes(text), `missing visual review output: ${text}`);
  }
  for (const text of ['320', '390', '768', '1440', 'main h1', 'data-home-artwork', 'skip-link']) {
    assert.ok(browser.includes(text), `missing browser gate: ${text}`);
  }
  assert.match(doc, /A11Y_ENFORCE=1/);
  assert.match(doc, /VoiceOver/);
  assert.match(doc, /not a WCAG certification/i);
});
