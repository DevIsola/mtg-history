import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Editorial regression for the 2026 depth expansion. The existing chapter
// metadata, links and references are validated by the established gates.
const plan = {
  "thran": [
    "How a physician became a political authority",
    "A civil war with more than two sides",
    "Why the two powerstone halves mattered later",
    "Reading Thran history backward without distorting it"
  ],
  "brothers-war": [
    "A childhood dispute becomes an imperial problem",
    "Why Argive and the Fallaji fought for different kinds of power",
    "The Third Path and the possibility of another response",
    "Survivors, historians, and the missing perspectives"
  ],
  "ice-age": [
    "The Dark was also an argument about memory",
    "Sarpadia did not wait for Dominaria to thaw",
    "Lim-Dûl's threat depended on other people's uncertainty",
    "Why the Ice Age has more than one beginning and ending"
  ],
  "many-worlds": [
    "What it meant to live without a guild",
    "The political aftermath of a magical contract",
    "Hedrons, ruins, and the danger of mistaking a prison for a treasure",
    "Innistrad's church defended more than a doctrine",
    "Three histories that should not be forced into one chronology"
  ],
  "weatherlight": [
    "The Legacy was a network of relationships, not merely equipment",
    "Rath's inhabitants were not props in the rescue mission",
    "The difference between a secret plan and a public war",
    "What the final victory could not restore"
  ],
  "otaria": [
    "Why the Mirari could destabilize a whole continent",
    "Chainer and Kamahl chose different forms of belonging",
    "Jeska's wound binds private tragedy to public history",
    "Why Karona's birth was not a continent's solution"
  ],
  "mending": [
    "A temporal rift was a scar, not a doorway for adventure",
    "Venser's engineering was not a replacement for every lost power",
    "Alternate histories tested the meaning of responsibility",
    "The Mending changed the rules, but not the duty to remember"
  ],
  "war-of-the-spark": [
    "Bolas turned earlier adventures into parts of one machine",
    "A plane-wide trap is also a crisis for its residents",
    "Liliana's bargain became a question of who could refuse",
    "The end of Bolas's plan was not the end of Ravnica's crisis"
  ],
  "march-of-the-machine": [
    "The praetors disagreed about what perfection meant",
    "A failed mission can change the shape of a later victory",
    "Local resistance could not wait for a central command",
    "The ending of Norn's rule left a different Multiverse"
  ],
  "omenpaths": [
    "The opening of a road does not settle who owns its destination",
    "Kellan's search crosses systems of authority, not just scenery",
    "Investigating a city requires learning its institutions",
    "Thunder Junction reveals the opportunity and danger of convergence"
  ]
};

test('every historical era has substantial, uniquely titled added context', () => {
  assert.equal(Object.keys(plan).length, 10);
  for (const [chapter, entries] of Object.entries(plan)) {
    const source = readFileSync(new URL(`../src/content/chapters/${chapter}.mdx`, import.meta.url), 'utf8');
    assert.ok(entries.length >= 4, `${chapter}: expected four expanded topics`);
    for (const heading of entries) {
      const marker = `### ${heading}`;
      assert.equal(source.split(marker).length - 1, 1, `${chapter}: missing or duplicate '${heading}'`);
      const section = source.split(marker)[1].split(/\n##[# ]/)[0];
      assert.ok(section.trim().split(/\s+/).length >= 170, `${chapter}: new section too thin: ${heading}`);
    }
  }
});
