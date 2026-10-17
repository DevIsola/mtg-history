/**
 * Editorial narrative groupings, not a strict calendar of Multiverse events.
 * Stories on different planes may overlap. Exact chronology and source
 * references will be verified as individual chapters are published.
 */
export interface HistoricalEra {
  id: string;
  chapter: string;
  name: string;
  kicker: string;
  summary: string;
  sets: string[];
  status: "planned" | "in-progress" | "published";
}

export const eras: HistoricalEra[] = [
  {
    id: "thran",
    chapter: "01",
    name: "The Thran and the Origins of Phyrexia",
    kicker: "Before the Brothers",
    summary:
      "Explore Halcyon's powerstone society, the Untouchables' uprising, Yawgmoth's rise, Dyfed's gateway, Rebbec's sacrifice, and the stones that shaped the Brothers' War.",
    sets: ["Urza's Destiny · 1999", "Modern Horizons · 2019", "Commander Legends · 2020", "The Brothers' War · 2022"],
    status: "published",
  },

  {
    id: "brothers-war",
    chapter: "02",
    name: "The Brothers’ War",
    kicker: "A World Divided",
    summary:
      "From the Koilos stones and Tocasia’s death to the rival empires, Kroog’s fall, the Third Path, Argoth, and Kayla’s recovery, the brothers’ conflict remakes Terisiare.",
    sets: ["Antiquities · 1994", "Urza’s Saga · 1998", "The Brothers’ War · 2022"],
    status: "published",
  },
  {
    id: "ice-age",
    chapter: "03",
    name: "The Dark and the Ice Age",
    kicker: "From Darkness to the Thaw",
    summary:
      "From Talite persecution and Mairsil's Conclave to Sarpadia's thrulls and thallids, Lim-Dûl's armies, and Freyalise's World Spell, Dominaria survives the long winter.",
    sets: [
      "The Dark · 1994",
      "Fallen Empires · 1994",
      "Ice Age · 1995",
      "Alliances · 1996",
      "Coldsnap · 2006",
      "Time Spiral · 2006",
      "Commander 2017 · 2017",
    ],
    status: "published",
  },

  {
    id: "weatherlight",
    chapter: "04",
    name: "The Weatherlight Saga",
    kicker: "The Legacy and the Invasion",
    summary:
      "From Urza's Bloodlines project and Serra's Realm to Gerrard's crew, Mercadia, the Coalition, and Barrin's final spell, the Legacy ends Yawgmoth's invasion at immense personal cost.",
    sets: [
      "Weatherlight · 1997",
      "Tempest · 1997",
      "Urza's Saga · 1998",
      "Urza's Legacy · 1999",
      "Urza's Destiny · 1999",
      "Mercadian Masques · 1999",
      "Invasion · 2000",
      "Planeshift · 2001",
      "Apocalypse · 2001",
    ],
    status: "published",
  },

  {
    id: "otaria",
    chapter: "05",
    name: "The Mirari and Otaria",
    kicker: "Ambition, Redemption, and Rebirth",
    summary:
      "From the Order and Cabal to Kamahl, Chainer, and Balthor, the Mirari corrupts Otaria's rival powers before Jeska, Akroma, and Zagorka converge as Karona.",
    sets: [
      "Odyssey · 2001",
      "Torment · 2002",
      "Judgment · 2002",
      "Onslaught · 2002",
      "Legions · 2003",
      "Scourge · 2003",
    ],
    status: "published",
  },
  {
    id: "mending",
    chapter: "06",
    name: "Time Spiral and the Mending",
    kicker: "The Cost of Repairing Reality",
    summary:
      "Temporal rifts bring alternate histories into Dominaria; Jhoira and Venser confront broken time while Leshrac exploits Jeska before the sacrifices that complete the Mending.",
    sets: [
      "Time Spiral · 2006",
      "Planar Chaos · 2007",
      "Future Sight · 2007",
    ],
    status: "published",
  },
  {
    id: "many-worlds",
    chapter: "07",
    name: "Stories Across the Planes",
    kicker: "An Expanding Multiverse",
    summary:
      "Ravnica’s first Guildpact collapses, Zendikar’s Eldrazi prison weakens, and Innistrad’s Helvault crisis changes the fate of humanity.",
    sets: ["Ravnica · 2005", "Zendikar · 2009", "Innistrad · 2011"],
    status: "published",
  },
  {
    id: "war-of-the-spark",
    chapter: "08",
    name: "The War of the Spark",
    kicker: "The Fate of Ravnica",
    summary:
      "Bolas's Planar Bridge, beacon, Immortal Sun, and Elderspell trap planeswalkers on Ravnica; guild defenders resist his Dreadhorde, while Gideon's sacrifice and Niv-Mizzet's rebirth shape the aftermath.",
    sets: ["War of the Spark · 2019"],
    status: "published",
  },
  {
    id: "march-of-the-machine",
    chapter: "09",
    name: "The New Phyrexian Invasion",
    kicker: "A Multiverse at War",
    summary:
      "From Mirrodin's fall and the praetors' competing agendas to Tamiyo's compleation, Mirran resistance, Realmbreaker, and Zhalfir's return, the Multiverse confronts Elesh Norn.",
    sets: [
      "Scars of Mirrodin · 2010",
      "New Phyrexia · 2011",
      "Kaldheim · 2021",
      "Kamigawa: Neon Dynasty · 2022",
      "Streets of New Capenna · 2022",
      "Dominaria United · 2022",
      "Phyrexia: All Will Be One · 2023",
      "March of the Machine · 2023",
      "March of the Machine: The Aftermath · 2023",
    ],
    status: "published",
  },
  {
    id: "omenpaths",
    chapter: "10",
    name: "The Era of Omenpaths",
    kicker: "After the Invasion",
    summary:
      "As sparks fade and Omenpaths open, Kellan travels from Eldraine through Ixalan and Ravnica to Thunder Junction; Quintorius, Proft, and Trostani reveal how the new roads intersect with local histories.",
    sets: [
      "March of the Machine: The Aftermath · 2023",
      "Wilds of Eldraine · 2023",
      "The Lost Caverns of Ixalan · 2023",
      "Murders at Karlov Manor · 2024",
      "Outlaws of Thunder Junction · 2024",
      "The Big Score · 2024",

    ],
    status: "published",
  },
];
