import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';

const read = p =>
  readFileSync(new URL('../' + p, import.meta.url), 'utf8')
    .replace(/\r\n?/g, '\n');

const chapter = read('src/content/chapters/many-worlds.mdx');
const notes = read('docs/innistrad-historical-depth-wave2ab.md');

const begin = '## IX. Innistrad: Humanity in the Shadow of Monsters';
const finish = '## XII. Three Planes, Three Forms of Power';

const sectionTitles = ["A protector created to preserve a precarious balance","Thraben, the Blessed Sleep, and the geography of protection","The Skirsdag operated within the city it endangered","The Helvault was made of the moon, not improvised for Griselbrand","The cursemute changed some lives without erasing every curse"];
const sources = ["A Planeswalker's Guide to Innistrad: Introduction","A Planeswalker's Guide to Innistrad: Gavony and Humans","From The Vault: Lore","I Am Avacyn"];
const sourceBlock = "  - title: \"A Planeswalker's Guide to Innistrad: Introduction\"\n    kind: official\n    url: \"https://magic.wizards.com/en/news/feature/planeswalkers-guide-innistrad-introduction-2011-08-24\"\n  - title: \"A Planeswalker's Guide to Innistrad: Gavony and Humans\"\n    kind: official\n    url: \"https://magic.wizards.com/en/news/feature/planeswalkers-guide-innistrad-gavony-and-humans-2011-09-28\"\n  - title: \"From The Vault: Lore\"\n    kind: official\n    url: \"https://magic.wizards.com/en/news/feature/vault-lore-2016-08-01\"\n  - title: \"I Am Avacyn\"\n    kind: official\n    url: \"https://magic.wizards.com/en/news/magic-story/i-am-avacyn-2016-05-18\"\n";

const digest = s =>
  createHash('sha256').update(s).digest('hex');

test('five new sections are unique, ordered, and confined to Innistrad', () => {
  const positions = sectionTitles.map(title => {
    const heading = '### ' + title;
    assert.equal(chapter.split(heading).length - 1, 1, title);
    return chapter.indexOf(heading);
  });

  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.ok(positions[0] > chapter.indexOf(begin));
  assert.ok(positions.at(-1) < chapter.indexOf(finish));
});

test('Sorin motive and church infrastructure are not flattened into a single claim', () => {
  assert.match(chapter, /Sorin's \*\*motive\*\*, Avacyn's \*\*mission\*\*/);
  assert.match(chapter, /Flight of Alabaster guarded the \*\*Blessed Sleep\*\*/);
  assert.match(chapter, /Flight of Goldnight/);
  assert.match(chapter, /could consequently underestimate the dangers/);
});

test('Skirsdag and Helvault construction are separately attributed', () => {
  assert.match(chapter, /Skirsdag\*\* as a secret demon-worshipping cult/);
  assert.match(chapter, /not the same mission/);
  assert.match(chapter, /sliver of Innistrad's \*\*silver moon\*\*/);
  assert.match(chapter, /three different stages/);
});

test('Thalia coercion and cursemute have qualified consequences', () => {
  assert.match(chapter, /Liliana's coercion of Thalia/);
  assert.match(chapter, /werewolves who pledged to guard humanity could become \*\*wolfir\*\*/);
  assert.match(chapter, /did not cure Garruk/);
  assert.match(chapter, /2016\), not to the original 2012 restoration/);
  assert.match(notes, /No new events, artwork moments, or printing IDs/);
});

test('Ravnica and Zendikar content and later conclusion remain intact', () => {
  const prefix = chapter.slice(0, chapter.indexOf(begin))
    .replace(sourceBlock, '');

  const suffix = chapter.slice(chapter.indexOf(finish));

  assert.equal(digest(prefix), "b7265f98e63cc62300b59f7872091d7c660b68f3127dac45b7fed9fef25c6526");
  assert.equal(digest(suffix), "9bf7bd07d05aec6d0a4f13013dca62a9639ffe5104f40854b5e0b4a0a9728805");
});

test('card printings, events, scenes, and bibliography are exactly preserved or extended', () => {
  const ids = [...chapter.matchAll(
    /^  - ([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/gm
  )].map(m => m[1]);

  const events = [...chapter.matchAll(
    /<HistoricalEventReference id="([^"]+)"/g
  )].map(m => m[1]);

  assert.deepEqual(ids, ["2882793e-5d7d-47f0-9308-652a5e036c2c","e525be2e-26e6-4082-b713-ac74fcbd13d3","9eb856e6-8f63-4048-9818-cc3e65748855","45f43bd0-d4d9-4a64-a829-f1ea3dfc9e90","c3b21941-1b7d-4fde-8b1d-7edbd5e5b796","225e3cc6-34d0-4f81-9f49-162d97e2ea59","67600383-bbb8-411c-b8e6-2296650bc747","27bb371f-d49f-41bd-bbe0-d5e1e2067e36","16d2448c-1b2e-466a-a0ab-e20ba1de6bc9","ba149706-cd17-4da6-8403-ccfe2d6cb437","b51666ae-2aef-4cb1-9cd4-44aec81530f8"]);
  assert.deepEqual(events, ["ravnica-guildpact-collapse","ravnica-project-kraj","ravnica-nonmagical-guild-accord","zendikar-nahiri-chooses-prison","zendikar-hedrons","zendikar-eye-rupture","zendikar-eldrazi-awakening","innistrad-avacyn-created","innistrad-helvault-imprisonment","innistrad-thalia-breaks-helvault","innistrad-avacyn-restored"]);

  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) || []).length, 11);
  assert.equal((chapter.match(/^  - title:/gm) || []).length, 18);

  for (const title of sources) {
    assert.equal(chapter.split('  - title: "' + title + '"').length - 1, 1);
  }

  for (const title of [
    'Innistrad Plane Guide',
    "Planeswalker's Guide to Avacyn Restored, Part 2",
    'The Lunarch Inquisition'
  ]) {
    assert.equal(chapter.split('  - title: "' + title + '"').length - 1, 1);
  }
});
