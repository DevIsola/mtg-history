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

// Generated compatibility adapter. Edit src/content/characters/*.json instead.
import entry0 from '../content/characters/quintorius-kand.json' with { type: 'json' };
import entry1 from '../content/characters/alquist-proft.json' with { type: 'json' };
import entry2 from '../content/characters/trostani.json' with { type: 'json' };
import entry3 from '../content/characters/jin-gitaxias.json' with { type: 'json' };
import entry4 from '../content/characters/vorinclex.json' with { type: 'json' };
import entry5 from '../content/characters/urabrask.json' with { type: 'json' };
import entry6 from '../content/characters/melira.json' with { type: 'json' };
import entry7 from '../content/characters/tamiyo.json' with { type: 'json' };
import entry8 from '../content/characters/tezzeret.json' with { type: 'json' };
import entry9 from '../content/characters/ral-zarek.json' with { type: 'json' };
import entry10 from '../content/characters/dovin-baan.json' with { type: 'json' };
import entry11 from '../content/characters/leshrac.json' with { type: 'json' };
import entry12 from '../content/characters/lieutenant-kirtar.json' with { type: 'json' };
import entry13 from '../content/characters/balthor.json' with { type: 'json' };
import entry14 from '../content/characters/barrin.json' with { type: 'json' };
import entry15 from '../content/characters/radiant.json' with { type: 'json' };
import entry16 from '../content/characters/multani.json' with { type: 'json' };
import entry17 from '../content/characters/rofellos.json' with { type: 'json' };
import entry18 from '../content/characters/squee.json' with { type: 'json' };
import entry19 from '../content/characters/mairsil.json' with { type: 'json' };
import entry20 from '../content/characters/thelon-of-havenwood.json' with { type: 'json' };
import entry21 from '../content/characters/endrek-sahr.json' with { type: 'json' };
import entry22 from '../content/characters/will-kenrith.json' with { type: 'json' };
import entry23 from '../content/characters/rowan-kenrith.json' with { type: 'json' };
import entry24 from '../content/characters/kellan.json' with { type: 'json' };
import entry25 from '../content/characters/oko.json' with { type: 'json' };
import entry26 from '../content/characters/jace-beleren.json' with { type: 'json' };
import entry27 from '../content/characters/vraska.json' with { type: 'json' };
import entry28 from '../content/characters/loot.json' with { type: 'json' };
import entry29 from '../content/characters/elesh-norn.json' with { type: 'json' };
import entry30 from '../content/characters/sheoldred.json' with { type: 'json' };
import entry31 from '../content/characters/koth.json' with { type: 'json' };
import entry32 from '../content/characters/ajani.json' with { type: 'json' };
import entry33 from '../content/characters/nissa.json' with { type: 'json' };
import entry34 from '../content/characters/chandra.json' with { type: 'json' };
import entry35 from '../content/characters/elspeth.json' with { type: 'json' };
import entry36 from '../content/characters/wrenn.json' with { type: 'json' };
import entry37 from '../content/characters/nicol-bolas.json' with { type: 'json' };
import entry38 from '../content/characters/liliana-vess.json' with { type: 'json' };
import entry39 from '../content/characters/gideon-jura.json' with { type: 'json' };
import entry40 from '../content/characters/niv-mizzet.json' with { type: 'json' };
import entry41 from '../content/characters/agrus-kos.json' with { type: 'json' };
import entry42 from '../content/characters/szadek.json' with { type: 'json' };
import entry43 from '../content/characters/teysa-karlov.json' with { type: 'json' };
import entry44 from '../content/characters/nahiri.json' with { type: 'json' };
import entry45 from '../content/characters/emrakul.json' with { type: 'json' };
import entry46 from '../content/characters/sorin.json' with { type: 'json' };
import entry47 from '../content/characters/avacyn.json' with { type: 'json' };
import entry48 from '../content/characters/griselbrand.json' with { type: 'json' };
import entry49 from '../content/characters/tevesh-szat.json' with { type: 'json' };
import entry50 from '../content/characters/crovax.json' with { type: 'json' };
import entry51 from '../content/characters/mirri.json' with { type: 'json' };
import entry52 from '../content/characters/ertai.json' with { type: 'json' };
import entry53 from '../content/characters/sisay.json' with { type: 'json' };
import entry54 from '../content/characters/volrath.json' with { type: 'json' };
import entry55 from '../content/characters/hanna.json' with { type: 'json' };
import entry56 from '../content/characters/jaya.json' with { type: 'json' };
import entry57 from '../content/characters/lim-dul.json' with { type: 'json' };
import entry58 from '../content/characters/kayla.json' with { type: 'json' };
import entry59 from '../content/characters/tawnos.json' with { type: 'json' };
import entry60 from '../content/characters/ashnod.json' with { type: 'json' };
import entry61 from '../content/characters/mishra.json' with { type: 'json' };
import entry62 from '../content/characters/tocasia.json' with { type: 'json' };
import entry63 from '../content/characters/gix.json' with { type: 'json' };
import entry64 from '../content/characters/urza.json' with { type: 'json' };
import entry65 from '../content/characters/yawgmoth.json' with { type: 'json' };
import entry66 from '../content/characters/karn.json' with { type: 'json' };
import entry67 from '../content/characters/jodah.json' with { type: 'json' };
import entry68 from '../content/characters/gerrard.json' with { type: 'json' };
import entry69 from '../content/characters/glacian.json' with { type: 'json' };
import entry70 from '../content/characters/rebbec.json' with { type: 'json' };
import entry71 from '../content/characters/kamahl.json' with { type: 'json' };
import entry72 from '../content/characters/jeska.json' with { type: 'json' };
import entry73 from '../content/characters/chainer.json' with { type: 'json' };
import entry74 from '../content/characters/cabal-patriarch.json' with { type: 'json' };
import entry75 from '../content/characters/braids.json' with { type: 'json' };
import entry76 from '../content/characters/aboshan.json' with { type: 'json' };
import entry77 from '../content/characters/laquatus.json' with { type: 'json' };
import entry78 from '../content/characters/seton.json' with { type: 'json' };
import entry79 from '../content/characters/ixidor.json' with { type: 'json' };
import entry80 from '../content/characters/akroma.json' with { type: 'json' };
import entry81 from '../content/characters/teferi.json' with { type: 'json' };
import entry82 from '../content/characters/jhoira.json' with { type: 'json' };
import entry83 from '../content/characters/venser.json' with { type: 'json' };
import entry84 from '../content/characters/radha.json' with { type: 'json' };
import entry85 from '../content/characters/freyalise.json' with { type: 'json' };
import entry86 from '../content/characters/windgrace.json' with { type: 'json' };

