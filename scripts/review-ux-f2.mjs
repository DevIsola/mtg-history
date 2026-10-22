#!/usr/bin/env node
/**
 * Record repeatable, human-reviewable screenshots of the *production preview*.
 * No baseline screenshots are auto-approved and no remote image is treated as
 * proof of an editorial historical claim.
 *
 * pnpm run build
 * pnpm exec astro preview --host 127.0.0.1 --port 4322
 * node scripts/review-ux-f2.mjs --out "$HOME/Downloads/mtg-f2-review" [--full]
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  REVIEW_ROUTES, REVIEW_WIDTHS, EXTENDED_WIDTHS, THEME_MODES,
} from '../src/utils/ux-f2-audit.mjs';

const html = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export function parseOptions(args) {
  const options = { out: '', base: 'http://127.0.0.1:4322/mtg-history/', full: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--full') options.full = true;
    else if ((args[i] === '--out' || args[i] === '--base') && args[i + 1]) options[args[i++].slice(2)] = args[i];
    else throw new Error(`Unknown or incomplete argument ${args[i]}. Usage: --out DIRECTORY [--base URL] [--full]`);
  }
  if (!options.out) throw new Error('Specify --out DIRECTORY (preferably outside the repository).');
  const target = new URL(options.base);
  if (!['127.0.0.1', 'localhost'].includes(target.hostname)) {
    throw new Error('F2 reviewer only connects to a locally running Astro preview.');
  }
  if (!target.pathname.endsWith('/mtg-history/')) {
    throw new Error('Base URL must end with /mtg-history/.');
  }
  return options;
}

function gallery(entries, base, scope) {
  const failures = entries.filter(entry => entry.issues.length).length;
  const cards = entries.map(entry => {
    const description = `${entry.id}, ${entry.theme}, ${entry.width}px`;
    const notes = entry.issues.length ? entry.issues.join('; ') : 'No automated structural warning';
    return `<article class="shot ${entry.issues.length ? 'flag' : ''}">
      <h2>${html(description)}</h2>
      <p><a href="${html(entry.routeUrl)}">Open route ↗</a> · ${html(notes)}</p>
      ${entry.image ? `<a href="${html(entry.image)}"><img src="${html(entry.image)}" loading="lazy" alt="Screenshot: ${html(description)}"></a>` : ''}
      <p>HTTP ${html(entry.status ?? '—')} · ${html(entry.documentTitle ?? '(no title)')} · document width ${html(entry.documentWidth ?? '—')}px</p>
    </article>`;
  }).join('\n');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MTG F2 — visual acceptance gallery</title>
<style>
:root{color-scheme:light;background:#f4efe5;color:#172227;font:16px/1.5 system-ui,sans-serif}
*{box-sizing:border-box}body{max-width:1500px;margin:0 auto;padding:clamp(1rem,3vw,2.5rem)}
h1{font:normal clamp(1.8rem,4vw,3rem) Georgia,serif}p{max-width:76ch}a{color:#65451f}
.summary{padding:1rem;border:1px solid #b89150;background:#faf7f0}
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:1rem;margin-top:2rem}
.shot{padding:1rem;background:#faf7f0;border:1px solid #b9afa0;min-width:0}.shot.flag{border:3px solid #a4223c}
.shot h2{margin:0;font-size:1rem}.shot p{font-size:.8rem;overflow-wrap:anywhere}
.shot img{display:block;width:100%;height:280px;object-fit:contain;object-position:top center;background:#e9e0d0;border:1px solid #ccc}
.shot a:focus-visible{outline:3px solid #995000;outline-offset:2px}
</style><body>
<h1>F2 · visual acceptance gallery</h1>
<div class="summary"><p>${entries.length} route × theme × width captures · ${failures} records with structural warnings.<br>
Source: ${html(base)} · Widths: ${html(scope)}.</p>
<p><strong>Manual review is required.</strong> Compare light/dark, typography, image credits, layout at page bottom, focus states, native menus, and editorial art classification. A screenshot is not an accessibility certification. The images show only the first viewport, not every part of the page.</p>
<p>Inspect <a href="report.json">report.json</a> for machine-readable overflow, missing-alt and route checks.</p></div>
<div class="gallery">${cards}</div></body></html>`;
}

export async function run(options) {
  const out = resolve(options.out);
  const images = join(out, 'captures');
  await mkdir(images, { recursive: true });
  const widths = options.full ? { ...EXTENDED_WIDTHS, ...REVIEW_WIDTHS } : REVIEW_WIDTHS;
  const entries = [];
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [size, width] of Object.entries(widths)) {
      for (const theme of THEME_MODES) {
        const context = await browser.newContext({ viewport: { width, height: 850 }, deviceScaleFactor: 1 });
        try {
          await context.addInitScript(value => {
            try { localStorage.setItem('mtg-history-theme', value); } catch { /* blocked localStorage */ }
          }, theme);
          const page = await context.newPage();
          await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
          for (const target of REVIEW_ROUTES) {
            const routeUrl = new URL(target.route, options.base).href;
            const image = `captures/${target.id}-${size}-${theme}.png`;
            const entry = { id: target.id, route: target.route, routeUrl, size, theme, width, image: null, status: null, documentTitle: '', documentWidth: null, issues: [] };
            try {
              const response = await page.goto(routeUrl, { waitUntil: 'domcontentloaded', timeout: 25_000 });
              entry.status = response?.status() ?? null;
              if (!response?.ok()) entry.issues.push(`HTTP ${response?.status() ?? 'no response'}`);
              await page.locator('main h1').first().waitFor({ state: 'visible', timeout: 6_000 });
              await page.evaluate(() => document.fonts.ready);
              const facts = await page.evaluate(() => ({
                title: document.title,
                width: document.documentElement.scrollWidth,
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                language: document.documentElement.lang,
                missingAlt: document.querySelectorAll('main img:not([alt])').length,
                theme: document.documentElement.dataset.theme,
              }));
              entry.documentTitle = facts.title;
              entry.documentWidth = facts.width;
              if (facts.overflow > 1) entry.issues.push(`horizontal overflow: ${facts.overflow}px`);
              if (facts.missingAlt) entry.issues.push(`${facts.missingAlt} images without alt`);
              if (facts.language !== target.locale) entry.issues.push(`incorrect page language: ${facts.language}`);
              if (facts.theme !== theme) entry.issues.push(`unexpected theme: ${facts.theme}`);
              if (target.route === 'relationships/') {
                await page.waitForFunction(() =>
                  ['ready', 'error'].includes(document.querySelector('[data-relationship-explorer]')?.dataset.graphState),
                null, { timeout: 7000 }).catch(() => {});
              }
              await page.screenshot({ path: join(out, image), fullPage: false, animations: 'disabled', caret: 'hide' });
              entry.image = image;
            } catch (error) {
              entry.issues.push(error instanceof Error ? error.message : String(error));
            }
            entries.push(entry);
            console.log(`[F2] ${String(entries.length).padStart(3)} ${entry.id} · ${size} ${theme} · ${entry.issues.length ? 'REVIEW: ' + entry.issues.join('; ') : 'OK'}`);
          }
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
    await writeFile(join(out, 'report.json'), JSON.stringify({
      generatedAt: new Date().toISOString(), base: options.base,
      captures: entries, flagged: entries.filter(e => e.issues.length).length,
    }, null, 2) + '\n');
    await writeFile(join(out, 'index.html'), gallery(entries, options.base, Object.keys(widths).join(', ')));
  }
  console.log(`F2 gallery: ${join(out, 'index.html')}`);
  const failures = entries.filter(entry => entry.issues.length);
  if (failures.length) {
    console.error(`F2 structural review: ${failures.length} captures need attention; see report.json.`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await run(parseOptions(process.argv.slice(2))); }
  catch (error) { console.error(error); process.exitCode = 1; }
}
