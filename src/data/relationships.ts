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
  // Chapter 01 — the Thran and the origins of Phyrexia
  {
    a: "gix", b: "glacian", category: "rivalry",
    labelForA: "Powerstone engineer he attacked", labelForB: "Rebel who wounded him",
    context: "Before his compleation, Gix fought for Halcyon's excluded Untouchables and wounded Glacian with a powerstone shard during their uprising.",
    chapterId: "thran",
  },
  {
    a: "glacian", b: "yawgmoth", category: "rivalry",
    labelForA: "Physician who exploited his illness", labelForB: "Patient and engineering pioneer",
    context: "Yawgmoth gained political access by treating Glacian's phthisis, then manipulated the inventor and the divided powerstone tied to his fate.",
    chapterId: "thran",
  },
  // Chapter 10 — kinship and shifting alliances after the invasion
  {
    a: "will-kenrith", b: "rowan-kenrith", category: "family",
    labelForA: "Twin sister", labelForB: "Twin brother",
    context: "The heirs’ shared grief after the invasion developed into a disagreement over how Eldraine could be saved.",
    chapterId: "omenpaths",
  },
  {
    a: "kellan", b: "oko", category: "family",
    labelForA: "Elusive father", labelForB: "Son searching for him",
    context: "Kellan crossed Omenpaths to find Oko, only to confront the trickster’s methods on Thunder Junction.",
    chapterId: "omenpaths",
  },
  {
    a: "jace-beleren", b: "vraska", category: "alliance",
    labelForA: "Partner and beloved", labelForB: "Partner and beloved",
    context: "Jace and Vraska survived Phyrexian corruption and pursued a new plan after their recovery.",
    chapterId: "omenpaths",
  },
  {
    a: "jace-beleren", b: "loot", category: "alliance",
    labelForA: "Young ward", labelForB: "Protector and planner",
    context: "Jace took an interest in Loot after the discovery at the ancient vault on Thunder Junction.",
    chapterId: "omenpaths",
  },
  {
    a: "vraska", b: "loot", category: "alliance",
    labelForA: "Young ward", labelForB: "Protector and ally",
    context: "Vraska became part of Loot’s unfolding story following the vault heist.",
    chapterId: "omenpaths",
  },
  // Chapter 09 — loyalties, corruption, and resistance
  {
    a: "elesh-norn", b: "sheoldred", category: "rivalry",
    labelForA: "Rival praetor", labelForB: "Orthodoxy's authoritarian leader",
    context: "The two praetors pursued Phyrexian dominance with conflicting ambitions, exposing fractures beneath Norn's rhetoric of unity.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "elesh-norn", b: "elspeth", category: "rivalry",
    labelForA: "Angelic opponent", labelForB: "Persecutor and architect of conquest",
    context: "Elspeth returned transformed to confront Norn and keep the final resistance alive while Wrenn reached the tree.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "elesh-norn", b: "karn", category: "rivalry",
    labelForA: "Mirrodin's creator", labelForB: "Praetor he finally dismantled",
    context: "Karn assumed responsibility for the fate of the plane he made and personally ended Norn's attempt at multiversal conquest.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "ajani", b: "jaya", category: "rivalry",
    labelForA: "Hero killed during his corruption", labelForB: "Trusted ally transformed into sleeper agent",
    context: "Ajani's compleation enabled Phyrexia's betrayal of the Dominarian coalition and Jaya's death.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "jaya", b: "chandra", category: "mentorship",
    labelForA: "Promising pyromancer", labelForB: "Mentor whose death drove her",
    context: "Jaya's teachings shaped Chandra; her death during Dominaria United gave the final invasion an intensely personal cost.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "chandra", b: "nissa", category: "alliance",
    labelForA: "Loved one lost to compleation", labelForB: "Partner who sought her recovery",
    context: "Chandra fought Phyrexia while refusing to give up hope for Nissa, who later survived Melira and Karn's treatment.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "wrenn", b: "teferi", category: "alliance",
    labelForA: "Guide to Zhalfir's lost people", labelForB: "Dryad who restored his homeland",
    context: "Wrenn found a way through Realmbreaker to Zhalfir, completing Teferi's long struggle to reconnect his nation.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "wrenn", b: "chandra", category: "alliance",
    labelForA: "Friend who helped her reach the tree", labelForB: "Dryad whose sacrifice ended the invasion",
    context: "Chandra aided Wrenn's final attempt to bond with Realmbreaker and reverse the invaders' interplanar network.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "koth", b: "elspeth", category: "alliance",
    labelForA: "Returned defender of the Mirrans", labelForB: "Unyielding Mirran resistance leader",
    context: "Koth and Elspeth fought on Mirrodin's behalf, and her transformed return helped protect its surviving people.",
    chapterId: "march-of-the-machine",
  },
  {
    a: "karn", b: "koth", category: "alliance",
    labelForA: "Mirran who kept resisting", labelForB: "Creator reckoning with the plane's fall",
    context: "The two survivors were bound by the loss of Mirrodin and its people, even after the victory made Zhalfir their refuge.",
    chapterId: "march-of-the-machine",
  },
  // Chapter 08 — the War of the Spark
  {
    a: "nicol-bolas", b: "liliana-vess", category: "rivalry",
    labelForA: "Rebellious general", labelForB: "Coercive master",
    context: "Bolas bound Liliana to command his Eternals; she ultimately turned that army against him.",
    chapterId: "war-of-the-spark",
  },
  {
    a: "gideon-jura", b: "liliana-vess", category: "alliance",
    labelForA: "Ally he protected", labelForB: "Ally who gave his life",
    context: "Gideon took the lethal consequence intended for Liliana after she defied Bolas.",
    chapterId: "war-of-the-spark",
  },
  {
    a: "gideon-jura", b: "nicol-bolas", category: "rivalry",
    labelForA: "Enemy threatening Ravnica", labelForB: "Gatewatch opponent",
    context: "Gideon helped defend Ravnica against Bolas's invasion and his attempt to harvest sparks.",
    chapterId: "war-of-the-spark",
  },
  {
    a: "niv-mizzet", b: "nicol-bolas", category: "rivalry",
    labelForA: "Invading Elder Dragon", labelForB: "Firemind and Living Guildpact",
    context: "Niv-Mizzet's resistance and rebirth challenged Bolas's bid to dominate Ravnica.",
    chapterId: "war-of-the-spark",
  },
  // Chapter 07 — relationships across Ravnica, Zendikar, and Innistrad
  {
    a: "agrus-kos", b: "szadek", category: "rivalry",
    labelForA: "Conspiracy suspect", labelForB: "Wojek investigator",
    context: "Agrus Kos pursued Szadek's hidden conspiracy, but the vampire's arrest was entangled with the first Guildpact's destruction.",
    chapterId: "many-worlds",
  },
  {
    a: "agrus-kos", b: "teysa-karlov", category: "alliance",
    labelForA: "Orzhov political ally", labelForB: "Boros investigator",
    context: "Agrus and Teysa worked across guild boundaries as Ravnica confronted the consequences of the broken Guildpact.",
    chapterId: "many-worlds",
  },
  {
    a: "nahiri", b: "sorin", category: "alliance",
    labelForA: "Eldrazi prison ally", labelForB: "Lithomancer ally",
    context: "Nahiri and Sorin cooperated with Ugin to imprison the Eldrazi on Zendikar; their later rupture was not part of the prison's founding.",
    chapterId: "many-worlds",
  },
  {
    a: "nahiri", b: "emrakul", category: "rivalry",
    labelForA: "Imprisoned titan", labelForB: "Hedron prison architect",
    context: "Nahiri helped construct the ward network that confined Emrakul and the other Eldrazi titans to Zendikar.",
    chapterId: "many-worlds",
  },
  {
    a: "sorin", b: "avacyn", category: "creation",
    labelForA: "Created angelic guardian", labelForB: "Creator and protector",
    context: "Sorin created Avacyn to preserve Innistrad's humanity and the balance between its peoples and monsters.",
    chapterId: "many-worlds",
  },
  {
    a: "avacyn", b: "griselbrand", category: "rivalry",
    labelForA: "Demon who trapped her", labelForB: "Angelic adversary",
    context: "Griselbrand lured Avacyn into the Helvault, imprisoning himself and the angel while the church's protections collapsed.",
    chapterId: "many-worlds",
  },
  // Chapter 05 — Mirari Saga relationships
  {
    a: "chainer",
    b: "cabal-patriarch",
    category: "alliance",
    labelForA: "Cabal patron and eventual rival",
    labelForB: "Protégé turned usurper",
    context:
      "Chainer initially delivered the newly discovered Mirari to the First, then ultimately used its power to remove the Patriarch from Cabal City.",
    chapterId: "otaria",
  },
  {
    a: "braids",
    b: "cabal-patriarch",
    category: "alliance",
    labelForA: "Leader of the Cabal",
    labelForB: "Unpredictable operative",
    context:
      "Braids operated within the Cabal's sphere of influence and helped return the Mirari to the institution's control after its passage through rival hands.",
    chapterId: "otaria",
  },
  {
    a: "chainer",
    b: "braids",
    category: "alliance",
    labelForA: "Fellow Cabal operative",
    labelForB: "Dementia summoner colleague",
    context:
      "Chainer and Braids were members of the Cabal whose separate activities brought them into the Mirari crisis as the artifact returned to Cabal City.",
    chapterId: "otaria",
  },
  {
    a: "laquatus",
    b: "aboshan",
    category: "rivalry",
    labelForA: "Emperor and political obstacle",
    labelForB: "Ambitious court diplomat",
    context:
      "Laquatus schemed around Aboshan's rule and the Mirari, while the emperor's disastrous use of the artifact damaged the underwater empire.",
    chapterId: "otaria",
  },
  {
    a: "laquatus",
    b: "cabal-patriarch",
    category: "rivalry",
    labelForA: "Cabal political rival",
    labelForB: "Manipulative merfolk contender",
    context:
      "Laquatus and the Cabal Patriarch pursued conflicting ambitions for the Mirari and maneuvered to exploit one another's vulnerabilities.",
    chapterId: "otaria",
  },
  {
    a: "kamahl",
    b: "seton",
    category: "friendship",
    labelForA: "Krosan friend and ally",
    labelForB: "Pardic warrior turned defender",
    context:
      "Seton's alliance with Kamahl connected the former pit fighter to the living forest and its values as he abandoned the Mirari's corrupting influence.",
    chapterId: "otaria",
  },
  {
    a: "cabal-patriarch",
    b: "jeska",
    category: "rivalry",
    labelForA: "Wounded warrior made into Phage",
    labelForB: "Cabal authority behind her transformation",
    context:
      "Cabal intervention transformed the Mirari-wounded Jeska into Phage, whose deadly power became useful to the Patriarch's arenas and political aims.",
    chapterId: "otaria",
  },
  {
    a: "ixidor",
    b: "akroma",
    category: "creation",
    labelForA: "Angel created from grief",
    labelForB: "Reality-sculpting creator",
    context:
      "Ixidor created Akroma with his reality-shaping magic after Nivea's death and directed her toward vengeance against Phage.",
    chapterId: "otaria",
  },
  {
    a: "akroma",
    b: "jeska",
    category: "rivalry",
    labelForA: "Phage, target of her vengeance",
    labelForB: "Angel seeking her death",
    context:
      "As Phage, Jeska became Akroma's enemy. Their escalating conflict culminated in their fusion with Zagorka into Karona.",
    chapterId: "otaria",
  },
  {
    a: "ixidor",
    b: "jeska",
    category: "rivalry",
    labelForA: "Phage, blamed for Nivea's death",
    labelForB: "Vengeful illusionist",
    context:
      "Ixidor blamed Phage for the death of Nivea and created Akroma as the agent of his retribution.",
    chapterId: "otaria",
  },
  {
    a: "kamahl",
    b: "akroma",
    category: "rivalry",
    labelForA: "Vengeful angel and threat to Krosa",
    labelForB: "Druid defending his sister and forest",
    context:
      "Kamahl opposed the destructive conflict involving Akroma and Phage and ultimately struck both with the Soul Reaper axe during the confrontation that created Karona.",
    chapterId: "otaria",
  },

  // Phase 36 — the final Phyrexian campaign
  {
    a: "urza",
    b: "tevesh-szat",
    category: "rivalry",
    labelForA: "Traitor among the Titans",
    labelForB: "Leader and executioner",
    context:
      "Urza recruited Tevesh Szat into the Nine Titans but expected his betrayal. After Szat killed Daria and Kristina, Urza used the traitor's life essence to power the soul bombs against Phyrexia.",
    chapterId: "weatherlight",
  },
  {
    a: "urza",
    b: "gerrard",
    category: "rivalry",
    labelForA: "Legacy hero and arena opponent",
    labelForB: "Architect of the Legacy and arena opponent",
    context:
      "Urza engineered the Legacy that shaped Gerrard's life. Under Yawgmoth's influence, the two fought each other in an arena, where Gerrard beheaded Urza.",
    chapterId: "weatherlight",
  },

  // Phase 35 — the loss and corruption of three Weatherlight companions
  {
    a: "gerrard",
    b: "mirri",
    category: "friendship",
    labelForA: "Longtime friend and companion",
    labelForB: "Longtime friend and companion",
    context:
      "Gerrard and Mirri grew up together, and she accompanied him aboard the Weatherlight until her death at the hands of Crovax.",
    chapterId: "weatherlight",
  },
  {
    a: "crovax",
    b: "mirri",
    category: "rivalry",
    labelForA: "Former shipmate and victim",
    labelForB: "Former ally and killer",
    context:
      "Crovax killed Selenia to save Mirri but became cursed; after she followed him away from the Weatherlight, he killed her.",
    chapterId: "weatherlight",
  },
  {
    a: "gerrard",
    b: "crovax",
    category: "rivalry",
    labelForA: "Fallen crew companion",
    labelForB: "Former shipmate and adversary",
    context:
      "Crovax once sailed with Gerrard but betrayed the crew after his transformation into a vampire, killing Mirri and later serving Phyrexia.",
    chapterId: "weatherlight",
  },
  {
    a: "sisay",
    b: "ertai",
    category: "alliance",
    labelForA: "Crew wizard",
    labelForB: "Captain",
    context:
      "Ertai served the Weatherlight's mission and kept open the portal the crew used to escape Rath, but was left stranded there.",
    chapterId: "weatherlight",
  },
  {
    a: "hanna",
    b: "ertai",
    category: "alliance",
    labelForA: "Tolarian crew mage",
    labelForB: "Navigator and artificer",
    context:
      "Hanna and Ertai both brought Tolarian knowledge aboard the Weatherlight during the rescue mission to Rath.",
    chapterId: "weatherlight",
  },
  {
    a: "crovax",
    b: "ertai",
    category: "alliance",
    labelForA: "Corrupted wizard and aide",
    labelForB: "Evincar and Phyrexian master",
    context:
      "Ertai's transformation on Rath brought him into Crovax's service; he aided Crovax in defeating Volrath and claiming the title of evincar.",
    chapterId: "weatherlight",
  },
  {
    a: "crovax",
    b: "volrath",
    category: "rivalry",
    labelForA: "Former evincar and rival",
    labelForB: "Successor and killer",
    context:
      "With Ertai's help, Crovax killed Volrath after the shapeshifter's return from Mercadia and became the new evincar of Rath.",
    chapterId: "weatherlight",
  },
  // Phase 34 — Weatherlight companions and adversaries
  {
    a: "gerrard",
    b: "sisay",
    category: "alliance",
    labelForA: "Captain and trusted ally",
    labelForB: "Legacy hero and crew member",
    context:
      "Sisay believed in Gerrard's part in the Legacy, and her abduction drew him back into the Weatherlight's mission.",
    chapterId: "weatherlight",
  },
  {
    a: "gerrard",
    b: "hanna",
    category: "friendship",
    labelForA: "Former partner and shipmate",
    labelForB: "Former partner and shipmate",
    context:
      "Hanna and Gerrard shared a romantic past, strained when Gerrard abandoned the Weatherlight; his return brought them together again before the invasion took Hanna's life.",
    chapterId: "weatherlight",
  },
  {
    a: "gerrard",
    b: "volrath",
    category: "rivalry",
    labelForA: "Foster brother and enemy",
    labelForB: "Foster brother and rival",
    context:
      "The boys Gerrard and Vuel grew up together, but Vuel later became Volrath, evincar of Rath and the chief antagonist of the Weatherlight's rescue mission.",
    chapterId: "weatherlight",
  },
  {
    a: "sisay",
    b: "hanna",
    category: "alliance",
    labelForA: "Navigator and artificer",
    labelForB: "Captain",
    context:
      "Sisay led the Weatherlight and relied on Hanna's command of its machinery and magical artifacts.",
    chapterId: "weatherlight",
  },
  {
    a: "sisay",
    b: "karn",
    category: "alliance",
    labelForA: "Legacy companion",
    labelForB: "Captain",
    context:
      "Sisay and Karn served aboard the Weatherlight as the crew pursued the pieces of the Legacy.",
    chapterId: "weatherlight",
  },
  {
    a: "volrath",
    b: "yawgmoth",
    category: "alliance",
    labelForA: "Master of Phyrexia",
    labelForB: "Evincar and agent",
    context:
      "Volrath ruled Rath as a Phyrexian evincar and worked to advance Yawgmoth's invasion plans.",
    chapterId: "weatherlight",
  },

  {
    a: "jodah",
    b: "jaya",
    category: "friendship",
    labelForA: "Longtime friend and ally",
    labelForB: "Longtime friend and ally",
    context:
      "Jodah and Jaya maintained an enduring friendship and helped bring Kjeldoran and Balduvian forces together against Lim-Dûl.",
    chapterId: "ice-age",
  },
  {
    a: "jodah",
    b: "lim-dul",
    category: "rivalry",
    labelForA: "Necromancer adversary",
    labelForB: "Archmage adversary",
    context:
      "Jodah opposed Lim-Dûl's ambitions and helped build resistance to his undead armies.",
    chapterId: "ice-age",
  },
  {
    a: "jaya",
    b: "lim-dul",
    category: "rivalry",
    labelForA: "Necromancer adversary",
    labelForB: "Pyromancer adversary",
    context:
      "Jaya joined Jodah in resisting Lim-Dûl and the threat his forces posed to Terisiare.",
    chapterId: "ice-age",
  },
  {
    a: "jodah",
    b: "freyalise",
    category: "alliance",
    labelForA: "World Spell caster",
    labelForB: "Mirror bearer",
    context:
      "Jodah possessed an enchanted mirror that helped Freyalise cast the World Spell and bring Dominaria's Ice Age to an end.",
    chapterId: "ice-age",
  },

  {
    a: "urza",
    b: "kayla",
    category: "family",
    labelForA: "Wife",
    labelForB: "Husband",
    context:
      "Urza's marriage to Kayla connected him to Yotia's ruling family. Their relationship was profoundly affected by the war and its aftermath.",
    chapterId: "brothers-war",
  },
  {
    a: "urza",
    b: "tawnos",
    category: "mentorship",
    labelForA: "Apprentice",
    labelForB: "Mentor",
    context:
      "Tawnos studied under Urza and contributed to his mechanical inventions, later questioning the destructive uses of their technology.",
    chapterId: "brothers-war",
  },
  {
    a: "mishra",
    b: "ashnod",
    category: "alliance",
    labelForA: "Artificer and lieutenant",
    labelForB: "Commander and patron",
    context:
      "Ashnod worked within Mishra's war effort, but her independence and decisions eventually brought her into conflict with his ambitions.",
    chapterId: "brothers-war",
  },
  {
    a: "ashnod",
    b: "tawnos",
    category: "friendship",
    labelForA: "Friend across enemy lines",
    labelForB: "Friend across enemy lines",
    context:
      "Despite serving opposing armies, Ashnod and Tawnos developed an important personal connection. Ashnod later helped Tawnos escape captivity.",
    chapterId: "brothers-war",
  },
  {
    a: "kayla",
    b: "tawnos",
    category: "alliance",
    labelForA: "Trusted artificer",
    labelForB: "Queen and political ally",
    context:
      "Kayla and Tawnos survived the war's devastation and later worked to protect communities struggling with its consequences.",
    chapterId: "brothers-war",
  },

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
  {
    a: "freyalise",
    b: "radha",
    category: "alliance",
    labelForA: "Keldon-elf warrior tied to Skyshroud",
    labelForB: "Guardian of the forest",
    context:
      "Radha's connection to rift mana placed her in the struggle over Skyshroud, the displaced forest Freyalise sacrificed herself to protect.",
    chapterId: "mending",
  },
  {
    a: "teferi",
    b: "windgrace",
    category: "alliance",
    labelForA: "Urborg's wary protector",
    labelForB: "Time mage seeking to close rifts",
    context:
      "The temporal crisis ultimately aligned the work of Teferi and the fiercely independent Windgrace, despite the latter's suspicion of outside interventions.",
    chapterId: "mending",
  },
  {
    a: "jeska",
    b: "radha",
    category: "rivalry",
    labelForA: "Rift-linked warrior whose autonomy she endangered",
    labelForB: "Planeswalker who tried to exploit her link to rifts",
    context:
      "Jeska attempted to use Radha's connection to the temporal fractures before finally refusing to sacrifice her in the last repair.",
    chapterId: "mending",
  },
  {
    a: "jeska",
    b: "venser",
    category: "alliance",
    labelForA: "Artificer and final-rift collaborator",
    labelForB: "Planeswalker and final-rift collaborator",
    context:
      "Venser and Jeska converged at Otaria's final rift; Jeska chose to send him to safety rather than force him to pay for its closure.",
    chapterId: "mending",
  },
  {
    a: "jeska",
    b: "teferi",
    category: "rivalry",
    labelForA: "Time mage whose home she could not restore",
    labelForB: "Planeswalker who closed Zhalfir's remaining route",
    context:
      "Jeska's sealing of the Zhalfirin rift prevented Teferi from using that opening to retrieve Zhalfir, revealing the conflicting costs of repairing the world.",
    chapterId: "mending",
  },
];