export const characters: CharacterProfile[] = [
  { id: "quintorius-kand", ...entry0 } as CharacterProfile,
  { id: "alquist-proft", ...entry1 } as CharacterProfile,
  { id: "trostani", ...entry2 } as CharacterProfile,
  { id: "jin-gitaxias", ...entry3 } as CharacterProfile,
  { id: "vorinclex", ...entry4 } as CharacterProfile,
  { id: "urabrask", ...entry5 } as CharacterProfile,
  { id: "melira", ...entry6 } as CharacterProfile,
  { id: "tamiyo", ...entry7 } as CharacterProfile,
  { id: "tezzeret", ...entry8 } as CharacterProfile,
  { id: "ral-zarek", ...entry9 } as CharacterProfile,
  { id: "dovin-baan", ...entry10 } as CharacterProfile,
  { id: "leshrac", ...entry11 } as CharacterProfile,
  { id: "lieutenant-kirtar", ...entry12 } as CharacterProfile,
  { id: "balthor", ...entry13 } as CharacterProfile,
  { id: "barrin", ...entry14 } as CharacterProfile,
  { id: "radiant", ...entry15 } as CharacterProfile,
  { id: "multani", ...entry16 } as CharacterProfile,
  { id: "rofellos", ...entry17 } as CharacterProfile,
  { id: "squee", ...entry18 } as CharacterProfile,
  { id: "mairsil", ...entry19 } as CharacterProfile,
  { id: "thelon-of-havenwood", ...entry20 } as CharacterProfile,
  { id: "endrek-sahr", ...entry21 } as CharacterProfile,
  { id: "will-kenrith", ...entry22 } as CharacterProfile,
  { id: "rowan-kenrith", ...entry23 } as CharacterProfile,
  { id: "kellan", ...entry24 } as CharacterProfile,
  { id: "oko", ...entry25 } as CharacterProfile,
  { id: "jace-beleren", ...entry26 } as CharacterProfile,
  { id: "vraska", ...entry27 } as CharacterProfile,
  { id: "loot", ...entry28 } as CharacterProfile,
  { id: "elesh-norn", ...entry29 } as CharacterProfile,
  { id: "sheoldred", ...entry30 } as CharacterProfile,
  { id: "koth", ...entry31 } as CharacterProfile,
  { id: "ajani", ...entry32 } as CharacterProfile,
  { id: "nissa", ...entry33 } as CharacterProfile,
  { id: "chandra", ...entry34 } as CharacterProfile,
  { id: "elspeth", ...entry35 } as CharacterProfile,
  { id: "wrenn", ...entry36 } as CharacterProfile,
  { id: "nicol-bolas", ...entry37 } as CharacterProfile,
  { id: "liliana-vess", ...entry38 } as CharacterProfile,
  { id: "gideon-jura", ...entry39 } as CharacterProfile,
  { id: "niv-mizzet", ...entry40 } as CharacterProfile,
  { id: "agrus-kos", ...entry41 } as CharacterProfile,
  { id: "szadek", ...entry42 } as CharacterProfile,
  { id: "teysa-karlov", ...entry43 } as CharacterProfile,
  { id: "nahiri", ...entry44 } as CharacterProfile,
  { id: "emrakul", ...entry45 } as CharacterProfile,
  { id: "sorin", ...entry46 } as CharacterProfile,
  { id: "avacyn", ...entry47 } as CharacterProfile,
  { id: "griselbrand", ...entry48 } as CharacterProfile,
  { id: "tevesh-szat", ...entry49 } as CharacterProfile,
  { id: "crovax", ...entry50 } as CharacterProfile,
  { id: "mirri", ...entry51 } as CharacterProfile,
  { id: "ertai", ...entry52 } as CharacterProfile,
  { id: "sisay", ...entry53 } as CharacterProfile,
  { id: "volrath", ...entry54 } as CharacterProfile,
  { id: "hanna", ...entry55 } as CharacterProfile,
  { id: "jaya", ...entry56 } as CharacterProfile,
  { id: "lim-dul", ...entry57 } as CharacterProfile,
  { id: "kayla", ...entry58 } as CharacterProfile,
  { id: "tawnos", ...entry59 } as CharacterProfile,
  { id: "ashnod", ...entry60 } as CharacterProfile,
  { id: "mishra", ...entry61 } as CharacterProfile,
  { id: "tocasia", ...entry62 } as CharacterProfile,
  { id: "gix", ...entry63 } as CharacterProfile,
  { id: "urza", ...entry64 } as CharacterProfile,
  { id: "yawgmoth", ...entry65 } as CharacterProfile,
  { id: "karn", ...entry66 } as CharacterProfile,
  { id: "jodah", ...entry67 } as CharacterProfile,
  { id: "gerrard", ...entry68 } as CharacterProfile,
  { id: "glacian", ...entry69 } as CharacterProfile,
  { id: "rebbec", ...entry70 } as CharacterProfile,
  { id: "kamahl", ...entry71 } as CharacterProfile,
  { id: "jeska", ...entry72 } as CharacterProfile,
  { id: "chainer", ...entry73 } as CharacterProfile,
  { id: "cabal-patriarch", ...entry74 } as CharacterProfile,
  { id: "braids", ...entry75 } as CharacterProfile,
  { id: "aboshan", ...entry76 } as CharacterProfile,
  { id: "laquatus", ...entry77 } as CharacterProfile,
  { id: "seton", ...entry78 } as CharacterProfile,
  { id: "ixidor", ...entry79 } as CharacterProfile,
  { id: "akroma", ...entry80 } as CharacterProfile,
  { id: "teferi", ...entry81 } as CharacterProfile,
  { id: "jhoira", ...entry82 } as CharacterProfile,
  { id: "venser", ...entry83 } as CharacterProfile,
  { id: "radha", ...entry84 } as CharacterProfile,
  { id: "freyalise", ...entry85 } as CharacterProfile,
  { id: "windgrace", ...entry86 } as CharacterProfile,
];
