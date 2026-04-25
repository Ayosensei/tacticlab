import { Duty } from "@/types/tactic";

export interface RoleInstruction {
  instructions: string[];
  hiddenInstructions: string[];
}

export interface RoleTraits {
  complementary: string[];
  contrasting: string[];
}

export interface RoleData {
  id: string;
  name: string;
  description: string;
  baseInstructions: RoleInstruction;
  baseTraits: RoleTraits;
  duties: Partial<Record<Duty, { instructions?: string[]; hiddenInstructions?: string[]; traits?: RoleTraits }>>;
}

export const ROLES_DB: Record<string, RoleData> = {
  "Goalkeeper": {
    id: "goalkeeper",
    name: "Goalkeeper",
    description: "The Goalkeeper focuses on making saves and collecting crosses as the last line of defense. Takes minimal risks with distribution.",
    baseInstructions: { instructions: ["Take Fewer Risks"], hiddenInstructions: [] },
    baseTraits: { complementary: [], contrasting: [] },
    duties: {
      Defend: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Sweeper Keeper": {
    id: "sweeper_keeper",
    name: "Sweeper Keeper",
    description: "Controls the space behind the defense, acting as a sweeper to clean up through balls and initiate counter-attacks.",
    baseInstructions: { instructions: [], hiddenInstructions: ["rush out more", "use more creative freedom"] },
    baseTraits: { complementary: [], contrasting: [] },
    duties: {
      Defend: { instructions: [], hiddenInstructions: [] },
      Support: { instructions: ["Take More Risks"], hiddenInstructions: [] },
      Attack: { instructions: ["Take More Risks", "Dribble More"], hiddenInstructions: [] }
    }
  },
  "Central Defender": {
    id: "central_defender",
    name: "Central Defender",
    description: "Main job is to clear the ball from danger and break up attacks without taking unnecessary risks in possession.",
    baseInstructions: { instructions: ["Dribble Less", "Shoot Less Often"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Refrains From Taking Long Shots", "Stays Back At All Times"], contrasting: ["Gets Forward Whenever Possible", "Runs With Ball Often", "Tries Tricks"] },
    duties: {
      Defend: { instructions: ["Hold Position"], hiddenInstructions: [] },
      Stopper: { instructions: ["Step Up More"], hiddenInstructions: ["Hold Position (but move into a more advanced position to close down)"] },
      Cover: { instructions: ["Drop Deeper"], hiddenInstructions: ["Hold Position (but move into a deeper position to sit off)"] }
    }
  },
  "Ball Playing Defender": {
    id: "ball_playing_defender",
    name: "Ball Playing Defender",
    description: "Defends while being encouraged to play long splitting passes from deep to launch counter-attacks.",
    baseInstructions: { instructions: ["Take More Risks"], hiddenInstructions: ["Carry the ball more", "Use more creative freedom"] },
    baseTraits: { complementary: ["Brings Ball Out Of Defence", "Tries Long Range Passes", "Dictates Tempo"], contrasting: ["Dwells On Ball", "Plays Short Simple Passes"] },
    duties: {
      Defend: { instructions: ["Hold Position"], hiddenInstructions: [] },
      Stopper: { instructions: ["Step Up More"], hiddenInstructions: [] },
      Cover: { instructions: ["Drop Deeper"], hiddenInstructions: [] }
    }
  },
  "No-Nonsense Centre-Back": {
    id: "no_nonsense_centre_back",
    name: "No-Nonsense Centre-Back",
    description: "An old-school defender focused purely on clearing the ball away from danger with absolute zero risk.",
    baseInstructions: { instructions: ["Pass It Shorter", "Take Fewer Risks", "Dribble Less"], hiddenInstructions: ["Use more tactical discipline"] },
    baseTraits: { complementary: ["Plays No Through Balls", "Stays Back At All Times"], contrasting: ["Brings Ball Out Of Defence", "Tries Tricks"] },
    duties: {
      Defend: { instructions: ["Hold Position"], hiddenInstructions: [] },
      Stopper: { instructions: ["Step Up More"], hiddenInstructions: [] },
      Cover: { instructions: ["Drop Deeper"], hiddenInstructions: [] }
    }
  },
  "Wide Centre-Back": {
    id: "wide_centre_back",
    name: "Wide Centre-Back",
    description: "Stays wide in possession to support the midfield like a full-back, overlapping or underlapping in attack.",
    baseInstructions: { instructions: ["Stay Wider"], hiddenInstructions: ["Make lateral runs"] },
    baseTraits: { complementary: ["Runs With Ball Often", "Gets Forward Whenever Possible"], contrasting: ["Stays Back At All Times"] },
    duties: {
      Defend: { instructions: ["Hold Position"], hiddenInstructions: [] },
      Support: { instructions: ["Get Further Forward", "Cross More Often"], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward", "Dribble More"], hiddenInstructions: [] }
    }
  },
  "Libero": {
    id: "libero",
    name: "Libero",
    description: "Drops behind the defense to sweep, but steps up into midfield to orchestrate play when in possession.",
    baseInstructions: { instructions: ["Take More Risks"], hiddenInstructions: ["Move into deeper position to sit off", "Use more creative freedom"] },
    baseTraits: { complementary: ["Brings Ball Out Of Defence", "Dictates Tempo"], contrasting: ["Plays Short Simple Passes", "Dwells On Ball"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: ["Carry the ball more"] },
      Attack: { instructions: ["Get Further Forward", "Dribble More", "Shoot More Often"], hiddenInstructions: [] }
    }
  },
  "Full Back": {
    id: "full_back",
    name: "Full Back",
    description: "Focuses heavily on defensive duties but will advance to provide width when absolutely necessary.",
    baseInstructions: { instructions: [], hiddenInstructions: [] },
    baseTraits: { complementary: ["Stays Back At All Times"], contrasting: ["Gets Forward Whenever Possible"] },
    duties: {
      Defend: { instructions: ["Hold Position", "Cross Less Often"], hiddenInstructions: [] },
      Support: { instructions: ["Cross From Deep"], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward", "Cross More Often"], hiddenInstructions: [] },
      Automatic: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Wing Back": {
    id: "wing_back",
    name: "Wing Back",
    description: "Provides width and creativity in attack while fulfilling significant defensive responsibilities to track opposition wingers.",
    baseInstructions: { instructions: ["Stay Wider", "Cross More Often"], hiddenInstructions: ["Make overlapping runs"] },
    baseTraits: { complementary: ["Gets Forward Whenever Possible", "Runs With Ball Down Left/Right"], contrasting: ["Stays Back At All Times"] },
    duties: {
      Defend: { instructions: ["Hold Position"], hiddenInstructions: [] },
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward"], hiddenInstructions: [] },
      Automatic: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Inverted Wing Back": {
    id: "inverted_wing_back",
    name: "Inverted Wing Back",
    description: "Starts wide but tucks inside centrally into midfield during build-up play to overload the center.",
    baseInstructions: { instructions: ["Sit Narrower"], hiddenInstructions: ["Cut inside with ball"] },
    baseTraits: { complementary: ["Cuts Inside From Both Flanks"], contrasting: ["Hugs Line"] },
    duties: {
      Defend: { instructions: ["Hold Position"], hiddenInstructions: [] },
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward"], hiddenInstructions: [] },
      Automatic: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Complete Wing-Back": {
    id: "complete_wing_back",
    name: "Complete Wing-Back",
    description: "Relentless attacker operating across the entire flank, contributing heavily with crosses and through balls while abandoning some defensive structure.",
    baseInstructions: { instructions: ["Get Further Forward", "Roam From Position", "Cross More Often"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Gets Forward Whenever Possible", "Plays One-Twos"], contrasting: ["Stays Back At All Times"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Dribble More"], hiddenInstructions: [] }
    }
  },
  "Defensive Midfielder": {
    id: "defensive_midfielder",
    name: "Defensive Midfielder",
    description: "Protects the defensive line, breaking up opposition attacks and recycling possession efficiently.",
    baseInstructions: { instructions: ["Hold Position"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Stays Back At All Times"], contrasting: ["Gets Forward Whenever Possible", "Arrives Late In Opponents' Area"] },
    duties: {
      Defend: { instructions: ["Dribble Less", "Shoot Less Often"], hiddenInstructions: [] },
      Support: { instructions: ["Take More Risks"], hiddenInstructions: [] }
    }
  },
  "Deep Lying Playmaker": {
    id: "deep_lying_playmaker",
    name: "Deep Lying Playmaker",
    description: "Operates between defense and midfield, initiating attacks with pinpoint passes and tremendous vision.",
    baseInstructions: { instructions: ["Hold Position", "Shoot Less Often"], hiddenInstructions: ["Use more creative freedom", "Focus play"] },
    baseTraits: { complementary: ["Dictates Tempo", "Comes Deep To Get Ball", "Tries Killer Balls Often"], contrasting: ["Dwells On Ball", "Plays Short Simple Passes"] },
    duties: {
      Defend: { instructions: ["Dribble Less"], hiddenInstructions: [] },
      Support: { instructions: ["Take More Risks"], hiddenInstructions: [] }
    }
  },
  "Ball Winning Midfielder": {
    id: "ball_winning_midfielder",
    name: "Ball Winning Midfielder",
    description: "A destroyer tasked with aggressively pressing the opposition to regain possession at all costs.",
    baseInstructions: { instructions: ["Tackle Harder"], hiddenInstructions: ["Use more tactical discipline"] },
    baseTraits: { complementary: ["Dives Into Tackles"], contrasting: ["Dictates Tempo", "Plays Short Simple Passes"] },
    duties: {
      Defend: { instructions: ["Hold Position", "Take Fewer Risks", "Dribble Less"], hiddenInstructions: [] },
      Support: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Anchor": {
    id: "anchor",
    name: "Anchor",
    description: "The 'Water Carrier' who occupies space between defense and midfield, intercepting play and playing simple passes without roaming.",
    baseInstructions: { instructions: ["Hold Position", "Take Fewer Risks", "Dribble Less", "Shoot Less Often"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Plays Short Simple Passes", "Stays Back At All Times"], contrasting: ["Gets Forward Whenever Possible", "Tries Killer Balls Often"] },
    duties: {
      Defend: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Half Back": {
    id: "half_back",
    name: "Half Back",
    description: "Drops between center-backs during build-up to form a back three, allowing full-backs to push extremely high.",
    baseInstructions: { instructions: ["Hold Position", "Dribble Less"], hiddenInstructions: ["Drop deep more"] },
    baseTraits: { complementary: ["Comes Deep To Get Ball", "Stays Back At All Times"], contrasting: ["Gets Forward Whenever Possible"] },
    duties: {
      Defend: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Regista": {
    id: "regista",
    name: "Regista",
    description: "An aggressive deep playmaker who roams from position to dictate high-pressing, possession-oriented systems.",
    baseInstructions: { instructions: ["Roam From Position", "Take More Risks"], hiddenInstructions: ["Collect the ball more", "Use more creative freedom", "Focus play"] },
    baseTraits: { complementary: ["Dictates Tempo", "Comes Deep To Get Ball", "Tries Killer Balls Often"], contrasting: ["Stays Back At All Times", "Plays Short Simple Passes"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Roaming Playmaker": {
    id: "roaming_playmaker",
    name: "Roaming Playmaker",
    description: "A heartbeat of the team who constantly seeks the ball across all thirds, driving play forward dynamically.",
    baseInstructions: { instructions: ["Roam From Position", "Take More Risks"], hiddenInstructions: ["Carry the ball more", "Use more creative freedom", "Make more surging forward runs", "Focus play"] },
    baseTraits: { complementary: ["Dictates Tempo", "Arrives Late In Opponents' Area", "Runs With Ball Through Centre"], contrasting: ["Stays Back At All Times", "Dwells On Ball"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Segundo Volante": {
    id: "segundo_volante",
    name: "Segundo Volante",
    description: "A dynamic defensive midfielder paired with an Anchor who makes late, surging runs into the opposition penalty area.",
    baseInstructions: { instructions: [], hiddenInstructions: ["Carry the ball more", "Make more surging forward runs"] },
    baseTraits: { complementary: ["Arrives Late In Opponents' Area", "Runs With Ball Through Centre"], contrasting: ["Stays Back At All Times", "Dwells On Ball"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward", "Shoot More Often"], hiddenInstructions: [] }
    }
  },
  "Central Midfielder": {
    id: "central_midfielder",
    name: "Central Midfielder",
    description: "A versatile link between defense and attack who executes a balanced range of tactical instructions.",
    baseInstructions: { instructions: [], hiddenInstructions: [] },
    baseTraits: { complementary: [], contrasting: [] },
    duties: {
      Defend: { instructions: ["Hold Position"], hiddenInstructions: [] },
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward"], hiddenInstructions: [] },
      Automatic: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Box To Box Midfielder": {
    id: "box_to_box_midfielder",
    name: "Box To Box Midfielder",
    description: "A relentless engine covering both penalty boxes, supporting attack and defending intensely.",
    baseInstructions: { instructions: ["Roam From Position"], hiddenInstructions: ["Make more surging forward runs", "Track back more"] },
    baseTraits: { complementary: ["Arrives Late In Opponents' Area"], contrasting: ["Stays Back At All Times"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Advanced Playmaker": {
    id: "advanced_playmaker",
    name: "Advanced Playmaker",
    description: "Finds space between the opposition midfield and defense to turn defense into attack instantly.",
    baseInstructions: { instructions: ["Take More Risks", "Shoot Less Often"], hiddenInstructions: ["Sit between the lines more", "Use more creative freedom", "Focus play"] },
    baseTraits: { complementary: ["Comes Deep To Get Ball", "Tries Killer Balls Often"], contrasting: ["Plays Short Simple Passes", "Gets Forward Whenever Possible"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Dribble More"], hiddenInstructions: [] }
    }
  },
  "Mezzala": {
    id: "mezzala",
    name: "Mezzala",
    description: "A central half-winger who prefers to operate in the half-spaces and wide areas, drifting out of the center.",
    baseInstructions: { instructions: ["Stay Wider", "Roam From Position"], hiddenInstructions: ["Make more dribbles into channels"] },
    baseTraits: { complementary: ["Gets Into Opposition Area", "Moves Into Channels"], contrasting: ["Stays Back At All Times", "Comes Deep To Get Ball"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward", "Take More Risks"], hiddenInstructions: [] }
    }
  },
  "Carrilero": {
    id: "carrilero",
    name: "Carrilero",
    description: "A supportive shuttler who covers the lateral areas of the midfield to balance formations like diamonds.",
    baseInstructions: { instructions: ["Stay Wider"], hiddenInstructions: ["Make more lateral runs"] },
    baseTraits: { complementary: ["Moves Into Channels"], contrasting: ["Gets Forward Whenever Possible", "Gets Into Opposition Area"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Wide Midfielder": {
    id: "wide_midfielder",
    name: "Wide Midfielder",
    description: "A traditional wide player who balances defensive cover with attacking support along the flanks.",
    baseInstructions: { instructions: [], hiddenInstructions: [] },
    baseTraits: { complementary: ["Hugs Line"], contrasting: ["Cuts Inside From Both Flanks"] },
    duties: {
      Defend: { instructions: ["Hold Position", "Cross Less Often"], hiddenInstructions: [] },
      Support: { instructions: ["Cross From Deep"], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward", "Cross More Often"], hiddenInstructions: [] },
      Automatic: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Winger": {
    id: "winger",
    name: "Winger",
    description: "Hugs the touchline to stretch the opposition defense, beating their man and delivering crosses.",
    baseInstructions: { instructions: ["Stay Wider", "Cross More Often", "Dribble More"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Runs With Ball Down Left/Right", "Hugs Line"], contrasting: ["Cuts Inside From Both Flanks", "Comes Deep To Get Ball"] },
    duties: {
      Support: { instructions: ["Cross From Deep"], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward"], hiddenInstructions: [] }
    }
  },
  "Inverted Winger": {
    id: "inverted_winger",
    name: "Inverted Winger",
    description: "Starts wide but cuts inside onto their stronger foot to create central overloads and shooting opportunities.",
    baseInstructions: { instructions: ["Sit Narrower", "Cut Inside With Ball", "Dribble More"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Cuts Inside From Both Flanks", "Shoots From Distance"], contrasting: ["Hugs Line", "Runs With Ball Down Left/Right"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward", "Shoot More Often"], hiddenInstructions: [] }
    }
  },
  "Inside Forward": {
    id: "inside_forward",
    name: "Inside Forward",
    description: "Aggressively cuts directly towards the penalty box from wide positions, acting almost as a secondary striker.",
    baseInstructions: { instructions: ["Sit Narrower", "Cut Inside With Ball", "Get Further Forward", "Take More Risks", "Dribble More"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Cuts Inside From Both Flanks", "Gets Into Opposition Area", "Places Shots"], contrasting: ["Hugs Line", "Crosses Early"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Shoot More Often"], hiddenInstructions: [] }
    }
  },
  "Raumdeuter": {
    id: "raumdeuter",
    name: "Raumdeuter",
    description: "A 'space investigator' who roams freely from wide areas to exploit pockets of space, completely abandoning defensive duties.",
    baseInstructions: { instructions: ["Roam From Position", "Get Further Forward"], hiddenInstructions: ["Find space"] },
    baseTraits: { complementary: ["Moves Into Channels", "Gets Into Opposition Area"], contrasting: ["Stays Back At All Times", "Plays Short Simple Passes"] },
    duties: {
      Attack: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Advanced Forward": {
    id: "advanced_forward",
    name: "Advanced Forward",
    description: "Spearheads the attack, leading the line and constantly looking to exploit gaps behind the defense to score or assist.",
    baseInstructions: { instructions: ["Get Further Forward", "Move Into Channels", "Take More Risks"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Moves Into Channels", "Gets Into Opposition Area", "Tries To Beat Offside Trap"], contrasting: ["Comes Deep To Get Ball", "Plays No Through Balls"] },
    duties: {
      Attack: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Deep Lying Forward": {
    id: "deep_lying_forward",
    name: "Deep Lying Forward",
    description: "Drops deep into the space between defense and midfield to link play and hold up the ball.",
    baseInstructions: { instructions: ["Hold Up Ball"], hiddenInstructions: ["Drop deep more"] },
    baseTraits: { complementary: ["Comes Deep To Get Ball", "Plays With Back To Goal"], contrasting: ["Tries To Beat Offside Trap"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward"], hiddenInstructions: [] }
    }
  },
  "Target Forward": {
    id: "target_forward",
    name: "Target Forward",
    description: "A physical focal point for the team, holding up long balls and bringing teammates into play.",
    baseInstructions: { instructions: ["Hold Up Ball"], hiddenInstructions: ["Focus play"] },
    baseTraits: { complementary: ["Plays With Back To Goal"], contrasting: ["Runs With Ball Often"] },
    duties: {
      Support: { instructions: ["Drop Deeper"], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward"], hiddenInstructions: [] }
    }
  },
  "Poacher": {
    id: "poacher",
    name: "Poacher",
    description: "An absolute penalty-box assassin whose sole focus is scoring goals. Ignores build-up play to stay on the shoulder of the last defender.",
    baseInstructions: { instructions: ["Take Fewer Risks", "Dribble Less", "Shoot More Often", "Stay Narrow"], hiddenInstructions: [] },
    baseTraits: { complementary: ["Tries To Beat Offside Trap", "Places Shots"], contrasting: ["Comes Deep To Get Ball", "Plays With Back To Goal", "Runs With Ball Often"] },
    duties: {
      Attack: { instructions: [], hiddenInstructions: [] }
    }
  },
  "Complete Forward": {
    id: "complete_forward",
    name: "Complete Forward",
    description: "A striker possessing the technical ability of a playmaker, power of a target man, and finishing of a poacher.",
    baseInstructions: { instructions: ["Roam From Position", "Take More Risks"], hiddenInstructions: ["Use more creative freedom"] },
    baseTraits: { complementary: ["Tries To Beat Offside Trap", "Comes Deep To Get Ball", "Plays One-Twos"], contrasting: [] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward", "Dribble More", "Shoot More Often"], hiddenInstructions: [] }
    }
  },
  "Pressing Forward": {
    id: "pressing_forward",
    name: "Pressing Forward",
    description: "A relentless workhorse who harries the opposition defense continuously to force mistakes.",
    baseInstructions: { instructions: ["Tackle Harder"], hiddenInstructions: ["Close down much more"] },
    baseTraits: { complementary: ["Dives Into Tackles"], contrasting: [] },
    duties: {
      Defend: { instructions: ["Hold Up Ball"], hiddenInstructions: [] },
      Support: { instructions: ["Hold Up Ball"], hiddenInstructions: [] },
      Attack: { instructions: ["Get Further Forward"], hiddenInstructions: [] }
    }
  },
  "False Nine": {
    id: "false_nine",
    name: "False Nine",
    description: "An unconventional lone striker who drops deep into midfield, dragging defenders completely out of position.",
    baseInstructions: { instructions: ["Roam From Position", "Take More Risks", "Dribble More"], hiddenInstructions: ["Drop deep much more", "Use more creative freedom"] },
    baseTraits: { complementary: ["Comes Deep To Get Ball", "Plays One-Twos", "Dictates Tempo"], contrasting: ["Tries To Beat Offside Trap", "Plays With Back To Goal"] },
    duties: {
      Support: { instructions: [], hiddenInstructions: [] }
    }
  }
};
