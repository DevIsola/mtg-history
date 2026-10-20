import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { eventProvenance, validateEventProvenance } from '../src/data/event-provenance.mjs';
import { parseChapterEditorial } from './check-editorial-metadata.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const reviewedInWave = {
  "rise-of-yawgmoth": {
    "chapter": "thran",
    "source": "The Legendary Characters of Commander Legends, Part 1"
  },
  "brothers-koilos-stones": {
    "chapter": "brothers-war",
    "source": "Act of War, Part 1"
  },
  "sylex-blast": {
    "chapter": "brothers-war",
    "source": "The Brothers' War — Episode 1: The End"
  },
  "alliance-against-lim-dul": {
    "chapter": "ice-age",
    "source": "The Legends You'll Find in Dominaria United"
  },
  "weatherlight-barrin-obliteration": {
    "chapter": "weatherlight",
    "source": "From the Vault: Lore"
  },
  "mirari-crisis": {
    "chapter": "otaria",
    "source": "From the Vault: Lore"
  },
  "the-mending": {
    "chapter": "mending",
    "source": "27 Things You Might Not Have Known About Time Spiral Block"
  },
  "innistrad-avacyn-restored": {
    "chapter": "many-worlds",
    "source": "You Had Me at Helvault"
  },
  "spark-gideons-sacrifice": {
    "chapter": "war-of-the-spark",
    "source": "War of the Spark: Ravnica — Ashes"
  },
  "phyrexia-realmbreaker-invasion": {
    "chapter": "march-of-the-machine",
    "source": "March of the Machine — Episode 1: Triumph of the Fleshless"
  },
  "phyrexia-norns-fall": {
    "chapter": "march-of-the-machine",
    "source": "March of the Machine — Episode 9: The Old Sins of New Phyrexia"
  },
  "omenpaths-proft-uncovers-oba": {
    "chapter": "omenpaths",
    "source": "Murders at Karlov Manor — Episode 9: Beauty in Destruction"
  }
};
const originalIds = [
  'thran-glacian-stones-implanted', 'thran-stones-rediscovered',
  'zendikar-hedrons', 'ravnica-guildpact-collapse',
  'phyrexia-zhalfir-return', 'omenpaths-sparks-and-roads',
];

test('the second provenance batch reviews twelve actual events while retaining the first six', () => {
  assert.equal(Object.keys(reviewedInWave).length, 12);
  assert.equal(Object.keys(eventProvenance).length, 18);
  for (const id of originalIds) assert.ok(eventProvenance[id], `${id}: original review missing`);
  for (const [id, expected] of Object.entries(reviewedInWave)) {
    const event = json(`src/content/events/${id}.json`);
    assert.equal(event.chapterId, expected.chapter, id);
    const entry = eventProvenance[id];
    assert.ok(entry, `${id}: review missing`);
    assert.equal(entry.sources.length, 1, id);
    assert.equal(entry.sources[0].title, expected.source, id);
    assert.ok(entry.sources[0].supports.length >= 35, id);
    assert.ok(entry.artworkNote.length >= 35, id);
    assert.ok(['undated', 'relative'].includes(entry.chronology.precision), id);
  }
});

test('each new official citation occurs in its actual chapter bibliography', () => {
  for (const [id, expected] of Object.entries(reviewedInWave)) {
    const chapter = parseChapterEditorial(read(`src/content/chapters/${expected.chapter}.mdx`), expected.chapter);
    for (const source of eventProvenance[id].sources) {
      assert.ok(chapter.sources.some((citation) => citation.kind === 'official' && citation.title === source.title && citation.url === source.url),
        `${id}: official bibliography mismatch for ${source.title}`);
    }
  }
});

test('all eighteen records pass the production provenance validator', () => {
  const chapters = readdirSync(new URL('../src/content/chapters/', import.meta.url)).filter((name) => name.endsWith('.mdx'));
  const sourcesByChapter = new Map(chapters.map((name) => [name.slice(0, -4),
    parseChapterEditorial(read(`src/content/chapters/${name}`), name.slice(0, -4)).sources]));
  const events = readdirSync(new URL('../src/content/events/', import.meta.url)).filter((name) => name.endsWith('.json'))
    .map((name) => ({ id: name.slice(0, -5), ...json(`src/content/events/${name}`) }));
  assert.equal(events.length, 133);
  assert.deepEqual(validateEventProvenance(eventProvenance, events, sourcesByChapter), []);
});

test('audit distinguishes narrow support from exact dating and preserves verification pipeline', () => {
  for (const id of Object.keys(reviewedInWave)) {
    assert.match(eventProvenance[id].chronology.basis, /year|date|timestamp|sequence|chronolog|without|not a|post-invasion|cross-planar|time|before|after|calendar/i);
  }
  const check = read('scripts/check-event-provenance.mjs');
  const manifest = json('package.json');
  assert.match(check, /Event provenance coverage:/);
  assert.equal(manifest.scripts['check:provenance'], 'node scripts/check-event-provenance.mjs');
  assert.match(manifest.scripts.verify, /check:editorial && pnpm run check:provenance && pnpm run check:artwork/);
});
