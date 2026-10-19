import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadChapterProvenance } from './audit-external-provenance.mjs';
import { cardImageUrlForPrinting } from '../src/utils/card-images.mjs';

const ledgerPath = fileURLToPath(new URL('../docs/artwork-fidelity-ledger.tsv', import.meta.url));
const chapterDirectory = fileURLToPath(new URL('../src/content/chapters/', import.meta.url));
const header = ['chapter', 'card', 'visualRole', 'timeContext', 'basis', 'editorialInterpretation'];
const roles = new Set(['portrait', 'scene', 'object', 'symbol']);
const times = new Set(['contemporary', 'retrospective', 'reprint', 'foreshadowing', 'cross-era']);
const bases = new Set(['context-assessed', 'source-confirmed', 'visual-checked']);

/** This ledger records an editorial claim, not an independent visual certification. */
export function parseArtworkLedger(source) {
  const lines = source.replace(/\r\n/g, '\n').trimEnd().split('\n');
  const found = lines.shift()?.split('\t');
  if (!found || found.length !== header.length || found.some((value, i) => value !== header[i])) {
    throw new Error(`Artwork ledger header must be: ${header.join('\\t')}`);
  }
  return lines.filter((line) => line.trim()).map((line, index) => {
    const cells = line.split('\t');
    if (cells.length !== header.length) throw new Error(`Artwork ledger row ${index + 2} must have ${header.length} tab-separated fields`);
    return Object.fromEntries(header.map((field, i) => [field, cells[i]]));
  });
}

export function validateArtworkLedger(chapters, entries) {
  const errors = [];
  const expected = new Map();
  for (const chapter of chapters) {
    for (const card of chapter.cards) {
      const key = `${chapter.id}\0${card.name}`;
      if (expected.has(key)) errors.push(`Repeated source card: ${chapter.id} / ${card.name}`);
      expected.set(key, { chapter: chapter.id, card });
    }
  }
  const seen = new Set();
  for (const entry of entries) {
    const key = `${entry.chapter}\0${entry.card}`;
    const label = `${entry.chapter} / ${entry.card}`;
    if (seen.has(key)) errors.push(`Duplicate artwork review: ${label}`);
    seen.add(key);
    if (!expected.has(key)) errors.push(`Orphan artwork review (no matching chapter card): ${label}`);
    if (!roles.has(entry.visualRole)) errors.push(`Invalid visualRole for ${label}: ${entry.visualRole}`);
    if (!times.has(entry.timeContext)) errors.push(`Invalid timeContext for ${label}: ${entry.timeContext}`);
    if (!bases.has(entry.basis)) errors.push(`Invalid evidence basis for ${label}: ${entry.basis}`);
    if (!entry.editorialInterpretation?.trim() || entry.editorialInterpretation.trim().length < 18) {
      errors.push(`Missing substantive editorial interpretation for ${label}`);
    }
  }
  for (const key of expected.keys()) {
    if (!seen.has(key)) errors.push(`Missing artwork review: ${key.replace('\0', ' / ')}`);
  }
  return errors;
}

/** Expand folded YAML significance prose omitted by the lightweight metadata parser. */
export function extractCardSignificance(source, canonicalNames = null) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const cards = frontmatter.match(/^cards:\r?\n([\s\S]*?)(?=^[A-Za-z][\w-]*:|$(?![\s\S]))/m)?.[1] ?? '';
  const result = new Map();
  let name = null;
  let folded = false;
  let index = 0;
  for (const line of cards.split(/\r?\n/)) {
    if (/^  - significance:\s*>-\s*$/.test(line)) {
      name = canonicalNames?.[index++] ?? null;
      folded = Boolean(name);
      if (folded) result.set(name, '');
      continue;
    }
    const card = line.match(/^  - name:\s*(?:"([^"]+)"|'([^']+)')/);
    if (card) { name = card[1] ?? card[2]; folded = false; continue; }
    if (/^    significance:\s*>-\s*$/.test(line)) {
      folded = Boolean(name);
      if (folded) result.set(name, '');
      continue;
    }
    if (folded && /^      \S/.test(line)) {
      result.set(name, [result.get(name), line.trim()].filter(Boolean).join(' '));
      continue;
    }
    if (folded && line.trim() && !line.startsWith('      ')) folded = false;
  }
  return result;
}

const htmlEscape = (value) => String(value).replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[ch]);

