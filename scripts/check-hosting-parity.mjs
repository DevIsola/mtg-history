import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

async function inventory(root, directory = root) {
  const pages = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) pages.push(...await inventory(root, path));
    else if (item.name.endsWith('.html')) pages.push(relative(root, path));
  }
  return pages.sort();
}
function record(html) {
  const values = pattern => [...html.matchAll(pattern)].map(match => match[1]).sort();
  return {
    lang: html.match(/<html[^>]* lang="([^"]+)"/)?.[1],
    headings: values(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g),
    // Tooltip IDs are random per build; retain their count, but compare authored fragments exactly.
    fragments: values(/\sid="([^"]+)"/g).map(id => id.replace(/^lore-definition-[0-9a-f-]{36}$/, 'lore-definition-generated')).sort(),
    printings: values(/data-printing-id="([^"]+)"/g),
  };
}
export async function checkHostingParity(pagesRoot, workersRoot) {
  const pages = await inventory(pagesRoot), workers = await inventory(workersRoot);
  if (!pages.length) throw new Error('No built HTML routes to compare');
  if (JSON.stringify(pages) !== JSON.stringify(workers)) throw new Error('Hosting HTML route inventories differ');
  for (const path of pages) {
    const before = record(await readFile(join(pagesRoot, path), 'utf8'));
    const after = record(await readFile(join(workersRoot, path), 'utf8'));
    if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error(`Hosting content/fragment/printing mismatch: ${path}`);
  }
  return { pages: pages.length };
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const [pages, workers] = process.argv.slice(2);
  if (!pages || !workers) throw new Error('Usage: node scripts/check-hosting-parity.mjs <pages-build> <workers-build>');
  console.log(await checkHostingParity(pages, workers));
}
