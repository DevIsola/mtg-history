import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const staticRoutes = ['', 'about/', 'archive/', 'characters/', 'events/', 'relationships/', 'discover/', 'explore/', 'glossary/', 'paths/', 'timeline/', 'search/'];
export function translatedRoutes() {
  const detailRoutes = ['chapters', 'characters', 'events'].flatMap(collection => {
    const extension = collection === 'chapters' ? '.mdx' : '.json';
    return readdirSync(new URL(`src/content/${collection}/`, root))
      .filter(file => file.endsWith(extension))
      .sort()
      .map(file => `${collection}/${file.slice(0, -extension.length)}/`);
  });
  return [...staticRoutes, ...detailRoutes];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = new URL('src/data/translated-routes.json', root);
  const expected = JSON.stringify(translatedRoutes(), null, 2) + '\n';
  if (process.argv.includes('--check')) {
    if (readFileSync(file, 'utf8') !== expected) throw new Error('Translated route manifest is stale; regenerate it from the canonical content.');
    console.log(`${translatedRoutes().length} exact translated route pairs verified.`);
  } else {
    writeFileSync(file, expected);
  }
}
