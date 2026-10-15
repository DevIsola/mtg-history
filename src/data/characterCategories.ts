export interface CharacterCategory {
  id: string;
  label: string;
  characterIds: string[];
}

export const characterCategories: CharacterCategory[] = [
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
      "jaya",
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
      "tawnos",
      "ashnod",
    ],
  },

  {
    id: "magic",
    label: "Mages and spellcasters",
    characterIds: [
      "jodah",
      "jaya",
      "lim-dul",
      "chainer",
      "teferi",
      "venser",
      "freyalise",
    ],
  },

  {
    id: "warriors",
    label: "Warriors and heroes",
    characterIds: ["gerrard", "kamahl", "jeska", "radha"],
  },

  {
    id: "leaders",
    label: "Leaders and guardians",
    characterIds: [
      "yawgmoth",
      "mishra",
      "gix",
      "freyalise",
      "windgrace",
      "radha",
      "kayla",
    ],
  },

  {
    id: "phyrexia",
    label: "Phyrexian figures",
    characterIds: ["yawgmoth", "gix"],
  },
];
