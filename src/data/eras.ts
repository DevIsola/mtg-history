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
      "Urza and Mishra turn rivalry into catastrophe. Their war changes Dominaria and echoes through stories released decades apart.",
    sets: ["Antiquities · 1994", "The Brothers’ War · 2022"],
    status: "published",
  },
  {
    id: "ice-age",
    chapter: "03",
    name: "The Dark and the Ice Age",
    kicker: "From Darkness to the Thaw",
    summary:
      "After the Sylex Blast, Dominaria enters centuries of turmoil. Jodah, Lim-Dûl, and Freyalise become central figures in the struggle through the Ice Age.",
    sets: [
      "The Dark · 1994",
      "Fallen Empires · 1994",
      "Ice Age · 1995",
      "Alliances · 1996",
      "Coldsnap · 2006",
    ],
    status: "published",
  },

  {
    id: "weatherlight",
    chapter: "04",
    name: "The Weatherlight Saga",
    kicker: "The Legacy and the Invasion",
    summary:
      "Follow Gerrard Capashen, Captain Sisay, Karn, and the Weatherlight crew through Rath, Mercadia, and the final struggle against Yawgmoth's Phyrexia.",
    sets: [
      "Weatherlight · 1997",
      "Tempest · 1997",
      "Urza's Saga · 1998",
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
  },
  {
    id: "mending",
    chapter: "06",
    name: "Time Spiral and the Mending",
    kicker: "The Cost of Repairing Reality",
    summary:
      "Time rifts threaten Dominaria and the Multiverse; Teferi, Jeska, Freyalise, Windgrace, and their allies pay the price of the Mending.",
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
      "Nicol Bolas draws planeswalkers into a confrontation whose consequences reach far beyond a single plane.",
    sets: ["War of the Spark · 2019"],
    status: "published",
  },
  {
    id: "march-of-the-machine",
    chapter: "09",
    name: "The New Phyrexian Invasion",
    kicker: "A Multiverse at War",
    summary:
      "From Mirrodin's fall and Dominarian sleeper agents to Realmbreaker's invasion and Zhalfir's return, the Multiverse resists Elesh Norn.",
    sets: [
      "Scars of Mirrodin · 2010",
      "New Phyrexia · 2011",
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
      "With sparks lost and Omenpaths opening, travelers like Kellan cross Eldraine, Ixalan, Ravnica, and Thunder Junction while survivors reshape their worlds.",
    sets: [
      "March of the Machine: The Aftermath · 2023",
      "Wilds of Eldraine · 2023",
      "The Lost Caverns of Ixalan · 2023",
      "Murders at Karlov Manor · 2024",
      "Outlaws of Thunder Junction · 2024",
    ],
    status: "published",
  },
];
