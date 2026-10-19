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

// Generated compatibility adapter. Edit src/content/relationships/*.json instead.
import entry0 from '../content/relationships/kellan--quintorius-kand--alliance--omenpaths.json' with { type: 'json' };
import entry1 from '../content/relationships/alquist-proft--kellan--alliance--omenpaths.json' with { type: 'json' };
import entry2 from '../content/relationships/alquist-proft--trostani--rivalry--omenpaths.json' with { type: 'json' };
import entry3 from '../content/relationships/teysa-karlov--trostani--rivalry--omenpaths.json' with { type: 'json' };
import entry4 from '../content/relationships/elesh-norn--jin-gitaxias--alliance--march-of-the-machine.json' with { type: 'json' };
import entry5 from '../content/relationships/elesh-norn--vorinclex--alliance--march-of-the-machine.json' with { type: 'json' };
import entry6 from '../content/relationships/elesh-norn--urabrask--rivalry--march-of-the-machine.json' with { type: 'json' };
import entry7 from '../content/relationships/koth--melira--alliance--march-of-the-machine.json' with { type: 'json' };
import entry8 from '../content/relationships/jin-gitaxias--tamiyo--rivalry--march-of-the-machine.json' with { type: 'json' };
import entry9 from '../content/relationships/karn--melira--alliance--march-of-the-machine.json' with { type: 'json' };
import entry10 from '../content/relationships/nicol-bolas--tezzeret--alliance--war-of-the-spark.json' with { type: 'json' };
import entry11 from '../content/relationships/dovin-baan--nicol-bolas--alliance--war-of-the-spark.json' with { type: 'json' };
import entry12 from '../content/relationships/niv-mizzet--ral-zarek--alliance--war-of-the-spark.json' with { type: 'json' };
import entry13 from '../content/relationships/ral-zarek--tezzeret--rivalry--war-of-the-spark.json' with { type: 'json' };
import entry14 from '../content/relationships/dovin-baan--ral-zarek--rivalry--war-of-the-spark.json' with { type: 'json' };
import entry15 from '../content/relationships/jeska--leshrac--rivalry--mending.json' with { type: 'json' };
import entry16 from '../content/relationships/leshrac--nicol-bolas--rivalry--mending.json' with { type: 'json' };
import entry17 from '../content/relationships/radha--venser--alliance--mending.json' with { type: 'json' };
import entry18 from '../content/relationships/balthor--kamahl--mentorship--otaria.json' with { type: 'json' };
import entry19 from '../content/relationships/cabal-patriarch--lieutenant-kirtar--rivalry--otaria.json' with { type: 'json' };
import entry20 from '../content/relationships/barrin--hanna--family--weatherlight.json' with { type: 'json' };
import entry21 from '../content/relationships/gerrard--multani--mentorship--weatherlight.json' with { type: 'json' };
import entry22 from '../content/relationships/gerrard--rofellos--friendship--weatherlight.json' with { type: 'json' };
import entry23 from '../content/relationships/mirri--multani--mentorship--weatherlight.json' with { type: 'json' };
import entry24 from '../content/relationships/radiant--urza--rivalry--weatherlight.json' with { type: 'json' };
import entry25 from '../content/relationships/sisay--squee--alliance--weatherlight.json' with { type: 'json' };
import entry26 from '../content/relationships/karn--squee--friendship--weatherlight.json' with { type: 'json' };
import entry27 from '../content/relationships/jodah--mairsil--rivalry--ice-age.json' with { type: 'json' };
import entry28 from '../content/relationships/kayla--mishra--rivalry--brothers-war.json' with { type: 'json' };
import entry29 from '../content/relationships/mishra--tawnos--rivalry--brothers-war.json' with { type: 'json' };
import entry30 from '../content/relationships/gix--glacian--rivalry--thran.json' with { type: 'json' };
import entry31 from '../content/relationships/glacian--yawgmoth--rivalry--thran.json' with { type: 'json' };
import entry32 from '../content/relationships/rowan-kenrith--will-kenrith--family--omenpaths.json' with { type: 'json' };
import entry33 from '../content/relationships/kellan--oko--family--omenpaths.json' with { type: 'json' };
import entry34 from '../content/relationships/jace-beleren--vraska--alliance--omenpaths.json' with { type: 'json' };
import entry35 from '../content/relationships/jace-beleren--loot--alliance--omenpaths.json' with { type: 'json' };
import entry36 from '../content/relationships/loot--vraska--alliance--omenpaths.json' with { type: 'json' };
import entry37 from '../content/relationships/elesh-norn--sheoldred--rivalry--march-of-the-machine.json' with { type: 'json' };
import entry38 from '../content/relationships/elesh-norn--elspeth--rivalry--march-of-the-machine.json' with { type: 'json' };
import entry39 from '../content/relationships/elesh-norn--karn--rivalry--march-of-the-machine.json' with { type: 'json' };
import entry40 from '../content/relationships/ajani--jaya--rivalry--march-of-the-machine.json' with { type: 'json' };
import entry41 from '../content/relationships/chandra--jaya--mentorship--march-of-the-machine.json' with { type: 'json' };
import entry42 from '../content/relationships/chandra--nissa--alliance--march-of-the-machine.json' with { type: 'json' };
import entry43 from '../content/relationships/teferi--wrenn--alliance--march-of-the-machine.json' with { type: 'json' };
import entry44 from '../content/relationships/chandra--wrenn--alliance--march-of-the-machine.json' with { type: 'json' };
import entry45 from '../content/relationships/elspeth--koth--alliance--march-of-the-machine.json' with { type: 'json' };
import entry46 from '../content/relationships/karn--koth--alliance--march-of-the-machine.json' with { type: 'json' };
import entry47 from '../content/relationships/liliana-vess--nicol-bolas--rivalry--war-of-the-spark.json' with { type: 'json' };
import entry48 from '../content/relationships/gideon-jura--liliana-vess--alliance--war-of-the-spark.json' with { type: 'json' };
import entry49 from '../content/relationships/gideon-jura--nicol-bolas--rivalry--war-of-the-spark.json' with { type: 'json' };
import entry50 from '../content/relationships/nicol-bolas--niv-mizzet--rivalry--war-of-the-spark.json' with { type: 'json' };
import entry51 from '../content/relationships/agrus-kos--szadek--rivalry--many-worlds.json' with { type: 'json' };
import entry52 from '../content/relationships/agrus-kos--teysa-karlov--alliance--many-worlds.json' with { type: 'json' };
import entry53 from '../content/relationships/nahiri--sorin--alliance--many-worlds.json' with { type: 'json' };
import entry54 from '../content/relationships/emrakul--nahiri--rivalry--many-worlds.json' with { type: 'json' };
import entry55 from '../content/relationships/avacyn--sorin--creation--many-worlds.json' with { type: 'json' };
import entry56 from '../content/relationships/avacyn--griselbrand--rivalry--many-worlds.json' with { type: 'json' };
import entry57 from '../content/relationships/cabal-patriarch--chainer--alliance--otaria.json' with { type: 'json' };
import entry58 from '../content/relationships/braids--cabal-patriarch--alliance--otaria.json' with { type: 'json' };
import entry59 from '../content/relationships/braids--chainer--alliance--otaria.json' with { type: 'json' };
import entry60 from '../content/relationships/aboshan--laquatus--rivalry--otaria.json' with { type: 'json' };
import entry61 from '../content/relationships/cabal-patriarch--laquatus--rivalry--otaria.json' with { type: 'json' };
import entry62 from '../content/relationships/kamahl--seton--friendship--otaria.json' with { type: 'json' };
import entry63 from '../content/relationships/cabal-patriarch--jeska--rivalry--otaria.json' with { type: 'json' };
import entry64 from '../content/relationships/akroma--ixidor--creation--otaria.json' with { type: 'json' };
import entry65 from '../content/relationships/akroma--jeska--rivalry--otaria.json' with { type: 'json' };
import entry66 from '../content/relationships/ixidor--jeska--rivalry--otaria.json' with { type: 'json' };
import entry67 from '../content/relationships/akroma--kamahl--rivalry--otaria.json' with { type: 'json' };
import entry68 from '../content/relationships/tevesh-szat--urza--rivalry--weatherlight.json' with { type: 'json' };
import entry69 from '../content/relationships/gerrard--urza--rivalry--weatherlight.json' with { type: 'json' };
import entry70 from '../content/relationships/gerrard--mirri--friendship--weatherlight.json' with { type: 'json' };
import entry71 from '../content/relationships/crovax--mirri--rivalry--weatherlight.json' with { type: 'json' };
import entry72 from '../content/relationships/crovax--gerrard--rivalry--weatherlight.json' with { type: 'json' };
import entry73 from '../content/relationships/ertai--sisay--alliance--weatherlight.json' with { type: 'json' };
import entry74 from '../content/relationships/ertai--hanna--alliance--weatherlight.json' with { type: 'json' };
import entry75 from '../content/relationships/crovax--ertai--alliance--weatherlight.json' with { type: 'json' };
import entry76 from '../content/relationships/crovax--volrath--rivalry--weatherlight.json' with { type: 'json' };
import entry77 from '../content/relationships/gerrard--sisay--alliance--weatherlight.json' with { type: 'json' };
import entry78 from '../content/relationships/gerrard--hanna--friendship--weatherlight.json' with { type: 'json' };
import entry79 from '../content/relationships/gerrard--volrath--rivalry--weatherlight.json' with { type: 'json' };
import entry80 from '../content/relationships/hanna--sisay--alliance--weatherlight.json' with { type: 'json' };
import entry81 from '../content/relationships/karn--sisay--alliance--weatherlight.json' with { type: 'json' };
import entry82 from '../content/relationships/volrath--yawgmoth--alliance--weatherlight.json' with { type: 'json' };
import entry83 from '../content/relationships/jaya--jodah--friendship--ice-age.json' with { type: 'json' };
import entry84 from '../content/relationships/jodah--lim-dul--rivalry--ice-age.json' with { type: 'json' };
import entry85 from '../content/relationships/jaya--lim-dul--rivalry--ice-age.json' with { type: 'json' };
import entry86 from '../content/relationships/freyalise--jodah--alliance--ice-age.json' with { type: 'json' };
import entry87 from '../content/relationships/kayla--urza--family--brothers-war.json' with { type: 'json' };
import entry88 from '../content/relationships/tawnos--urza--mentorship--brothers-war.json' with { type: 'json' };
import entry89 from '../content/relationships/ashnod--mishra--alliance--brothers-war.json' with { type: 'json' };
import entry90 from '../content/relationships/ashnod--tawnos--friendship--brothers-war.json' with { type: 'json' };
import entry91 from '../content/relationships/kayla--tawnos--alliance--brothers-war.json' with { type: 'json' };
import entry92 from '../content/relationships/mishra--urza--family--brothers-war.json' with { type: 'json' };
import entry93 from '../content/relationships/tocasia--urza--mentorship--brothers-war.json' with { type: 'json' };
import entry94 from '../content/relationships/mishra--tocasia--mentorship--brothers-war.json' with { type: 'json' };
import entry95 from '../content/relationships/gix--mishra--alliance--brothers-war.json' with { type: 'json' };
import entry96 from '../content/relationships/gix--yawgmoth--alliance--brothers-war.json' with { type: 'json' };
import entry97 from '../content/relationships/glacian--rebbec--family--thran.json' with { type: 'json' };
import entry98 from '../content/relationships/rebbec--yawgmoth--rivalry--thran.json' with { type: 'json' };
import entry99 from '../content/relationships/urza--yawgmoth--rivalry--weatherlight.json' with { type: 'json' };
import entry100 from '../content/relationships/karn--urza--creation--weatherlight.json' with { type: 'json' };
import entry101 from '../content/relationships/gerrard--karn--alliance--weatherlight.json' with { type: 'json' };
import entry102 from '../content/relationships/jeska--kamahl--family--otaria.json' with { type: 'json' };
import entry103 from '../content/relationships/chainer--kamahl--friendship--otaria.json' with { type: 'json' };
import entry104 from '../content/relationships/jeska--karn--mentorship--otaria.json' with { type: 'json' };
import entry105 from '../content/relationships/jhoira--karn--friendship--mending.json' with { type: 'json' };
import entry106 from '../content/relationships/jhoira--teferi--friendship--mending.json' with { type: 'json' };
import entry107 from '../content/relationships/teferi--venser--alliance--mending.json' with { type: 'json' };
import entry108 from '../content/relationships/jhoira--venser--alliance--mending.json' with { type: 'json' };
import entry109 from '../content/relationships/radha--teferi--alliance--mending.json' with { type: 'json' };
import entry110 from '../content/relationships/venser--windgrace--alliance--mending.json' with { type: 'json' };
import entry111 from '../content/relationships/freyalise--radha--alliance--mending.json' with { type: 'json' };
import entry112 from '../content/relationships/teferi--windgrace--alliance--mending.json' with { type: 'json' };
import entry113 from '../content/relationships/jeska--radha--rivalry--mending.json' with { type: 'json' };
import entry114 from '../content/relationships/jeska--venser--alliance--mending.json' with { type: 'json' };
import entry115 from '../content/relationships/jeska--teferi--rivalry--mending.json' with { type: 'json' };
import entry116 from '../content/relationships/crovax--selenia--rivalry--weatherlight.json' with { type: 'json' };
import entry117 from '../content/relationships/mirri--selenia--rivalry--weatherlight.json' with { type: 'json' };

