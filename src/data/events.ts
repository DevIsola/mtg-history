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
  // Chapter 04 — the hidden costs and human stories of the Legacy
  {
    id: "weatherlight-bloodlines-project",
    title: "Urza Shapes the Legacy's Future",
    chapterId: "weatherlight",
    summary: "Bloodlines, academy research, and engineered artifacts prepare a future generation for Phyrexia.",
    narrative: [
      "Urza's war against Phyrexia extended beyond battlefield tactics to the bloodlines of future defenders and the technology of the Tolarian Academy.",
      "Barrin directed students and researchers while Karn, Gerrard, and the components of the Legacy became part of a design stretching across generations.",
      "The plan's moral cost arose from treating people and their choices as parts of a weapon to be assembled later.",
    ],
    characterIds: ["urza", "barrin", "karn", "gerrard"],
    cardName: "Barrin, Master Wizard",
  },
  {
    id: "weatherlight-serras-realm",
    title: "Serra's Realm Becomes the Weatherlight's Power",
    chapterId: "weatherlight",
    summary: "Radiant struggles against Phyrexian infiltration as the collapsing realm's mana is gathered to power the skyship.",
    narrative: [
      "After the Phyrexians tainted Serra's artificial realm and Serra departed, Radiant inherited its defense and grew increasingly severe.",
      "The Weatherlight's intervention evacuated inhabitants who wished to leave before Urza collapsed the remaining realm into a powerstone.",
      "The resulting engine linked a celebrated symbol of multiversal hope to the death of an entire artificial world.",
    ],
    characterIds: ["radiant", "urza"],
    cardName: "Radiant, Archangel",
  },
  {
    id: "weatherlight-yavimaya-training",
    title: "The Friends Who Studied Under Multani",
    chapterId: "weatherlight",
    summary: "Gerrard, Mirri, and Rofellos become companions while learning from Yavimaya's maro-sorcerer.",
    narrative: [
      "Multani trained Gerrard alongside Mirri and the Llanowar elf Rofellos in Yavimaya.",
      "Their friendship and shared education existed before Sisay's later attempt to reunite the Weatherlight crew.",
      "Multani's lessons contrasted with the destiny Urza intended to impose through the Legacy.",
    ],
    characterIds: ["multani", "gerrard", "mirri", "rofellos"],
    cardName: "Multani, Maro-Sorcerer",
  },
  {
    id: "weatherlight-rofellos-loss",
    title: "Rofellos Dies Before the Rescue of Sisay",
    chapterId: "weatherlight",
    summary: "The death of a close companion fractures Gerrard's relationship with the ship and its assigned destiny.",
    narrative: [
      "Rofellos joined the Weatherlight after studying with Gerrard and Mirri.",
      "His loss was central to Gerrard's decision to abandon the voyage; it occurred before the Rath rescue mission that opens the published saga.",
      "A later Urza's Destiny card depicts Rofellos alive, reflecting the storytelling shift into the past.",
    ],
    characterIds: ["rofellos", "gerrard", "mirri", "sisay"],
    cardName: "Rofellos, Llanowar Emissary",
  },
  {
    id: "weatherlight-mercadian-fleet",
    title: "The Phyrexian Fleet Beneath Mercadia",
    chapterId: "weatherlight",
    summary: "The crew uncovers the Kyren rulers' hidden preparation for the invasion of Dominaria.",
    narrative: [
      "The ship's arrival on Mercadia entangled its crew with the commercial rulers and their opposition, including the Cho-Arrim.",
      "Beneath the city's inverted mountain, the Kyren had concealed a vast fleet that could support Phyrexia's assault on Dominaria.",
      "The Weatherlight escaped to warn its home plane, underscoring that the invasion involved preparations across multiple worlds.",
    ],
    characterIds: ["gerrard", "sisay", "squee", "volrath"],
    cardName: "Skyship Weatherlight",
  },
  {
    id: "weatherlight-barrin-obliteration",
    title: "Barrin Obliterates Phyrexian-Occupied Tolaria",
    chapterId: "weatherlight",
    summary: "After losing his family, Barrin unleashes a forbidden spell that destroys Tolaria's occupied academy and himself.",
    narrative: [
      "Barrin's wife Rayne died during the invasion, followed by their daughter Hanna, the Weatherlight's navigator, who succumbed to Phyrexian plague.",
      "Returning to the academy and finding it overrun, the bereaved master wizard cast Obliterate against the invaders.",
      "The spell destroyed the area and Barrin himself, showing how victory over Phyrexia could demand a terrible local cost.",
    ],
    characterIds: ["barrin", "hanna", "urza"],
    cardName: "Barrin, Master Wizard",
  },
  {
    id: "weatherlight-squee-immortality",
    title: "Squee Survives with Yawgmoth's Curse",
    chapterId: "weatherlight",
    summary: "The cabin boy's Phyrexian-altered immortality makes him a witness to centuries beyond the original war.",
    narrative: [
      "Squee was a loyal Weatherlight companion during the war against Yawgmoth.",
      "Yawgmoth's spell repeatedly restored his body after death, leaving consequences far beyond the immediate invasion.",
      "The 2022 story Death and Salvation later explained the entanglement of the spell with Squee's soul.",
    ],
    characterIds: ["squee", "yawgmoth", "karn"],
    cardName: "Squee, Goblin Nabob",
  },
  // Chapter 03 — the Conclave, Sarpadian artifice, and the Shard
  {
    id: "dark-conclave-usurpation",
    title: "Mairsil Seizes the Conclave",
    chapterId: "ice-age",
    summary: "Mairsil deposes Lord Ith and turns a place of magical instruction into an instrument of control.",
    narrative: [
      "The Conclave of Mages offered refuge for learning amid the Dark Age's persecution of spellcasters.",
      "Mairsil imprisoned its founder, Ith, in Barl's Cage, siphoning the captive wizard's magical power while ruling in his place.",
      "His designs on Jodah's knowledge revealed how easily the defense of scholarship could become an excuse for exploitation.",
    ],
    characterIds: ["mairsil", "jodah"],
    cardName: "Mairsil, the Pretender",
  },
  {
    id: "dark-ith-freed",
    title: "Jodah Helps Free Ith",
    chapterId: "ice-age",
    summary: "The release of the imprisoned founder ends Mairsil's control and shatters the Conclave.",
    narrative: [
      "Jodah and Sima uncovered the Conclave's hidden prisoner and helped free Ith from the cage that had consumed his power.",
      "Ith's fury devastated the Conclave; the knowledge held by its students survived through those who departed for other places of study.",
      "The episode contrasts the survival of magical learning with the collapse of an institution that misused it.",
    ],
    characterIds: ["jodah", "mairsil"],
    cardName: "Jodah, Archmage Eternal",
  },
  {
    id: "sarpadia-thelon-thallids",
    title: "Thelon and Havenwood's Thallids",
    chapterId: "ice-age",
    summary: "The Havenwood elves' fungal creations become a destabilizing force on Sarpadia.",
    narrative: [
      "Thelon is linked with the development of thallids, whose spores gave rise to saprolings.",
      "Fungal life offered the elves new possibilities amid scarcity, but the creations also became a source of upheaval in Havenwood.",
      "Thelon's Time Spiral card retrospectively represents this character from the earlier Fallen Empires history.",
    ],
    characterIds: ["thelon-of-havenwood"],
    cardName: "Thelon of Havenwood",
  },
  {
    id: "sarpadia-endrek-breeding",
    title: "Endrek Sahr and the Thrull Breeders",
    chapterId: "ice-age",
    summary: "The Ebon Hand breeds thrulls and becomes dependent on beings it cannot permanently control.",
    narrative: [
      "Endrek Sahr's breeding of thrulls helped the Order of the Ebon Hand exploit created servitors.",
      "The Order's reliance on those creations laid the conditions for an internal revolt, separate from Havenwood's thallid crisis.",
      "The later legendary card gives a name and portrait to a figure first known through Fallen Empires flavor text.",
    ],
    characterIds: ["endrek-sahr"],
    cardName: "Endrek Sahr, Master Breeder",
  },
  {
    id: "ice-age-shard-dissolves",
    title: "The World Spell Changes the Shard",
    chapterId: "ice-age",
    summary: "Freyalise's World Spell ends the supernatural winter and changes the Multiverse's isolated Shard.",
    narrative: [
      "The Sylex catastrophe had contributed both to Dominaria's worsening climate and the interplanar isolation called the Shard of Twelve Worlds.",
      "Freyalise's World Spell ended the long winter and helped dissolve that separation, with consequences beyond Terisiare.",
      "The thaw remained disruptive to survivors even as it opened new possibilities for travel and exchange.",
    ],
    characterIds: ["freyalise", "jodah"],
    cardName: "The World Spell",
  },
  // Chapter 02 — the discoveries, political ascent, and legacy of the war
  {
    id: "brothers-koilos-stones",
    title: "The Brothers Claim the Ancient Stones",
    chapterId: "brothers-war",
    summary: "The Koilos discovery divides Glacian's ancient powerstone between Urza and Mishra, transforming study into rivalry.",
    narrative: [
      "At the Caves of Koilos, the two students recovered the fragments of a Thran powerstone whose history reached back to Glacian and Rebbec.",
      "Urza held the Mightstone and Mishra the Weakstone. Each possessed real power, but their distrust turned the division into an enduring grievance.",
      "The stones connected their personal choices to a much older history of Thran technology and Phyrexian influence.",
    ],
    characterIds: ["urza", "mishra", "tocasia", "glacian"],
    cardName: "The Mightstone and Weakstone",
  },
  {
    id: "brothers-fallaji-ascent",
    title: "Mishra Rises Among the Fallaji",
    chapterId: "brothers-war",
    summary: "Mishra's knowledge of Thran machines becomes political and military influence among the Fallaji.",
    narrative: [
      "Separated from Urza after Tocasia's death, Mishra traveled among the Fallaji of Terisiare's desert regions.",
      "His archaeological knowledge and command of ancient machines made him valuable to an existing society with its own leaders, ambitions, and alliances.",
      "By gaining influence over armed forces, Mishra transformed an argument between brothers into a continental struggle.",
    ],
    characterIds: ["mishra", "urza"],
    cardName: "Mishra, Tamer of Mak Fawa",
  },
  {
    id: "brothers-argoth-ruin",
    title: "Argoth Becomes the Last Battlefield",
    chapterId: "brothers-war",
    summary: "The final confrontation devastates Argoth's living landscape and sets the stage for the Sylex catastrophe.",
    narrative: [
      "Argoth's forests became a battleground despite having no stake in the original dispute between Urza and Mishra.",
      "The discovery of Mishra's Phyrexian transformation raised the stakes of the final battle, but did not erase the earlier destruction caused by both brothers.",
      "Urza's Sylex ended the battle at an ecological and magical price that echoed into Dominaria's long climatic crisis.",
    ],
    characterIds: ["urza", "mishra", "gix"],
    cardName: "Urza's Sylex",
  },
  {
    id: "brothers-kaylas-reconstruction",
    title: "Kayla Faces the Aftermath of War",
    chapterId: "brothers-war",
    summary: "Kayla bin-Kroog and Tawnos confront the human cost of the conflict and the uncertain future of artifice.",
    narrative: [
      "The fall of Kroog and the Sylex catastrophe left Kayla to govern and protect people who had survived the brothers' war.",
      "Tawnos later proposed peaceful applications of machinery, but Kayla questioned whether technology could be separated from its uses in warfare.",
      "Her record and the later accounts of Terisiare's recovery preserve a perspective centered on survivors rather than the rival commanders.",
    ],
    characterIds: ["kayla", "tawnos", "urza"],
    cardName: "Queen Kayla bin-Kroog",
  },
  // Chapter 01 — deeper Thran history
  {
    id: "thran-untouchables-uprising",
    title: "Gix and the Untouchables Rise Against Halcyon",
    chapterId: "thran",
    summary: "Outcasts harmed by powerstone exposure revolt against Halcyon's inequality, drawing Glacian and Gix into a fateful confrontation.",
    narrative: [
      "The Thran capital's extraordinary technology concealed serious divisions: the Untouchables were confined in the Caves of the Damned, where phthisis was widespread.",
      "Before he became a Phyrexian praetor, Gix was a human rebel. He attacked Glacian with a powerstone shard amid the unrest, precipitating the illness that brought Yawgmoth back to the city.",
      "Gix's later identity as a Phyrexian commander belongs to a subsequent phase of the story, not the initial uprising.",
    ],
    characterIds: ["gix", "glacian", "yawgmoth"],
    cardName: "Gix, Yawgmoth Praetor",
  },
  {
    id: "thran-phthisis-and-power",
    title: "Phthisis Becomes an Instrument of Power",
    chapterId: "thran",
    summary: "Yawgmoth uses treatment of a powerstone-linked sickness to gain political authority over Halcyon and its excluded people.",
    narrative: [
      "Powerstone exposure lay behind the illness that ravaged the Thran, with the Untouchables suffering disproportionately from the city's dependence on its energy infrastructure.",
      "Yawgmoth's medical expertise and provision of treatment increased his credibility; his control over diagnosis, confinement, and care became a way to manipulate political loyalties.",
      "The card Thran Dynamo is a later image of Thran-derived artifice, not a literal picture of the Mana Rig or its victims.",
    ],
    characterIds: ["yawgmoth", "glacian", "rebbec", "gix"],
    cardName: "Thran Dynamo",
  },
  {
    id: "thran-dyfed-portal",
    title: "Dyfed Opens a Passage to Phyrexia",
    chapterId: "thran",
    summary: "A planeswalker introduces Yawgmoth to an existing artificial plane and creates the route that enables his experiments.",
    narrative: [
      "Dyfed took Yawgmoth to a world created earlier by an unnamed planeswalker. He did not originate that plane.",
      "The portal between Dominaria and Phyrexia allowed Yawgmoth to move patients and followers into a setting where his program of enforced transformation could grow.",
    ],
    characterIds: ["yawgmoth", "rebbec"],
    cardName: "Yawgmoth, Thran Physician",
  },
  {
    id: "thran-war-for-halcyon",
    title: "The Thran-Phyrexian War Destroys Halcyon",
    chapterId: "thran",
    summary: "The struggle against Yawgmoth destroys the capital; Rebbec seals the passage, but cannot restore the empire.",
    narrative: [
      "Yawgmoth's expanding power and the forces emerging from Phyrexia led to a war involving resistance beyond the original ruling circles of Halcyon.",
      "Rebbec sacrificed herself to close the gate after the capital was devastated, separating Dominaria from an entrenched Phyrexian threat.",
    ],
    characterIds: ["rebbec", "yawgmoth", "glacian", "gix"],
    cardName: "Rebbec, Architect of Ascension",
  },
  {
    id: "thran-stones-rediscovered",
    title: "The Powerstones Return as the Mightstone and Weakstone",
    chapterId: "thran",
    summary: "Glacian's divided powerstone survives the Thran catastrophe and becomes central to Urza and Mishra's later history.",
    narrative: [
      "The two powerstone halves associated with Glacian and the sealing of Phyrexia outlasted the destruction of Thran society.",
      "Millennia later, Urza and Mishra found the stones amid the ruins. What they named the Mightstone and Weakstone linked their rivalry to a catastrophe long before their time.",
      "The Brothers' War card printing is a 2022 illustration of this later discovery, not a card printed during the fictional Thran era.",
    ],
    characterIds: ["glacian", "rebbec", "urza", "mishra"],
    cardName: "The Mightstone and Weakstone",
  },
  // Chapter 10 — the early Omenpath era
  {
    id: "omenpaths-sparks-and-roads",
    title: "Desparking and the Emergence of Omenpaths",
    chapterId: "omenpaths",
    summary: "Many planeswalkers lose their sparks even as non-planeswalkers gain new ways to traverse worlds.",
    narrative: [
      "The consequences of Realmbreaker include the loss of sparks by many former planeswalkers and the appearance of unstable Omenpaths.",
      "Nissa struggles through her recovery on Zhalfir, while Chandra continues to provide a personal point of connection to the war’s survivors.",
    ],
    characterIds: ["nissa", "chandra"],
    cardName: "Nissa, Resurgent Animist",
  },
  {
    id: "omenpaths-eldraine-mourning",
    title: "Eldraine Mourns the Kenriths",
    chapterId: "omenpaths",
    summary: "Will and Rowan face a shattered kingdom after the deaths of their parents.",
    narrative: [
      "King Kenrith and Queen Linden died during the Phyrexian invasion, leaving Eldraine without its familiar rulers.",
      "Their desparked children took different approaches to the realm’s rebuilding as the Wicked Slumber strained its people.",
    ],
    characterIds: ["will-kenrith", "rowan-kenrith"],
    cardName: "The Kenriths' Royal Funeral",
  },
  {
    id: "omenpaths-kellan-first-crossing",
    title: "Kellan Leaves Eldraine by Omenpath",
    chapterId: "omenpaths",
    summary: "A half-fae youth begins crossing planes without a spark to search for Oko.",
    narrative: [
      "Kellan’s involvement in Eldraine’s fae crisis reveals his connection to Oko.",
      "He follows Omenpaths toward other worlds, where the search for a parent begins to intersect with local histories.",
    ],
    characterIds: ["kellan", "oko"],
    cardName: "Kellan, the Fae-Blooded",
  },
  {
    id: "omenpaths-rowan-and-will-diverge",
    title: "The Kenrith Twins Choose Different Paths",
    chapterId: "omenpaths",
    summary: "Will turns toward rebuilding while Rowan pursues increasingly dangerous power.",
    narrative: [
      "Neither heir can undo the invasion’s losses, and both see the Wicked Slumber as a threat to Eldraine’s survival.",
      "Will emphasizes repair and legitimacy; Rowan becomes increasingly suspicious of patient compromise.",
    ],
    characterIds: ["will-kenrith", "rowan-kenrith"],
    cardName: "Rowan, Scion of War",
  },
  {
    id: "omenpaths-ravnica-investigation",
    title: "A Murder Conspiracy Shakes Ravnica",
    chapterId: "omenpaths",
    summary: "Kellan helps investigators uncover a conspiracy amid the guilds’ post-invasion tensions.",
    narrative: [
      "After arriving from other planes, Kellan joins Kaya and detective Alquist Proft as they investigate high-profile murders.",
      "The case reaches deep into Ravnica’s guild politics and unresolved injuries from the Phyrexian war.",
    ],
    characterIds: ["kellan", "teysa-karlov"],
    cardName: "Kellan, Inquisitive Prodigy",
  },
  {
    id: "omenpaths-thunder-junction-vault",
    title: "Oko’s Crew Raids the Thunder Junction Vault",
    chapterId: "omenpaths",
    summary: "Interplanar outlaws converge on an ancient vault as Kellan encounters his father.",
    narrative: [
      "Oko organizes a criminal crew on Thunder Junction to claim the secrets of a guarded Fomori vault.",
      "Kellan’s search brings him into the operation, forcing him to judge Oko by his choices rather than reputation or kinship.",
    ],
    characterIds: ["oko", "kellan", "vraska"],
    cardName: "Oko, the Ringleader",
  },
  {
    id: "omenpaths-loot-discovered",
    title: "The Vault Reveals Loot",
    chapterId: "omenpaths",
    summary: "The treasure in Thunder Junction’s vault is a living being tied to broader multiversal mysteries.",
    narrative: [
      "Loot is discovered within the ancient vault as the heist’s participants struggle over its contents.",
      "Jace and Vraska become central to Loot’s next steps, connecting the affair to ambitions extending beyond Thunder Junction.",
    ],
    characterIds: ["loot", "jace-beleren", "vraska"],
    cardName: "Loot, the Key to Everything",
  },
  // Chapter 09 — the New Phyrexian invasion and its aftermath
  {
    id: "phyrexia-dominaria-sleeper-war",
    title: "Sheoldred Infiltrates Dominaria",
    chapterId: "march-of-the-machine",
    summary: "Sleeper agents and Ajani's compleation undermine Dominaria's defenses before the invasion.",
    narrative: [
      "Sheoldred's agents compromised trusted institutions on the world that had defeated Yawgmoth's Phyrexia centuries earlier.",
      "The compleated Ajani betrayed the defenders, leading to Jaya Ballard's death and exposing the danger of allies who no longer controlled their actions.",
    ],
    characterIds: ["sheoldred", "ajani", "jaya", "teferi", "karn"],
    cardName: "Sheoldred, the Apocalypse",
  },
  {
    id: "phyrexia-seedcore-failure",
    title: "The Sylex Mission Fails at the Seedcore",
    chapterId: "march-of-the-machine",
    summary: "The strike team's effort to prevent Realmbreaker's growth ends in corruption and a desperate rescue.",
    narrative: [
      "Planeswalkers attacked New Phyrexia with a new Sylex, but defenses and glistening oil fractured the mission; Nissa and other allies were compleated.",
      "As Realmbreaker opened portals to other worlds, Elspeth carried the activated Sylex into the Blind Eternities rather than allow the blast to endanger already-linked planes.",
    ],
    characterIds: ["elspeth", "nissa", "koth"],
    cardName: "Nissa, Ascended Animist",
  },
  {
    id: "phyrexia-realmbreaker-invasion",
    title: "Realmbreaker Breaches the Multiverse",
    chapterId: "march-of-the-machine",
    summary: "The Invasion Tree provides portals through which Phyrexia attacks many planes simultaneously.",
    narrative: [
      "Elesh Norn's forces grew Realmbreaker from Kaldheim's World Tree essence and used its branches to cross previously impassable planar boundaries.",
      "Invasions unfolded across Kaldheim, Zendikar, Kamigawa, Kaladesh, and numerous other planes, whose peoples mounted different forms of resistance.",
    ],
    characterIds: ["elesh-norn", "nissa", "nahiri"],
    cardName: "Realmbreaker, the Invasion Tree",
  },
  {
    id: "phyrexia-elspeth-return",
    title: "Elspeth Returns as an Angel",
    chapterId: "march-of-the-machine",
    summary: "Elspeth's transformed return protects the Mirran resistance and challenges Elesh Norn.",
    narrative: [
      "Elspeth returned from the Blind Eternities transformed, intervening as Norn threatened Chandra, Karn, Koth, and Wrenn.",
      "She defied Norn and bought the defenders the opening needed for Wrenn's attempt to reach Realmbreaker.",
    ],
    characterIds: ["elspeth", "elesh-norn", "chandra", "karn", "koth", "wrenn"],
    cardName: "Archangel Elspeth",
  },
  {
    id: "phyrexia-zhalfir-return",
    title: "Wrenn Opens a Path to Zhalfir",
    chapterId: "march-of-the-machine",
    summary: "Wrenn's union with Realmbreaker brings the isolated Zhalfirins into the battle and seals New Phyrexia away.",
    narrative: [
      "Wrenn joined the invasion tree's remnant, called Eight, and reconnected Teferi's lost homeland with the Multiverse.",
      "Zhalfir's forces counterattacked, and the two planes exchanged positions: Zhalfir became reachable while New Phyrexia was placed beyond ordinary contact.",
    ],
    characterIds: ["wrenn", "teferi", "chandra", "koth"],
    cardName: "Wrenn and Realmbreaker",
  },
  {
    id: "phyrexia-norns-fall",
    title: "Karn Ends Elesh Norn's Rule",
    chapterId: "march-of-the-machine",
    summary: "The invasion fails and Karn personally dismantles the Mother of Machines.",
    narrative: [
      "Elspeth's intervention and the Zhalfirin counterattack brought Norn's war to a halt as New Phyrexia became isolated.",
      "Karn assumed personal responsibility for ending Norn's threat, dismantling her after years of guilt over the fate of his created plane.",
    ],
    characterIds: ["karn", "elesh-norn", "elspeth", "teferi"],
    cardName: "Invasion of New Phyrexia",
  },
  {
    id: "phyrexia-meliras-last-gift",
    title: "Melira and Karn Save Nissa and Ajani",
    chapterId: "march-of-the-machine",
    summary: "A costly attempt to reverse compleation saves two survivors but takes Melira's life and Karn's remaining spark.",
    narrative: [
      "After New Phyrexia was shut away, Nissa and Ajani remained inert and severely altered by compleation.",
      "Melira used her power to oppose the corruption while Karn expended the remaining spark he had received from Venser; the two planeswalkers survived, but Melira did not.",
    ],
    characterIds: ["nissa", "ajani", "karn", "chandra", "koth", "teferi"],
    cardName: "Karn, Legacy Reforged",
  },
  // Chapter 08 — the War of the Spark
  {
    id: "spark-ravnica-invasion",
    title: "The Dreadhorde Invades Ravnica",
    chapterId: "war-of-the-spark",
    summary: "Bolas traps planeswalkers on Ravnica and transports an Eternal army to take their sparks.",
    narrative: [
      "The beacon drew planeswalkers to Ravnica, where the Immortal Sun prevented their escape.",
      "Bolas used the Planar Bridge to transport the lazotep-clad Eternals from Amonkhet, threatening residents and hunting the gathered planeswalkers.",
    ],
    characterIds: ["nicol-bolas", "liliana-vess"],
    cardName: "Bolas's Citadel",
  },
  {
    id: "spark-elderspell",
    title: "Bolas Begins the Elderspell",
    chapterId: "war-of-the-spark",
    summary: "The Eternals harvest planeswalker sparks to restore Bolas's lost power.",
    narrative: [
      "The invasion was designed to gather sparks from the captive planeswalkers, killing victims in the process.",
      "The Elderspell redirected that stolen power toward Bolas, who sought the near-divine stature he remembered from before the Mending.",
    ],
    characterIds: ["nicol-bolas", "liliana-vess"],
    cardName: "The Elderspell",
  },
  {
    id: "spark-living-guildpact",
    title: "The Firemind Becomes the Living Guildpact",
    chapterId: "war-of-the-spark",
    summary: "Niv-Mizzet's return provides a new political and magical focus for Ravnica's guilds.",
    narrative: [
      "Cooperation among the city's guilds became a crucial element of the resistance.",
      "Niv-Mizzet was restored to life and invested with the mantle of the Living Guildpact, connecting the struggle with Ravnica's future governance.",
    ],
    characterIds: ["niv-mizzet", "nicol-bolas"],
    cardName: "Niv-Mizzet Reborn",
  },
  {
    id: "spark-gideons-sacrifice",
    title: "Gideon Sacrifices Himself for Liliana",
    chapterId: "war-of-the-spark",
    summary: "Gideon bears Bolas's deadly punishment when Liliana chooses to rebel.",
    narrative: [
      "Liliana ordered the Eternals to attack Bolas despite the curse that would kill her for disobedience.",
      "Gideon used his protective magic to take the fatal consequence himself, allowing Liliana to survive.",
    ],
    characterIds: ["gideon-jura", "liliana-vess", "nicol-bolas"],
    cardName: "Gideon's Sacrifice",
  },
  {
    id: "spark-bolas-defeated",
    title: "Bolas Is Defeated and Imprisoned",
    chapterId: "war-of-the-spark",
    summary: "The stolen sparks are lost and Ugin confines the powerless Elder Dragon in the Meditation Realm.",
    narrative: [
      "Bontu drew away the stolen sparks Bolas had amassed, and the dragon's bid for godhood collapsed.",
      "Bolas survived but lost his spark and freedom, remaining confined under Ugin's watch in the Meditation Realm.",
    ],
    characterIds: ["nicol-bolas", "liliana-vess"],
    cardName: "Nicol Bolas, Dragon-God",
  },
  // Chapter 07 — first major narratives beyond Dominaria
  {
    id: "ravnica-guildpact-collapse",
    title: "The First Guildpact Breaks",
    chapterId: "many-worlds",
    summary: "Agrus Kos's investigation brings Szadek to justice but triggers the collapse of Ravnica's ancient magical settlement.",
    narrative: [
      "The ten guilds had spent millennia operating within the magically enforced Guildpact.",
      "During the Decamillennial crisis, Agrus Kos followed evidence to the secret Dimir founder Szadek. His arrest broke the original pact, exposing Ravnica to renewed factional conflict.",
    ],
    characterIds: ["agrus-kos", "szadek"],
    cardName: "Szadek, Lord of Secrets",
  },
  {
    id: "ravnica-project-kraj",
    title: "Project Kraj and Ravnica's Aftermath",
    chapterId: "many-worlds",
    summary: "Momir Vig's living weapon threatens a city destabilized by the broken Guildpact.",
    narrative: [
      "With the old constraints weakened, guild leaders pursued increasingly dangerous plans to dominate Ravnica.",
      "Teysa Karlov and Agrus Kos became involved in struggles that culminated in the defeat of Momir Vig's Project Kraj, even as the guilds remained politically divided.",
    ],
    characterIds: ["teysa-karlov", "agrus-kos"],
    cardName: "Teysa, Orzhov Scion",
  },
  {
    id: "zendikar-hedrons",
    title: "Nahiri Builds the Hedron Prison",
    chapterId: "many-worlds",
    summary: "Nahiri, Sorin, and Ugin construct an immense prison to bind the Eldrazi titans to Zendikar.",
    narrative: [
      "Ugin devised a network of magical leylines and floating stone hedrons to draw the Eldrazi into confinement.",
      "Nahiri built the prison on her home plane with the help of Sorin. The arrangement contained three titans, but made Zendikar bear the danger on behalf of other worlds.",
    ],
    characterIds: ["nahiri", "sorin", "emrakul"],
    cardName: "Nahiri, the Harbinger",
  },
  {
    id: "zendikar-eye-rupture",
    title: "The Eye of Ugin Is Disturbed",
    chapterId: "many-worlds",
    summary: "A confrontation at the Eye damages the prison and begins the Eldrazi awakening.",
    narrative: [
      "Jace, Chandra, and Sarkhan converged on the Eye of Ugin amid Nicol Bolas's larger schemes.",
      "The resulting disruption weakened the prison, allowing Eldrazi spawn to emerge across Zendikar.",
    ],
    characterIds: ["nahiri", "emrakul"],
    cardName: "Eye of Ugin",
  },
  {
    id: "zendikar-eldrazi-awakening",
    title: "The Eldrazi Awakening",
    chapterId: "many-worlds",
    summary: "Eldrazi spawn and titanic manifestations turn Zendikar's frontier into an existential battlefield.",
    narrative: [
      "When the wards began to fail, Zendikar's inhabitants discovered that the ancient hedrons had imprisoned entities from outside ordinary reality.",
      "The emergence of Eldrazi spawn and titans endangered the landscape and the communities living upon it.",
    ],
    characterIds: ["emrakul", "nahiri", "sorin"],
    cardName: "Emrakul, the Aeons Torn",
  },
  {
    id: "innistrad-avacyn-created",
    title: "Sorin Creates Avacyn",
    chapterId: "many-worlds",
    summary: "Sorin fashions an angel to protect humanity and sustain Innistrad's fragile balance.",
    narrative: [
      "Sorin understood that unconstrained predation would eventually threaten the vampires alongside their human prey.",
      "He created Avacyn as a guardian and the focus of a protective church, giving human communities a chance to survive.",
    ],
    characterIds: ["sorin", "avacyn"],
    cardName: "Sorin, Lord of Innistrad",
  },
  {
    id: "innistrad-helvault-imprisonment",
    title: "Avacyn Disappears into the Helvault",
    chapterId: "many-worlds",
    summary: "Griselbrand lures Avacyn into the Helvault, leaving humanity's defenses gravely weakened.",
    narrative: [
      "The demon Griselbrand tricked Avacyn into confinement within the enchanted prison she used against demons.",
      "With both imprisoned, the church's protective rites weakened and Innistrad descended toward a new crisis.",
    ],
    characterIds: ["griselbrand", "avacyn", "sorin"],
    cardName: "Helvault",
  },
  {
    id: "innistrad-avacyn-restored",
    title: "The Helvault Breaks and Avacyn Returns",
    chapterId: "many-worlds",
    summary: "Breaking the Helvault frees Avacyn and its demons, transforming the balance of hope and danger.",
    narrative: [
      "Liliana's search for Griselbrand intersected with the desperate efforts of Innistrad's human defenders.",
      "The Helvault's destruction released Avacyn and the imprisoned demons. The angel's return restored hope, but did not remove the supernatural threats to humanity.",
    ],
    characterIds: ["avacyn", "griselbrand", "sorin"],
    cardName: "Avacyn, Angel of Hope",
  },
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
  // Chapter 05 — Mirari owners, the Cabal, and the Otarian aftermath
  {
    id: "mirari-discovery",
    title: "Chainer Discovers the Mirari",
    chapterId: "otaria",
    summary:
      "Chainer finds Karn's enigmatic probe and presents it to the Cabal Patriarch, setting the Otarian struggle in motion.",
    narrative: [
      "In an abandoned mansion near Cabal City, the young dementia caster Chainer encountered the Mirari. He delivered it to the First rather than claiming the device for himself.",
      "The Patriarch placed the object among the Cabal's treasures and made it a prize, attracting champions and ambitious powers into a struggle for possession. Its origin as Karn's probe would be revealed only later.",
    ],
    characterIds: ["chainer", "cabal-patriarch", "karn"],
    cardName: "Mirari",
  },
  {
    id: "mirari-changes-hands",
    title: "The Mirari's Disastrous Journey",
    chapterId: "otaria",
    summary:
      "The Mirari leaves the Cabal, corrupts leaders of the Order and the merfolk empire, and returns after widespread ruin.",
    narrative: [
      "Lieutenant Kirtar of the Order acquired the artifact after the attack on Cabal City; his use of it led to catastrophe for the Order.",
      "The cephalid emperor Aboshan later attempted to fulfill his dreams through the Mirari, unleashing devastating flooding. Laquatus continued his maneuvering, and the sphere ultimately returned to Cabal custody.",
    ],
    characterIds: ["aboshan", "laquatus", "braids"],
    cardName: "Aboshan, Cephalid Emperor",
  },
  {
    id: "chainer-downfall",
    title: "Chainer's Nightmare Catastrophe",
    chapterId: "otaria",
    summary:
      "After seizing the Mirari and Cabal City, Chainer loses control of a tide of nightmares and dies in a confrontation with Kamahl.",
    narrative: [
      "Chainer used the Mirari to drive the Cabal Patriarch from the city and magnify dementia summoning beyond his ability to contain it.",
      "Kamahl tried to halt his friend, but Chainer was overwhelmed as the nightmares he had summoned merged with his body. Kamahl ended Chainer's suffering, inheriting the artifact that had destroyed him.",
    ],
    characterIds: ["chainer", "kamahl", "cabal-patriarch"],
    cardName: "Chainer, Dementia Master",
  },
  {
    id: "jeska-wounded",
    title: "The Mirari Sword Wounds Jeska",
    chapterId: "otaria",
    summary:
      "Under the Mirari's influence, Kamahl nearly kills Jeska, beginning a transformation he cannot reverse.",
    narrative: [
      "The Mirari amplified Kamahl's violent ambition as he attempted to assert leadership among the Pardic tribes.",
      "When Jeska confronted him, he stabbed her with his Mirari sword. The wound resisted ordinary healing and eventually contributed to her transformation into Phage.",
    ],
    characterIds: ["kamahl", "jeska"],
    cardName: "Jeska, Warrior Adept",
  },
  {
    id: "miraris-wake",
    title: "Kamahl Releases Mirari's Wake",
    chapterId: "otaria",
    summary:
      "Kamahl abandons the Mirari sword in Krosa, releasing transformative magical energy into the forest.",
    narrative: [
      "After learning from the Krosan druids and turning away from his old life, Kamahl confronted the continuing danger of the Mirari and the ambitions of Laquatus.",
      "He planted the Mirari sword in Krosa. The land absorbed and radiated its power, creating Mirari's Wake and changing the forest's fate.",
    ],
    characterIds: ["kamahl", "seton", "laquatus"],
    cardName: "Mirari's Wake",
  },
  {
    id: "jeska-becomes-phage",
    title: "Jeska Becomes Phage",
    chapterId: "otaria",
    summary:
      "Dark Cabal intervention remakes the wounded Jeska as Phage the Untouchable, whose touch brings death.",
    narrative: [
      "Jeska did not recover from the injury caused by Kamahl's Mirari sword. The Cabal's intervention transformed her into Phage rather than restoring her original condition.",
      "Her deadly power became central to the arena culture and political designs of the Cabal Patriarch, drawing her into new conflicts across Otaria.",
    ],
    characterIds: ["jeska", "cabal-patriarch"],
    cardName: "Phage the Untouchable",
  },
  {
    id: "akroma-created",
    title: "Ixidor Creates Akroma",
    chapterId: "otaria",
    summary:
      "Ixidor turns grief over Nivea's death into the reality-sculpted angel Akroma and a vendetta against Phage.",
    narrative: [
      "After Nivea died in a pit encounter with Phage, Ixidor's powers as an illusionist developed into the ability to make imagined beings real.",
      "He created Akroma as an instrument of vengeance. The conflict between Akroma and Phage spread beyond personal grief into a devastating confrontation between their followers.",
    ],
    characterIds: ["ixidor", "akroma", "jeska"],
    cardName: "Akroma, Angel of Wrath",
  },
  {
    id: "jeska-spark",
    title: "Karona Falls and Jeska Ascends",
    chapterId: "otaria",
    summary:
      "The Mirari sword breaks Karona apart; Akroma and Zagorka die while Jeska becomes a planeswalker.",
    narrative: [
      "Sash and Waistcoat betrayed Karona and stabbed her with the Mirari sword, separating the three beings whose fusion had created the false god.",
      "Akroma and Zagorka died, but Jeska survived and her planeswalker spark ignited. Karn became her mentor, linking the Otarian saga to later events on Dominaria.",
    ],
    characterIds: ["jeska", "akroma", "kamahl", "karn"],
    cardName: "Jeska, Thrice Reborn",
  },
  {
    id: "mirari-aftermath",
    title: "Karn Reclaims the Mirari",
    chapterId: "otaria",
    summary:
      "Karn retrieves the probe and transforms it into Memnarch, connecting the Otarian crisis to the future of Mirrodin.",
    narrative: [
      "Karn returned to collect the Mirari, an object originally intended to observe the world rather than amplify the ambitions of its inhabitants.",
      "On his artificial plane Argentum, he reshaped the device into Memnarch. That new guardian's subsequent history would become central to the Mirrodin storyline.",
    ],
    characterIds: ["karn"],
    cardName: "Mirari",
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
  {
    id: "origins-of-the-temporal-rifts",
    title: "The Origins of Dominaria's Temporal Rifts",
    chapterId: "mending",
    summary:
      "Separate catastrophes at Tolaria, Shiv, Zhalfir, Urborg, Skyshroud, and Otaria weaken a single world.",
    narrative: [
      "The Sylex Blast, Urza's Tolarian experiments, Teferi's phasing, the Rathi Overlay, and Karona's emergence left different kinds of damage in Dominaria's history.",
      "The wounds accumulated and accelerated the loss of mana, so a local solution could have consequences for other regions.",
    ],
    characterIds: ["teferi", "karn", "jeska"],
    cardName: "The Mending of Dominaria",
  },
  {
    id: "teferis-phasing-decision",
    title: "Teferi Phases Out Zhalfir and Shiv",
    chapterId: "mending",
    summary:
      "Teferi preserves two lands from Phyrexia, but leaves their inhabitants separated from Dominaria.",
    narrative: [
      "During the Phyrexian invasion, Teferi phased Zhalfir and Shiv out of normal reality in an effort to save their populations.",
      "His later restoration of Shiv could not undo the isolation of Zhalfir, a loss that shaped his actions for centuries.",
    ],
    characterIds: ["teferi", "jhoira"],
    cardName: "Teferi, Mage of Zhalfir",
  },
  {
    id: "radha-and-the-skyshroud-rift",
    title: "Radha and the Skyshroud Rift",
    chapterId: "mending",
    summary:
      "Radha's connection to a damaged landscape makes her central to rift research and a target of dangerous plans.",
    narrative: [
      "Radha's Keldon and elven heritage placed her amid the Skyshroud crisis, where her unusual access to rift mana drew Teferi's attention.",
      "Her resistance to being used as a magical tool foreshadowed the conflict over Jeska's later attempts to close rifts.",
    ],
    characterIds: ["radha", "teferi", "freyalise"],
    cardName: "Radha, Heir to Keld",
  },
  {
    id: "freyalise-seals-skyshroud",
    title: "Freyalise Seals the Skyshroud Rift",
    chapterId: "mending",
    summary:
      "Skyshroud's ancient protector gives her life to heal the displaced forest's fracture.",
    narrative: [
      "The Rathi Overlay had brought Skyshroud into Keld, and a dangerous rift threatened its inhabitants.",
      "Freyalise ultimately sacrificed herself to close the wound and protect the people under her care.",
    ],
    characterIds: ["freyalise", "radha"],
    cardName: "Freyalise, Llanowar's Fury",
  },
  {
    id: "windgrace-seals-urborg",
    title: "Windgrace Seals the Urborg Rift",
    chapterId: "mending",
    summary:
      "The protector of Urborg surrenders his life to close the wound left by the Rathi Overlay.",
    narrative: [
      "Urborg's fracture was bound to the geographic upheaval and machinery that had arrived during Phyrexia's invasion.",
      "Lord Windgrace's final act healed the rift while leaving his legacy tied to the land.",
    ],
    characterIds: ["windgrace", "venser", "jhoira"],
    cardName: "Lord Windgrace",
  },
  {
    id: "karn-heals-tolaria",
    title: "Karn Heals the Tolarian Rift",
    chapterId: "mending",
    summary:
      "Karn confronts the Academy's temporal catastrophe and disappears after repairing the fracture.",
    narrative: [
      "Tolaria's rift emerged from Urza's temporal research and the disaster that struck his Academy.",
      "Karn traveled into the past to address its origin and vanished afterward, leaving Jeska without her mentor during the remaining crisis.",
    ],
    characterIds: ["karn", "jeska", "jhoira"],
    cardName: "The Mending of Dominaria",
  },
  {
    id: "jeska-seals-zhalfir-rift",
    title: "Jeska Closes the Zhalfirin Rift",
    chapterId: "mending",
    summary:
      "A dangerous fracture is closed, but Teferi's remaining route to Zhalfir is cut off.",
    narrative: [
      "Jeska tried to repair the damage to Dominaria while relying upon others' connections to the rifts.",
      "Closing the Zhalfirin wound preserved reality but eliminated the route through which Teferi hoped to recover the phased-out homeland.",
    ],
    characterIds: ["jeska", "teferi", "radha"],
    cardName: "Jeska, Thrice Reborn",
  },
  {
    id: "bolas-and-madara-rift",
    title: "Bolas, Leshrac, and the Madaran Rift",
    chapterId: "mending",
    summary:
      "The contest between two ancient planeswalkers becomes the means of sealing Madara's fracture.",
    narrative: [
      "Leshrac attempted to use Jeska and the rifts to increase his own power before confronting Nicol Bolas.",
      "Bolas defeated Leshrac and used the defeated walker's power to seal the Madaran rift, an outcome driven by rivalry rather than altruism.",
    ],
    characterIds: ["jeska"],
    cardName: "The Mending of Dominaria",
  },
  {
    id: "jeskas-final-sacrifice",
    title: "Jeska's Final Sacrifice at Otaria",
    chapterId: "mending",
    summary:
      "Jeska protects Radha and Venser and gives her life to seal the final rift.",
    narrative: [
      "The damage associated with Karona culminated in a final, exceptionally dangerous fracture over Otaria.",
      "Rather than sacrifice Radha and Venser, Jeska sent them away and spent her own power and life to close the wound, completing the Mending.",
    ],
    characterIds: ["jeska", "radha", "venser"],
    cardName: "Jeska, Thrice Reborn",
  },
];
