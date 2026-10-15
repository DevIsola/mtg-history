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
    ],
    chapterIds: ["ice-age"],
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
    origin: "Phyrexia",
    role: "Phyrexian praetor and agent of Yawgmoth",
    summary:
      "A powerful Phyrexian agent whose interference in the Brothers' War helped corrupt Mishra and advance Yawgmoth's interests.",
    biography: [
      "Gix was a powerful servant of Yawgmoth and one of the major Phyrexian figures involved in the events surrounding the Brothers' War.",
      "His influence reached Dominaria while Urza and Mishra were fighting for control of Terisiare. Rather than acting as an ordinary military commander, Gix worked to extend Phyrexian power through the conflict already underway.",
      "Mishra's growing dependence on Phyrexian forces enabled Gix's influence to become part of the war's central story. The brother's ultimate corruption reflected the danger of treating those forces as instruments of personal ambition.",
      "Gix's involvement helped connect the ancient origins of Phyrexia to the later struggles against Yawgmoth, making the Brothers' War an important chapter in a much longer conflict.",
    ],
    chapterIds: ["brothers-war"],
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
    ],
    chapterIds: ["weatherlight", "otaria", "mending"],
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
      "Kamahl began as a formidable Pardic barbarian and gladiator, drawn to Cabal City and the Mirari during the struggle for power on Otaria.",
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
      "After Karona was broken apart, Jeska's planeswalker spark ignited. Karn became her guide, and she would later return to Dominaria during the crisis of the temporal rifts.",
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
      "Despite their contrasting backgrounds, he and Kamahl formed an unexpected friendship amid the Cabal's contests and political ambitions.",
      "Possession of the Mirari amplified Chainer's abilities and destabilized his control. His downfall became one of the defining tragedies of the Odyssey block story.",
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
    ],
    chapterIds: ["mending"],
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
