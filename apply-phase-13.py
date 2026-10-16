#!/usr/bin/env python3
"""Phase 13 — update the existing MTG History era and character registries.
Run from the repository root, on feat/mirari-otaria-chapter.
Only edits src/data/eras.ts and src/data/characters.ts.
Uses only Python's standard library. Changes are reversible with Git.
"""
from pathlib import Path
import re

root = Path.cwd()
eras_path = root / 'src/data/eras.ts'
characters_path = root / 'src/data/characters.ts'
chapter_path = root / 'src/content/chapters/otaria.mdx'

for path in (eras_path, characters_path, chapter_path):
    if not path.is_file():
        raise SystemExit(f'Missing required file: {path}\nRun from the repository root and copy otaria.mdx first.')

old_eras = eras_path.read_text(encoding='utf-8')
old_characters = characters_path.read_text(encoding='utf-8')

# Update only the Otaria era object, leaving all other eras untouched.
new_era = '''  {
    id: "otaria",
    chapter: "05",
    name: "The Mirari and Otaria",
    kicker: "Ambition, Redemption, and Rebirth",
    summary:
      "The Mirari draws Kamahl, Chainer, and rival Otarian powers into conflict; Jeska's transformation and the emergence of Karona reshape Dominaria.",
    sets: [
      "Odyssey · 2001",
      "Torment · 2002",
      "Judgment · 2002",
      "Onslaught · 2002",
      "Legions · 2003",
      "Scourge · 2003",
    ],
    status: "published",
  },'''

era_pattern = re.compile(r'(?m)^  \{\s*\n\s*id: ["\']otaria["\'],.*?^  \},', re.DOTALL)
if len(era_pattern.findall(old_eras)) != 1:
    raise SystemExit('Expected exactly one Otaria entry in src/data/eras.ts. No files changed.')
new_eras = era_pattern.sub(lambda _: new_era, old_eras)

# Add Karn's new historical connection, only inside the Karn profile.
karn_block = re.search(r'(?s)\{\s*id: ["\']karn["\'],.*?(?=\n  \},)', old_characters)
if not karn_block:
    raise SystemExit('Karn profile not found. No files changed.')
if '"otaria"' not in karn_block.group():
    old_segment = karn_block.group()
    updated_segment, count = re.subn(
        r'chapterIds:\s*\[\s*["\']weatherlight["\']\s*\]',
        'chapterIds: ["weatherlight", "otaria"]',
        old_segment,
    )
    if count != 1:
        raise SystemExit('Unexpected Karn chapterIds structure. No files changed.')
    new_characters = old_characters.replace(old_segment, updated_segment, 1)
else:
    new_characters = old_characters

new_entries = r'''

  // Chapter 05 — The Mirari and Otaria
  {
    id: "kamahl",
    name: "Kamahl",
    title: "From Pit Fighter to Druid",
    origin: "Dominaria — Otaria",
    role: "Pardic barbarian and Krosan druid",
    summary:
      "A celebrated warrior whose pursuit of the Mirari led to tragedy, remorse, and a new calling as a protector of Krosa.",
    biography: [
      "Kamahl began as a formidable Pardic barbarian and gladiator, drawn to Cabal City and the Mirari during the struggle for power on Otaria.",
      "The Mirari amplified his aggression. With the artifact bound to his sword, he seriously injured his sister Jeska, setting in motion her transformation into Phage.",
      "Kamahl sought a different life in the Krosan Forest, where Thriss the Nantuko taught him druidic ways. His transformation from pit fighter to protector would shape the Onslaught story and his efforts to save Jeska.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Kamahl, Fist of Krosa",
      setCode: "arc",
      collectorNumber: "61",
      scryfallId: "97ab4974-d0a4-4033-b150-8928b46dc626",
      artist: "Matthew D. Wilson",
      significance:
        "A reprint of Kamahl's green incarnation, originally introduced in Onslaught to reflect his turn from violent pit fighting toward druidic magic.",
    },
    source: {
      title: "Wizards of the Coast — Kamahl, Heart of Krosa",
      url: "https://magic.wizards.com/en/news/card-preview/kamahl-heart-krosa-2020-10-28",
    },
  },
  {
    id: "jeska",
    name: "Jeska",
    title: "The Thrice-Reborn Planeswalker",
    origin: "Dominaria — Otaria",
    role: "Pardic warrior, Phage, Karona, and planeswalker",
    summary:
      "Kamahl's sister survived a terrible wound and multiple transformations before becoming a planeswalker.",
    biography: [
      "Jeska was a Pardic warrior and the younger sister of Kamahl. Her life changed when he struck her with a sword influenced by the Mirari.",
      "The wound led to her transformation into Phage the Untouchable. A later confrontation combined Phage, Akroma, and Zagorka into Karona, the False God.",
      "After Karona was broken apart, Jeska's planeswalker spark ignited. Karn became her guide, and she would later return to Dominaria during the crisis of the temporal rifts.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Jeska, Warrior Adept",
      setCode: "jud",
      collectorNumber: "93",
      scryfallId: "1cf96a59-8b7d-4a5b-adfd-17eeedd95db5",
      artist: "rk post",
      significance:
        "Jeska's original legendary card shows the Pardic warrior before the identities of Phage, Karona, and planeswalker.",
    },
    source: {
      title: "Wizards of the Coast — Legendary Characters of Commander Legends, Part 1",
      url: "https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30",
    },
  },
  {
    id: "chainer",
    name: "Chainer",
    title: "Master of Dementia",
    origin: "Dominaria — Otaria",
    role: "Cabal dementia summoner",
    summary:
      "A gifted summoner of nightmares whose friendship with Kamahl could not save him from the Mirari's influence.",
    biography: [
      "Chainer trained within the Cabal of Otaria, using dementia magic to summon nightmarish creatures from his mind.",
      "Despite their contrasting backgrounds, he and Kamahl formed an unexpected friendship amid the Cabal's contests and political ambitions.",
      "Possession of the Mirari amplified Chainer's abilities and destabilized his control. His downfall became one of the defining tragedies of the Odyssey block story.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Chainer, Dementia Master",
      setCode: "tor",
      collectorNumber: "56",
      scryfallId: "40342b11-1005-4ccc-bef4-9ea4c640b048",
      artist: "Mark Zug",
      significance:
        "Chainer's original Torment printing illustrates the Cabal summoner and his nightmarish magic.",
    },
    source: {
      title: "Wizards of the Coast — Commander Masters Storyteller, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/commander-masters-storyteller-part-1",
    },
  },'''

wanted = ('kamahl', 'jeska', 'chainer')
present = tuple(bool(re.search(rf'\bid:\s*["\']{id}["\']', new_characters)) for id in wanted)
if any(present) and not all(present):
    raise SystemExit('Some but not all new characters already exist; review characters.ts manually. No files changed.')
if not all(present):
    if not new_characters.rstrip().endswith('];'):
        raise SystemExit('Character array does not end in ]; — no files changed.')
    before, ending = new_characters.rsplit('];', 1)
    if ending.strip():
        raise SystemExit('Unexpected content after character array. No files changed.')
    # Existing array already ends with its previous final object's comma.
    new_characters = before.rstrip() + new_entries + '\n];\n'

# All checks have passed; perform the two targeted updates.
eras_path.write_text(new_eras, encoding='utf-8')
characters_path.write_text(new_characters, encoding='utf-8')
print('Updated:', eras_path.relative_to(root))
print('Updated:', characters_path.relative_to(root))
print('Character registry now includes: kamahl, jeska, chainer')
print('Karn profile now connects to Chapter 05.')
print('Run: pnpm astro sync && pnpm build')
