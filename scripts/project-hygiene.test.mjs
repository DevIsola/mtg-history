import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const retired = [
  "scripts/migrate-cards-to-collections.mjs",
  "scripts/migrate-card-consumers.mjs",
  "scripts/migrate-card-contexts.mjs",
  "scripts/migrate-card-image-consumers.mjs",
  "scripts/migrate-chapter-card-contexts.mjs",
  "scripts/migrate-entities-to-collections.mjs",
  "scripts/card-consumer-migration-tools.mjs",
  "scripts/card-consumer-migration-tools.test.mjs",
  "scripts/card-context-migration-tools.mjs",
  "scripts/card-context-migration-tools.test.mjs",
  "scripts/chapter-card-migration-tools.mjs",
  "scripts/chapter-card-migration-tools.test.mjs",
  "scripts/migrate-card-image-consumers.test.mjs"
];
const critical = [
  "scripts/check-card-collections.mjs",
  "scripts/check-entity-collections.mjs",
  "scripts/load-curated-chapters.mjs",
  "scripts/card-collection-tools.mjs",
  "scripts/entity-collection-tools.mjs",
  "scripts/check-artwork-fidelity.mjs",
  "scripts/check-event-provenance.mjs",
  "docs/artwork-fidelity-ledger.tsv"
];
const read = path => readFileSync(new URL(path, root), 'utf8');
const count = (name, ext) => readdirSync(new URL('src/content/' + name + '/', root)).filter(name => name.endsWith(ext)).length;

test('all completed one-time migration executables and exclusive fixtures are retired', () => {
  for (const path of retired) assert.equal(existsSync(new URL(path, root)), false, path);
  const pkg = JSON.parse(read('package.json'));
  for (const cmd of ['migrate:cards', 'migrate:card-consumers', 'migrate:entities']) {
    assert.equal(Object.hasOwn(pkg.scripts, cmd), false, cmd);
  }
});

test('live content validators, provenance, and artwork evidence remain intact', () => {
  for (const path of critical) assert.equal(existsSync(new URL(path, root)), true, path);
  const scripts = JSON.parse(read('package.json')).scripts;
  for (const cmd of ['check:entities','check:cards','check:editorial','check:provenance','check:artwork','verify']) {
    assert.ok(scripts[cmd], cmd);
  }
});

test('README counts reflect canonical collections rather than the old 130-event snapshot', () => {
  const counts = ['chapters', 'characters', 'events', 'relationships', 'cards', 'glossary']
    .map(name => count(name, name === 'chapters' ? '.mdx' : '.json'));
  const readme = read('README.md');
  const row = counts.map(n => String(n)).join('\s*\|\s*');
  assert.match(readme, new RegExp('\\|\\s*' + row + '\\s*\\|'));
  assert.match(readme, new RegExp('searchable index of ' + (counts[0] + counts[1] + counts[2]) + ' chapters'));
  assert.doesNotMatch(readme, /publication history and 130 events/);
});

test('one-time migration documents explicitly identify their archived status', () => {
  for (const path of [
  "docs/card-content-collections.md",
  "docs/canonical-card-consumers.md",
  "docs/card-context-dedup-phase3a.md",
  "docs/chapter-card-dedup-phase3b.md",
  "docs/entity-content-collections.md"
]) {
    assert.match(read(path), /Historical migration record/);
  }
  assert.ok(read('docs/project-maintenance.md').includes('retained intentionally'));
});
