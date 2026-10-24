import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { hostingConfig } from '../config/hosting.mjs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultDist = fileURLToPath(new URL('../dist/', import.meta.url));

/** Built artifacts are mandatory; a missing index must block deployment. */
export async function checkPagefindIndex(root = defaultDist, base = hostingConfig().base) {
  const errors = [];
  const site = resolve(root);
  for (const path of ['pagefind/pagefind.js', 'search/index.html', 'chapters/thran/index.html']) {
    try { await access(resolve(site, path)); }
    catch { errors.push(`missing build output: ${path}`); }
  }
  try {
    const search = await readFile(resolve(site, 'search/index.html'), 'utf8');
    if (!search.includes(`data-pagefind-bundle="${base}pagefind/pagefind.js"`)) {
      errors.push(`search entry point does not respect ${base} base`);
    }
    const chapter = await readFile(resolve(site, 'chapters/thran/index.html'), 'utf8');
    if (!/<main\b[^>]*data-pagefind-body/.test(chapter)) {
      errors.push('chapter HTML missing Pagefind index scope');
    }
  } catch { /* missing files reported above */ }
  try {
    // Pagefind 1.x places per-page fragments in pagefind/fragment/.
    const fragments = await readdir(resolve(site, 'pagefind', 'fragment'), { withFileTypes: true });
    if (!fragments.some((entry) => entry.isFile() && entry.name.endsWith('.pf_fragment'))) {
      errors.push('Pagefind has no generated fragments');
    }
  } catch {
    errors.push('missing build output: pagefind/fragment/');
  }
  return errors;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const errors = await checkPagefindIndex();
  if (errors.length) {
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log('Pagefind search index: generated bundle, fragments, chapter scope and base path passed.');
  }
}
