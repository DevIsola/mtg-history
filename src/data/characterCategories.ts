export interface CharacterCategory {
  id: string;
  label: string;
  characterIds: string[];
}

export const characterCategories: CharacterCategory[] = [
  {
    id: "planeswalkers",
    label: "Planeswalkers",
    characterIds: ["urza", "karn", "jeska", "teferi", "freyalise", "windgrace"],
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
    ],
  },

  {
    id: "magic",
    label: "Mages and spellcasters",
    characterIds: ["jodah", "chainer", "teferi", "venser", "freyalise"],
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
    ],
  },

  {
    id: "phyrexia",
    label: "Phyrexian figures",
    characterIds: ["yawgmoth", "gix"],
  },
];
