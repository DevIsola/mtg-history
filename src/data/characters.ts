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
    chapterIds: ["weatherlight"],
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
    chapterIds: ["ice-age"],
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
];