export const characterRelationships: CharacterRelationship[] = [
  entry0 as CharacterRelationship,
  entry1 as CharacterRelationship,
  entry2 as CharacterRelationship,
  entry3 as CharacterRelationship,
  entry4 as CharacterRelationship,
  entry5 as CharacterRelationship,
  entry6 as CharacterRelationship,
  entry7 as CharacterRelationship,
  entry8 as CharacterRelationship,
  entry9 as CharacterRelationship,
  entry10 as CharacterRelationship,
  entry11 as CharacterRelationship,
  entry12 as CharacterRelationship,
  entry13 as CharacterRelationship,
  entry14 as CharacterRelationship,
  entry15 as CharacterRelationship,
  entry16 as CharacterRelationship,
  entry17 as CharacterRelationship,
  entry18 as CharacterRelationship,
  entry19 as CharacterRelationship,
  entry20 as CharacterRelationship,
  entry21 as CharacterRelationship,
  entry22 as CharacterRelationship,
  entry23 as CharacterRelationship,
  entry24 as CharacterRelationship,
  entry25 as CharacterRelationship,
  entry26 as CharacterRelationship,
  entry27 as CharacterRelationship,
  entry28 as CharacterRelationship,
  entry29 as CharacterRelationship,
  entry30 as CharacterRelationship,
  entry31 as CharacterRelationship,
  entry32 as CharacterRelationship,
  entry33 as CharacterRelationship,
  entry34 as CharacterRelationship,
  entry35 as CharacterRelationship,
  entry36 as CharacterRelationship,
  entry37 as CharacterRelationship,
  entry38 as CharacterRelationship,
  entry39 as CharacterRelationship,
  entry40 as CharacterRelationship,
  entry41 as CharacterRelationship,
  entry42 as CharacterRelationship,
  entry43 as CharacterRelationship,
  entry44 as CharacterRelationship,
  entry45 as CharacterRelationship,
  entry46 as CharacterRelationship,
  entry47 as CharacterRelationship,
  entry48 as CharacterRelationship,
  entry49 as CharacterRelationship,
  entry50 as CharacterRelationship,
  entry51 as CharacterRelationship,
  entry52 as CharacterRelationship,
  entry53 as CharacterRelationship,
  entry54 as CharacterRelationship,
  entry55 as CharacterRelationship,
  entry56 as CharacterRelationship,
  entry57 as CharacterRelationship,
  entry58 as CharacterRelationship,
  entry59 as CharacterRelationship,
  entry60 as CharacterRelationship,
  entry61 as CharacterRelationship,
  entry62 as CharacterRelationship,
  entry63 as CharacterRelationship,
  entry64 as CharacterRelationship,
  entry65 as CharacterRelationship,
  entry66 as CharacterRelationship,
  entry67 as CharacterRelationship,
  entry68 as CharacterRelationship,
  entry69 as CharacterRelationship,
  entry70 as CharacterRelationship,
  entry71 as CharacterRelationship,
  entry72 as CharacterRelationship,
  entry73 as CharacterRelationship,
  entry74 as CharacterRelationship,
  entry75 as CharacterRelationship,
  entry76 as CharacterRelationship,
  entry77 as CharacterRelationship,
  entry78 as CharacterRelationship,
  entry79 as CharacterRelationship,
  entry80 as CharacterRelationship,
  entry81 as CharacterRelationship,
  entry82 as CharacterRelationship,
  entry83 as CharacterRelationship,
  entry84 as CharacterRelationship,
  entry85 as CharacterRelationship,
  entry86 as CharacterRelationship,
  entry87 as CharacterRelationship,
  entry88 as CharacterRelationship,
  entry89 as CharacterRelationship,
  entry90 as CharacterRelationship,
  entry91 as CharacterRelationship,
  entry92 as CharacterRelationship,
  entry93 as CharacterRelationship,
  entry94 as CharacterRelationship,
  entry95 as CharacterRelationship,
  entry96 as CharacterRelationship,
  entry97 as CharacterRelationship,
  entry98 as CharacterRelationship,
  entry99 as CharacterRelationship,
  entry100 as CharacterRelationship,
  entry101 as CharacterRelationship,
  entry102 as CharacterRelationship,
  entry103 as CharacterRelationship,
  entry104 as CharacterRelationship,
  entry105 as CharacterRelationship,
  entry106 as CharacterRelationship,
  entry107 as CharacterRelationship,
  entry108 as CharacterRelationship,
  entry109 as CharacterRelationship,
  entry110 as CharacterRelationship,
  entry111 as CharacterRelationship,
  entry112 as CharacterRelationship,
  entry113 as CharacterRelationship,
  entry114 as CharacterRelationship,
  entry115 as CharacterRelationship,
  entry116 as CharacterRelationship,
  entry117 as CharacterRelationship,
];
