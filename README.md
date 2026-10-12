<p align="center">
  <img src="docs/assets/archive-cover.svg" alt="Chronicles of the Multiverse — an illustrated historical archive with an ancient golden portal over the worlds of Magic" width="100%" />
</p>

<p align="center">
  <strong>History before everything.</strong><br />
  Follow the wars, discoveries, characters, and turning points that shaped the Multiverse — through the cards that remember them.
</p>

<p align="center">
  <a href="https://devisola.github.io/mtg-history/"><strong>Enter the archive</strong></a>
  &nbsp;·&nbsp;
  <a href="https://devisola.github.io/mtg-history/timeline/">Explore the timeline</a>
  &nbsp;·&nbsp;
  <a href="https://devisola.github.io/mtg-history/about/">About the project</a>
</p>

---

## The archive

**Chronicles of the Multiverse** is an independent, non-commercial historical reading project about the lore of *Magic: The Gathering*. It's designed as an illustrated chronicle, **not a card database or deckbuilding guide**.

Magic's history has been told across decades of expansions, novels, short fiction, and flavor text. This project connects those scattered sources into readable chapters, with selected cards acting as **historical artifacts**: illustrations and references that bring each event into focus.

<p align="center">
  <img src="docs/assets/historical-eras.svg" alt="Three illustrated eras: Ancient Dominaria, the Brothers' War, and the changing Multiverse" width="100%" />
</p>

## Explore the history

| Follow the story | Discover its sources |
| :--- | :--- |
| **[Historical timeline](https://devisola.github.io/mtg-history/timeline/)** — Explore the major eras in a guided narrative order. | **Expansions** — Connect fictional events to the sets that introduced or revisited them. *Planned archive section.* |
| **[Illustrated chapters](https://devisola.github.io/mtg-history/chapters/brothers-war/)** — Read the stories behind the events, with selected cards beside the prose. | **Cards as artifacts** — Examine why a particular printing, image, or flavor reference matters to the history. |

### Two chronologies, one story

> **Story chronology** tracks when an event took place *inside* the fictional Multiverse. **Publication chronology** tracks when Magic players first encountered, or later revisited, that event.

The Brothers' War, for example, appeared through the artifacts of *Antiquities* (1994), was developed extensively in fiction, and returned in *The Brothers' War* (2022). Our chapters connect those perspectives without confusing release dates with in-world history.

## How a chapter is built

Each article aims to provide:

1. **Historical context** — what led to the event and why it matters.
2. **The narrative** — key people, places, conflicts, and consequences.
3. **Illustrated evidence** — a small, carefully chosen selection of relevant cards.
4. **Publication history** — expansions and stories that reveal or revisit the event.
5. **Sources and connections** — references, uncertainties, and links to related chapters.

The writing is original. Official lore is prioritized, and retcons or uncertain chronology are identified rather than quietly presented as settled fact.

## Behind the archive

| | |
| :--- | :--- |
| **Framework** | [Astro](https://astro.build/) + TypeScript |
| **Styling** | Tailwind CSS |
| **Content** | Markdown / MDX + Astro Content Collections |
| **Package manager** | pnpm |
| **Hosting** | GitHub Pages |
| **Deployment** | GitHub Actions |

This is a statically generated site: no accounts, database, or application server are required.

### Run locally

Requires **Node.js 22.12+**, **pnpm**, and Git.

```bash
git clone https://github.com/DevIsola/mtg-history.git
cd mtg-history
pnpm install
pnpm dev
```

With Astro's configured base path, open `http://localhost:4321/mtg-history/`.

```bash
pnpm build      # Create the static production site
pnpm preview    # Preview the production build
```

Pushing a reviewed change to `main` triggers the existing GitHub Pages deployment workflow.

## Current chapter of the project

**Under active development.** The timeline and chapter system establish the reading experience; historical articles, imagery, source references, and cross-links are being expanded incrementally.

The first reference chapter is **[The Brothers' War](https://devisola.github.io/mtg-history/chapters/brothers-war/)**, a conflict portrayed in releases separated by decades. Future chapters will reach back to the Thran and forward through Dominaria's later history and other planes.

## Curated by DevIsola

Created and maintained by **[DevIsola](https://github.com/DevIsola)** as an independent, open-source tribute to the storytelling of Magic: The Gathering.

[Visit the live archive](https://devisola.github.io/mtg-history/) · [Explore the source](https://github.com/DevIsola/mtg-history)

---

<sub>**Unofficial fan-content notice.** This project is not affiliated with, sponsored, endorsed, or approved by Wizards of the Coast. Magic: The Gathering, its characters, settings, card art, and associated marks belong to their respective rights holders. This non-commercial archive uses original writing and original decorative README artwork. See the <a href="https://company.wizards.com/en/legal/fancontentpolicy">Wizards of the Coast Fan Content Policy</a>.</sub>
