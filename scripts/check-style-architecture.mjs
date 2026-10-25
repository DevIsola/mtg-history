import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const requiredModules = [
  'reset', 'tokens', 'foundation', 'reading', 'theme', 'support',
  'characters', 'exploration', 'events', 'discovery', 'interactive-explorers',
  'chapter-themes', 'ux-c1', 'phase15',
];
const requiredTokens = [
  'ink', 'ink-soft', 'night', 'night-raised', 'paper', 'paper-white',
  'paper-deep', 'line', 'gold', 'gold-light', 'jade',
  'site-header-height', 'font-body', 'font-display',
  'link-color', 'link-hover',
];
const scopedComponents = [
  'CardHoverPreview.astro', 'CharacterRelationships.astro',
  'HistoricalCard.astro', 'HistoricalEventReference.astro',
  'SiteFooter.astro',
];

/** Offline policy validation; Astro/Vite and Sass perform actual compilation. */
export function auditStyles({ globalCss, foundation, tokens, reset, styles, config, manifest, lockfile,
  layout = "import '../styles/global.scss';", components = {}, workspace = '' }) {
  const errors = [];
  const uses = [...globalCss.matchAll(/@use\s+["']\.\/([\w-]+)["']\s*;/g)]
    .map((match) => match[1]);
  if (JSON.stringify(uses) !== JSON.stringify(requiredModules) || /@import\b/.test(globalCss)) {
    errors.push(`global.scss module order differs from: ${requiredModules.join(', ')}`);
  }
  for (const module of requiredModules) {
    if (typeof styles[`_${module}.scss`] !== 'string') errors.push(`missing SCSS partial: _${module}.scss`);
  }
  if (typeof styles['_breakpoints.scss'] !== 'string' ||
      !/\$small:\s*600px/.test(styles['_breakpoints.scss'] ?? '') ||
      !/\$header:\s*680px/.test(styles['_breakpoints.scss'] ?? '')) {
    errors.push('breakpoints must own the 600px and 680px responsive values');
  }
  if (Object.keys(styles).some((file) => file.endsWith('.css'))) {
    errors.push('src/styles must use SCSS modules, not legacy global .css files');
  }
  if (!/@layer\s+reset\s*\{/.test(reset) || !/box-sizing:\s*border-box/.test(reset) ||
      !/\[hidden\]/.test(reset)) errors.push('reset partial must preserve box-sizing, hidden and reset cascade');
  const named = new Set([...tokens.matchAll(/--([\w-]+)\s*:/g)].map((match) => match[1]));
  for (const token of requiredTokens) if (!named.has(token)) errors.push(`missing semantic token: --${token}`);
  if (!/:root\s*\{/.test(tokens) || !/@media\s*\(max-width:\s*bp\.\$header\)/.test(tokens) ||
      !/--site-header-height:\s*72px/.test(tokens)) {
    errors.push('token partial must own default and mobile viewport tokens');
  }
  if (/:root\s*\{/.test(foundation)) errors.push('foundation partial duplicates root-level tokens');
  if (/^\s*\.(?:site-footer|footer-grid|footer-brand|footer-links|footer-legal)(?:\b|__)/m.test(foundation)) {
    errors.push('footer selectors must be owned by SiteFooter.astro, not foundation');
  }
  if (!/:root\[data-theme="dark"\]/.test(styles['_theme.scss'] ?? '')) {
    errors.push('theme partial must own dark-mode runtime overrides');
  }
  const tailwind = /@(?:apply|tailwind|theme|utility|variant|config|plugin)\b|@import\s*["']tailwindcss(?:\/[^"']*)?["']/;
  for (const [file, source] of Object.entries(styles)) {
    if (tailwind.test(source)) errors.push(`${file}: Tailwind directive remains`);
  }
  if (/@tailwindcss\/vite|\btailwindcss\s*\(/.test(config)) errors.push('Astro config still loads Tailwind');
  const deps = { ...manifest.dependencies, ...manifest.devDependencies };
  if (deps.tailwindcss || deps['@tailwindcss/vite']) errors.push('Tailwind is still a direct dependency');
  if (!deps.sass) errors.push('Sass dependency is required for Vite SCSS compilation');
  if (!/^allowBuilds:\s*\n(?:[ \t]+[^\n]+\n)*?  ['\"]@parcel\/watcher['\"]:\s*true\s*$/m.test(workspace)) {
    errors.push('pnpm-workspace.yaml must explicitly approve only the reviewed @parcel/watcher build');
  }
  if (/set this to true or false/i.test(workspace)) errors.push('pnpm build policy contains an undecided placeholder');
  if (manifest.scripts['check:styles'] !== 'node scripts/check-style-architecture.mjs' ||
      !manifest.scripts.verify.includes('pnpm run check:styles')) errors.push('verification does not gate style architecture');
  const importer = lockfile.split(/^---\s*$/m).map(document => document.split(/^packages:\s*$/m)[0]).join('\n');
  if (/^\s+(?:'@tailwindcss\/vite'|tailwindcss):/m.test(importer)) errors.push('lockfile importer retains Tailwind');
  if (!/^\s+sass:/m.test(importer)) errors.push('lockfile importer lacks Sass; run pnpm install --lockfile-only');
  if (!/import\s+["']\.\.\/styles\/global\.scss["']/.test(layout)) {
    errors.push('BaseLayout must import the SCSS entrypoint');
  }
  for (const name of scopedComponents) {
    const source = components[name];
    if (typeof source !== 'string' || !/<style\s+lang="scss">/.test(source)) {
      errors.push(`${name}: styles must be Astro-scoped SCSS`);
    }
  }
  return errors;
}

export async function checkStyleArchitecture() {
  const directory = join(root, 'src', 'styles');
  const styles = Object.fromEntries(await Promise.all((await readdir(directory))
    .filter((file) => /\.(?:s?css)$/.test(file))
    .map(async (file) => [file, await readFile(join(directory, file), 'utf8')])));
  const components = Object.fromEntries(await Promise.all(scopedComponents.map(async (name) =>
    [name, await readFile(join(root, 'src', 'components', name), 'utf8')])));
  return auditStyles({
    styles,
    globalCss: styles['global.scss'] ?? '',
    foundation: styles['_foundation.scss'] ?? '',
    tokens: styles['_tokens.scss'] ?? '',
    reset: styles['_reset.scss'] ?? '',
    config: await readFile(join(root, 'astro.config.mjs'), 'utf8'),
    layout: await readFile(join(root, 'src', 'layouts', 'BaseLayout.astro'), 'utf8'),
    components,
    manifest: JSON.parse(await readFile(join(root, 'package.json'), 'utf8')),
    lockfile: await readFile(join(root, 'pnpm-lock.yaml'), 'utf8'),
    workspace: await readFile(join(root, 'pnpm-workspace.yaml'), 'utf8'),
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = await checkStyleArchitecture();
  if (errors.length) {
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log('Style architecture: Astro + SCSS; footer scoped; @parcel/watcher build explicitly approved.');
  }
}
