export interface HistoricalEvent {
  id: string;
  title: string;
  chapterId: string;
  summary: string;
  narrative: string[];
  characterIds: string[];
  cardName: string;
}

export const historicalEvents: HistoricalEvent[] = [
  {
    id: "powerstone-revolution",
    title: "Glacian and the Powerstone Revolution",
    chapterId: "thran",
    summary:
      "Glacian's discovery of powerstone technology transforms the Thran Empire and leaves a legacy lasting thousands of years.",
    narrative: [
      "Glacian developed a method of creating powerstones, crystals that could contain vast quantities of energy. The Thran built much of their extraordinary civilization around the technology, powering machinery, construction, and magical artifice.",
      "Working in the same technologically advanced society, Glacian and his wife Rebbec became two of the empire's most influential figures. Rebbec incorporated powerstones into ambitious architectural projects, including the Thran Temple floating above Halcyon.",
      "The powerstones also carried a terrible cost. Their connection to the illness known as phthisis placed Glacian's achievements at the center of a crisis that would help bring Yawgmoth to power.",
      "After the fall of the Thran, two halves of a broken powerstone associated with Glacian survived. Urza and Mishra would discover them millennia later, continuing a chain of events that eventually led to the Brothers' War.",
    ],
    characterIds: ["glacian", "rebbec"],
    cardName: "Glacian, Powerstone Engineer",
  },
  {
    id: "rise-of-yawgmoth",
    title: "The Rise of Yawgmoth",
    chapterId: "thran",
    summary:
      "A physician gains control of Phyrexia and becomes an existential threat to Dominaria.",
    narrative: [
      "Yawgmoth gained influence during a crisis in the ancient Thran civilization. His ambition and increasingly ruthless medical experiments helped destabilize an already divided society.",
      "With access to the artificial plane of Phyrexia, he established the foundations of an empire that would threaten Dominaria for thousands of years.",
    ],
    characterIds: ["yawgmoth", "rebbec", "glacian"],
    cardName: "Yawgmoth, Thran Physician",
  },
  {
    id: "rebbec-seals-phyrexia",
    title: "Rebbec Seals the Gateway",
    chapterId: "thran",
    summary:
      "Rebbec makes a final sacrifice to separate Dominaria from Phyrexia.",
    narrative: [
      "As the Thran civilization collapsed, Rebbec recognized the danger posed by Yawgmoth and his Phyrexian domain.",
      "Her decision to seal the gateway prevented Yawgmoth from freely returning to Dominaria, though the consequences of his rise would endure.",
    ],
    characterIds: ["rebbec", "yawgmoth"],
    cardName: "Rebbec, Architect of Ascension",
  },

  {
    id: "tocasias-death",
    title: "The Death of Tocasia",
    chapterId: "brothers-war",
    summary:
      "A confrontation between Urza and Mishra kills their mentor and destroys the brothers' shared life.",
    narrative: [
      "Under Tocasia's guidance, Urza and Mishra explored ancient Thran ruins and developed their talents as artificers. Their discovery of the Mightstone and Weakstone eventually caused a bitter rivalry to emerge.",
      "During a violent confrontation between the brothers, Tocasia attempted to intervene. The power unleashed in their struggle killed the archaeologist who had raised and guided them.",
      "Her death became a decisive personal tragedy. Urza and Mishra separated, and the ambitions that once centered on ancient artifacts eventually grew into a war between nations.",
    ],
    characterIds: ["tocasia", "urza", "mishra"],
    cardName: "Brotherhood's End",
  },

  {
    id: "brothers-war",
    title: "The Brothers Become Enemies",
    chapterId: "brothers-war",
    summary:
      "Urza and Mishra turn a personal rivalry into a conflict that engulfs Terisiare.",
    narrative: [
      "The brothers began as students fascinated by the remnants of ancient Thran technology. Their discovery of powerful artifacts contributed to a growing rivalry.",
      "Their separate ambitions eventually drew nations and armies into a destructive struggle, transforming the political and physical landscape of Dominaria.",
    ],
    characterIds: ["urza", "mishra"],
    cardName: "Mishra, Tamer of Mak Fawa",
  },

  {
    id: "gix-influences-mishra",
    title: "Gix and the Corruption of Mishra",
    chapterId: "brothers-war",
    summary:
      "Phyrexian influence transforms Mishra's ambitions and draws the Brothers' War into Yawgmoth's larger conflict.",
    narrative: [
      "The rivalry between Urza and Mishra created an opening for Phyrexian interference on Dominaria. Gix, a servant of Yawgmoth, worked to expand Phyrexian influence through the conflict.",
      "Mishra's pursuit of power became increasingly entangled with the forces Gix represented. The Phyrexian presence deepened a war that was already consuming Terisiare.",
      "By the war's final confrontation, Mishra had undergone a terrible transformation. His fate demonstrated that the struggle between the brothers had become part of a much older threat to Dominaria.",
    ],
    characterIds: ["mishra", "gix", "yawgmoth"],
    cardName: "Gix, Yawgmoth Praetor",
  },

  {
    id: "sylex-blast",
    title: "The Sylex Blast",
    chapterId: "brothers-war",
    summary:
      "The destruction of Argoth ends the Brothers’ War and changes Dominaria.",
    narrative: [
      "The final confrontation on Argoth culminated in Urza activating the Golgothian Sylex, releasing catastrophic magical energy.",
      "The blast ended the war, ignited Urza’s planeswalker spark, and helped precipitate the prolonged climatic disruption associated with the Ice Age.",
    ],
    characterIds: ["urza", "mishra"],
    cardName: "Urza's Sylex",
  },
  {
    id: "rise-of-lim-dul",
    title: "The Rise of Lim-Dûl",
    chapterId: "ice-age",
    summary:
      "Necromancy and political ambition threaten the frozen kingdoms of Dominaria.",
    narrative: [
      "During the Ice Age, Lim-Dûl assembled undead forces and pursued power amid the turmoil of the frozen world.",
      "His ambitions brought him into conflict with those attempting to protect magical knowledge and resist the growing influence of necromancy.",
    ],
    characterIds: ["jodah"],
    cardName: "Lim-Dûl the Necromancer",
  },
  {
    id: "world-spell",
    title: "Freyalise Casts the World Spell",
    chapterId: "ice-age",
    summary:
      "A vast magical undertaking helps bring Dominaria’s Ice Age to an end.",
    narrative: [
      "The Ice Age was sustained by more than ordinary climate conditions. Magical disruptions continued to affect the plane long after the Brothers’ War.",
      "Freyalise’s World Spell played a decisive role in ending that era, allowing Dominaria to move toward a period of thaw and renewal.",
    ],
    characterIds: ["freyalise", "jodah"],
    cardName: "The World Spell",
  },
  {
    id: "weatherlight-rescue",
    title: "The Weatherlight Mission to Rath",
    chapterId: "weatherlight",
    summary:
      "Gerrard and the Weatherlight crew confront Volrath to rescue Captain Sisay.",
    narrative: [
      "Sisay’s capture brought Gerrard back into the life of the Weatherlight crew and into the struggle surrounding the Legacy.",
      "The expedition to Rath exposed the companions to Phyrexian influence, personal betrayals, and the dangerous rule of Volrath.",
    ],
    characterIds: ["gerrard", "karn"],
    cardName: "Sisay, Weatherlight Captain",
  },
  {
    id: "legacy-weapon",
    title: "The Legacy Defeats Yawgmoth",
    chapterId: "weatherlight",
    summary:
      "Centuries of preparation culminate in the destruction of Yawgmoth.",
    narrative: [
      "The Phyrexian invasion brought Dominaria to the brink of catastrophe. Urza’s long preparations converged with the actions of Gerrard and the Weatherlight crew.",
      "The assembled Legacy became the decisive weapon against Yawgmoth, ending his immediate threat while leaving immense devastation behind.",
    ],
    characterIds: ["urza", "yawgmoth", "gerrard", "karn"],
    cardName: "Legacy Weapon",
  },
  {
    id: "mirari-crisis",
    title: "The Mirari Crisis",
    chapterId: "otaria",
    summary:
      "A mysterious artifact magnifies the ambitions of competing powers on Otaria.",
    narrative: [
      "The Mirari promised extraordinary magical power, attracting warriors, Cabal mages, and political rivals.",
      "Its influence repeatedly encouraged obsession and destructive decisions, drawing Kamahl and Chainer into a conflict whose consequences spread throughout Otaria.",
    ],
    characterIds: ["kamahl", "chainer", "karn"],
    cardName: "Mirari",
  },
  {
    id: "birth-of-karona",
    title: "The Birth of Karona",
    chapterId: "otaria",
    summary:
      "Phage, Akroma, and Zagorka merge into a being worshipped as a false god.",
    narrative: [
      "Jeska’s transformation into Phage and the creation of Akroma drew Otaria into an escalating conflict of vengeance and devotion.",
      "A catastrophic confrontation joined Phage, Akroma, and Zagorka into Karona, whose immense power placed the continent in even greater danger.",
    ],
    characterIds: ["jeska", "kamahl"],
    cardName: "Karona, False God",
  },
  {
    id: "shivan-rift",
    title: "Teferi Repairs the Shivan Rift",
    chapterId: "mending",
    summary:
      "Teferi sacrifices his old planeswalker powers to help restore a fractured Dominaria.",
    narrative: [
      "Centuries of planar disturbances had left dangerous temporal rifts across Dominaria. The effort to close them demanded unprecedented sacrifices.",
      "Teferi helped repair the rift at Shiv, losing his planeswalker spark in the process and demonstrating the personal cost of healing reality.",
    ],
    characterIds: ["teferi", "jhoira", "venser"],
    cardName: "Teferi, Mage of Zhalfir",
  },
  {
    id: "the-mending",
    title: "The Mending of the Multiverse",
    chapterId: "mending",
    summary:
      "The restoration of reality fundamentally changes the nature of planeswalkers.",
    narrative: [
      "The repair of Dominaria’s temporal rifts required the intervention and sacrifice of several powerful figures, including Freyalise and Lord Windgrace.",
      "The final restoration, associated with Jeska’s actions, transformed the nature of the planeswalker spark and ended the era of near-omnipotent oldwalkers.",
    ],
    characterIds: ["jeska", "teferi", "freyalise", "windgrace"],
    cardName: "The Mending of Dominaria",
  },
];
