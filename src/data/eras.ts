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
      "Discover the rise and fall of the Thran Empire, the genius of Glacian, the sacrifice of Rebbec, and the origins of Yawgmoth’s Phyrexia.",
    sets: ["Modern Horizons · 2019", "Commander Legends · 2020"],
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
    kicker: "Power and Ambition",
    summary:
      "A mysterious artifact fuels a new cycle of ambition, conflict, and transformation on Dominaria.",
    sets: ["Odyssey · 2001", "Onslaught · 2002", "Scourge · 2003"],
    status: "planned",
  },
  {
    id: "mending",
    chapter: "06",
    name: "Time Spiral and the Mending",
    kicker: "The Nature of Planeswalkers",
    summary:
      "Rifts in reality threaten Dominaria, and repairing them changes what it means to be a planeswalker.",
    sets: ["Time Spiral · 2006", "Planar Chaos · 2007", "Future Sight · 2007"],
    status: "planned",
  },
  {
    id: "many-worlds",
    chapter: "07",
    name: "Stories Across the Planes",
    kicker: "An Expanding Multiverse",
    summary:
      "Ravnica, Zendikar, Innistrad, and other worlds become home to distinct histories and intersecting journeys.",
    sets: ["Ravnica · 2005", "Zendikar · 2009", "Innistrad · 2011"],
    status: "planned",
  },
  {
    id: "war-of-the-spark",
    chapter: "08",
    name: "The War of the Spark",
    kicker: "The Fate of Ravnica",
    summary:
      "Nicol Bolas draws planeswalkers into a confrontation whose consequences reach far beyond a single plane.",
    sets: ["War of the Spark · 2019"],
    status: "planned",
  },
  {
    id: "march-of-the-machine",
    chapter: "09",
    name: "The New Phyrexian Invasion",
    kicker: "A Multiverse at War",
    summary:
      "Phyrexia launches a campaign across the planes, forcing old rivals and new allies to confront a shared threat.",
    sets: ["Dominaria United · 2022", "March of the Machine · 2023"],
    status: "planned",
  },
  {
    id: "omenpaths",
    chapter: "10",
    name: "The Era of Omenpaths",
    kicker: "After the Invasion",
    summary:
      "New routes between worlds reshape travel, relationships, and the possibilities of life in the Multiverse.",
    sets: ["Wilds of Eldraine · 2023", "Later story releases"],
    status: "planned",
  },
];
