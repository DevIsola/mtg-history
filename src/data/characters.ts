import type { CollectionEntry } from "astro:content";

type HistoricalCard = CollectionEntry<"chapters">["data"]["cards"][number];

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  origin: string;
  role: string;
  summary: string;
  biography: string[];
  chapterIds: string[];
  featuredCard: HistoricalCard;
  source: {
    title: string;
    url: string;
  };
}

export const characters: CharacterProfile[] = [
  // Chapter 10 — archaeology, investigation, and Ravnica's damaged institutions
  {
    id: "quintorius-kand",
    name: "Quintorius Kand",
    title: "Archaeologist of Arcavios",
    origin: "Arcavios — Lorehold College; expedition to Ixalan",
    role: "Newly sparked planeswalker and scholar of ancient civilizations",
    summary: "An archaeologist whose work with Huatli and Saheeli reveals older histories beneath Ixalan.",
    biography: [
      "Quintorius studied history on Arcavios before discovering that he possessed a planeswalker spark.",
      "He accepted Saheeli and Huatli's invitation to help interpret Orazca's puzzle-door and evidence of Ixalan's buried civilizations.",
      "His presence illustrates how a still-active spark and recurring Omenpaths could connect researchers without erasing the local history they sought to understand.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Quintorius Kand", setCode: "lci", collectorNumber: "238",
      scryfallId: "4382fa49-9e34-45b3-8495-4916dcd995ec", artist: "Zoltan Boros",
      significance: "The original Lost Caverns of Ixalan planeswalker portrait of Quintorius.",
    },
    source: { title: "Wizards of the Coast — Lost Caverns of Ixalan Story Spotlight Cards", url: "https://magic.wizards.com/en/news/card-preview/story-spotlight-cards-for-the-lost-caverns-of-ixalan" },
  },
  {
    id: "alquist-proft",
    name: "Alquist Proft",
    title: "Ravnican Master Sleuth",
    origin: "Ravnica",
    role: "Detective investigating the Karlov Manor murders",
    summary: "A detective whose work exposed mind control and Oba's hidden vengeance following Phyrexia's invasion.",
    biography: [
      "Proft investigated the Ravnican murders when initial evidence pointed toward the assassin Etrata.",
      "He distinguished coerced acts from willing culpability and worked with Etrata, Kaya, and Kellan to test the evidence.",
      "The investigation uncovered Oba's use of mind-controlling flowers and the grief beneath the Trostani leadership's public unity.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Alquist Proft, Master Sleuth", setCode: "mkm", collectorNumber: "185",
      scryfallId: "41129b44-4fa7-473b-b2b7-48c6a58be03c", artist: "Andreas Zafiratos",
      significance: "Proft's original Murders at Karlov Manor card.",
    },
    source: { title: "Wizards of the Coast — Murders at Karlov Manor: Roots of Decay", url: "https://magic.wizards.com/en/news/magic-story/episode-10-roots-of-decay" },
  },
  {
    id: "trostani",
    name: "Trostani",
    title: "Three Voices of the Selesnya Conclave",
    origin: "Ravnica — Vitu-Ghazi",
    role: "Shared dryad leadership, including Oba, Cim, and Ses",
    summary: "The triune leader whose internal division concealed Oba's murder campaign after the Phyrexian invasion.",
    biography: [
      "The Selesnya Conclave's leader consisted of three dryads: Oba, Cim, and Ses, presenting a shared voice despite different experiences.",
      "Oba protected her sisters from the invasion's suffering, then pursued revenge through violence and magical coercion.",
      "Cim and Ses were not knowing participants in those murders; the case exposed how the appearance of unity could conceal a dangerous division.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Trostani, Three Whispers", setCode: "mkm", collectorNumber: "238",
      scryfallId: "329f3aca-6db7-41d3-95b2-c479d14b7fa3", artist: "Jodie Muir",
      significance: "The three dryads depicted together during the Karlov Manor crisis.",
    },
    source: { title: "Wizards of the Coast — Murders at Karlov Manor: Beauty in Destruction", url: "https://magic.wizards.com/en/news/magic-story/episode-9-beauty-in-destruction" },
  },

  // Chapter 09 — the competing praetors and the Mirran resistance
  {
    id: "jin-gitaxias",
    name: "Jin-Gitaxias",
    title: "Praetor of the Progress Engine",
    origin: "New Phyrexia — the Surgical Bay",
    role: "Chrome Host commander and architect of spark-preserving compleation",
    summary: "A Phyrexian researcher whose Kamigawan experiments transformed planeswalkers into agents of the invasion.",
    biography: [
      "Jin-Gitaxias pursued an ideal of perfection through experimentation and the acquisition of knowledge, commanding the blue-aligned Chrome Host.",
      "His studies of Kamigawa's kami helped produce a method of compleation that retained a planeswalker's spark; Tamiyo became a devastating example.",
      "During the Multiversal invasion his soldiers exploited intelligence about each plane, although faulty assumptions made their attacks vulnerable to local resistance.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Jin-Gitaxias, Core Augur", setCode: "nph", collectorNumber: "37",
      scryfallId: "bd46fc9f-5b92-44d7-8940-2f39b0962b8f", artist: "Eric Deschamps",
      significance: "The original 2011 portrait of the scientist whose later work changed planeswalker compleation.",
    },
    source: { title: "Wizards of the Coast — March of the Machine Planeswalker's Guide", url: "https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-march-of-the-machine" },
  },
  {
    id: "vorinclex",
    name: "Vorinclex",
    title: "Praetor of the Vicious Swarm",
    origin: "New Phyrexia — the Hunter Maze",
    role: "Predatory praetor and thief of the World Tree's essence",
    summary: "The green-aligned praetor whose mission to Kaldheim helped create the invasion's interplanar tree.",
    biography: [
      "Vorinclex embodied the vision that domination and survival should be determined by ruthless adaptation and predation.",
      "Traveling to Kaldheim through Phyrexia's growing interplanar reach, he secured an essence of the World Tree needed for Realmbreaker.",
      "His achievements helped Elesh Norn prepare a coordinated invasion despite the praetors' conflicting ideas of what perfection meant.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Vorinclex, Voice of Hunger", setCode: "nph", collectorNumber: "127",
      scryfallId: "0806adab-6a08-411b-b249-e1c58ade354b", artist: "Karl Kopinski",
      significance: "The original depiction of Vorinclex, published well before his World Tree mission.",
    },
    source: { title: "Wizards of the Coast — March of the Machine Planeswalker's Guide", url: "https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-march-of-the-machine" },
  },
  {
    id: "urabrask",
    name: "Urabrask",
    title: "Praetor of the Quiet Furnace",
    origin: "New Phyrexia — the Furnace Layer",
    role: "Dissenting red-aligned praetor and adversary of Elesh Norn",
    summary: "A Phyrexian praetor who tolerated Mirran refugees and openly resisted Norn's forced unity.",
    biography: [
      "Unlike Norn, Urabrask allowed Mirran survivors to shelter within his furnaces and refused to impose a single form of obedience.",
      "His opposition to the Machine Orthodoxy eventually became open rebellion, with alliances formed across deep ideological divisions.",
      "Norn's brutal punishment of her rival showed the violence underlying her proclamation that all Phyrexians shared one will.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Urabrask the Hidden", setCode: "mul", collectorNumber: "23",
      scryfallId: "0533d7e4-6b5b-4e2e-8407-279fe438c676", artist: "Flavio Girón",
      significance: "A 2023 retrospective illustration of the furnace praetor first introduced in 2011.",
    },
    source: { title: "Wizards of the Coast — The Legends of Phyrexia: All Will Be One", url: "https://magic.wizards.com/en/news/feature/the-legends-of-phyrexia-all-will-be-one" },
  },
  {
    id: "melira",
    name: "Melira",
    title: "Sylvok Outcast",
    origin: "Mirrodin — the Sylvok",
    role: "Mirran resistance fighter and protector against Phyrexian corruption",
    summary: "A Mirran whose rare immunity gave the resistance hope and enabled a final sacrifice for two compleated planeswalkers.",
    biography: [
      "Melira's innate resistance to Phyrexian corruption made her valuable to the scattered Mirran survivors during the conquest of their world.",
      "She helped the attempted expedition into New Phyrexia's Seedcore, guided by her knowledge of the plane's transformed regions.",
      "After Elesh Norn's defeat she expended her life to help restore Nissa and Ajani, in a cure that also cost Karn his spark.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Melira, Sylvok Outcast", setCode: "nph", collectorNumber: "115",
      scryfallId: "e83851a1-e4e8-49ec-af5c-4efe86fa51ad", artist: "Min Yum",
      significance: "The original 2011 representation of Melira's immunity and her role in the resistance.",
    },
    source: { title: "Wizards of the Coast — Assault on New Phyrexia, Episode 2", url: "https://magic.wizards.com/en/news/magic-story/assault-on-new-phyrexia-or-episode-2-unstable-foundations" },
  },
  {
    id: "tamiyo",
    name: "Tamiyo",
    title: "Moon Sage and Keeper of Stories",
    origin: "Kamigawa",
    role: "Storyteller, first compleated planeswalker, and mother to Nashi",
    summary: "A beloved historian transformed by Jin-Gitaxias, whose saved magical memory survived her death on Kamigawa.",
    biography: [
      "Tamiyo collected stories across the Multiverse and treasured her family on Kamigawa, recording memories within enchanted scrolls.",
      "Phyrexian experimentation compleated her while preserving her spark, twisting her scholarship into an instrument of conquest.",
      "During the invasion the Wanderer killed her to save others. A magical record of Tamiyo's memories survived and spoke with Nashi; this was not a complete restoration of her body.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Tamiyo, Compleated Sage", setCode: "neo", collectorNumber: "238",
      scryfallId: "222a736e-d819-452d-aeda-eb848c4b2302", artist: "Chris Rahn",
      significance: "The original 2022 portrayal of Tamiyo after Phyrexian compleation on Kamigawa.",
    },
    source: { title: "Wizards of the Coast — Mother, Son, and Story", url: "https://magic.wizards.com/en/news/magic-story/episode-3-mother-son-and-story" },
  },
  // Chapter 08 — the machinery, resistance, and political capture of Ravnica
  {
    id: "tezzeret",
    name: "Tezzeret",
    title: "Master of the Planar Bridge",
    origin: "Alara — Esper",
    role: "Artificer and carrier of Bolas's interplanar invasion device",
    summary: "The planeswalker artificer whose Planar Bridge enabled Bolas to transport the lazotep-clad Eternals to Ravnica.",
    biography: [
      "Tezzeret's ambition and mastery of magical machinery made him an important agent in Nicol Bolas's plans.",
      "After the Planar Bridge was taken from Kaladesh, Tezzeret became its bearer. Its movement of nonliving matter between planes gave Bolas a way to move the specially prepared Eternals from Amonkhet to Ravnica.",
      "The bridge was one element of a larger operation that also depended on the Interplanar Beacon, Immortal Sun, and Elderspell. After Bolas's defeat, Ravnican guild leaders sought to hold Tezzeret accountable.",
    ],
    chapterIds: ["war-of-the-spark"],
    featuredCard: {
      name: "Tezzeret, Master of the Bridge", setCode: "war", collectorNumber: "275",
      scryfallId: "9ee1eea2-961f-445d-b035-6baed454f289", artist: "Chase Stone",
      significance: "War of the Spark buy-a-box portrait of the Planar Bridge's bearer.",
    },
    source: { title: "Wizards of the Coast — War of the Spark: Ravnica — Ashes", url: "https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12" },
  },
  {
    id: "ral-zarek",
    name: "Ral Zarek",
    title: "Izzet Storm Mage",
    origin: "Ravnica",
    role: "Izzet planeswalker and organizer of Ravnica's resistance",
    summary: "An Izzet mage whose expertise with the Interplanar Beacon proved vital both to the invasion's trap and to countering it.",
    biography: [
      "Ral Zarek was a planeswalker and Izzet League mage closely tied to Ravnica's magical engineering and to Niv-Mizzet.",
      "As Bolas's plot converged on Ravnica, the Interplanar Beacon became the means of attracting planeswalkers into a prison sealed by the Immortal Sun.",
      "Ral helped organize resistance and disable the machinery supporting the invading army. After the battle, the guild leadership charged him with pursuing Tezzeret.",
    ],
    chapterIds: ["war-of-the-spark"],
    featuredCard: {
      name: "Ral, Storm Conduit", setCode: "war", collectorNumber: "211",
      scryfallId: "678ce3bf-152d-45ca-87ae-ad46c921328b", artist: "Wesley Burt",
      significance: "Ral Zarek during the War of the Spark, serving Ravnica's resistance.",
    },
    source: { title: "Wizards of the Coast — War of the Spark: Ravnica — Ashes", url: "https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12" },
  },
  {
    id: "dovin-baan",
    name: "Dovin Baan",
    title: "Azorius Grand Arbiter",
    origin: "Kaladesh",
    role: "Bolas-aligned administrator of the Azorius Senate",
    summary: "The planeswalker who used Ravnica's legal institutions to obstruct opposition to Bolas.",
    biography: [
      "Dovin Baan was a Vedalken planeswalker known for his administrative precision and talent for finding flaws in systems.",
      "He came to Ravnica and gained control of the Azorius Senate, using civic authority in ways that strengthened Bolas's conspiracy and obstructed its opponents.",
      "His political control demonstrates why the War of the Spark was not only a magical battle: the city's own institutions had been compromised. Following the war, Vraska was asked to pursue him.",
    ],
    chapterIds: ["war-of-the-spark"],
    featuredCard: {
      name: "Dovin, Hand of Control", setCode: "pwar", collectorNumber: "229s",
      scryfallId: "45abf8eb-c583-4eec-a91f-0e58424a8b1c", artist: "Kieran Yanner",
      significance: "War of the Spark prerelease portrait of the Azorius collaborator.",
    },
    source: { title: "Wizards of the Coast — War of the Spark: Ravnica — Ashes", url: "https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12" },
  },
  // Chapter 06 — an old planeswalker's destructive ambitions
  {
    id: "leshrac",
    name: "Leshrac",
    title: "The Night Walker",
    origin: "The Multiverse — active on Dominaria",
    role: "Ancient planeswalker and manipulator during the Mending",
    summary: "An old planeswalker who exploited Jeska's fear of losing her spark and was ultimately defeated by Nicol Bolas.",
    biography: [
      "Leshrac was an ancient and dangerous planeswalker whose name had been associated with dark magic on Dominaria since the time of Lim-Dûl.",
      "During the temporal crisis he offered Jeska advice that appeared to let her close rifts without giving up her own spark, while drawing on Radha's extraordinary bond to rift mana.",
      "His motives were predatory: he sought the power connected to Jeska's Phage identity and challenged Nicol Bolas. Bolas defeated him and used the remaining power to close the Madaran rift.",
    ],
    chapterIds: ["mending"],
    featuredCard: {
      name: "Leshrac's Sigil", setCode: "ice", collectorNumber: "144",
      scryfallId: "ad5ba7ee-d6df-4b62-a8a1-c81e6fca392a", artist: "Drew Tucker",
      significance: "An Ice Age card named after Leshrac; thematic evidence of his earlier influence rather than a portrait of the planeswalker.",
    },
    source: {
      title: "Wizards of the Coast — The Known Multiverse",
      url: "https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19",
    },
  },

  // Chapter 05 — the Order and the cost of the Mirari
  {
    id: "lieutenant-kirtar",
    name: "Lieutenant Kirtar",
    title: "The Order's Lieutenant",
    origin: "Dominaria — Otaria",
    role: "Order officer and early possessor of the Mirari",
    summary: "An Order commander who took the Mirari from the Cabal but could not make its power serve his ideal of justice.",
    biography: [
      "Kirtar served the Order, which opposed the Cabal and claimed to act against the dangerous magic and cruelty associated with Cabal City.",
      "When the Mirari passed from Cabal custody into the Order's hands, Kirtar hoped to direct its power toward his cause. The artifact instead demonstrated how dangerous certainty could become when amplified by overwhelming magic.",
      "His failure is one phase of the Mirari's passage among rival Otarian powers, preceding Aboshan's disastrous use of the sphere.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Lieutenant Kirtar", setCode: "ody", collectorNumber: "29",
      scryfallId: "e518750f-492d-4575-b4ee-c80c1f8e0a58", artist: "Paolo Parente",
      significance: "Kirtar's original Odyssey portrait; the illustration identifies him rather than depicting his final attempt to wield the Mirari.",
    },
    source: {
      title: "Lieutenant Kirtar — Odyssey printing",
      url: "https://scryfall.com/card/ody/29/lieutenant-kirtar",
    },
  },
  {
    id: "balthor",
    name: "Balthor",
    title: "The Barbarian Mentor Reborn",
    origin: "Dominaria — Otaria",
    role: "Dwarven leader, mentor to Kamahl, and later an undead warrior",
    summary: "A dwarven leader who mentored Kamahl and whose death and return were depicted on two separate cards.",
    biography: [
      "Balthor was a dwarf who led barbarians and acted as a mentor to Kamahl, giving the young fighter an example of leadership grounded in experience.",
      "Balthor died during the Otarian conflicts and later returned in undead form. His two legendary creature cards were deliberately planned as depictions of the same character on opposite sides of death.",
      "Torment portrayed him as Balthor the Stout, while Judgment portrayed him as Balthor the Defiled, emphasizing that transformation rather than introducing another person.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Balthor the Defiled", setCode: "jud", collectorNumber: "61",
      scryfallId: "ed4cc273-adc3-4f46-9743-134b552d1d56", artist: "Carl Critchlow",
      significance: "Balthor after death and reanimation, paired in the story with the earlier Balthor the Stout card.",
    },
    source: {
      title: "Wizards of the Coast — Building Balthor",
      url: "https://magic.wizards.com/en/news/making-magic/thirty-two-short-columns-about-dwarves-2005-11-21",
    },
  },

  // Chapter 04 — the people behind the Legacy and its cost
  {
    id: "barrin",
    name: "Barrin",
    title: "Master Wizard of Tolaria",
    origin: "Dominaria — Tolaria",
    role: "Tolarian headmaster, Urza's ally, and Hanna's father",
    summary: "An academy leader whose final spell destroyed Phyrexian-occupied Tolaria after the death of his family.",
    biography: [
      "Barrin led the Tolarian Academy while working with Urza to prepare mages and artificers for a future confrontation with Phyrexia.",
      "He was the father of Hanna, the Weatherlight's navigator. Her independent career tied the Academy's research to the living crew Urza expected to assemble the Legacy.",
      "The invasion killed his wife Rayne and daughter Hanna. Finding Tolaria overrun, Barrin cast Obliterate, destroying the area and himself.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Barrin, Master Wizard", setCode: "usg", collectorNumber: "63",
      scryfallId: "ec79e35f-9e78-462d-8b71-4f044e2eff90", artist: "Michael Sutfin",
      significance: "A portrait of the Tolarian mage whose final sacrifice came during the Phyrexian invasion.",
    },
    source: { title: "Wizards of the Coast — From the Vault: Lore", url: "https://magic.wizards.com/en/news/feature/vault-lore-2016-08-01" },
  },
  {
    id: "radiant",
    name: "Radiant",
    title: "Serra's Archangel",
    origin: "Serra's Realm",
    role: "Angelic guardian of Serra's artificial plane",
    summary: "The guardian whose increasingly severe rule preceded the collapse of Serra's Realm and the creation of the Weatherlight's power source.",
    biography: [
      "Serra entrusted her realm to Radiant when Phyrexian corruption drove its creator away.",
      "Radiant's determination to eliminate infiltration hardened into suspicion of her own people, while the realm without Serra continued to deteriorate.",
      "The Weatherlight helped rescue inhabitants before the plane collapsed. Its mana and Radiant's divine light became part of the powerstone fueling the skyship.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Radiant, Archangel", setCode: "ulg", collectorNumber: "20",
      scryfallId: "99509da7-3e11-4c38-804b-286ce572f36e", artist: "Michael Sutfin",
      significance: "The original Urza's Legacy depiction of the archangel who guarded Serra's failing realm.",
    },
    source: { title: "Wizards of the Coast — Commander Legends Character Stories", url: "https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30" },
  },
  {
    id: "multani",
    name: "Multani",
    title: "Maro-Sorcerer of Yavimaya",
    origin: "Dominaria — Yavimaya",
    role: "Ancient nature spirit and mentor",
    summary: "The maro who guided Gerrard, Mirri, and Rofellos before their intertwined Weatherlight journeys.",
    biography: [
      "Multani was an ancient elemental tied to Yavimaya's forests and their living magic.",
      "He instructed the young Gerrard, Mirri, and Rofellos, whose friendship long predated the mission to rescue Sisay from Rath.",
      "His teachings provide a human-scale counterweight to Urza's manipulation of bloodlines and the Legacy: Gerrard's loyalties were formed by lived experience, not merely design.",
    ],
    chapterIds: ["weatherlight", "mending"],
    featuredCard: {
      name: "Multani, Maro-Sorcerer", setCode: "ulg", collectorNumber: "107",
      scryfallId: "0d6cc98b-b376-40af-8308-198bab00b2b1", artist: "Daren Bader",
      significance: "The Urza's Legacy printing of Gerrard's Yavimayan teacher.",
    },
    source: { title: "Wizards of the Coast — Stories from Dominaria, Part 3", url: "https://magic.wizards.com/en/news/making-magic/stories-dominaria-part-3-2018-04-30" },
  },
  {
    id: "rofellos",
    name: "Rofellos",
    title: "Llanowar Emissary",
    origin: "Dominaria — Llanowar",
    role: "Elvish mage and Gerrard's fallen companion",
    summary: "A friend of Gerrard and Mirri whose death aboard the Weatherlight helped turn Gerrard against his inherited mission.",
    biography: [
      "Rofellos studied under Multani alongside Gerrard and Mirri, becoming part of their closest circle of friends.",
      "He later joined the Weatherlight crew and died before Sisay's kidnapping. His loss helped drive Gerrard and Mirri away from the ship.",
      "Although he was absent from the main rescue narrative, Urza's Destiny later gave him a card because its flashback period could depict his earlier life.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Rofellos, Llanowar Emissary", setCode: "uds", collectorNumber: "118",
      scryfallId: "6aa5cc65-f8f1-4f6f-8b4e-2fedccbda684", artist: "Michael Sutfin",
      significance: "A retrospective card of the Llanowar elf who influenced Gerrard's departure from the Weatherlight.",
    },
    source: { title: "Wizards of the Coast — Magic Design A to Z, Part 3", url: "https://magic.wizards.com/en/news/making-magic/magic-design-a-to-z-part-3" },
  },
  {
    id: "squee",
    name: "Squee",
    title: "Goblin Nabob",
    origin: "Dominaria",
    role: "Weatherlight cabin boy and unlikely immortal",
    summary: "A goblin companion whose loyalty and strange Phyrexian-granted immortality extended his story far beyond the original invasion.",
    biography: [
      "Squee joined the Weatherlight as an apparently insignificant goblin cabin boy and became a loyal member of its varied company.",
      "During the original Phyrexian war, Yawgmoth's magic granted him a regenerative immortality that caused his body to be rebuilt after death.",
      "Many centuries later, the official story Death and Salvation revealed the deeper consequences of that spell and the protection of his soul.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Squee, Goblin Nabob", setCode: "mmq", collectorNumber: "214",
      scryfallId: "4ba8325a-1203-4125-9111-94d9e2b1f14b", artist: "David Monette",
      significance: "Squee's original Mercadian Masques portrait from the Weatherlight era.",
    },
    source: { title: "Wizards of the Coast — Death and Salvation", url: "https://magic.wizards.com/en/news/magic-story/death-and-salvation-2022-08-16" },
  },

  // Chapter 03 — the Conclave and Sarpadia's remembered creators
  {
    id: "mairsil",
    name: "Mairsil",
    title: "The Pretender",
    origin: "Dominaria — Terisiare",
    role: "Conclave usurper during the Dark Age",
    summary: "A Conclave mage who imprisoned Ith and exploited forbidden magical knowledge for personal power.",
    biography: [
      "Mairsil displaced the Conclave's founder, Ith, and kept him in Barl's Cage, draining the captive wizard's magical power.",
      "He tried to exploit Jodah's ancestry and knowledge as a route to greater power, illustrating how the Conclave's public mission of preserving magic could conceal coercion.",
      "Jodah and Sima helped release Ith. The destruction that followed ended Mairsil's control of the institution, but the surviving scholars carried their knowledge onward.",
    ],
    chapterIds: ["ice-age"],
    featuredCard: {
      name: "Mairsil, the Pretender", setCode: "c17", collectorNumber: "41",
      scryfallId: "87b71b08-668c-4b32-8243-8def1a9acf26", artist: "Izzy",
      significance: "A Commander 2017 portrayal of the Dark Age usurper and his hunger for stolen power.",
    },
    source: {
      title: "Wizards of the Coast — Commander (2017 Edition) Card Image Gallery",
      url: "https://magic.wizards.com/en/news/card-image-gallery/commander-2017",
    },
  },
  {
    id: "thelon-of-havenwood",
    name: "Thelon of Havenwood",
    title: "Thelonite Druid",
    origin: "Dominaria — Sarpadia, Havenwood",
    role: "Druid associated with the cultivation of thallids",
    summary: "A Havenwood druid whose fungal creations became central to the Sarpadian elves' struggle.",
    biography: [
      "Thelon is associated with the development of thallids, the fungal beings that could generate saprolings in the declining society of Havenwood.",
      "The elves' attempts to enlist fungal life among their resources were followed by conflicts as the thallids expanded beyond expectations.",
      "His later Time Spiral card recalls the Fallen Empires period rather than depicting an event contemporaneous with the 2006 expansion.",
    ],
    chapterIds: ["ice-age"],
    featuredCard: {
      name: "Thelon of Havenwood", setCode: "tsp", collectorNumber: "227",
      scryfallId: "92b0be6d-9183-4938-b7a1-ae7f04ba78a0", artist: "Kev Walker",
      significance: "A Time Spiral retrospective portrait of the druid connected with Sarpadia's thallids.",
    },
    source: {
      title: "Wizards of the Coast — Name Dropping",
      url: "https://magic.wizards.com/en/news/making-magic/name-dropping-2006-11-13",
    },
  },
  {
    id: "endrek-sahr",
    name: "Endrek Sahr",
    title: "Master Breeder",
    origin: "Dominaria — Sarpadia",
    role: "Creator of thrulls for the Order of the Ebon Hand",
    summary: "A mage whose thrull breeding served the Ebon Hand before its creations helped overturn the Order's control.",
    biography: [
      "Endrek Sahr was remembered as the creator of thrulls used by the Order of the Ebon Hand on Sarpadia.",
      "The Order's reliance on constructed servitors made it vulnerable when the thrulls grew beyond the obedient roles intended for them.",
      "Endrek first received a legendary card in Time Spiral (2006); this archive uses a 2013 printing of that earlier illustration.",
    ],
    chapterIds: ["ice-age"],
    featuredCard: {
      name: "Endrek Sahr, Master Breeder", setCode: "c13", collectorNumber: "76",
      scryfallId: "48eac047-f888-49c7-aa7e-339f900f558f", artist: "Mark Tedin",
      significance: "A Commander 2013 reprint recalling the Sarpadian breeder of thrulls.",
    },
    source: {
      title: "Wizards of the Coast — Name Dropping",
      url: "https://magic.wizards.com/en/news/making-magic/name-dropping-2006-11-13",
    },
  },
  // Chapter 10 — the first Omenpath-era travelers and survivors
  {
    id: "will-kenrith",
    name: "Will Kenrith",
    title: "Eldraine’s Young King",
    origin: "Eldraine",
    role: "Former planeswalker and claimant to Eldraine’s throne",
    summary: "The desparked heir who attempted to guide Eldraine through the consequences of the Phyrexian invasion.",
    biography: [
      "Will and his twin Rowan lost King Kenrith and Queen Linden during the Phyrexian invasion, leaving the realm to rebuild amid grief and disorder.",
      "With his planeswalker spark gone, Will remained committed to the difficult work of restoring institutions and uniting Eldraine after the Wicked Slumber.",
      "His belief in negotiation clashed with Rowan’s conviction that only formidable magic could prevent the next catastrophe.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Will, Scion of Peace", setCode: "woe", collectorNumber: "218",
      scryfallId: "162088ea-5f99-4244-9427-2fdfb2168fc3", artist: "Ryan Pancoast",
      significance: "The legendary creature card captures Will’s responsibilities after losing his spark.",
    },
    source: {
      title: "Wizards of the Coast — Official Magic story",
      url: "https://magic.wizards.com/en/news/announcements/a-first-look-at-wilds-of-eldraine",
    },
  },
  {
    id: "rowan-kenrith",
    name: "Rowan Kenrith",
    title: "The Scion of War",
    origin: "Eldraine",
    role: "Former planeswalker and royal heir pursuing dangerous power",
    summary: "Will’s twin, whose grief and desire to protect Eldraine led her away from her brother’s vision of restoration.",
    biography: [
      "Rowan survived the Phyrexian invasion but lost her parents and her planeswalker spark, joining a kingdom struggling with the Wicked Slumber.",
      "She came to distrust the slow political solutions Will favored and increasingly viewed power as the necessary answer to Eldraine’s vulnerability.",
      "Her pursuit of dangerous magic placed her at odds with Will without erasing the family bond at the root of their conflict.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Rowan, Scion of War", setCode: "woe", collectorNumber: "300",
      scryfallId: "844e29e9-e870-4433-ad63-0ff918a3e41a", artist: "Abigail Larson",
      significance: "Alternate-art 2023 printing reflecting Rowan’s turn toward power in Eldraine.",
    },
    source: {
      title: "Wizards of the Coast — Official Magic story",
      url: "https://magic.wizards.com/en/news/magic-story/episode-2-wandering-knight-budding-hero",
    },
  },
  {
    id: "kellan",
    name: "Kellan",
    title: "The Fae-Blooded Traveler",
    origin: "Eldraine; later a traveler between planes",
    role: "Half-fae adventurer who crossed Omenpaths in search of his father",
    summary: "A young Eldraine hero whose quest became a journey across Ixalan, Ravnica, and Thunder Junction.",
    biography: [
      "Kellan’s encounters with the fae and the Wicked Slumber on Eldraine revealed that his father was the elusive planeswalker Oko.",
      "The newly opened Omenpaths let him continue the search beyond his home despite not possessing a planeswalker spark.",
      "His experiences as an explorer, investigator, and participant in the Thunder Junction heist tested what family and personal judgment meant to him.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Kellan, the Fae-Blooded", setCode: "woe", collectorNumber: "230",
      scryfallId: "ec5e2680-8b42-4571-ab45-4936aec51901", artist: "Anna Steinbauer",
      significance: "Kellan’s first legendary card precedes the later portrayals of his multiversal journey.",
    },
    source: {
      title: "Wizards of the Coast — Official Magic story",
      url: "https://magic.wizards.com/en/news/feature/a-legendary-crew-for-an-unbelievable-heist-outlaws-of-thunder-junction",
    },
  },
  {
    id: "oko",
    name: "Oko",
    title: "The Fae Trickster",
    origin: "Unknown fae origins; traveler across worlds",
    role: "Planeswalker, shapeshifter, and organizer of the Thunder Junction vault heist",
    summary: "Kellan’s father, a deceptive fae planeswalker whose elaborate plans led a crew toward an ancient vault.",
    biography: [
      "Oko’s skill with transformations and manipulation helped him evade consequences and assemble allies for high-risk schemes.",
      "He organized an interplanar criminal crew around the Thunder Junction vault and its mysterious contents.",
      "His reunion with Kellan confronted the young traveler with the difference between seeking a parent and trusting one.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Oko, the Ringleader", setCode: "otj", collectorNumber: "223",
      scryfallId: "396df8d6-e85d-4486-8116-68841b7e1e2e", artist: "Magali Villeneuve",
      significance: "The Thunder Junction planeswalker card depicts Oko as the architect of the vault heist.",
    },
    source: {
      title: "Wizards of the Coast — Official Magic story",
      url: "https://magic.wizards.com/en/news/feature/a-legendary-crew-for-an-unbelievable-heist-outlaws-of-thunder-junction",
    },
  },
  {
    id: "jace-beleren",
    name: "Jace Beleren",
    title: "The Reawakened Mind Mage",
    origin: "Vryn; later Ravnica and other planes",
    role: "Telepathic planeswalker who survived Phyrexian compleation",
    summary: "A surviving planeswalker whose rescue of Vraska and later plans reveal the unresolved stakes of the post-invasion era.",
    biography: [
      "Jace was compleated during the campaign against New Phyrexia but retained enough of himself to struggle against the corruption within his own mind.",
      "He found Vraska on Ravnica during the invasion and worked to recover her, carrying the two of them to his mother on Vryn for help.",
      "After the war, he and Vraska became involved in the plot surrounding Thunder Junction’s ancient vault and the being called Loot.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Jace Reawakened", setCode: "otj", collectorNumber: "271",
      scryfallId: "fd17e8d4-499e-4005-ae3c-bc9c44dc5a67", artist: "Cristi Balanescu",
      significance: "A 2024 planeswalker card demonstrating that desparking did not affect all planeswalkers.",
    },
    source: {
      title: "Wizards of the Coast — Official Magic story",
      url: "https://magic.wizards.com/en/news/magic-story/epilogue-1-the-invasion-tree",
    },
  },
  {
    id: "vraska",
    name: "Vraska",
    title: "The Silencer",
    origin: "Ravnica",
    role: "Gorgon survivor, former guild leader, and ally of Jace",
    summary: "A former compleated planeswalker whose survival and hidden aims complicate the Thunder Junction heist.",
    biography: [
      "Vraska’s history with Ravnica and Jace preceded the Phyrexian invasion, during which her body and mind were corrupted.",
      "Jace sought her out during the war, protected her surviving self, and brought her toward recovery.",
      "She returned to action among the Thunder Junction outlaws while concealing objectives beyond those Oko’s crew understood.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Vraska, the Silencer", setCode: "otj", collectorNumber: "237",
      scryfallId: "b042abf2-c40b-4235-a4fa-2e4901c375c3", artist: "Kieran Yanner",
      significance: "Her Thunder Junction legendary creature printing reflects a changed post-invasion status.",
    },
    source: {
      title: "Wizards of the Coast — Official Magic story",
      url: "https://magic.wizards.com/en/news/magic-story/epilogue-1-the-invasion-tree",
    },
  },
  {
    id: "loot",
    name: "Loot",
    title: "The Key to Everything",
    origin: "Ancient Thunder Junction vault",
    role: "Mysterious young being tied to the vault’s multiversal secrets",
    summary: "The living discovery at the heart of the vault heist, whose abilities drew attention beyond Thunder Junction.",
    biography: [
      "Loot was found inside a heavily defended ancient vault on Thunder Junction, rather than being an ordinary treasure seized by a criminal crew.",
      "His unusual connection to the Multiverse made him important to the plans of Jace and Vraska.",
      "His emergence turned the outcome of a heist into the beginning of a larger unresolved question about the future of interplanar travel.",
    ],
    chapterIds: ["omenpaths"],
    featuredCard: {
      name: "Loot, the Key to Everything", setCode: "big", collectorNumber: "21",
      scryfallId: "fb169fa2-c92e-45f7-89a2-0ca0e3910a1c", artist: "Rudy Siswanto",
      significance: "The Big Score card presents the vault’s living prize, not an ordinary object.",
    },
    source: {
      title: "Wizards of the Coast — Official Magic story",
      url: "https://magic.wizards.com/en/news/magic-story/episode-5-high-moon",
    },
  },
  // Chapter 09 — New Phyrexia and the Multiverse-wide invasion
  {
    id: "elesh-norn",
    name: "Elesh Norn",
    title: "Mother of Machines",
    origin: "New Phyrexia — the Machine Orthodoxy",
    role: "Grand praetor and architect of the multiversal invasion",
    summary: "The praetor who used Realmbreaker to impose Phyrexian unity on the Multiverse.",
    biography: [
      "After Mirrodin's fall, Elesh Norn consolidated the Machine Orthodoxy and sought dominion over other praetors as well as other planes.",
      "Agents recovered Kaldheim's World Tree essence and perfected planeswalker compleation, enabling Norn to grow Realmbreaker and open paths for invasion armies.",
      "Her ambition failed when Elspeth returned, Wrenn brought Zhalfir into the fight, and Karn personally dismantled Norn after the counterattack.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Elesh Norn, Mother of Machines", setCode: "one", collectorNumber: "10",
      scryfallId: "44dcab01-1d13-4dfc-ae2f-fbaa3dd35087", artist: "Martina Fackova",
      significance: "The original All Will Be One image of the praetor directing Phyrexia's attempt to conquer every plane.",
    },
    source: {
      title: "Wizards of the Coast — Planeswalker's Guide to March of the Machine",
      url: "https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-march-of-the-machine",
    },
  },
  {
    id: "sheoldred",
    name: "Sheoldred",
    title: "The Apocalypse",
    origin: "New Phyrexia — the Dross Pits",
    role: "Praetor and organizer of Dominaria's sleeper-agent campaign",
    summary: "A Phyrexian leader who weakened Dominaria through covert infiltration before the greater invasion.",
    biography: [
      "Sheoldred operated among the Steel Thanes and led a covert effort to destabilize Dominaria, the world where Phyrexia's earlier empire had been defeated.",
      "Her sleeper agents turned trusted institutions and companions into possible threats; Ajani's compleation enabled a devastating betrayal and Jaya's death.",
      "Sheoldred's interests were not identical to Elesh Norn's, and the praetors' struggle for power revealed the limits of Phyrexia's supposedly unified will.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Sheoldred, the Apocalypse", setCode: "dmu", collectorNumber: "107",
      scryfallId: "d67be074-cdd4-41d9-ac89-0a0456c4e4b2", artist: "Chris Rahn",
      significance: "The Dominaria United praetor portrait introduces the covert campaign behind the coming war.",
    },
    source: {
      title: "Wizards of the Coast — The Legends You'll Find in Dominaria United",
      url: "https://magic.wizards.com/en/news/feature/legends-youll-find-dominaria-united-2022-09-01",
    },
  },
  {
    id: "koth",
    name: "Koth",
    title: "Fire of Resistance",
    origin: "Mirrodin — the Vulshok of the Oxidda Chain",
    role: "Geomancer and leader of the surviving Mirran resistance",
    summary: "A native of Mirrodin who refused to yield to Phyrexia after it occupied his home plane.",
    biography: [
      "Koth fought the Phyrexians as their corruption swept Mirrodin and continued resisting long after the world was renamed New Phyrexia.",
      "He helped guide returning planeswalkers and Mirran survivors through the Seedcore crisis and the final attempt to reach Realmbreaker.",
      "The restoration of Zhalfir offered his people sanctuary, but victory did not return the metal world he had vowed to save.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Koth, Fire of Resistance", setCode: "pone", collectorNumber: "138",
      scryfallId: "e38f63c4-1d35-451a-8778-2066ed874ff9", artist: "Eric Wilkerson",
      significance: "A Phyrexia: All Will Be One promotional printing illustrating the Mirran resistance leader.",
    },
    source: {
      title: "Wizards of the Coast — March of the Machine, Episode 10: The Rhythms of Life",
      url: "https://magic.wizards.com/en/news/magic-story/episode-10-the-rhythms-of-life",
    },
  },
  {
    id: "ajani",
    name: "Ajani Goldmane",
    title: "The Sleeper Agent",
    origin: "Naya, Alara",
    role: "Planeswalker, corrupted infiltrator, and survivor of compleation",
    summary: "A trusted ally whose compleation drove a betrayal during Dominaria's defense.",
    biography: [
      "Ajani was widely trusted for his compassion and care for others before he was secretly compleated by Phyrexia.",
      "His altered allegiance contributed to the death of Jaya during the Dominarian sleeper-agent crisis, showing how Phyrexia weaponized trust.",
      "After New Phyrexia was isolated, Melira and Karn used a costly treatment to free Ajani from corruption; survival did not erase the damage done while he was controlled.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Ajani, Sleeper Agent", setCode: "dmu", collectorNumber: "370",
      scryfallId: "7e2af6c1-fdf1-4d04-bd74-f07da939110a", artist: "Victor Adame Minguez",
      significance: "A Phyrexian-language treatment of Ajani's Dominaria United card, revealing the betrayal.",
    },
    source: {
      title: "Wizards of the Coast — March of the Machine, Episode 10: The Rhythms of Life",
      url: "https://magic.wizards.com/en/news/magic-story/episode-10-the-rhythms-of-life",
    },
  },
  {
    id: "nissa",
    name: "Nissa Revane",
    title: "The Ascended Animist",
    origin: "Zendikar",
    role: "Elemental mage, compleated planeswalker, and survivor",
    summary: "A guardian of living worlds whose powers were turned against her allies after compleation.",
    biography: [
      "Nissa's relationship with Zendikar's lands and the Roil made her one of the Multiverse's most capable nature mages.",
      "In the failed mission to the Seedcore, Phyrexian oil and coercive compleation turned her against the coalition; Chandra later faced her in the invasion's final stages.",
      "On Zhalfir, Melira's sacrifice and the power Karn retained from Venser allowed Nissa's restoration, although scars and consequences remained.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Nissa, Ascended Animist", setCode: "one", collectorNumber: "175",
      scryfallId: "1dd64b1d-bcef-476c-bf0b-3ac7df7cbed3", artist: "Chase Stone",
      significance: "Her compleated portrait records the invasion's violation of an old bond with nature.",
    },
    source: {
      title: "Wizards of the Coast — March of the Machine, Episode 10: The Rhythms of Life",
      url: "https://magic.wizards.com/en/news/magic-story/episode-10-the-rhythms-of-life",
    },
  },
  {
    id: "chandra",
    name: "Chandra Nalaar",
    title: "Hope's Beacon",
    origin: "Kaladesh",
    role: "Pyromancer and defender of the Multiverse",
    summary: "A planeswalker who returned to New Phyrexia to fight Norn while struggling with Jaya's death and Nissa's corruption.",
    biography: [
      "Jaya Ballard mentored Chandra, whose fiery temperament concealed a deep loyalty to the people she loved.",
      "After Ajani's betrayal killed Jaya and the Seedcore mission failed, Chandra helped the remaining defenders regroup and return to New Phyrexia.",
      "She fought alongside Wrenn and Koth, and later stood by Nissa during the uncertain attempt to reverse compleation.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Chandra, Hope's Beacon", setCode: "mom", collectorNumber: "134",
      scryfallId: "a146ea07-ec1c-448d-b67a-dd9f9e27c2e0", artist: "Kieran Yanner",
      significance: "Chandra's March of the Machine appearance captures her resolve at the war's climax.",
    },
    source: {
      title: "Wizards of the Coast — March of the Machine, Episode 7: Divine Intervention",
      url: "https://magic.wizards.com/en/news/magic-story/episode-7-divine-intervention",
    },
  },
  {
    id: "elspeth",
    name: "Elspeth Tirel",
    title: "Archangel of the Final Defense",
    origin: "New Capenna; survivor of Phyrexian persecution",
    role: "Planeswalker and angelic defender of New Phyrexia's victims",
    summary: "A longtime opponent of Phyrexia who transformed after saving connected worlds from the Sylex.",
    biography: [
      "Elspeth survived the horrors of Phyrexia in childhood, fought alongside Mirran resistance forces, and searched for safety across worlds.",
      "When the Seedcore plan threatened worlds already connected to Realmbreaker, she carried the Sylex into the Blind Eternities instead of allowing its detonation among them.",
      "She returned transformed into an angel, defended the Mirrans, and held off Elesh Norn while Wrenn made the decisive connection to Zhalfir.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Archangel Elspeth", setCode: "mom", collectorNumber: "320",
      scryfallId: "93f99e67-901f-4c8d-8a09-e443b7eb928f", artist: "Denys Tsiperko",
      significance: "A borderless portrait of Elspeth's angelic return at the climax of March of the Machine.",
    },
    source: {
      title: "Wizards of the Coast — March of the Machine, Episode 7: Divine Intervention",
      url: "https://magic.wizards.com/en/news/magic-story/episode-7-divine-intervention",
    },
  },
  {
    id: "wrenn",
    name: "Wrenn",
    title: "The Dryad Who Became Eight",
    origin: "A planeswalking dryad bonded to successive host trees",
    role: "Dryad planeswalker who redirected Realmbreaker to Zhalfir",
    summary: "The dryad who joined with Phyrexia's invasion tree and exchanged New Phyrexia's place with Zhalfir.",
    biography: [
      "Wrenn survived by bonding with trees, each partnership unique; her relationship with host trees was personal rather than simply a source of magical power.",
      "At the height of the multiversal invasion, she bonded with Realmbreaker's living remnant, naming her eighth partner Eight and reaching the isolated plane of Zhalfir.",
      "She enabled a counterinvasion and exchanged the planes' positions, giving her life so that Zhalfir could return and New Phyrexia could be shut away.",
    ],
    chapterIds: ["march-of-the-machine"],
    featuredCard: {
      name: "Wrenn and Realmbreaker", setCode: "mom", collectorNumber: "217",
      scryfallId: "6f807d91-b157-44e8-a431-49782184f876", artist: "Cristi Balanescu",
      significance: "The card documents Wrenn's unique bond with the once-hostile Invasion Tree.",
    },
    source: {
      title: "Wizards of the Coast — March of the Machine, Episode 8: Wrenn and Eight",
      url: "https://magic.wizards.com/en/news/magic-story/episode-8-wrenn-and-eight",
    },
  },
  // Chapter 08 — the Bolas arc and War of the Spark
  {
    id: "nicol-bolas",
    name: "Nicol Bolas",
    title: "The Elder Dragon",
    origin: "Dominaria; later a traveler across the Multiverse",
    role: "Planeswalker and architect of the War of the Spark",
    summary: "An Elder Dragon who engineered an invasion to harvest other planeswalkers' sparks and regain his lost power.",
    biography: [
      "After the Mending diminished the near-godlike powers of older planeswalkers, Bolas sought a means of reversing the loss.",
      "His agents obtained the Planar Bridge and the Immortal Sun; the Eternals prepared on Amonkhet became an army intended to harvest sparks on Ravnica.",
      "He trapped planeswalkers on Ravnica and activated the Elderspell, but the resistance and Liliana's defiance denied him victory. His spark was removed, and Ugin confined him in the Meditation Realm.",
    ],
    chapterIds: ["war-of-the-spark"],
    featuredCard: {
      name: "Nicol Bolas, Dragon-God", setCode: "war", collectorNumber: "207",
      scryfallId: "98b68dea-a7be-4f99-8a50-4c8cf0e0f7a9", artist: "Raymond Swanland",
      significance: "Bolas at the apparent peak of his bid for restored divinity on Ravnica.",
    },
    source: {
      title: "Wizards of the Coast — War Games",
      url: "https://magic.wizards.com/en/news/making-magic/war-games-2019-04-22",
    },
  },
  {
    id: "liliana-vess",
    name: "Liliana Vess",
    title: "The Dreadhorde General",
    origin: "Dominaria",
    role: "Necromancer forced to command Bolas's Eternal army",
    summary: "A planeswalker whose defiance of Bolas changed the battle and led to Gideon's sacrifice.",
    biography: [
      "Liliana pursued freedom from supernatural bargains but became bound to the Elder Dragon Nicol Bolas.",
      "On Ravnica she commanded the Dreadhorde while knowing that Bolas's hold on her could kill her if she disobeyed.",
      "She turned the Eternals against Bolas; Gideon absorbed the lethal consequence of her rebellion, leaving her alive with a difficult legacy.",
    ],
    chapterIds: ["war-of-the-spark"],
    featuredCard: {
      name: "Liliana, Dreadhorde General", setCode: "war", collectorNumber: "97",
      scryfallId: "d75ebba8-34ca-47a0-bf13-8318ad73b343", artist: "Chris Rallis",
      significance: "Liliana's contested command of the Eternal army during the invasion.",
    },
    source: {
      title: "Wizards of the Coast — War of the Spark: Ravnica—Ashes",
      url: "https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12",
    },
  },
  {
    id: "gideon-jura",
    name: "Gideon Jura",
    title: "The Gatewatch's Shield",
    origin: "Theros",
    role: "Planeswalker and leader who gave his life for Liliana",
    summary: "A defender of Ravnica whose final act spared Liliana from Bolas's deadly punishment.",
    biography: [
      "Gideon joined the Gatewatch in defense of a Multiverse that could not rely on planeswalkers' power alone.",
      "Trapped on Ravnica with the other planeswalkers, he rallied resistance and fought to protect people endangered by Bolas's invasion.",
      "When Liliana rebelled, Gideon interposed his own protective magic, taking the fatal consequence and saving her life.",
    ],
    chapterIds: ["war-of-the-spark"],
    featuredCard: {
      name: "Gideon's Sacrifice", setCode: "war", collectorNumber: "14",
      scryfallId: "849c79ad-8bfc-4512-ab41-f213b6b285ab", artist: "Chris Rallis",
      significance: "Gideon redirects the lethal effect of Liliana's rebellion onto himself.",
    },
    source: {
      title: "Wizards of the Coast — War of the Spark: Ravnica—Ashes",
      url: "https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12",
    },
  },
  {
    id: "niv-mizzet",
    name: "Niv-Mizzet",
    title: "The Firemind Reborn",
    origin: "Ravnica",
    role: "Izzet guildmaster and later Living Guildpact",
    summary: "Ravnica's Firemind whose rebirth made the city's guild alliance a new form of magical order.",
    biography: [
      "Niv-Mizzet led the Izzet League with formidable intellect and a long history of guild intrigue.",
      "During the confrontation with Bolas, his dangerous plan required cooperation among Ravnica's factions and resulted in his death and rebirth.",
      "He returned as the Living Guildpact, a central figure for Ravnica's attempted recovery from the war.",
    ],
    chapterIds: ["war-of-the-spark"],
    featuredCard: {
      name: "Niv-Mizzet Reborn", setCode: "war", collectorNumber: "208",
      scryfallId: "56a2609d-b535-400b-81d9-72989a33c70f", artist: "Raymond Swanland",
      significance: "The Firemind's transformation into the Living Guildpact.",
    },
    source: {
      title: "Wizards of the Coast — War of the Spark: Ravnica—Ashes",
      url: "https://magic.wizards.com/en/news/magic-story/war-spark-ravnica-ashes-2019-06-12",
    },
  },
  // Chapter 07 — early Ravnica, Zendikar and Innistrad
  {
    id: "agrus-kos",
    name: "Agrus Kos",
    title: "Wojek Investigator",
    origin: "Ravnica",
    role: "Boros veteran and investigator",
    summary: "A determined wojek whose pursuit of a secret guildmaster helped unmake Ravnica's first Guildpact.",
    biography: [
      "Agrus Kos served the Boros Legion as a veteran wojek, pursuing crimes that exposed the fault lines between Ravnica's ten guilds.",
      "His investigation into Szadek helped reveal House Dimir's conspiracy, but the vampire's arrest was also the trigger for the original Guildpact's collapse.",
      "Agrus continued to confront the consequences of the broken pact alongside allies such as Teysa Karlov.",
    ],
    chapterIds: ["many-worlds"],
    featuredCard: {
      name: "Agrus Kos, Wojek Veteran",
      setCode: "gk1",
      collectorNumber: "83",
      scryfallId: "e525be2e-26e6-4082-b713-ac74fcbd13d3",
      artist: "Donato Giancola",
      significance: "A later printing of the Boros investigator introduced in Ravnica's first story cycle.",
    },
    source: { title: "Wizards — Ravnica, Then and Now", url: "https://magic.wizards.com/en/news/feature/ravnica-then-and-now-2012-08-29-0" },
  },
  {
    id: "szadek",
    name: "Szadek",
    title: "Lord of Secrets",
    origin: "Ravnica",
    role: "Vampire founder of House Dimir",
    summary: "The hidden guildmaster whose manipulation of the Decamillennial crisis shattered the ancient Guildpact.",
    biography: [
      "Szadek was the elusive founder of House Dimir, the guild that cultivated secrecy and misinformation across Ravnica.",
      "During the Decamillennial crisis, his machinations led Agrus Kos to discover and arrest him, triggering the Guildpact's collapse.",
    ],
    chapterIds: ["many-worlds"],
    featuredCard: {
      name: "Szadek, Lord of Secrets", setCode: "rav", collectorNumber: "234",
      scryfallId: "2882793e-5d7d-47f0-9308-652a5e036c2c", artist: "Donato Giancola",
      significance: "The original depiction of Ravnica's hidden Dimir founder.",
    },
    source: { title: "Wizards — A Flavorful Guide to the Guilds of Ravnica", url: "https://magic.wizards.com/en/news/feature/flavorful-guide-guilds-ravnica-2018-10-03" },
  },
  {
    id: "teysa-karlov",
    name: "Teysa Karlov",
    title: "Orzhov Negotiator",
    origin: "Ravnica",
    role: "Orzhov aristocrat and political strategist",
    summary: "A resourceful Orzhov leader who navigated the chaos following the first Guildpact's destruction.",
    biography: [
      "Teysa worked within the Orzhov Syndicate's world of contracts, debts, and political leverage.",
      "During the struggles that followed the broken Guildpact she allied with Agrus Kos to confront threats to Ravnica's future.",
    ],
    chapterIds: ["many-worlds"],
    featuredCard: {
      name: "Teysa, Orzhov Scion", setCode: "gpt", collectorNumber: "134",
      scryfallId: "9eb856e6-8f63-4048-9818-cc3e65748855", artist: "Todd Lockwood",
      significance: "The original Guildpact portrait of the Orzhov leader.",
    },
    source: { title: "Wizards — Ravnica, Then and Now", url: "https://magic.wizards.com/en/news/feature/ravnica-then-and-now-2012-08-29-0" },
  },
  {
    id: "nahiri",
    name: "Nahiri",
    title: "The Lithomancer",
    origin: "Zendikar",
    role: "Planeswalker and architect of the hedron prison",
    summary: "A Zendikari lithomancer who built the hedron prison with Ugin and Sorin to contain the Eldrazi.",
    biography: [
      "Nahiri's talent for shaping stone made it possible to construct Zendikar's planet-spanning prison for the Eldrazi titans.",
      "She agreed to defend her home plane after Ugin and Sorin helped lure the Eldrazi into confinement.",
      "Her later conflict with Sorin and actions on Innistrad belong to subsequent stories, not the first Eldrazi awakening.",
      "Much later she was compleated during the attack on New Phyrexia and turned her lithomancy against Zendikar during the invasion.",
    ],
    chapterIds: ["many-worlds", "march-of-the-machine"],
    featuredCard: {
      name: "Nahiri, the Harbinger", setCode: "warm", collectorNumber: "7",
      scryfallId: "45f43bd0-d4d9-4a64-a829-f1ea3dfc9e90", artist: "Kieran Yanner",
      significance: "A 2019 retrospective portrait of the ancient Zendikari lithomancer.",
    },
    source: { title: "Wizards — The Lithomancer", url: "https://magic.wizards.com/en/news/magic-story/the-lithomancer" },
  },
  {
    id: "emrakul",
    name: "Emrakul",
    title: "The Aeons Torn",
    origin: "The Blind Eternities",
    role: "Eldrazi titan",
    summary: "An alien titan whose imprisonment on Zendikar preceded a devastating awakening.",
    biography: [
      "Emrakul is one of three Eldrazi titans imprisoned on Zendikar by Nahiri, Ugin, and Sorin.",
      "The opening of the Eldrazi prison endangered Zendikar and exposed the terrifying scale of the entities once hidden behind the hedron network.",
    ],
    chapterIds: ["many-worlds"],
    featuredCard: {
      name: "Emrakul, the Aeons Torn", setCode: "roe", collectorNumber: "4",
      scryfallId: "67600383-bbb8-411c-b8e6-2296650bc747", artist: "Mark Tedin",
      significance: "Emrakul's first legendary card from Rise of the Eldrazi.",
    },
    source: { title: "Wizards — Battle for Zendikar Story Summary", url: "https://magic.wizards.com/en/news/magic-story/battle-zendikar-story-summary-2015-12-23" },
  },
  {
    id: "sorin",
    name: "Sorin Markov",
    title: "Vampire Planeswalker of Innistrad",
    origin: "Innistrad",
    role: "Planeswalker and creator of Avacyn",
    summary: "An ancient vampire who helped imprison the Eldrazi and created Avacyn to preserve Innistrad's humanity.",
    biography: [
      "Sorin helped Nahiri and Ugin build the system that imprisoned the Eldrazi on Zendikar.",
      "On his home plane of Innistrad he created the angel Avacyn to preserve humanity and a workable balance between prey and predator.",
      "The imprisonment of Avacyn in the Helvault threatened that balance and forced Sorin to confront the limits of his intervention.",
    ],
    chapterIds: ["many-worlds"],
    featuredCard: {
      name: "Sorin, Lord of Innistrad", setCode: "dka", collectorNumber: "142",
      scryfallId: "27bb371f-d49f-41bd-bbe0-d5e1e2067e36", artist: "Michael Komarck",
      significance: "The Dark Ascension portrait of Innistrad's vampire planeswalker.",
    },
    source: { title: "Wizards — Innistrad Plane Guide", url: "https://magic.wizards.com/en/story/innistrad-plane" },
  },
  {
    id: "avacyn",
    name: "Avacyn",
    title: "Angel of Hope",
    origin: "Innistrad",
    role: "Angelic protector of humanity",
    summary: "Sorin's creation who protected Innistrad until Griselbrand trapped her in the Helvault.",
    biography: [
      "Sorin created Avacyn to protect humanity from supernatural predators and to maintain Innistrad's precarious balance.",
      "Griselbrand tricked her into imprisoning herself with him in the Helvault, weakening the church's protective wards.",
      "Her release in Avacyn Restored marked a renewal of hope, though not a permanent end to the plane's dangers.",
    ],
    chapterIds: ["many-worlds"],
    featuredCard: {
      name: "Avacyn, Angel of Hope", setCode: "avr", collectorNumber: "6",
      scryfallId: "ba149706-cd17-4da6-8403-ccfe2d6cb437", artist: "Jason Chan",
      significance: "The original Avacyn Restored representation of her return.",
    },
    source: { title: "Wizards — Innistrad Plane Guide", url: "https://magic.wizards.com/en/story/innistrad-plane" },
  },
  {
    id: "griselbrand",
    name: "Griselbrand",
    title: "Demon of the Helvault",
    origin: "Innistrad",
    role: "Demon and adversary of Avacyn",
    summary: "A demon who drew Avacyn into the Helvault, becoming the target of Liliana Vess's pursuit.",
    biography: [
      "Griselbrand tricked Avacyn into the Helvault, taking Innistrad's protector out of the conflict.",
      "He was also one of the demon creditors to whom Liliana Vess owed a terrible magical bargain.",
    ],
    chapterIds: ["many-worlds"],
    featuredCard: {
      name: "Griselbrand", setCode: "avr", collectorNumber: "106",
      scryfallId: "b51666ae-2aef-4cb1-9cd4-44aec81530f8", artist: "Igor Kieryluk",
      significance: "The Avacyn Restored depiction of the demon who helped cause the Helvault crisis.",
    },
    source: { title: "Wizards — Planeswalker's Guide to Avacyn Restored, Part 2", url: "https://magic.wizards.com/en/news/feature/planeswalkers-guide-to-avacyn-restored-part-2" },
  },
  // Phase 36 — The Nine Titans and the final assault on Phyrexia
  {
    id: "tevesh-szat",
    name: "Tevesh Szat",
    title: "The Traitor Among the Nine Titans",
    origin: "Dominaria",
    role: "Ancient planeswalker, manipulator, and member of the Nine Titans",
    summary:
      "A ruthless planeswalker whose betrayal of Urza's Nine Titans exposed the desperate compromises behind the assault on Phyrexia.",
    biography: [
      "Before the Phyrexian Invasion, Tevesh Szat was an ancient and destructive force in Dominaria's history. His schemes contributed to upheaval in Sarpadia and other civilizations long before the Weatherlight's final campaign.",
      "Urza recruited Szat into the Nine Titans, nine planeswalkers who attacked Phyrexia in Titan Engines. The arrangement was strategically useful but profoundly dangerous because Szat had never abandoned his own ambitions.",
      "Szat betrayed the mission and murdered the planeswalkers Daria and Kristina. Urza had anticipated the betrayal and killed Szat, using his life essence to power the soul bombs meant to devastate Phyrexia.",
      "His story illustrates both the threat of treachery within the Nine Titans and Urza's willingness to weaponize the death of an ally. Tevesh Szat later received a planeswalker card in Commander Legends, long after the events it recalls.",
    ],
    chapterIds: ["ice-age", "weatherlight"],
    featuredCard: {
      name: "Tevesh Szat, Doom of Fools",
      setCode: "cmr",
      collectorNumber: "153",
      scryfallId: "8f244716-78ab-46f5-b6e9-fc1e6db28052",
      artist: "Livia Prima",
      significance:
        "Tevesh Szat's later legendary planeswalker card, representing a villain whose betrayal damaged Urza's Nine Titans.",
    },
    source: {
      title: "Wizards of the Coast — The Legendary Characters of Commander Legends, Part 1",
      url: "https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30",
    },
  },

  // Phase 35 — Rath, the Stronghold, and the Weatherlight's losses
  {
    id: "crovax",
    name: "Crovax",
    title: "The Cursed Nobleman",
    origin: "Dominaria",
    role: "Weatherlight companion, vampire, and later evincar of Rath",
    summary:
      "A former Weatherlight companion whose bond with Selenia brought a vampiric curse and whose fall led him to rule Rath.",
    biography: [
      "Crovax was a Dominarian nobleman whose household was afflicted by a curse bound to the angel Selenia. After releasing her from the artifact that held her, he lost her to Volrath and joined the Weatherlight's journey to Rath in hopes of finding her.",
      "During the rescue mission at Volrath's Stronghold, Selenia attacked Mirri. To save his companion, Crovax killed the angel, unwittingly fulfilling the curse that transformed him into a vampire.",
      "The change consumed his former loyalties. After an injured Mirri followed him when he left the Weatherlight, Crovax killed her, severing another bond to the crew and Gerrard's life.",
      "Crovax later served Phyrexian interests on Rath. With Ertai's assistance, he killed the returning Volrath and claimed the title of evincar, a transformation represented by the later card Ascendant Evincar.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Crovax the Cursed",
      setCode: "sth",
      collectorNumber: "55",
      scryfallId: "88a9b76d-6ce1-40d4-bc04-7ae6237f5eaf",
      artist: "Pete Venters",
      significance:
        "A Stronghold depiction of Crovax following his transformation into a vampire through Selenia's death.",
    },
    source: {
      title: "Wizards of the Coast — Face Cards, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/face-cards-part-1-2018-11-19",
    },
  },
  {
    id: "mirri",
    name: "Mirri",
    title: "The Weatherlight's Cat Warrior",
    origin: "Dominaria — Llanowar",
    role: "Cat warrior and Weatherlight crew member",
    summary:
      "A skilled fighter and Gerrard's longtime friend whose loyalty could not save her from Crovax's curse and betrayal.",
    biography: [
      "Mirri was a cat warrior raised among the elves of Llanowar, where her friendship with Gerrard formed an important part of her life. Her speed and combat abilities made her a valued member of the Weatherlight crew.",
      "When the crew invaded Volrath's Stronghold to rescue Sisay, Mirri intervened during an encounter with the angel Selenia and was badly injured. Crovax killed Selenia to protect her, completing the curse that made him a vampire.",
      "Mirri remained loyal to her companions. After the encounter, she followed Crovax when he departed the Weatherlight, and he killed her. Her death was one of the defining personal losses of the Rath expedition.",
      "The original Exodus card Mirri, Cat Warrior depicts her as part of the main Weatherlight continuity. Mirri the Cursed, published later in Planar Chaos, depicts an alternative reality and not her canonical fate.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Mirri, Cat Warrior",
      setCode: "exo",
      collectorNumber: "114",
      scryfallId: "6d1682dd-5a99-4bee-a2c2-c8735047e1a9",
      artist: "Daren Bader",
      significance:
        "Mirri's Exodus legendary card, issued during the story of the crew's escape from Rath.",
    },
    source: {
      title: "Wizards of the Coast — The Making of a Legend",
      url: "https://magic.wizards.com/en/news/making-magic/making-legend-2003-08-25",
    },
  },
  {
    id: "ertai",
    name: "Ertai",
    title: "The Wizard Left Behind",
    origin: "Dominaria — Tolaria",
    role: "Tolarian wizard and later Phyrexian agent",
    summary:
      "A talented, boastful Weatherlight mage whose efforts to open an escape portal left him stranded on Rath and vulnerable to corruption.",
    biography: [
      "Ertai was a talented Tolarian wizard known for his mastery of countermagic and his considerable confidence in his own abilities. He joined the Weatherlight during the search for Captain Sisay.",
      "After the Predator damaged the Weatherlight's ability to cross planes, Ertai helped open an escape portal on Rath. The crew used the Legacy's Skyshaper to reach it before it closed, but the escape left Ertai stranded on the enemy plane.",
      "His isolation and subsequent experiences under Phyrexian influence transformed him. Ertai aided Crovax during the struggle for leadership of Rath and was depicted as Ertai, the Corrupted in Planeshift.",
      "The later Dominaria United storyline resurrected Ertai centuries after his original death. His original Exodus and Planeshift cards record the much earlier journey from young wizard to fallen antagonist.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Ertai, Wizard Adept",
      setCode: "exo",
      collectorNumber: "33",
      scryfallId: "91971e19-61ce-45ac-b700-9ffca5091a27",
      artist: "Terese Nielsen",
      significance:
        "Ertai as a talented young mage before being stranded on Rath and later transformed by Phyrexia.",
    },
    source: {
      title: "Wizards of the Coast — Face Cards, Part 2",
      url: "https://magic.wizards.com/en/news/making-magic/face-cards-part-2-2018-12-03",
    },
  },
  // Phase 34 — The Weatherlight Saga
  {
    id: "sisay",
    name: "Captain Sisay",
    title: "Captain of the Weatherlight",
    origin: "Dominaria — Jamuraa",
    role: "Skyship captain and leader of the Legacy expedition",
    summary:
      "The steadfast Weatherlight captain whose leadership united its crew and whose capture drew Gerrard back to the Legacy's mission.",
    biography: [
      "Sisay captained the Weatherlight and helped gather the people and artifacts associated with Urza's Legacy. She believed in Gerrard's destiny even when he rejected it, and her judgment held together a crew of very different companions.",
      "Volrath captured Sisay and took her to Rath. Rescuing her was the immediate reason Gerrard returned to the Weatherlight and led the expedition through the enemy stronghold.",
      "After her rescue, Sisay remained a central leader as the crew escaped Rath, survived Mercadia, and returned to face the Phyrexian invasion of Dominaria.",
      "Her Modern Horizons card revisits a captain first established in the original Weatherlight-era storytelling, emphasizing the legendary companions she sought to bring together.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Sisay, Weatherlight Captain",
      setCode: "mh1",
      collectorNumber: "29",
      scryfallId: "5a293c45-1e73-4527-be2f-2dcd5c47b610",
      artist: "Anna Steinbauer",
      significance:
        "A later portrait of the Weatherlight's captain, whose capture begins the crew's rescue mission to Rath.",
    },
    source: {
      title: "Wizards of the Coast — Weather(light) Report",
      url: "https://magic.wizards.com/en/news/making-magic/weatherlight-report-2007-12-03",
    },
  },
  {
    id: "volrath",
    name: "Volrath",
    title: "Evincar of Rath",
    origin: "Dominaria — Jamuraa; later Rath",
    role: "Phyrexian shapeshifter and ruler of Rath",
    summary:
      "Once Gerrard's foster brother Vuel, Volrath ruled Rath for Phyrexia and infiltrated the Weatherlight crew through a dangerous disguise.",
    biography: [
      "Known as Vuel in his youth, Volrath grew up alongside Gerrard under Sidar Kondo's care. His resentment toward Gerrard helped turn their personal bond into a lasting enmity.",
      "As evincar of Rath, Volrath ruled from the Stronghold and served the Phyrexian plan to use the artificial plane as a staging ground for the invasion of Dominaria.",
      "He abducted Captain Sisay, bringing Gerrard back into the Weatherlight's mission. When the crew freed its captives, Volrath escaped Rath disguised as Takara, Starke's daughter, and traveled with the group to Mercadia.",
      "On Mercadia, Volrath's deception led to Starke's murder and further fractured the crew's trust. His schemes were part of a wider campaign stretching beyond one plane or one rivalry.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Volrath the Fallen",
      setCode: "nms",
      collectorNumber: "75",
      scryfallId: "08bdd66e-9ca1-456e-a61c-7c96cf6f7c56",
      artist: "Kev Walker",
      significance:
        "A Nemesis depiction of the Phyrexian shapeshifter who ruled Rath and deceived the Weatherlight crew.",
    },
    source: {
      title: "Wizards of the Coast — Face Cards, Part 2",
      url: "https://magic.wizards.com/en/news/making-magic/face-cards-part-2-2018-12-03",
    },
  },
  {
    id: "hanna",
    name: "Hanna",
    title: "The Weatherlight's Navigator",
    origin: "Dominaria — Tolaria",
    role: "Navigator, artificer, and magical engineer",
    summary:
      "A gifted Tolarian artificer who maintained the Weatherlight's technology and whose death in the Phyrexian invasion devastated its crew.",
    biography: [
      "Hanna was the daughter of Barrin and Rayne and studied at Tolaria. Though her father wanted her to pursue spellcraft, her own strengths and interests lay with magical objects and engineering.",
      "She served aboard the Weatherlight as navigator and artificer, using her expertise to maintain its extraordinary machinery and the artifacts tied to the Legacy.",
      "Hanna and Gerrard had shared a close romantic relationship before his departure from the ship. His return after Sisay's abduction forced them to confront the consequences of that earlier separation.",
      "During the Phyrexian invasion, Hanna died from a Phyrexian plague. Her loss represented both a personal tragedy and a severe blow to the crew's knowledge and experience.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Hanna, Ship's Navigator",
      setCode: "inv",
      collectorNumber: "249",
      scryfallId: "83a4e48d-6452-4245-bdad-63fe3263550e",
      artist: "Dave Dorman",
      significance:
        "Hanna's Invasion card commemorates the artificer and navigator whose life ended during the war against Phyrexia.",
    },
    source: {
      title: "Wizards of the Coast — Face Cards, Part 2",
      url: "https://magic.wizards.com/en/news/making-magic/face-cards-part-2-2018-12-03",
    },
  },

  // =========================================
  // Chapter 03 — Jaya Ballard
  // =========================================
  {
    id: "jaya",
    name: "Jaya Ballard",
    title: "The Task Mage of the Ice Age",
    origin: "Dominaria — Terisiare",
    role: "Pyromancer, task mage, and later planeswalker",
    summary:
      "A renowned pyromancer and longtime friend of Jodah, whose courage and magical abilities helped defend Dominaria during and after the Ice Age.",
    biography: [
      "Jaya Ballard became known as a resourceful task mage and an exceptionally talented wielder of fire magic. Her adventures brought her into the dangerous political and magical struggles of Terisiare.",
      "Her friendship with Jodah endured across centuries. Together, they played a crucial role in bringing the Kjeldoran and Balduvian factions into cooperation against the necromancer Lim-Dûl.",
      "Jaya's life extended beyond the end of the Ice Age. Her planeswalker spark eventually ignited, beginning another chapter in a career that connected several distinct eras of Dominarian history.",
      "Although her name first appeared in Ice Age card flavor text, Jaya received a legendary creature card in Time Spiral, followed by later cards depicting her as a planeswalker.",
      "She later mentored Chandra Nalaar and died defending Dominaria amid Sheoldred’s sleeper-agent conspiracy.",
    ],
    chapterIds: ["ice-age", "march-of-the-machine"],
    featuredCard: {
      name: "Jaya Ballard, Task Mage",
      setCode: "tsp",
      collectorNumber: "166",
      scryfallId: "a1f85b2a-7836-4058-87a5-859c4311a7e4",
      artist: "Matt Cavotta",
      significance:
        "Jaya as a task mage, before her later depiction as a planeswalker.",
    },
    source: {
      title:
        "Wizards of the Coast — The Legends You'll Find in Dominaria United",
      url: "https://magic.wizards.com/en/news/feature/legends-youll-find-dominaria-united-2022-09-01",
    },
  },

  // =========================================
  // Chapter 03 — Lim-Dûl
  // =========================================
  {
    id: "lim-dul",
    name: "Lim-Dûl",
    title: "The Necromancer of the Ice Age",
    origin: "Dominaria — Terisiare",
    role: "Necromancer and commander of undead armies",
    summary:
      "A powerful necromancer whose ambitions and undead forces threatened the kingdoms of Terisiare during Dominaria's long winter.",
    biography: [
      "Lim-Dûl pursued magical and political power during Dominaria's Ice Age, when the kingdoms of Terisiare were already strained by generations of environmental hardship and warfare.",
      "His mastery of necromancy allowed him to raise and command undead forces, adding a supernatural threat to the conflicts of the frozen kingdoms.",
      "Jodah and Jaya Ballard became important opponents of Lim-Dûl. Resistance to his ambitions encouraged cooperation between the rival Kjeldoran and Balduvian factions.",
      "Lim-Dûl became one of the enduring figures associated with the Ice Age storyline. His legendary creature card appeared in Time Spiral, years after the original Ice Age expansion.",
    ],
    chapterIds: ["ice-age"],
    featuredCard: {
      name: "Lim-Dûl the Necromancer",
      setCode: "tsp",
      collectorNumber: "114",
      scryfallId: "b8a3cdfe-0289-474b-b9c4-07e8c6588ec5",
      artist: "Matt Cavotta",
      significance:
        "A Time Spiral depiction of Lim-Dûl, whose undead armies threatened Terisiare.",
    },
    source: {
      title:
        "Wizards of the Coast — The Legends You'll Find in Dominaria United",
      url: "https://magic.wizards.com/en/news/feature/legends-youll-find-dominaria-united-2022-09-01",
    },
  },

  // =========================================
  // The Brothers' War — Kayla bin-Kroog
  // =========================================
  {
    id: "kayla",
    name: "Kayla bin-Kroog",
    title: "The Queen Who Endured",
    origin: "Dominaria — Yotia and Argive",
    role: "Yotian noble, queen, and historical chronicler",
    summary:
      "A royal figure whose life was transformed by Urza's war with Mishra, and whose leadership helped preserve her people after catastrophe.",
    biography: [
      "Kayla bin-Kroog belonged to the ruling family of Yotia. Her marriage to Urza connected the artificer to Yotian political power, placing her close to the origins and escalation of the Brothers' War.",
      "The destruction of Kroog devastated the world Kayla had known. She survived the attack and became a leader for people displaced by the war, facing political and humanitarian consequences that neither brother's inventions could solve.",
      "Kayla's experiences continued beyond the final battle on Argoth. As the climate deteriorated and surviving communities struggled to adapt, she worked to preserve order and protect the people under her care.",
      "Her account, The Antiquities War, became an important historical record of the conflict. Her perspective preserved not simply the actions of Urza and Mishra but the suffering and resilience of those who lived through their decisions.",
    ],
    chapterIds: ["brothers-war", "ice-age"],
    featuredCard: {
      name: "Queen Kayla bin-Kroog",
      setCode: "bro",
      collectorNumber: "218",
      scryfallId: "685c9767-eaa7-4e16-b245-816181e2fc36",
      artist: "Cristi Balanescu",
      significance:
        "A depiction of Kayla as a leader whose role continued beyond the military conflict between Urza and Mishra.",
    },
    source: {
      title: "Wizards of the Coast — The Brothers' War, Episode 1: The End",
      url: "https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-1-the-end",
    },
  },

  // =========================================
  // The Brothers' War — Tawnos
  // =========================================
  {
    id: "tawnos",
    name: "Tawnos",
    title: "The Apprentice Who Questioned War",
    origin: "Dominaria — Terisiare",
    role: "Artificer, inventor, and apprentice of Urza",
    summary:
      "A gifted inventor who served Urza during the Brothers' War and later confronted the destructive legacy of the machines they built.",
    biography: [
      "Tawnos became a student and close associate of Urza, developing an exceptional understanding of machinery and powerstone-driven inventions. His talents helped support the engineering projects of Urza's forces.",
      "Unlike the two brothers, whose rivalry came to dominate their lives, Tawnos maintained relationships across the conflict. His connection with Ashnod, an artificer associated with Mishra, revealed the possibility of cooperation beyond opposing military loyalties.",
      "During the war, Tawnos experienced imprisonment and was eventually freed through Ashnod's intervention. His experiences exposed him to the personal consequences of the struggle between their respective leaders.",
      "After the devastation of Argoth, Tawnos continued working with mechanical technology in the changed world. His efforts to serve civilian communities forced him to confront the danger that machines designed for peaceful use could once again become instruments of war.",
    ],
    chapterIds: ["brothers-war", "ice-age"],
    featuredCard: {
      name: "Tawnos, the Toymaker",
      setCode: "bro",
      collectorNumber: "222",
      scryfallId: "1f855a7e-3a97-4b62-a2a7-06ff1fbb2c4c",
      artist: "Livia Prima",
      significance:
        "Represents Tawnos's inventive approach to mechanical life and his interests beyond military artifice.",
    },
    source: {
      title:
        "Wizards of the Coast — The Brothers' War, Episode 2: The Beginning",
      url: "https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-2-the-beginning",
    },
  },

  // =========================================
  // The Brothers' War — Ashnod
  // =========================================
  {
    id: "ashnod",
    name: "Ashnod",
    title: "The Flesh Mechanist",
    origin: "Dominaria — Terisiare",
    role: "Artificer and researcher of flesh and machinery",
    summary:
      "A brilliant but ruthless artificer associated with Mishra, whose experiments and independent decisions shaped the Brothers' War.",
    biography: [
      "Ashnod was an accomplished artificer whose inventions and experiments explored the manipulation of living bodies through machinery and magical power. Her methods were frequently cruel, reflecting the moral costs of the technological arms race.",
      "Ashnod worked within Mishra's sphere of influence and contributed to the development of increasingly destructive technologies. Her relationship with Mishra was complicated by her independence and the growing Phyrexian influence around him.",
      "Despite their opposing loyalties, Ashnod developed an important connection with Tawnos, Urza's apprentice. During the conflict, she helped him escape captivity, a choice that demonstrated her willingness to act against expectations imposed by the war.",
      "Her story illustrates a central contradiction of the Brothers' War: extraordinary technical ingenuity flourished while the political ambitions surrounding it caused immense suffering.",
    ],
    chapterIds: ["brothers-war"],
    featuredCard: {
      name: "Ashnod, Flesh Mechanist",
      setCode: "bro",
      collectorNumber: "84",
      scryfallId: "5eb43c15-50a9-488f-b0be-84a5e0a6d10b",
      artist: "Howard Lyon",
      significance:
        "Depicts Ashnod's experiments with powerstones, flesh, and constructed beings.",
    },
    source: {
      title: "Wizards of the Coast — Act of War, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/act-of-war-part-1",
    },
  },

  // =========================================
  // The Brothers' War — Mishra
  // =========================================
  {
    id: "mishra",
    name: "Mishra",
    title: "The Brother Lost to Phyrexia",
    origin: "Dominaria — Terisiare",
    role: "Artificer, Fallaji commander, and war leader",
    summary:
      "Urza's gifted younger brother, whose rivalry, military ambitions, and Phyrexian corruption helped devastate Terisiare.",
    biography: [
      "Mishra studied ancient Thran artifacts alongside his brother Urza under the archaeologist Tocasia. Their discovery of two halves of a powerful stone helped ignite the rivalry that would define both their lives.",
      "After Tocasia's death, Mishra separated from Urza and rose to prominence among the Fallaji. His talents as an artificer and his growing influence turned a family conflict into a struggle between powerful factions.",
      "As the war continued, the Phyrexian praetor Gix took advantage of Mishra's ambitions. Mishra became increasingly entangled with Phyrexian influence, and his eventual transformation symbolized how far the conflict had moved beyond its original causes.",
      "Mishra's final confrontation with Urza took place on Argoth. Urza's activation of the Golgothian Sylex brought the war to a catastrophic end, leaving the brothers' legacy inseparable from the devastation of Dominaria.",
    ],
    chapterIds: ["brothers-war"],
    featuredCard: {
      name: "Mishra, Tamer of Mak Fawa",
      setCode: "bro",
      collectorNumber: "217",
      scryfallId: "585a753d-a692-474a-bc28-48dd93b73ace",
      artist: "Darren Tan",
      significance:
        "Mishra as a powerful artificer and leader before the ultimate consequences of his Phyrexian corruption.",
    },
    source: {
      title: "Wizards of the Coast — The Brothers' War Card Stories, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/the-brothers-war-card-stories-part-1",
    },
  },

  // =========================================
  // The Brothers' War — Tocasia
  // =========================================
  {
    id: "tocasia",
    name: "Tocasia",
    title: "Mentor of the Brothers",
    origin: "Dominaria — Terisiare",
    role: "Archaeologist, artificer, and teacher",
    summary:
      "An archaeologist who guided Urza and Mishra through the ruins of the Thran before their rivalry brought tragedy to her camp.",
    biography: [
      "Tocasia was an experienced archaeologist whose investigations of ancient Thran ruins provided the setting for Urza and Mishra's early studies. She helped nurture their interest in artifice and the forgotten civilizations of Dominaria.",
      "The brothers' discoveries at the Caves of Koilos brought them into possession of the Mightstone and Weakstone. As their rivalry grew, the artifacts increasingly became objects of conflict rather than shared curiosity.",
      "Tocasia died when she attempted to intervene in a confrontation between the brothers. Her death ended their life together under her guidance and became one of the defining tragedies preceding the Brothers' War.",
      "The Brothers' War expansion later depicted Tocasia on a legendary creature card, giving an important early figure in the story her own representation in the illustrated historical record.",
    ],
    chapterIds: ["brothers-war"],
    featuredCard: {
      name: "Tocasia, Dig Site Mentor",
      setCode: "bro",
      collectorNumber: "360",
      scryfallId: "25d759dc-0501-481a-8330-005f83b999d7",
      artist: "Lie Setiawan",
      significance:
        "An extended-art depiction of Tocasia, the archaeologist who mentored Urza and Mishra.",
    },
    source: {
      title: "Wizards of the Coast — Act of War, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/act-of-war-part-1",
    },
  },

  // =========================================
  // The Brothers' War — Gix
  // =========================================
  {
    id: "gix",
    name: "Gix",
    title: "Praetor of Old Phyrexia",
    origin: "Dominaria (Thran Empire); later Phyrexia",
    role: "Former Thran rebel, later Phyrexian praetor and agent of Yawgmoth",
    summary:
      "A former Untouchable rebel from Halcyon who became a Phyrexian praetor and later helped corrupt Mishra during the Brothers' War.",
    biography: [
      "In Halcyon, Gix began as a human among the Untouchables, whose sickness and exclusion were linked to the Thran Empire's dependence on powerstones. He attacked Glacian with a powerstone shard during unrest at the Mana Rig.",
      "Yawgmoth later used access to phthisis treatment as leverage over the outcasts and their leaders. Gix was drawn into his growing power before being transformed into a Phyrexian servant.",
      "Gix was a powerful servant of Yawgmoth and one of the major Phyrexian figures involved in the events surrounding the Brothers' War.",
      "His influence reached Dominaria while Urza and Mishra were fighting for control of Terisiare. Rather than acting as an ordinary military commander, Gix worked to extend Phyrexian power through the conflict already underway.",
      "Mishra's growing dependence on Phyrexian forces enabled Gix's influence to become part of the war's central story. The brother's ultimate corruption reflected the danger of treating those forces as instruments of personal ambition.",
      "Gix's involvement helped connect the ancient origins of Phyrexia to the later struggles against Yawgmoth, making the Brothers' War an important chapter in a much longer conflict.",
    ],
    chapterIds: ["thran", "brothers-war"],
    featuredCard: {
      name: "Gix, Yawgmoth Praetor",
      setCode: "bro",
      collectorNumber: "95",
      scryfallId: "2c76f7e0-37e7-4e87-93a3-a25ba0674645",
      artist: "Anna Podedworna",
      significance:
        "Gix as a legendary Phyrexian praetor in The Brothers' War.",
    },
    source: {
      title: "Wizards of the Coast — The Brothers' War Card Stories, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/the-brothers-war-card-stories-part-1",
    },
  },

  // =========================================
  // Urza
  // =========================================
  {
    id: "urza",
    name: "Urza",
    title: "The Architect of Destiny",
    origin: "Dominaria",
    role: "Artificer and planeswalker",
    summary:
      "A master artificer whose rivalry with Mishra and long war against Phyrexia reshaped Dominaria.",
    biography: [
      "Urza and his brother Mishra discovered ancient Thran powerstones that would divide their family. Their rivalry escalated into the Brothers’ War, ending with the devastation of Argoth and the ignition of Urza’s planeswalker spark.",
      "Urza dedicated the following centuries to defeating Yawgmoth and Phyrexia. He developed elaborate plans, including the Legacy and preparations that ultimately involved the Weatherlight and its crew.",
      "His achievements carried immense costs. Urza was willing to sacrifice others in pursuit of victory, making his legacy both historically significant and morally complicated.",
    ],
    chapterIds: ["brothers-war", "weatherlight"],
    featuredCard: {
      name: "Urza, Lord Protector",
      setCode: "bro",
      collectorNumber: "225",
      scryfallId: "8aefe8bd-216a-4ec1-9362-3f9dbf7fd083",
      artist: "Ryan Pancoast",
      significance:
        "Urza during the Brothers’ War, before the Sylex Blast transformed his existence.",
    },
    source: {
      title: "Wizards of the Coast — Urza",
      url: "https://magic.wizards.com/en/story/urza-planeswalker",
    },
  },

  // =========================================
  // Yawgmoth
  // =========================================
  {
    id: "yawgmoth",
    name: "Yawgmoth",
    title: "The Father of Machines",
    origin: "Dominaria",
    role: "Thran physician and ruler of Phyrexia",
    summary:
      "A Thran physician whose ambition transformed an artificial plane into the center of Phyrexian power.",
    biography: [
      "Yawgmoth entered the Thran capital of Halcyon during a medical crisis. His knowledge and political maneuvering helped him acquire influence, even as his increasingly ruthless experiments threatened the civilization.",
      "The planeswalker Dyfed introduced him to the artificial plane of Phyrexia. Yawgmoth did not originally create that plane; he took control of it and reshaped its inhabitants according to his vision.",
      "Phyrexia became a threat to Dominaria across thousands of years, from the influence of Gix during the Brothers’ War to the invasion opposed by Urza and the Weatherlight crew.",
    ],
    chapterIds: ["thran", "brothers-war", "weatherlight"],
    featuredCard: {
      name: "Yawgmoth, Thran Physician",
      setCode: "mh1",
      collectorNumber: "116",
      scryfallId: "8690cbcc-f8fd-41f7-9e28-e61c12b04014",
      artist: "Mark Winters",
      significance:
        "Yawgmoth before his transformation into the ruler of Phyrexia.",
    },
    source: {
      title: "Wizards of the Coast — The Known Multiverse",
      url: "https://magic.wizards.com/en/news/feature/known-mutliverse-2008-03-19",
    },
  },

  // =========================================
  // Karn
  // =========================================
  {
    id: "karn",
    name: "Karn",
    title: "The Silver Golem",
    origin: "Dominaria",
    role: "Construct, Legacy component, and planeswalker",
    summary:
      "Created by Urza, Karn became a compassionate member of the Weatherlight crew and later a planeswalker.",
    biography: [
      "Karn was created by Urza as a silver golem and became an important component of the Legacy. His gentle disposition contrasted with the destructive purposes of many machines around him.",
      "As part of the Weatherlight crew, Karn was drawn into the struggle against Phyrexia. His role in the Legacy helped make the final confrontation with Yawgmoth possible.",
      "Karn survived that conflict and became a planeswalker. His later creation of an artificial world would have consequences for another era of Magic’s history.",
      "As New Phyrexia tried to invade every plane, Karn helped end Elesh Norn’s rule and later sacrificed his remaining spark to help save Nissa and Ajani.",
    ],
    chapterIds: ["weatherlight", "otaria", "mending", "march-of-the-machine"],
    featuredCard: {
      name: "Karn, Silver Golem",
      setCode: "usg",
      collectorNumber: "298",
      scryfallId: "811a0988-2900-426c-9413-8f1778d99678",
      artist: "Mark Zug",
      significance:
        "Karn’s original legendary creature card, released during the Urza’s Saga block.",
    },
    source: {
      title: "Wizards of the Coast — Face Cards, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/face-cards-part-1-2018-11-19",
    },
  },

  // =========================================
  // Jodah
  // =========================================
  {
    id: "jodah",
    name: "Jodah",
    title: "The Eternal Archmage",
    origin: "Dominaria",
    role: "Archmage and historian",
    summary:
      "An exceptionally long-lived wizard who preserved magical knowledge across the Dark Age and Ice Age.",
    biography: [
      "Jodah emerged during the troubled centuries that followed the Brothers’ War. His early experiences took place when magical knowledge was feared and its practitioners could face persecution.",
      "His remarkable lifespan allowed him to witness centuries of Dominarian history. Alongside Jaya Ballard, he played an important role in the struggle against Lim-Dûl during the Ice Age.",
      "Jodah survived into much later ages, becoming a living connection between the ancient history of Dominaria and its newer generations.",
    ],
    chapterIds: ["ice-age", "mending"],
    featuredCard: {
      name: "Jodah, Archmage Eternal",
      setCode: "dom",
      collectorNumber: "198",
      scryfallId: "1ee86efa-248e-4251-b734-f8ad3e8a0344",
      artist: "Yongjae Choi",
      significance:
        "A later depiction of Jodah, whose life spans multiple major historical periods.",
    },
    source: {
      title: "Wizards of the Coast — Legends of Dominaria United",
      url: "https://magic.wizards.com/en/news/feature/legends-youll-find-dominaria-united-2022-09-01",
    },
  },

  // =========================================
  // Gerrard Capashen
  // =========================================
  {
    id: "gerrard",
    name: "Gerrard Capashen",
    title: "Hero of the Weatherlight",
    origin: "Dominaria",
    role: "Warrior and Legacy hero",
    summary:
      "The central hero of the Weatherlight Saga, whose destiny became inseparable from the Legacy.",
    biography: [
      "Gerrard was bound to Urza’s long-term plans for confronting Phyrexia. Despite his importance to the Legacy, he initially resisted the destiny others had arranged for him.",
      "His return to the Weatherlight helped bring together its crew for the rescue of Sisay and the subsequent adventures on Rath and Mercadia.",
      "During the invasion of Dominaria, Gerrard faced devastating personal losses. His final decisions were essential to bringing the Legacy to completion and ending Yawgmoth’s invasion.",
    ],
    chapterIds: ["weatherlight"],
    featuredCard: {
      name: "Gerrard Capashen",
      setCode: "apc",
      collectorNumber: "11",
      scryfallId: "ccca800f-e850-4bec-95d0-70280b51b7a7",
      artist: "Brom",
      significance:
        "Gerrard as depicted in Apocalypse, the concluding expansion of the original Weatherlight Saga.",
    },
    source: {
      title: "Wizards of the Coast — Weather(light) Report",
      url: "https://magic.wizards.com/en/news/making-magic/weatherlight-report-2007-12-03",
    },
  },

  // =========================================
  // Glacian
  // =========================================
  {
    id: "glacian",
    name: "Glacian",
    title: "The Father of Powerstone Artifice",
    origin: "Dominaria",
    role: "Thran engineer and powerstone inventor",
    summary:
      "The brilliant Thran engineer whose powerstones powered an empire and whose inventions shaped the conflicts of later ages.",
    biography: [
      "Glacian discovered how to create powerstones, crystals capable of storing extraordinary amounts of magical energy. His inventions became fundamental to the machines, infrastructure, and achievements of the ancient Thran Empire.",
      "Glacian was married to Rebbec, one of the empire's greatest architects. Their accomplishments were closely intertwined: powerstones supported the extraordinary structures Rebbec designed, including the floating Thran Temple above Halcyon.",
      "The technologies Glacian pioneered were also linked to phthisis, a devastating illness afflicting the Thran. When Glacian became gravely ill, Rebbec used her influence to bring the physician Yawgmoth to Halcyon.",
      "Yawgmoth implanted two halves of a broken powerstone in Glacian's body, draining his life force. Rebbec later used those stones to seal the gateway to Phyrexia. Millennia afterward, Urza and Mishra discovered them and named them the Mightstone and Weakstone.",
    ],
    chapterIds: ["thran"],
    featuredCard: {
      name: "Glacian, Powerstone Engineer",
      setCode: "cmr",
      collectorNumber: "72",
      scryfallId: "a736df42-18e9-4259-b0b8-54d21143e72e",
      artist: "Magali Villeneuve",
      significance:
        "A Commander Legends depiction of Glacian, whose inventions powered Thran civilization and influenced generations of later artificers.",
    },
    source: {
      title:
        "Wizards of the Coast — The Legendary Characters of Commander Legends, Part 2",
      url: "https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-2-2020-11-06",
    },
  },

  // =========================================
  // Rebbec
  // =========================================
  {
    id: "rebbec",
    name: "Rebbec",
    title: "Architect of Ascension",
    origin: "Dominaria",
    role: "Thran architect",
    summary:
      "A celebrated Thran architect whose final choice separated Dominaria from Yawgmoth’s Phyrexia.",
    biography: [
      "Rebbec was one of the greatest architects of the ancient Thran civilization. She incorporated powerstones into extraordinary structures, including the floating Thran Temple above Halcyon.",
      "When her husband Glacian fell ill, Rebbec helped bring the physician Yawgmoth to Halcyon. His growing influence contributed to the destruction of the civilization she had helped build.",
      "Recognizing the threat posed by Phyrexia, Rebbec sealed the gateway between the planes, cutting off Yawgmoth’s immediate path back to Dominaria.",
    ],
    chapterIds: ["thran"],
    featuredCard: {
      name: "Rebbec, Architect of Ascension",
      setCode: "cmr",
      collectorNumber: "42",
      scryfallId: "46975250-950f-4f5d-a7c5-f61aec8e40ad",
      artist: "Magali Villeneuve",
      significance:
        "Depicts the influential Thran architect whose choices shaped Dominaria’s ancient history.",
    },
    source: {
      title: "Wizards of the Coast — Commander Legends Characters",
      url: "https://magic.wizards.com/en/news/card-preview/legendary-characters-commander-legends-part-1-2020-10-30",
    },
  },

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
      "Kamahl began as a formidable Pardic barbarian and gladiator, drawn to Cabal City and the Mirari during the struggle for power on Otaria. He befriended Chainer while competing in the Cabal pits; after Chainer lost control of the Mirari and his nightmares, Kamahl was forced to end his friend’s suffering.",
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
      "When Karona was stabbed with the Mirari sword, Akroma and Zagorka died, but Jeska survived and her planeswalker spark ignited. Karn became her guide, and she would later return to Dominaria during the crisis of the temporal rifts.",
    ],
    chapterIds: ["otaria", "mending"],
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
      title:
        "Wizards of the Coast — Legendary Characters of Commander Legends, Part 1",
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
      "Chainer discovered the Mirari in an abandoned mansion and presented it to the Cabal Patriarch. He and Kamahl formed an unexpected friendship in the pits, but his loyalty to the Cabal and growing distrust of its leadership eventually separated their paths.",
      "Chainer used the Mirari to displace the Patriarch and overwhelm Cabal City with nightmares drawn through dementia magic. As his body was overtaken by the creatures he could no longer control, Kamahl killed him in an act of mercy. His downfall became one of the defining tragedies of the Odyssey block.",
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
  },

  // Chapter 05 — Additional Otarian leaders, rivals, and figures
  {
    id: "cabal-patriarch",
    name: "Cabal Patriarch",
    title: "The First of the Cabal",
    origin: "Dominaria — Otaria",
    role: "Leader of the Cabal and ruler of its arena establishment",
    summary:
      "The First made the Mirari a public prize and manipulated Cabal City through spectacle, patronage, and dark magic.",
    biography: [
      "The Cabal Patriarch, known as the First, wielded political power through the profitable, violent arena culture of Cabal City.",
      "Chainer brought the Mirari to him after its discovery. The First recognized its potential and offered it as a prize that would draw ambitious combatants and rival factions to the games.",
      "Chainer eventually seized the Mirari and temporarily displaced the Patriarch, but the First's wider influence survived this rebellion and later extended to Jeska's transformation into Phage.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Cabal Patriarch",
      setCode: "cmm",
      collectorNumber: "140",
      scryfallId: "9e9a1276-5ad5-44ee-83e5-2d1ab728946e",
      artist: "Mark Zug",
      significance: "A Commander Masters reprint of the original Odyssey-era portrait of the Cabal's First.",
    },
    source: {
      title: "Wizards of the Coast — Commander Masters Storyteller, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/commander-masters-storyteller-part-1",
    },
  },
  {
    id: "braids",
    name: "Braids",
    title: "An Agent of the Cabal",
    origin: "Dominaria — Otaria",
    role: "Cabal operative and dementia caster",
    summary:
      "A ruthless and unpredictable figure whose activities helped the Cabal maintain its reach during the Mirari crisis.",
    biography: [
      "Braids served the Cabal in the era when its pit games and dementia magic shaped Otaria's political life.",
      "She was involved in the movements and return of the Mirari after the artifact passed through the hands of rival powers.",
      "Her original Odyssey card depicts the Cabal's uncompromising methods and the lives sacrificed to preserve its influence.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Braids, Cabal Minion",
      setCode: "ody",
      collectorNumber: "117",
      scryfallId: "4dcdcad5-e4fb-480e-984f-1ac5cdc986b9",
      artist: "Eric Peterson",
      significance: "Braids's original Odyssey portrait, representing the Cabal's harsh internal culture.",
    },
    source: {
      title: "Wizards of the Coast — Commander Masters Storyteller, Part 1",
      url: "https://magic.wizards.com/en/news/making-magic/commander-masters-storyteller-part-1",
    },
  },
  {
    id: "aboshan",
    name: "Aboshan",
    title: "The Cephalid Emperor",
    origin: "Dominaria — Otaria",
    role: "Ruler of the underwater empire",
    summary:
      "A ruler whose attempt to realize his desires through the Mirari caused a devastating flood.",
    biography: [
      "Aboshan ruled the cephalid empire during the crisis that followed the Mirari's discovery on Otaria.",
      "When he obtained the Mirari, his wish for dominion over the sea was magnified into catastrophic magic that flooded great stretches of the continent and devastated his capital.",
      "His destruction demonstrates that a ruler's ambition was no more immune to the Mirari than the desires of a gladiator or a dementia caster.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Aboshan, Cephalid Emperor",
      setCode: "ody",
      collectorNumber: "58",
      scryfallId: "82db4a41-03e8-4f0c-946c-a98fc5c9f7c8",
      artist: "Christopher Moeller",
      significance: "An original Odyssey portrait of the emperor whose use of the Mirari caused disaster.",
    },
    source: {
      title: "Wizards of the Coast — Dominarian Cartography",
      url: "https://magic.wizards.com/en/news/feature/dominarian-cartography-2018-04-20",
    },
  },
  {
    id: "laquatus",
    name: "Ambassador Laquatus",
    title: "The Otarian Intriguer",
    origin: "Dominaria — Otaria",
    role: "Merfolk diplomat and political schemer",
    summary:
      "An ambitious merfolk ambassador who pursued the Mirari through alliances, manipulations, and opportunism.",
    biography: [
      "Laquatus represented the merfolk court but devoted considerable effort to advancing his own position in Otaria's shifting conflicts.",
      "The Mirari offered leverage over the emperor, the Cabal, the Order, and other contenders. Laquatus pursued it through political intrigue rather than the straightforward combat favored by Kamahl.",
      "His continuing attempts to seize its power contributed to the conflicts that brought Kamahl to his final decision in Krosa.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Laquatus's Creativity",
      setCode: "ody",
      collectorNumber: "88",
      scryfallId: "dcd48c28-bfa3-4eca-8e1a-f72d785b2ab9",
      artist: "Don Hazeltine",
      significance: "A named Odyssey-era reference to Laquatus; not a direct portrait of his attempt to acquire the Mirari.",
    },
    source: {
      title: "Wizards of the Coast — Dominarian Cartography",
      url: "https://magic.wizards.com/en/news/feature/dominarian-cartography-2018-04-20",
    },
  },
  {
    id: "seton",
    name: "Seton",
    title: "Protector of Krosa",
    origin: "Dominaria — Krosan Forest",
    role: "Centaur druid and guardian",
    summary:
      "A Krosan defender who represented the values of a living forest in contrast with Otaria's arena politics.",
    biography: [
      "Seton was a centaur associated with the Krosan Forest and its traditions of guardianship and druidic magic.",
      "His friendship with Kamahl helped connect the former pit fighter to a world where power could be exercised in service to living things rather than personal conquest.",
      "Kamahl's principal Nantuko teacher was Thriss; Seton is best understood as an ally and representative of the wider Krosan tradition, not as a replacement for Thriss in the narrative.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Seton, Krosan Protector",
      setCode: "ody",
      collectorNumber: "267",
      scryfallId: "641a3bae-9146-4e70-862a-86a56f7c3816",
      artist: "Greg Staples",
      significance: "Seton's original Odyssey portrait, showing the guardians of Krosa before Kamahl's transformation.",
    },
    source: {
      title: "Wizards of the Coast — Kamahl, Heart of Krosa",
      url: "https://magic.wizards.com/en/news/card-preview/kamahl-heart-krosa-2020-10-28",
    },
  },
  {
    id: "ixidor",
    name: "Ixidor",
    title: "The Reality Sculptor",
    origin: "Dominaria — Otaria",
    role: "Illusionist and creator of Akroma",
    summary:
      "Grief over Nivea's death led Ixidor to reshape reality and create Akroma to destroy Phage.",
    biography: [
      "Ixidor was an illusionist whose relationship with Nivea ended in tragedy after a lethal arena confrontation with Phage.",
      "In grief, he developed the ability to make imagined forms real. Akroma was his most consequential creation, an angel shaped by the loss of Nivea and driven toward vengeance.",
      "The conflict between Akroma and Phage escaped the bounds of Ixidor's private motives and became part of Otaria's wider devastation.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Ixidor, Reality Sculptor",
      setCode: "ons",
      collectorNumber: "89",
      scryfallId: "314d5e89-55f7-42b4-af19-d4d0f499a265",
      artist: "Kev Walker",
      significance: "Ixidor's original Onslaught card, portraying the illusionist who could realize imagined beings.",
    },
    source: {
      title: "Wizards of the Coast — Quite Some Characters",
      url: "https://magic.wizards.com/en/news/making-magic/quite-some-characters-2020-11-09",
    },
  },
  {
    id: "akroma",
    name: "Akroma",
    title: "The Angel of Wrath",
    origin: "Dominaria — Otaria",
    role: "Reality-sculpted angel and adversary of Phage",
    summary:
      "Created by Ixidor in grief, Akroma became a symbol of vengeance whose conflict with Phage culminated in Karona.",
    biography: [
      "Akroma was a powerful angel made real by Ixidor after the death of Nivea in the Cabal pits.",
      "Her purpose was vengeance against Phage, Jeska's transformed identity. Their confrontation grew beyond a personal feud as competing supporters rallied to them.",
      "Kamahl's Soul Reaper strike joined Akroma, Phage, and Zagorka into Karona. Akroma died when that composite being was later broken apart.",
    ],
    chapterIds: ["otaria"],
    featuredCard: {
      name: "Akroma, Angel of Wrath",
      setCode: "lgn",
      collectorNumber: "1",
      scryfallId: "814245de-6105-43ef-acbf-d12d304b6331",
      artist: "Ron Spears",
      significance: "The original Legions depiction of the angel created by Ixidor to avenge Nivea.",
    },
    source: {
      title: "Wizards of the Coast — Quite Some Characters",
      url: "https://magic.wizards.com/en/news/making-magic/quite-some-characters-2020-11-09",
    },
  },

  // Chapter 06 — Time Spiral and the Mending
  {
    id: "teferi",
    name: "Teferi",
    title: "The Time Mage of Zhalfir",
    origin: "Dominaria — Zhalfir",
    role: "Temporal archmage; former planeswalker",
    summary:
      "A master of time magic who surrendered his planeswalker spark to save Shiv and begin healing Dominaria.",
    biography: [
      "A gifted student of the Tolarian Academy, Teferi mastered temporal magic and eventually became a planeswalker. During the Phyrexian invasion he phased Zhalfir and Shiv out of ordinary reality to spare them from conquest.",
      "Returning to Dominaria centuries later, he found a dying plane whose time rifts were partly the legacy of those drastic interventions. He worked with Jhoira, Venser, and Radha to understand how they could be sealed.",
      "Teferi spent his spark restoring Shiv and healing its rift. Zhalfir, however, remained absent—one of the most enduring costs of his earlier decision.",
      "When Wrenn reached Realmbreaker, the Zhalfirin armies returned to the fight and the displaced nation regained its place in the Multiverse.",
    ],
    chapterIds: ["mending", "march-of-the-machine"],
    featuredCard: {
      name: "Teferi, Mage of Zhalfir",
      setCode: "tsp",
      collectorNumber: "83",
      scryfallId: "3c0145f6-4e27-49e7-9ef6-bac6fa3de26d",
      artist: "D. Alexander Gregory & Jeremy Jarvis",
      significance:
        "Teferi as depicted in Time Spiral, before the sacrifice of his planeswalker spark.",
    },
    source: {
      title: "Wizards of the Coast — Teferi: Behind the Magic",
      url: "https://magic.wizards.com/en/news/card-preview/teferi-behind-magic-2020-06-12",
    },
  },
  {
    id: "jhoira",
    name: "Jhoira",
    title: "The Tolarian Artificer",
    origin: "Dominaria — Shiv",
    role: "Artificer, engineer, and keeper of historical memory",
    summary:
      "An ingenious Tolarian and longtime ally of Teferi and Karn whose practical skill proved critical during the temporal crisis.",
    biography: [
      "Jhoira studied at Urza's Tolarian Academy and developed enduring friendships with Teferi and Karn. Her long life made her a living connection to eras separated by centuries.",
      "When Dominaria's temporal fractures threatened the world, she accompanied Teferi and worked with Venser and other allies, often challenging those who treated mortal companions as expendable resources.",
      "Jhoira survived the crisis and remained important to Dominaria's history beyond the Mending, carrying forward the practical legacy of artifice.",
    ],
    chapterIds: ["mending"],
    featuredCard: {
      name: "Jhoira of the Ghitu",
      setCode: "fut",
      collectorNumber: "157",
      scryfallId: "1f437128-3a87-4958-97d0-3940d8761cba",
      artist: "Kev Walker",
      significance:
        "Jhoira's Future Sight card depicts the Ghitu artificer associated with Teferi and the Tolarian legacy.",
    },
    source: {
      title: "Wizards of the Coast — Planeswalker's Guide to Dominaria",
      url: "https://magic.wizards.com/en/news/feature/planeswalkers-guide-dominaria-2022-08-31",
    },
  },
  {
    id: "venser",
    name: "Venser",
    title: "The Shaper Savant",
    origin: "Dominaria — Urborg",
    role: "Artificer, teleportation specialist, and planeswalker",
    summary:
      "An inventive mage whose teleportation experiments and emerging spark foreshadowed the post-Mending age.",
    biography: [
      "Venser grew up in Urborg, where he pursued the construction of devices capable of extraordinary transportation and displacement. His talents attracted the attention of Teferi and Lord Windgrace.",
      "Drawn into the attempt to close Dominaria's rifts, he discovered that his own potential for planeswalking differed from the nearly limitless abilities of the older planeswalkers.",
      "Venser survived the final repair of the Otarian rift and entered the new era as one of the first examples of a post-Mending planeswalker.",
    ],
    chapterIds: ["mending"],
    featuredCard: {
      name: "Venser, Shaper Savant",
      setCode: "fut",
      collectorNumber: "46",
      scryfallId: "0e84fc99-4045-4518-b588-512a675f2933",
      artist: "Aleksi Briclot",
      significance:
        "Venser's first legendary card, printed in Future Sight, reflects his talent for teleportation.",
    },
    source: {
      title: "Wizards of the Coast — Venser",
      url: "https://magic.wizards.com/en/story/venser-planeswalker",
    },
  },
  {
    id: "radha",
    name: "Radha",
    title: "Heir to Keld",
    origin: "Dominaria — Keld and Skyshroud",
    role: "Half-elven warrior and Keldon leader",
    summary:
      "A formidable warrior whose connection to Skyshroud's rift helped reshape attempts to save Dominaria.",
    biography: [
      "Radha was raised between the heritage of Skyshroud's elves and the fierce traditions of Keld. She sought recognition as a Keldon warrior rather than simply accepting the identity others assigned her.",
      "Her unusual bond with rift mana made her central to Teferi's investigation and later to Jeska's attempts to heal the damaged plane. Both planeswalkers had to confront Radha's independence and the dangers of using another person as a tool.",
      "She survived the Mending and became an influential leader in Keld during Dominaria's subsequent recovery.",
    ],
    chapterIds: ["mending"],
    featuredCard: {
      name: "Radha, Heir to Keld",
      setCode: "plc",
      collectorNumber: "162",
      scryfallId: "7fc23b2e-9124-4f88-b93e-8bfe90e6eb41",
      artist: "Jim Murray",
      significance:
        "Radha's original Planar Chaos printing captures her Keldon identity and link to the forest.",
    },
    source: {
      title: "Wizards of the Coast — Planeswalker's Guide to Dominaria",
      url: "https://magic.wizards.com/en/news/feature/planeswalkers-guide-dominaria-2022-08-31",
    },
  },
  {
    id: "freyalise",
    name: "Freyalise",
    title: "Guardian of Elvenkind",
    origin: "Dominaria",
    role: "Ancient planeswalker and protector of Skyshroud",
    summary:
      "A formidable guardian who ended Dominaria's Ice Age and died sealing the Skyshroud rift.",
    biography: [
      "Freyalise had wielded extraordinary power since the age of the Ice Age, when her magic helped end the long supernatural winter. She became particularly associated with elven communities and the defense of their forests.",
      "After the Rathi Overlay transplanted Skyshroud into Keld, Freyalise continued to protect its inhabitants from threats even while the growing temporal rift weakened the plane.",
      "Recognizing the threat to all of Dominaria, she sacrificed her life and power to heal the fracture above Skyshroud.",
    ],
    chapterIds: ["ice-age", "mending"],
    featuredCard: {
      name: "Freyalise, Llanowar's Fury",
      setCode: "c14",
      collectorNumber: "43",
      scryfallId: "6c6ef042-1a69-4b16-abae-4f436dbadbbd",
      artist: "Adam Paquette",
      significance:
        "A later planeswalker card representing the elven protector who sacrificed herself during the Mending.",
    },
    source: {
      title: "Wizards of the Coast — Freyalise",
      url: "https://magic.wizards.com/en/story/freyalise-planeswalker",
    },
  },
  {
    id: "windgrace",
    name: "Lord Windgrace",
    title: "Protector of Urborg",
    origin: "Dominaria — Urborg",
    role: "Planeswalker and guardian of Urborg",
    summary:
      "An ancient protector who surrendered his life to close Urborg's temporal rift.",
    biography: [
      "Lord Windgrace ruled as a guardian of Urborg and was wary of the destructive effects of artifice and the interventions of outsiders. The Rathi Overlay left his homeland scarred with transplanted structures and a dangerous rift.",
      "When Teferi and his companions sought a way to heal the plane, Windgrace's suspicion made cooperation difficult. He nevertheless came to recognize the scale of the crisis.",
      "Windgrace gave his life sealing Urborg's rift, leaving an enduring spiritual connection to the land he had defended.",
    ],
    chapterIds: ["mending"],
    featuredCard: {
      name: "Lord Windgrace",
      setCode: "c18",
      collectorNumber: "43",
      scryfallId: "213d6fb8-5624-4804-b263-51f339482754",
      artist: "Bram Sels",
      significance:
        "A Commander 2018 depiction of the historical guardian of Urborg.",
    },
    source: {
      title: "Wizards of the Coast — Planeswalker's Guide to Dominaria",
      url: "https://magic.wizards.com/en/news/feature/planeswalkers-guide-dominaria-2022-08-31",
    },
  },
];
