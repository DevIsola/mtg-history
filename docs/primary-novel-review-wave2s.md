# Wave 2S — Time Spiral primary-novel verification worksheet

## Result of source research

The two outstanding Time Spiral questions remain **open**. Official public character material confirms that Venser became a planeswalker and that Freyalise sacrificed herself, but does not independently establish the exact divergent-world first planeswalk or named Skyshroud rift. See the already-cited official biography entries in `src/data/event-provenance.mjs`.

Secondary research leads (not chapter source citations, not novel verification):

- [MTG Wiki — Venser](https://mtg.fandom.com/wiki/Venser) summarizes an alternate-history expedition and suggests that Teferi and Jhoira helped Venser complete a first planeswalk. It is not the original fictional passage.
- [MTG Wiki — Planar Chaos (novel)](https://mtg.fandom.com/wiki/Planar_Chaos_(novel)) summarizes Freyalise using her remaining mana to seal the Skyshroud rift, and raises the question of what happened to the forest itself. It is not the original fictional passage.
- [MTG Wiki — Rifts](https://mtg.fandom.com/wiki/Rifts) characterizes the Skyshroud rift and destruction of the forest. Do not silently incorporate its more detailed claims into the website without reviewing the original work.

The original novels **Time Spiral** (2006) and **Planar Chaos** (2007) are already listed as books in the Mending chapter bibliography. A bibliography entry does not prove a precise narrative passage. A formerly advertised Wizards download sample could not be opened for verification. Do not cite inaccessible novel text or assign invented page numbers.

## Local Mac review workflow

```sh
pnpm run review:novel-evidence --output "$HOME/Downloads/mtg-time-spiral-novel-review.md"
open "$HOME/Downloads/mtg-time-spiral-novel-review.md"
```

This generates a **blank evidence worksheet** with two active claim questions, candidate books, source limits and explicit fields for edition, chapter/page, the reviewer's own short synopsis, verdict and content changes. It makes **no network calls**, redistributes **no copyrighted book text**, and changes **no reviewed status** or existing content. Only an explicit output path is accepted.

## Primary reading acceptance criteria

### Venser — `mending-venser-first-walk`

- Locate the divergent-history visit and return in **Time Spiral**; check **Planar Chaos** if the scene spans the volume boundary. Avoid assuming that the ambulator's ordinary teleportation is a planeswalk.
- Verify which characters accompany and assist Venser, the place/time at which his spark is used and whether the narrated scene is explicitly his first planeswalk.
- Record edition and page/digital location. The public Venser biography and *A Double Take, Part 1* remain separate contextual sources.

### Freyalise — `freyalise-seals-skyshroud`

- Read Freyalise's final scenes in **Planar Chaos** and establish whether the rift's precise geographical identification is Skyshroud/Keld.
- Differentiate protecting her people, repairing the rift, and the forest's fate. Do not suggest the entire forest survives if primary fiction states otherwise.
- Record edition and page/digital location. The short official Freyalise biography supports her sacrifice, but not these particulars.

## Integrity and future editorial changes

```sh
node --test scripts/primary-novel-review-wave2s.test.mjs
pnpm run check:provenance
pnpm run audit:source-gaps
pnpm run verify && pnpm exec playwright test
```

Expected: **43/133** reviewed event records, **three** unresolved primary-fiction questions in total (Venser, Freyalise, Gideon), and **two** novel-specific review packets. The new packet is a manual research workflow, **not** a completed canon review. A subsequent editorial PR may remove a question only with a traceable primary reference and any necessary corrections to the event prose and artwork context.
