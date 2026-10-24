import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const [origin, root = 'dist'] = process.argv.slice(2);
if (!origin || new URL(origin).origin !== origin) throw new Error('Usage: node scripts/check-hosting-http.mjs <origin-without-trailing-slash> [dist]');
async function files(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result;
}
const pending = (await files(root)).filter(path => !['_headers', '_redirects'].includes(relative(root, path)));
if (!pending.some(path => path.endsWith('index.html'))) throw new Error('No built HTML routes to probe');
const report = { origin, checked: 0, pages: 0, mismatches: [] };
const hash = value => createHash('sha256').update(value).digest('hex');
await Promise.all(Array.from({ length: 6 }, async () => {
  while (pending.length) {
    const path = pending.pop();
    const file = relative(root, path).replaceAll('\\', '/');
    const route = '/' + file.replace(/(^|\/)index\.html$/, '$1');
    try {
      const response = await fetch(new URL(route, origin), { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      if (response.status !== 200) throw new Error('HTTP ' + response.status);
      const body = Buffer.from(await response.arrayBuffer());
      if (hash(body) !== hash(await readFile(path))) throw new Error('body differs from reviewed artifact');
      if (file.endsWith('.html')) {
        report.pages++;
        if (response.headers.get('x-robots-tag') !== 'noindex') throw new Error('missing staging noindex');
      }
      report.checked++;
    } catch (error) { report.mismatches.push({ route, error: error.message }); }
  }
}));
console.log(JSON.stringify(report, null, 2));
if (report.mismatches.length) process.exitCode = 1;
