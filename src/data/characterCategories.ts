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
    characterIds: ["urza", "karn", "glacian", "rebbec", "jhoira", "venser"],
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
    characterIds: ["yawgmoth", "freyalise", "windgrace", "radha"],
  },
];
