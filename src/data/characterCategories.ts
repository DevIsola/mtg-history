export interface CharacterCategory {
  id: string;
  label: string;
  characterIds: string[];
}

export const characterCategories: CharacterCategory[] = [
  {
    id: "war-of-the-spark",
    label: "The War of the Spark",
    characterIds: ["nicol-bolas", "tezzeret", "ral-zarek", "dovin-baan", "liliana-vess", "gideon-jura", "niv-mizzet", "jace-beleren", "vraska"],
  },
  {
    id: "temporal-rifts",
    label: "Time Spiral and the Mending",
    characterIds: ["leshrac", "teferi", "jhoira", "venser", "radha", "jeska", "freyalise", "windgrace", "multani"],
  },

  {
    id: "otarian-mirari-crisis",
    label: "The Mirari and Otaria",
    characterIds: ["lieutenant-kirtar", "balthor", "kamahl", "chainer", "jeska", "ixidor", "akroma", "cabal-patriarch", "braids", "aboshan", "laquatus", "seton"],
  },

  {
    id: "weatherlight-legacy",
    label: "The Weatherlight and the Legacy",
    characterIds: ["barrin", "radiant", "multani", "rofellos", "squee", "gerrard", "sisay", "hanna", "mirri", "karn"],
  },

  {
    id: "sarpadia",
    label: "Sarpadian figures",
    characterIds: ["thelon-of-havenwood", "endrek-sahr"],
  },

  {
    id: "post-invasion",
    label: "Post-invasion and Omenpath-era figures",
    characterIds: ["will-kenrith", "rowan-kenrith", "kellan", "quintorius-kand", "alquist-proft", "trostani", "oko", "jace-beleren", "vraska", "loot"],
  },

  {
    id: "planeswalkers",
    label: "Planeswalkers",
    characterIds: [
      "urza",
      "karn",
      "jeska",
      "teferi",
      "freyalise",
      "windgrace",
      "tevesh-szat",
      "jaya",
      "nahiri",
      "sorin",
      "nicol-bolas",
      "liliana-vess",
      "gideon-jura",
      "ajani",
      "nissa",
      "chandra",
      "elspeth",
      "wrenn",
      "koth",
    ],
  },

  {
    id: "artifice",
    label: "Artifice and engineering",
    characterIds: [
      "urza",
      "mishra",
      "tocasia",
      "karn",
      "glacian",
      "rebbec",
      "jhoira",
      "venser",
      "hanna",
      "tawnos",
      "ashnod",
    ],
  },

  {
    id: "magic",
    label: "Mages and spellcasters",
    characterIds: [
      "jodah",
      "ertai",
      "jaya",
      "lim-dul",
      "chainer",
      "ixidor",
      "braids",
      "laquatus",
      "cabal-patriarch",
      "teferi",
      "venser",
      "freyalise",
      "mairsil",
    ],
  },

  {
    id: "warriors",
    label: "Warriors and heroes",
    characterIds: ["gerrard", "sisay", "mirri", "kamahl", "jeska", "akroma", "radha", "agrus-kos", "avacyn"],
  },

  {
    id: "leaders",
    label: "Leaders and guardians",
    characterIds: [
      "yawgmoth",
      "mishra",
      "gix",
      "sisay",
      "volrath",
      "crovax",
      "freyalise",
      "windgrace",
      "radha",
      "kayla",
      "cabal-patriarch",
      "aboshan",
      "laquatus",
      "seton",
      "szadek",
      "teysa-karlov",
      "avacyn",
      "niv-mizzet",
    ],
  },

  {
    id: "otherworldly",
    label: "Angels, demons, and Eldrazi",
    characterIds: ["avacyn", "griselbrand", "emrakul"],
  },

  {
    id: "phyrexia",
    label: "Phyrexian figures",
    characterIds: ["yawgmoth", "gix", "volrath", "crovax", "ertai", "elesh-norn", "sheoldred", "ajani", "nissa"],
  },
  {
    id: "new-phyrexian-invasion",
    label: "The New Phyrexian Invasion",
    characterIds: ["elesh-norn", "sheoldred", "jin-gitaxias", "vorinclex", "urabrask", "melira", "tamiyo", "koth", "ajani", "nissa", "chandra", "elspeth", "wrenn"],
  },
];
