import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

function normalizeBase(base) {
  const segments = String(base ?? '/').split('/').filter(Boolean);
  return segments.length ? `/${segments.join('/')}/` : '/';
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );
  return nested.flat();
}

function decodeHtmlAmpersands(value) {
  return value.replaceAll('&amp;', '&');
}

/** Parse responsive-image candidates, including data URLs containing commas. */
function* srcsetReferences(value) {
  let index = 0;

  while (index < value.length) {
    while (index < value.length && /[\s,]/.test(value[index])) index++;
    if (index >= value.length) break;

    const start = index;
    while (index < value.length && !/\s/.test(value[index])) index++;

    const token = value.slice(start, index);
    const reference = token.replace(/,+$/, '');
    if (reference) yield reference;

    // A URL ending in a comma has no descriptor; continue at the next URL.
    if (token.endsWith(',')) continue;

    // Ignore density/width descriptors, including parenthesized expressions.
    let depth = 0;
    while (index < value.length) {
      const char = value[index++];
      if (char === '(') depth++;
      else if (char === ')' && depth > 0) depth--;
      else if (char === ',' && depth === 0) break;
    }
  }
}

function* pageReferences(html) {
  for (const tag of html.matchAll(/<(a|link|script|img|source)\b[^>]*>/gi)) {
    const isAnchor = tag[1].toLowerCase() === 'a';

    for (const attribute of tag[0].matchAll(/\s(href|src|srcset)\s*=\s*(["'])(.*?)\2/gi)) {
      const name = attribute[1].toLowerCase();
      const value = decodeHtmlAmpersands(attribute[3]);
      if (name === 'srcset') {
        for (const reference of srcsetReferences(value)) {
          yield { reference, isAnchorHref: false };
        }
      } else {
        yield { reference: value, isAnchorHref: isAnchor && name === 'href' };
      }
    }
  }
}

/** Extract CSS url(...) references, ignoring plain CSS fragment pointers. */
function* cssReferences(css) {
  // Bundled CSS typically uses quoted or unquoted URLs. Comments are stripped
  // so examples in documentation cannot trigger false positives.
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of withoutComments.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi)) {
    const reference = (match[2] ?? match[3] ?? '').trim();
    if (reference && !reference.startsWith('#')) yield reference;
  }
}

function pageIds(html) {
  const ids = new Set();

  for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
    const attribute = tag[0].match(/\sid\s*=\s*(["'])(.*?)\1/i);
    if (attribute) ids.add(decodeHtmlAmpersands(attribute[2]));
  }

  return ids;
}

/** Check route, asset, and HTML-fragment targets in an Astro static build. */
export async function checkBuiltLinks({
  distDir = 'dist',
  base = '/',
  site = 'http://localhost',
} = {}) {
  const root = resolve(distDir);
  const basePath = normalizeBase(base);
  const origin = new URL(site).origin;
  const files = (await listFiles(root)).map((path) =>
    relative(root, path).split(sep).join('/'),
  );
  const available = new Set(files);
  const htmlFiles = files.filter((path) => path.endsWith('.html'));

  if (htmlFiles.length === 0) {
    throw new Error(`No generated HTML files found in ${root}`);
  }

  const errors = [];
  const idsCache = new Map();
  let checked = 0;
  let fragmentsChecked = 0;

  async function getPageIds(file) {
    if (!idsCache.has(file)) {
      const html = await readFile(join(root, file), 'utf8');
      idsCache.set(file, pageIds(html));
    }
    return idsCache.get(file);
  }

  async function checkReference(file, from, reference, isAnchorHref = false) {
    if (!reference || reference.startsWith('//')) return;

    let target;
    try {
      target = new URL(reference, from);
    } catch {
      errors.push(`${file}: invalid URL ${JSON.stringify(reference)}`);
      return;
    }

    if (target.origin !== origin) return;
    checked++;

    if (!target.pathname.startsWith(basePath)) {
      errors.push(`${file}: link escapes configured base: ${reference}`);
      return;
    }

    let path;
    try {
      path = decodeURIComponent(target.pathname.slice(basePath.length));
    } catch {
      errors.push(`${file}: invalid encoded path: ${reference}`);
      return;
    }

    const clean = path.replace(/\/+$/, '');
    const candidates = clean
      ? [clean, `${clean}/index.html`, `${clean}.html`]
      : ['index.html'];
    const matchedFile = candidates.find((candidate) => available.has(candidate));

    if (!matchedFile) {
      errors.push(`${file}: missing local target: ${reference}`);
      return;
    }

    // Only HTML anchors should validate fragment IDs.
    if (!isAnchorHref || !target.hash || !matchedFile.endsWith('.html')) return;

    let fragment;
    try {
      fragment = decodeURIComponent(target.hash.slice(1));
    } catch {
      errors.push(`${file}: invalid encoded fragment: ${reference}`);
      return;
    }

    if (!fragment) return;
    fragmentsChecked++;

    const ids = await getPageIds(matchedFile);
    if (!ids.has(fragment)) {
      errors.push(`${file}: missing fragment #${fragment} in ${matchedFile} (from ${reference})`);
    }
  }

  for (const file of htmlFiles) {
    const html = await readFile(join(root, file), 'utf8');
    const from = new URL(`${basePath}${file}`, origin);
    for (const { reference, isAnchorHref } of pageReferences(html)) {
      await checkReference(file, from, reference, isAnchorHref);
    }
  }

  // CSS URLs are relative to their stylesheet, not the page referencing it.
  for (const file of files.filter((path) => path.endsWith('.css'))) {
    const css = await readFile(join(root, file), 'utf8');
    const from = new URL(`${basePath}${file}`, origin);
    for (const reference of cssReferences(css)) {
      await checkReference(file, from, reference);
    }
  }

  return { pages: htmlFiles.length, checked, fragmentsChecked, errors };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const { default: config } = await import('../astro.config.mjs');
    const result = await checkBuiltLinks({ base: config.base, site: config.site });
    console.log(
      `Checked ${result.checked} local HTML/CSS references and ${result.fragmentsChecked} HTML fragments across ${result.pages} generated pages.`,
    );
    if (result.errors.length) {
      for (const error of result.errors) console.error(`- ${error}`);
      process.exitCode = 1;
    } else {
      console.log('All local route, asset, and fragment targets exist.');
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
