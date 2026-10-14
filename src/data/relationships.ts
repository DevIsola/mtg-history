export type RelationshipCategory =
  | "family"
  | "friendship"
  | "alliance"
  | "rivalry"
  | "mentorship"
  | "creation";

export interface CharacterRelationship {
  a: string;
  b: string;
  category: RelationshipCategory;

  // Label for the OTHER character, from each perspective.
  labelForA: string;
  labelForB: string;

  context: string;
  chapterId: string;
}

export const characterRelationships: CharacterRelationship[] = [
  {
    a: "urza",
    b: "mishra",
    category: "family",
    labelForA: "Brother and rival",
    labelForB: "Brother and rival",
    context:
      "Urza and Mishra were brothers whose shared interest in Thran artifacts developed into a rivalry that devastated Terisiare.",
    chapterId: "brothers-war",
  },
  {
    a: "tocasia",
    b: "urza",
    category: "mentorship",
    labelForA: "Student",
    labelForB: "Mentor",
    context:
      "Tocasia guided Urza's early studies of ancient Thran technology before her death separated the brothers.",
    chapterId: "brothers-war",
  },
  {
    a: "tocasia",
    b: "mishra",
    category: "mentorship",
    labelForA: "Student",
    labelForB: "Mentor",
    context:
      "Tocasia taught Mishra alongside Urza and died attempting to intervene in their conflict.",
    chapterId: "brothers-war",
  },
  {
    a: "mishra",
    b: "gix",
    category: "alliance",
    labelForA: "Phyrexian patron",
    labelForB: "Manipulated ally",
    context:
      "Gix exploited the Brothers' War to extend Phyrexian influence, drawing Mishra further into its machinery and ambitions.",
    chapterId: "brothers-war",
  },
  {
    a: "yawgmoth",
    b: "gix",
    category: "alliance",
    labelForA: "Praetor and agent",
    labelForB: "Master",
    context:
      "Gix served Yawgmoth and advanced Phyrexian interests on Dominaria during the Brothers' War.",
    chapterId: "brothers-war",
  },

  {
    a: "glacian",
    b: "rebbec",
    category: "family",
    labelForA: "Wife",
    labelForB: "Husband",
    context:
      "Glacian and Rebbec were married and stood among the Thran Empire's most accomplished figures. Glacian's powerstones supported Rebbec's architectural achievements, and his illness led her to seek treatment from Yawgmoth.",
    chapterId: "thran",
  },

  {
    a: "rebbec",
    b: "yawgmoth",
    category: "rivalry",
    labelForA: "Adversary",
    labelForB: "Adversary",
    context:
      "Rebbec brought Yawgmoth to Halcyon but ultimately opposed his ambitions and sealed the gateway to Phyrexia.",
    chapterId: "thran",
  },
  {
    a: "urza",
    b: "yawgmoth",
    category: "rivalry",
    labelForA: "Enemy",
    labelForB: "Enemy",
    context:
      "Urza spent centuries preparing to defeat Yawgmoth and the Phyrexian empire he controlled.",
    chapterId: "weatherlight",
  },
  {
    a: "urza",
    b: "karn",
    category: "creation",
    labelForA: "Created construct",
    labelForB: "Creator",
    context:
      "Urza created Karn as a silver golem who eventually became a central component of the Legacy.",
    chapterId: "weatherlight",
  },
  {
    a: "karn",
    b: "gerrard",
    category: "alliance",
    labelForA: "Weatherlight companion",
    labelForB: "Weatherlight companion",
    context:
      "Karn and Gerrard served aboard the Weatherlight and helped bring the Legacy to its final purpose.",
    chapterId: "weatherlight",
  },
  {
    a: "kamahl",
    b: "jeska",
    category: "family",
    labelForA: "Sister",
    labelForB: "Brother",
    context:
      "Kamahl and Jeska were siblings whose lives changed dramatically after the Mirari influenced Kamahl.",
    chapterId: "otaria",
  },
  {
    a: "kamahl",
    b: "chainer",
    category: "friendship",
    labelForA: "Friend",
    labelForB: "Friend",
    context:
      "Kamahl and Chainer formed an unlikely friendship during the conflicts surrounding the Mirari.",
    chapterId: "otaria",
  },
  {
    a: "karn",
    b: "jeska",
    category: "mentorship",
    labelForA: "Student",
    labelForB: "Mentor",
    context:
      "Following Jeska’s transformation into a planeswalker, Karn became an important guide in her new existence.",
    chapterId: "otaria",
  },
  {
    a: "karn",
    b: "jhoira",
    category: "friendship",
    labelForA: "Longtime friend",
    labelForB: "Longtime friend",
    context:
      "Karn and Jhoira shared a long history through the Tolarian Academy and the events that followed.",
    chapterId: "mending",
  },
  {
    a: "teferi",
    b: "jhoira",
    category: "friendship",
    labelForA: "Longtime friend",
    labelForB: "Longtime friend",
    context:
      "Teferi and Jhoira maintained an enduring friendship through the Tolarian era and the temporal crisis.",
    chapterId: "mending",
  },
  {
    a: "teferi",
    b: "venser",
    category: "alliance",
    labelForA: "Rift-repair ally",
    labelForB: "Rift-repair ally",
    context:
      "Venser joined Teferi’s efforts to understand and close the temporal rifts threatening Dominaria.",
    chapterId: "mending",
  },
  {
    a: "jhoira",
    b: "venser",
    category: "alliance",
    labelForA: "Collaborator",
    labelForB: "Collaborator",
    context:
      "Jhoira and Venser contributed their knowledge of artifice and magical displacement to the effort to repair Dominaria.",
    chapterId: "mending",
  },
  {
    a: "teferi",
    b: "radha",
    category: "alliance",
    labelForA: "Uneasy ally",
    labelForB: "Uneasy ally",
    context:
      "Radha’s connection to the Skyshroud rift helped Teferi investigate how damaged reality might be restored.",
    chapterId: "mending",
  },
  {
    a: "venser",
    b: "windgrace",
    category: "alliance",
    labelForA: "Uneasy ally",
    labelForB: "Uneasy ally",
    context:
      "Venser’s experiments drew the attention of Lord Windgrace, whose distrust of artifice complicated their involvement in the temporal crisis.",
    chapterId: "mending",
  },
];
