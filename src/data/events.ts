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
    id: "fall-of-kroog",
    title: "The Fall of Kroog",
    chapterId: "brothers-war",
    summary:
      "The destruction of Yotia's capital forces Kayla and its inhabitants to confront the devastating human cost of the Brothers' War.",
    narrative: [
      "As Urza and Mishra's armies struggled for control of Terisiare, the city of Kroog became a target of the expanding conflict. The destruction of the Yotian capital shattered a major political and civilian center.",
      "Kayla bin-Kroog survived the catastrophe. Her experiences highlighted the suffering of families, displaced communities, and people whose lives were consumed by decisions made by the rival artificers.",
      "The fall of Kroog further intensified the conflict, while its survivors faced the task of preserving their communities amid the destruction of their homeland.",
    ],
    characterIds: ["kayla", "urza", "mishra", "tawnos", "ashnod"],
    cardName: "Queen Kayla bin-Kroog",
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
    id: "ashnod-frees-tawnos",
    title: "Ashnod Frees Tawnos",
    chapterId: "brothers-war",
    summary:
      "A personal connection across enemy lines leads Ashnod to help Urza's apprentice escape captivity.",
    narrative: [
      "Tawnos and Ashnod served opposing sides of the Brothers' War: Tawnos worked with Urza, while Ashnod was associated with Mishra. Both were gifted inventors, but their methods and loyalties differed.",
      "As the conflict continued, Tawnos fell into captivity. Ashnod chose to help him escape, placing their personal connection above the demands of the competing war efforts.",
      "The decision added to Ashnod's growing distance from Mishra's circle and revealed that the war's apparent divisions did not fully determine the loyalties of everyone involved.",
    ],
    characterIds: ["ashnod", "tawnos", "mishra", "urza"],
    cardName: "Ashnod, Flesh Mechanist",
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
    id: "talite-siege-of-penregon",
    title: "The Talite Siege of Penregon",
    chapterId: "ice-age",
    summary:
      "The Church of Tal assaults Penregon as postwar communities struggle over the future of magic and artifice.",
    narrative: [
      "In 69 AR, followers of Tal attempted to seize Penregon. Their opposition to magic and artifice made the surviving machines of Urza's age an object of hostility, even where those machines supported civilian life.",
      "The crusaders attacked the city's defenses while sympathizers within its walls spread violence and destruction. Kayla bin-Kroog worked with Penregon's commanders to organize resistance and make decisions about its survival.",
      "Tawnos, troubled by the conversion of his civilian machines back into weapons, had destroyed his workshop. The siege and its aftermath exposed the fragile balance between technological dependence, political fear, and responsibility after the Brothers' War.",
    ],
    characterIds: ["kayla", "tawnos"],
    cardName: "Witch Hunter",
  },

  {
    id: "jodah-preserves-magic",
    title: "Jodah and the Preservation of Magic",
    chapterId: "ice-age",
    summary:
      "Amid fear and persecution after the Brothers' War, Jodah helps carry magical knowledge into a new historical era.",
    narrative: [
      "The destruction caused by the Brothers' War left much of Terisiare fearful of the forces that had devastated its kingdoms. In the centuries that followed, magical practitioners faced suspicion and, at times, persecution.",
      "Jodah's early adventures unfolded against this background of declining institutions and uncertain magical knowledge. His survival and education connected him to traditions that might otherwise have been lost.",
      "Over an extraordinarily long life, Jodah became a link between the Dark Age and the Ice Age, preserving experience and knowledge that would prove essential in later conflicts.",
    ],
    characterIds: ["jodah"],
    cardName: "Jodah, Archmage Eternal",
  },

  {
    id: "sarpadian-factions-fracture",
    title: "The Fragmentation of Sarpadia",
    chapterId: "ice-age",
    summary:
      "Five competing factions confront rival societies and upheavals within their own ranks during the decline recorded in Fallen Empires.",
    narrative: [
      "The continent of Sarpadia became the setting for struggles involving the Order of Leitbur, the Vodalian merfolk, the Order of the Ebon Hand, the dwarves, and the elves. Each power faced both neighboring enemies and pressures within its own society.",
      "The Farrelites challenged Icatia, homarids threatened the Vodalians, and goblins and orcs fought the dwarves. The elves faced thallids, while the Ebon Hand confronted rebellion among the thrulls it had created.",
      "These histories did not unfold as one battle or a single simultaneous collapse. Fallen Empires presents them as interconnected but distinct conflicts that undermined established powers across Sarpadia.",
    ],
    characterIds: [],
    cardName: "Order of the Ebon Hand",
  },
  {
    id: "thrull-uprising",
    title: "The Thrull Uprising",
    chapterId: "ice-age",
    summary:
      "The thrulls bred by the Order of the Ebon Hand become a threat to the society that exploited them.",
    narrative: [
      "The Order of the Ebon Hand relied on thrulls bred to serve its purposes. The same creatures that had supported the faction eventually challenged its control.",
      "The thrull revolt became one of the defining internal conflicts of Sarpadia's decline, turning the Order's own creations against an established power.",
      "Thrull Champion is used here as a representative card from Fallen Empires. This is a history of a factional uprising rather than a biographical event attributed to a particular named character.",
    ],
    characterIds: [],
    cardName: "Thrull Champion",
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
    characterIds: ["jodah", "jaya", "lim-dul"],
    cardName: "Lim-Dûl the Necromancer",
  },

  {
    id: "alliance-against-lim-dul",
    title: "The Alliance Against Lim-Dûl",
    chapterId: "ice-age",
    summary:
      "Jodah and Jaya help bring rival peoples together against the necromancer threatening the frozen kingdoms.",
    narrative: [
      "Kjeldor and the Balduvian communities had their own histories of rivalry and conflict. The growing threat posed by Lim-Dûl's undead forces made continued division increasingly dangerous.",
      "Jodah and Jaya Ballard played important roles in encouraging cooperation against the necromancer. Their partnership demonstrated how personal relationships and shared threats could change the political landscape.",
      "The resistance to Lim-Dûl helped reshape the relationships between the peoples of Terisiare and contributed to the emergence of a new political order.",
    ],
    characterIds: ["jodah", "jaya", "lim-dul"],
    cardName: "Jaya Ballard, Task Mage",
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
    characterIds: ["gerrard", "karn", "sisay", "volrath", "hanna", "crovax", "mirri", "ertai"],
    cardName: "Sisay, Weatherlight Captain",
  },
  // Phase 35 — personal catastrophes during the escape from Rath
  {
    id: "selenia-curse-crovax",
    title: "Crovax Kills Selenia",
    chapterId: "weatherlight",
    summary:
      "To save Mirri in Volrath's Stronghold, Crovax kills Selenia and fulfills a curse that turns him into a vampire.",
    narrative: [
      "Crovax had once freed the angel Selenia from a cursed artifact. Their bond became a source of pain after she was taken into Volrath's service on Rath.",
      "At the Stronghold, Selenia attacked members of the Weatherlight crew. Mirri intervened and was badly hurt, forcing Crovax to choose between the angel he loved and the companion he hoped to save.",
      "Crovax killed Selenia. The act completed the curse placed on him, transforming him into a vampire and beginning the collapse of his remaining loyalties to the crew.",
    ],
    characterIds: ["crovax", "mirri"],
    cardName: "Selenia, Dark Angel",
  },
  {
    id: "mirris-final-confrontation",
    title: "Mirri's Final Confrontation",
    chapterId: "weatherlight",
    summary:
      "The wounded Weatherlight warrior follows Crovax and is killed by the companion she had tried to protect.",
    narrative: [
      "Mirri was Gerrard's longtime companion and one of the most capable fighters aboard the Weatherlight. During the Stronghold mission, she was wounded while confronting Selenia.",
      "Crovax killed Selenia to save Mirri but became a vampire as a result. His curse changed the relationship between two people who had once served the same cause.",
      "After Crovax left the Weatherlight, Mirri followed him. Crovax killed her, making the escape from Rath an irreversible tragedy for the crew and for Gerrard.",
    ],
    characterIds: ["mirri", "crovax", "gerrard"],
    cardName: "Mirri, Cat Warrior",
  },
  {
    id: "ertai-stranded-on-rath",
    title: "Ertai Is Stranded on Rath",
    chapterId: "weatherlight",
    summary:
      "Ertai holds an escape portal open while the Weatherlight departs Rath without him.",
    narrative: [
      "When the Predator damaged the Weatherlight's planeshifting engine, the crew could no longer rely on its normal way of traveling between planes.",
      "Ertai helped open an escape portal from Rath. After delays during the Stronghold mission, the Weatherlight used the Skyshaper to reach the portal before it closed.",
      "Ertai was left on Rath. His isolation and later corruption transformed the former Weatherlight mage into an enemy of the people he had helped save.",
    ],
    characterIds: ["ertai", "gerrard", "sisay"],
    cardName: "Ertai, Wizard Adept",
  },
  {
    id: "volrath-unmasked",
    title: "Volrath's Disguise Is Revealed",
    chapterId: "weatherlight",
    summary:
      "On Mercadia, the shapeshifter Volrath's disguise as Takara conceals an enemy within the Weatherlight's own company.",
    narrative: [
      "After the Weatherlight rescued Sisay and other captives from Rath, Volrath escaped the Stronghold by impersonating Takara, the daughter of Starke. The apparent rescued companion traveled with the crew to Mercadia.",
      "Volrath used the disguise to sow mistrust and conceal his own movements. His murder of Starke exposed the deadly consequences of admitting an enemy into the company under a borrowed identity.",
      "The Mercadian Masques card Unmask depicts Volrath shedding Takara's appearance, making its illustration an unusually direct representation of a major plot revelation.",
    ],
    characterIds: ["volrath", "gerrard", "sisay", "hanna"],
    cardName: "Unmask",
  },
  {
    id: "crovax-becomes-evincar",
    title: "Crovax Becomes the Evincar of Rath",
    chapterId: "weatherlight",
    summary:
      "Crovax defeats the returning Volrath with Ertai's help and assumes control of Rath in Phyrexia's service.",
    narrative: [
      "After becoming a vampire, Crovax abandoned his former companions and turned toward power within the Phyrexian-controlled plane of Rath.",
      "When Volrath returned from Mercadia, the two competed for the role of evincar. With assistance from the corrupted wizard Ertai, Crovax killed Volrath and took control of Rath.",
      "The Nemesis card Ascendant Evincar depicts Crovax in this new role. His transformation completed the fall of a former Weatherlight companion into a central figure in the enemy's regime.",
    ],
    characterIds: ["crovax", "ertai", "volrath"],
    cardName: "Ascendant Evincar",
  },
  {
    id: "hanna-phyrexian-plague",
    title: "Hanna Falls to the Phyrexian Plague",
    chapterId: "weatherlight",
    summary:
      "The invasion costs the Weatherlight its navigator and one of its most capable artificers.",
    narrative: [
      "Hanna was essential to the Weatherlight's extraordinary journey. Her expertise in magical artifacts supported the crew through the rescue on Rath, the danger of Mercadia, and their return to Dominaria.",
      "When Phyrexia invaded, Hanna succumbed to a Phyrexian plague. Her death brought devastating personal grief and deprived the defenders of a deeply experienced member of the crew.",
      "Her loss exemplified the consequences of the invasion beyond its military campaigns: the destruction of relationships, knowledge, and irreplaceable lives.",
    ],
    characterIds: ["hanna", "gerrard", "sisay"],
    cardName: "Hanna, Ship's Navigator",
  },
  // Phase 36 — invasion, betrayal, and the Legacy's finale
  {
    id: "battle-of-koilos",
    title: "The Coalition's Victory at Koilos",
    chapterId: "weatherlight",
    summary:
      "Dominaria's allied defenders secure a crucial victory at Koilos, though the Phyrexian invasion is far from over.",
    narrative: [
      "As Phyrexian forces invaded Dominaria, peoples and military leaders from across the world formed the Coalition. Their combined strength contested the enemy's ancient foothold at Koilos.",
      "The victory at Koilos demonstrated the power of cooperation among former rivals and became an important source of hope for the defenders.",
      "That triumph was not the end of the conflict. Rath had been prepared to overlay Dominaria, allowing another vast army to enter the war and transforming the battlefield itself.",
      "The original Invasion card Coalition Victory represents the unity of the Coalition and the celebration after Koilos; it must not be mistaken for the later, final defeat of Yawgmoth.",
    ],
    characterIds: ["gerrard", "sisay", "urza", "karn"],
    cardName: "Coalition Victory",
  },
  {
    id: "rathi-overlay",
    title: "The Rathi Overlay",
    chapterId: "weatherlight",
    summary:
      "The artificial plane of Rath merges with Dominaria, delivering Phyrexian forces and transforming the landscape.",
    narrative: [
      "Phyrexia had constructed Rath as more than a fortress world. Its flowstone substrate and accumulating mass allowed the entire plane to be used as an invasion mechanism against Dominaria.",
      "During the Rathi Overlay, territory, peoples, and armies from Rath were superimposed upon Dominaria. The maneuver deployed enemy forces across the world and changed familiar landscapes.",
      "The Stronghold and other features of Rath appeared on Dominaria, leaving consequences that would endure beyond the end of the invasion.",
    ],
    characterIds: ["gerrard", "sisay", "karn", "yawgmoth"],
    cardName: "Skyship Weatherlight",
  },
  {
    id: "nine-titans-assault",
    title: "The Nine Titans Assault Phyrexia",
    chapterId: "weatherlight",
    summary:
      "Urza leads nine planeswalkers into Phyrexia, but Tevesh Szat's betrayal brings lethal consequences.",
    narrative: [
      "Urza assembled the Nine Titans—nine powerful planeswalkers, including Freyalise, Lord Windgrace, and Tevesh Szat—to strike directly at Phyrexia while Dominaria fought the invasion.",
      "Szat turned on his companions and killed Daria and Kristina. Urza had anticipated this betrayal and used Szat's life essence to fuel the soul bombs intended to destroy Phyrexian territory.",
      "The operation inflicted tremendous damage, but its sacrifices exposed the moral cost of Urza's strategy. The remaining Titans struggled to fulfill the mission even as Urza became captivated by Phyrexian artifice.",
    ],
    characterIds: ["urza", "tevesh-szat", "freyalise", "windgrace"],
    cardName: "Tevesh Szat, Doom of Fools",
  },
  {
    id: "yawgmoths-arena",
    title: "Gerrard and Urza in Yawgmoth's Arena",
    chapterId: "weatherlight",
    summary:
      "Yawgmoth turns two of Dominaria's central defenders against each other, and Gerrard beheads Urza.",
    narrative: [
      "Yawgmoth tempted Gerrard with the possibility of recovering Hanna and appealed to Urza's obsession with understanding Phyrexia. Under his control, the two adversaries fought in a dreadful arena.",
      "Gerrard eventually beheaded Urza, though the planeswalker continued to survive as a living head containing the Mightstone and Weakstone.",
      "The arena scene is represented by the original Apocalypse printing of Phyrexian Arena. The confrontation did not end the invasion; it preceded the Legacy's final activation.",
    ],
    characterIds: ["gerrard", "urza", "yawgmoth"],
    cardName: "Phyrexian Arena",
  },
  {
    id: "legacy-weapon",
    title: "The Legacy Defeats Yawgmoth",
    chapterId: "weatherlight",
    summary:
      "Gerrard, Urza, Karn, and the Legacy's accumulated power bring Yawgmoth's original invasion to an end.",
    narrative: [
      "The crisis culminated after Gerrard's confrontation with Urza in Yawgmoth's arena. Urza's living head still held the Mightstone and Weakstone, ancient fragments whose history reached back to the Thran and the Brothers' War.",
      "Karn, the Weatherlight, Gerrard, the powerstones, and other components of the Legacy converged in a final release of power. Yawgmoth's destructive manifestation was destroyed, and the invading forces lost their central master.",
      "The victory demanded the deaths of Gerrard and Urza and the loss of the Weatherlight as it had been known. Karn survived the activation and emerged as a planeswalker.",
      "The original Apocalypse card Legacy Weapon depicts the assembled artifact; Vindicate provides a complementary illustration associated with Gerrard's ultimate sacrifice.",
    ],
    characterIds: ["urza", "yawgmoth", "gerrard", "karn", "sisay"],
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
