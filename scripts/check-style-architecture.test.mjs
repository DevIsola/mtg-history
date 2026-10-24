import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { auditStyles } from './check-style-architecture.mjs';

const file = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const modules = ['reset', 'tokens', 'foundation', 'reading', 'theme', 'support',
  'characters', 'exploration', 'events', 'discovery', 'interactive-explorers',
  'chapter-themes', 'ux-c1', 'phase15'];
const styles = Object.fromEntries([
  ['global.scss', file('src/styles/global.scss')],
  ['_breakpoints.scss', file('src/styles/_breakpoints.scss')],
  ...modules.map((name) => [`_${name}.scss`, file(`src/styles/_${name}.scss`)]),
]);
const components = Object.fromEntries([
  'CardHoverPreview.astro', 'CharacterRelationships.astro',
  'HistoricalCard.astro', 'HistoricalEventReference.astro',
  'SiteFooter.astro',
].map((name) => [name, file(`src/components/${name}`)]));
const good = {
  styles, components,
  globalCss: styles['global.scss'], foundation: styles['_foundation.scss'],
  tokens: styles['_tokens.scss'], reset: styles['_reset.scss'],
  config: file('astro.config.mjs'), layout: file('src/layouts/BaseLayout.astro'),
  manifest: JSON.parse(file('package.json')),
  workspace: file('pnpm-workspace.yaml'),
  lockfile: 'lockfileVersion: "9.0"\nimporters:\n  .:\n    devDependencies:\n      sass:\npackages:\n',
};

test('preserves order with Sass modules and centralized runtime design tokens', () => {
  assert.deepEqual(auditStyles(good), []);
});
test('retains mobile 680px token and shared 600px breakpoint ownership', () => {
  assert.match(good.tokens, /bp\.\$header/);
  assert.doesNotMatch(good.foundation, /:root\s*\{/);
  assert.match(styles['_breakpoints.scss'], /\$small:\s*600px/);
});
test('rejects global module reordering, legacy CSS files, and missing Sass partials', () => {
  assert.match(auditStyles({ ...good, globalCss: good.globalCss.replace('@use "./foundation";', '@use "./bad";') }).join(' '), /module order/);
  assert.match(auditStyles({ ...good, styles: { ...good.styles, 'old.css': '.old{}' } }).join(' '), /legacy global/);
  const { '_theme.scss': _missing, ...withoutTheme } = good.styles;
  assert.match(auditStyles({ ...good, styles: withoutTheme }).join(' '), /missing SCSS partial/);
  const { '_ux-c1.scss': _missingC1, ...withoutC1 } = good.styles;
  assert.match(auditStyles({ ...good, styles: withoutC1 }).join(' '), /missing SCSS partial: _ux-c1\.scss/);
});
test('rejects forgotten token owners and dark theme regressions', () => {
  assert.match(auditStyles({ ...good, tokens: ':root {}' }).join(' '), /missing semantic token/);
  assert.match(auditStyles({ ...good, foundation: ':root { --ink: red }' }).join(' '), /duplicates root-level/);
  assert.match(auditStyles({ ...good, styles: { ...good.styles, '_theme.scss': '' } }).join(' '), /dark-mode/);
});
test('rejects missing Astro-scoped SCSS and wrong page style entrypoint', () => {
  assert.match(auditStyles({ ...good, components: { ...good.components, 'HistoricalCard.astro': '<style>old</style>' } }).join(' '), /Astro-scoped SCSS/);
  assert.match(auditStyles({ ...good, layout: "import '../styles/global.css'" }).join(' '), /SCSS entrypoint/);
});
test('rejects Tailwind and missing Sass in manifest or lockfile', () => {
  assert.match(auditStyles({ ...good, styles: { ...good.styles, '_reading.scss': '@apply p-4;' } }).join(' '), /Tailwind directive/);
  assert.match(auditStyles({ ...good, manifest: { ...good.manifest, devDependencies: { ...good.manifest.devDependencies, sass: undefined } } }).join(' '), /Sass dependency/);
  assert.match(auditStyles({ ...good, lockfile: 'importers:\n  .:\npackages:\n' }).join(' '), /lockfile importer lacks Sass/);
});


test('approves the reviewed watcher dependency without broad build-script exemptions', () => {
  assert.deepEqual(auditStyles(good), []);
  assert.match(auditStyles({ ...good, workspace: "allowBuilds:\n  '@parcel/watcher': set this to true or false\n" }).join(' '), /@parcel\/watcher build|undecided placeholder/);
  assert.match(auditStyles({ ...good, workspace: "strictDepBuilds: false\n" }).join(' '), /@parcel\/watcher build/);
});

test('footer selectors are component-owned, not reintroduced in the foundation', () => {
  assert.match(good.components['SiteFooter.astro'], /<style lang="scss">/);
  assert.match(good.components['SiteFooter.astro'], /bp\.\$header/);
  assert.match(auditStyles({ ...good, foundation: good.foundation + '\n.site-footer { color: red }' }).join(' '), /footer selectors/);
  assert.match(auditStyles({ ...good, components: { ...good.components, 'SiteFooter.astro': '<footer></footer>' } }).join(' '), /SiteFooter\.astro.*Astro-scoped SCSS/);
});
