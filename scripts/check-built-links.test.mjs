import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';
import { checkBuiltLinks } from './check-built-links.mjs';

const created = [];
afterEach(async () => {
  await Promise.all(created.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function fixture(files) {
  const root = await mkdtemp(join(tmpdir(), 'mtg-history-links-'));
  created.push(root);
  for (const [file, contents] of Object.entries(files)) {
    await mkdir(join(root, file, '..'), { recursive: true });
    await writeFile(join(root, file), contents);
  }
  return root;
}

const site = 'https://example.com';
const base = '/mtg-history/';

test('resolves base-prefixed, relative, root, and asset links', async () => {
  const distDir = await fixture({
    'index.html': '<a href="/mtg-history/chapters/thran/">Chapter</a><a href="/mtg-history/">Home</a>',
    'chapters/thran/index.html': '<a href="../../">Home</a><a href="#intro">Intro</a><img src="/mtg-history/favicon.svg"><a href="https://external.example/nope">External</a><h2 id="intro">Intro</h2>',
    'favicon.svg': '<svg></svg>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.deepEqual(result, { pages: 2, checked: 5, fragmentsChecked: 1, errors: [] });
});

test('checks in-page and cross-page fragments, including encoded IDs', async () => {
  const distDir = await fixture({
    'index.html': '<h2 id="introduction">Intro</h2><a href="#introduction">Same page</a><a href="/mtg-history/timeline/#ice-age">Timeline</a><a href="/mtg-history/chapters/thran/#rebbec%20%26%20glacian">Chapter</a>',
    'timeline/index.html': '<section id="ice-age"></section>',
    'chapters/thran/index.html': '<h2 id="rebbec &amp; glacian">The Thran</h2>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.fragmentsChecked, 3);
  assert.deepEqual(result.errors, []);
});

test('reports missing fragments on existing pages', async () => {
  const distDir = await fixture({
    'index.html': '<a href="#unknown">Missing in page</a><a href="/mtg-history/timeline/#not-here">Missing in timeline</a>',
    'timeline/index.html': '<section id="ice-age"></section>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /missing fragment #unknown in index\.html/);
  assert.match(result.errors[1], /missing fragment #not-here in timeline\/index\.html/);
});

test('reports missing local destinations and paths outside the site base', async () => {
  const distDir = await fixture({
    'index.html': '<a href="/mtg-history/unknown/#intro">Missing</a><a href="/other-app/">Wrong base</a>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /missing local target/);
  assert.match(result.errors[1], /escapes configured base/);
});

test('ignores external fragments, asset fragments, and empty hashes', async () => {
  const distDir = await fixture({
    'index.html': '<a href="https://external.example/page#missing">External</a><a href="/mtg-history/icons.svg#symbol">SVG</a><a href="#">Top</a><img src="/mtg-history/picture.svg#fragment">Image</img>',
    'icons.svg': '<svg></svg>',
    'picture.svg': '<svg></svg>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.fragmentsChecked, 0);
  assert.deepEqual(result.errors, []);
});

test('rejects malformed percent-encoded fragments without crashing', async () => {
  const distDir = await fixture({
    'index.html': '<a href="#%E0%A4%A">Invalid fragment</a>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /invalid encoded fragment/);
});

test('fails when the output has no generated HTML', async () => {
  const distDir = await fixture({ 'favicon.svg': '<svg></svg>' });
  await assert.rejects(checkBuiltLinks({ distDir, base, site }), /No generated HTML/);
});


test('checks responsive image candidates, including data URLs containing commas', async () => {
  const distDir = await fixture({
    'index.html': `<picture>
      <source srcset="/mtg-history/img/one.webp 1x, /mtg-history/img/two.webp 2x">
      <img srcset="data:image/png;base64,aGVsbG8= 1x, /mtg-history/img/one.webp 2x"
           src="/mtg-history/img/one.webp" alt="Archive card">
    </picture>`,
    'img/one.webp': 'test',
    'img/two.webp': 'test',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.checked, 4);
  assert.deepEqual(result.errors, []);
});

test('reports missing and escaped-base srcset images', async () => {
  const distDir = await fixture({
    'index.html': '<img srcset="/mtg-history/unknown.webp 1x, /another-site/image.webp 2x">',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /missing local target/);
  assert.match(result.errors[1], /escapes configured base/);
});

test('resolves CSS images and fonts relative to generated stylesheet paths', async () => {
  const distDir = await fixture({
    'index.html': '<link href="/mtg-history/_astro/site.css" rel="stylesheet">',
    '_astro/site.css': `/* url('/mtg-history/obsolete.svg') */
      .hero { background-image: url('../images/hero.svg'); }
      @font-face { src: url("./font.woff2") format('woff2'); }
      .icon { mask: url(data:image/svg+xml,%3Csvg%3E); }
      .filter { filter: url(#svg-filter); }
      .remote { background: url(https://example-cdn.com/picture.png); }`,
    '_astro/font.woff2': 'test',
    'images/hero.svg': '<svg></svg>',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.checked, 3);
  assert.deepEqual(result.errors, []);
});

test('reports missing CSS asset URLs using stylesheet source names', async () => {
  const distDir = await fixture({
    'index.html': '<link href="/mtg-history/_astro/site.css" rel="stylesheet">',
    '_astro/site.css': '.hero { background: url(../images/missing.svg); }',
  });
  const result = await checkBuiltLinks({ distDir, base, site });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /_astro\/site\.css: missing local target/);
});
