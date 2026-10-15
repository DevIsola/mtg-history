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

function* pageReferences(html) {
  for (const tag of html.matchAll(/<(a|link|script|img|source)\b[^>]*>/gi)) {
    const isAnchor = tag[1].toLowerCase() === 'a';

    for (const attribute of tag[0].matchAll(/\s(href|src)\s*=\s*(["'])(.*?)\2/gi)) {
      yield {
        reference: decodeHtmlAmpersands(attribute[3]),
        isAnchorHref: isAnchor && attribute[1].toLowerCase() === 'href',
      };
    }
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

  for (const file of htmlFiles) {
    const html = await readFile(join(root, file), 'utf8');
    const from = new URL(`${basePath}${file}`, origin);

    for (const { reference, isAnchorHref } of pageReferences(html)) {
      if (!reference || reference.startsWith('//')) continue;

      let target;
      try {
        target = new URL(reference, from);
      } catch {
        errors.push(`${file}: invalid URL ${JSON.stringify(reference)}`);
        continue;
      }

      if (target.origin !== origin) continue;
      checked++;

      if (!target.pathname.startsWith(basePath)) {
        errors.push(`${file}: link escapes configured base: ${reference}`);
        continue;
      }

      let path;
      try {
        path = decodeURIComponent(target.pathname.slice(basePath.length));
      } catch {
        errors.push(`${file}: invalid encoded path: ${reference}`);
        continue;
      }

      const clean = path.replace(/\/+$/, '');
      const candidates = clean
        ? [clean, `${clean}/index.html`, `${clean}.html`]
        : ['index.html'];
      const matchedFile = candidates.find((candidate) => available.has(candidate));

      if (!matchedFile) {
        errors.push(`${file}: missing local target: ${reference}`);
        continue;
      }

      // Fragments on assets, empty hashes, and non-anchor elements are not HTML IDs.
      if (!isAnchorHref || !target.hash || !matchedFile.endsWith('.html')) {
        continue;
      }

      let fragment;
      try {
        fragment = decodeURIComponent(target.hash.slice(1));
      } catch {
        errors.push(`${file}: invalid encoded fragment: ${reference}`);
        continue;
      }

      if (!fragment) continue;
      fragmentsChecked++;

      const ids = await getPageIds(matchedFile);
      if (!ids.has(fragment)) {
        errors.push(`${file}: missing fragment #${fragment} in ${matchedFile} (from ${reference})`);
      }
    }
  }

  return { pages: htmlFiles.length, checked, fragmentsChecked, errors };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const { default: config } = await import('../astro.config.mjs');
    const result = await checkBuiltLinks({ base: config.base, site: config.site });
    console.log(
      `Checked ${result.checked} local links and ${result.fragmentsChecked} HTML fragments across ${result.pages} generated pages.`,
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