/** A local, read-only visual queue. Images are loaded from Scryfall only when opened. */
export function makeArtworkGallery(chapters, entries) {
  const byKey = new Map(entries.map((r) => [`${r.chapter}\0${r.card}`, r]));
  const boxes = chapters.flatMap((chapter) => chapter.cards.map((card) => {
    const row = byKey.get(`${chapter.id}\0${card.name}`);
    if (!row) throw new Error(`Missing reviewed card: ${chapter.id} / ${card.name}`);
    const id = card.scryfallId.toLowerCase();
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id)) throw new Error(`Invalid Scryfall ID: ${id}`);
    const img = cardImageUrlForPrinting(id);
    const dest = `https://scryfall.com/card/${encodeURIComponent(card.setCode)}/${encodeURIComponent(card.collectorNumber)}`;
    const context = `${chapter.id} ${card.name} ${row.visualRole} ${row.timeContext} ${row.editorialInterpretation}`.toLowerCase();
    return `<article class="item" data-search="${htmlEscape(context)}"><a href="${htmlEscape(dest)}" target="_blank" rel="noopener noreferrer"><img loading="lazy" src="${htmlEscape(img)}" alt="${htmlEscape(card.name)}: exact Scryfall printing"/></a><div class="meta"><p class="chapter">${htmlEscape(chapter.id)} · ${htmlEscape(card.setCode.toUpperCase())} #${htmlEscape(card.collectorNumber)}</p><h2>${htmlEscape(card.name)}</h2><p><strong>${htmlEscape(row.visualRole)}</strong> · ${htmlEscape(row.timeContext)} · ${htmlEscape(row.basis)}</p><p>${htmlEscape(row.editorialInterpretation)}</p><details><summary>Chapter's existing significance</summary><p>${htmlEscape(card.significance ?? 'See chapter frontmatter for full significance.')}</p></details></div></article>`;
  })).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MTG artwork fidelity | 135-card review</title><style>body{font:16px/1.5 system-ui,sans-serif;background:#f2f3ef;color:#152528;margin:0;padding:2rem}header{max-width:1100px;margin:auto auto 2rem}h1{font-size:2rem}p{margin:.5rem 0 1rem}input{padding:.7rem;font:inherit;width:100%;box-sizing:border-box;border:1px solid #617470;border-radius:5px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:1.4rem;max-width:1300px;margin:auto}.item{background:white;border:1px solid #d0d8d3;border-radius:8px;overflow:hidden}.item img{width:100%;height:360px;object-fit:contain;background:#1a2224}.meta{padding:1rem}.chapter{color:#52746d;font-size:.85rem}h2{font-size:1.1rem}summary{cursor:pointer}article[hidden]{display:none}</style></head><body><header><h1>Card artwork-to-event review</h1><p>Every curated chapter card appears here, linked to its exact printing. Compare its visible artwork and card text against the editorial interpretation. Classifications are contextual assessments, <strong>not certification of every image pixel</strong>. Image delivery requires internet access to Scryfall; no images are stored or redistributed.</p><label for="q">Search by card, chapter, category, or note</label><input id="q" type="search" placeholder="e.g. symbolic, thran, Bolas"><p id="count" aria-live="polite"></p></header><main class="grid">${boxes}</main><script>const q=document.getElementById('q'),cards=[...document.querySelectorAll('.item')],count=document.getElementById('count');function filter(){let shown=0;for(const card of cards){card.hidden=!card.dataset.search.includes(q.value.trim().toLowerCase());if(!card.hidden)shown++}count.textContent=shown+' of '+cards.length+' cards'}q.addEventListener('input',filter);filter();</script></body></html>`;
}

export async function checkArtwork({ chapters = null, ledgerSource = null } = {}) {
  const list = chapters ?? await loadChapterProvenance();
  // The shared editorial parser intentionally reads scalar YAML only. Restore
  // real folded significance paragraphs for the visual gallery, without
  // changing the CI-facing print identity validation.
  if (!chapters) {
    for (const chapter of list) {
      const content = await readFile(join(chapterDirectory, `${chapter.id}.mdx`), 'utf8');
      const significance = extractCardSignificance(content, chapter.cards.map((card) => card.name));
      for (const card of chapter.cards) {
        if (significance.has(card.name)) card.significance = significance.get(card.name);
      }
    }
  }
  const source = ledgerSource ?? await readFile(ledgerPath, 'utf8');
  const rows = parseArtworkLedger(source);
  const errors = validateArtworkLedger(list, rows);
  return { chapters: list, rows, errors, counts: {
    references: list.reduce((sum, chapter) => sum + chapter.cards.length, 0),
    reviewed: rows.length,
    roles: Object.fromEntries([...roles].map((role) => [role, rows.filter((r) => r.visualRole === role).length])),
    evidence: Object.fromEntries([...bases].map((basis) => [basis, rows.filter((r) => r.basis === basis).length])),
  } };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--gallery' || !args[1])) {
      throw new Error('Usage: node scripts/check-artwork-fidelity.mjs [--gallery OUTPUT.html]');
    }
    const { chapters, rows, errors, counts } = await checkArtwork();
    console.log(`Artwork ledger: ${counts.reviewed}/${counts.references} chapter card references; roles ${JSON.stringify(counts.roles)}; evidence ${JSON.stringify(counts.evidence)}.`);
    if (errors.length) { for (const error of errors) console.error(`- ${error}`); process.exitCode = 1; }
    else {
      console.log('Artwork ledger coverage and classification integrity passed. Image-level verification remains a manual review.');
      if (args.length) {
        await writeFile(args[1], makeArtworkGallery(chapters, rows), 'utf8');
        console.log(`Local review gallery written to ${args[1]}`);
      }
    }
  } catch (error) { console.error(error); process.exitCode = 1; }
}
