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

function* pageReferences(html) {
  for (const match of html.matchAll(/<(?:a|link|script|img|source)\b[^>]*>/gi)) {
    for (const attribute of match[0].matchAll(/\s(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) {
      yield attribute[2];
    }
  }
}

/** Check route and asset targets within a statically generated Astro site. */
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
  let checked = 0;

  for (const file of htmlFiles) {
    const html = await readFile(join(root, file), 'utf8');
    const from = new URL(`${basePath}${file}`, origin);

    for (const reference of pageReferences(html)) {
      if (!reference || reference.startsWith('//')) continue;

      let target;
      try {
        target = new URL(reference.replaceAll('&amp;', '&'), from);
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

      if (!candidates.some((candidate) => available.has(candidate))) {
        errors.push(`${file}: missing local target: ${reference}`);
      }
    }
  }

  return { pages: htmlFiles.length, checked, errors };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const { default: config } = await import('../astro.config.mjs');
    const result = await checkBuiltLinks({ base: config.base, site: config.site });
    console.log(`Checked ${result.checked} local links across ${result.pages} generated pages.`);
    if (result.errors.length) {
      for (const error of result.errors) console.error(`- ${error}`);
      process.exitCode = 1;
    } else {
      console.log('All local route and asset targets exist.');
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
