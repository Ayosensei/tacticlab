export const GRID_SLOTS = [
  { id: "LST", x: 35, y: 15, band: "ST" },
  { id: "ST", x: 50, y: 15, band: "ST" },
  { id: "RST", x: 65, y: 15, band: "ST" },
  { id: "LW", x: 12, y: 28, band: "AM_W" },
  { id: "LAM", x: 35, y: 28, band: "AM" },
  { id: "AM", x: 50, y: 28, band: "AM" },
  { id: "RAM", x: 65, y: 28, band: "AM" },
  { id: "RW", x: 88, y: 28, band: "AM_W" },
  { id: "LM", x: 15, y: 48, band: "WM" },
  { id: "LCM", x: 35, y: 48, band: "CM" },
  { id: "CM", x: 50, y: 48, band: "CM" },
  { id: "RCM", x: 65, y: 48, band: "CM" },
  { id: "RM", x: 85, y: 48, band: "WM" },
  { id: "LWB", x: 12, y: 66, band: "WB" },
  { id: "LDM", x: 35, y: 66, band: "DM" },
  { id: "DM", x: 50, y: 66, band: "DM" },
  { id: "RDM", x: 65, y: 66, band: "DM" },
  { id: "RWB", x: 88, y: 66, band: "WB" },
  { id: "LB", x: 15, y: 82, band: "FB" },
  { id: "LCB", x: 35, y: 82, band: "CB" },
  { id: "CB", x: 50, y: 82, band: "CB" },
  { id: "RCB", x: 65, y: 82, band: "CB" },
  { id: "RB", x: 85, y: 82, band: "FB" },
  { id: "GK", x: 50, y: 96, band: "GK" }
];

const getGridSlot = (id: string) => GRID_SLOTS.find(s => s.id === id)!;

export const DUTIES: string[] = ["Defend", "Support", "Attack"];

export const FORMATIONS = [
  {
    id: "4-3-3 WIDE",
    name: "4-3-3 Wide",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LB"), id: "2", role: "Full Back", duty: "Support", slot: "LB" },
      { ...getGridSlot("LCB"), id: "3", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("RCB"), id: "4", role: "Ball Playing Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("RB"), id: "5", role: "Full Back", duty: "Defend", slot: "RB" },
      { ...getGridSlot("DM"), id: "6", role: "Deep Lying Playmaker", duty: "Defend", slot: "DM" },
      { ...getGridSlot("LCM"), id: "7", role: "Advanced Playmaker", duty: "Support", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "8", role: "Mezzala", duty: "Attack", slot: "RCM" },
      { ...getGridSlot("LW"), id: "9", role: "Winger", duty: "Support", slot: "LW" },
      { ...getGridSlot("RW"), id: "10", role: "Winger", duty: "Support", slot: "RW" },
      { ...getGridSlot("ST"), id: "11", role: "Advanced Forward", duty: "Attack", slot: "ST" },
    ],
  },
  {
    id: "4-2-3-1 WIDE",
    name: "4-2-3-1 Wide",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LB"), id: "2", role: "Full Back", duty: "Support", slot: "LB" },
      { ...getGridSlot("LCB"), id: "3", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("RCB"), id: "4", role: "Ball Playing Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("RB"), id: "5", role: "Full Back", duty: "Defend", slot: "RB" },
      { ...getGridSlot("LDM"), id: "6", role: "Deep Lying Playmaker", duty: "Defend", slot: "LDM" },
      { ...getGridSlot("RDM"), id: "7", role: "Ball Winning Midfielder", duty: "Support", slot: "RDM" },
      { ...getGridSlot("AM"), id: "8", role: "Attacking Midfielder", duty: "Support", slot: "AM" },
      { ...getGridSlot("LW"), id: "9", role: "Inside Forward", duty: "Attack", slot: "LW" },
      { ...getGridSlot("RW"), id: "10", role: "Winger", duty: "Support", slot: "RW" },
      { ...getGridSlot("ST"), id: "11", role: "Advanced Forward", duty: "Attack", slot: "ST" },
    ],
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1 Asymmetric",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Sweeper Keeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LCB"), id: "2", role: "Wide Centre-Back", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("CB"), id: "3", role: "Central Defender", duty: "Cover", slot: "CB" },
      { ...getGridSlot("RCB"), id: "4", role: "Wide Centre-Back", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("LWB"), id: "5", role: "Wing Back", duty: "Support", slot: "LWB" },
      { ...getGridSlot("RWB"), id: "6", role: "Wing Back", duty: "Attack", slot: "RWB" },
      { ...getGridSlot("LCM"), id: "7", role: "Central Midfielder", duty: "Defend", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "8", role: "Box To Box Midfielder", duty: "Support", slot: "RCM" },
      { ...getGridSlot("LAM"), id: "9", role: "Advanced Playmaker", duty: "Support", slot: "LAM" },
      { ...getGridSlot("RAM"), id: "10", role: "Shadow Striker", duty: "Attack", slot: "RAM" },
      { ...getGridSlot("ST"), id: "11", role: "Pressing Forward", duty: "Attack", slot: "ST" },
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2 Catenaccio",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LCB"), id: "2", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("CB"), id: "3", role: "Central Defender", duty: "Cover", slot: "CB" },
      { ...getGridSlot("RCB"), id: "4", role: "Central Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("LWB"), id: "5", role: "Wing Back", duty: "Defend", slot: "LWB" },
      { ...getGridSlot("RWB"), id: "6", role: "Wing Back", duty: "Defend", slot: "RWB" },
      { ...getGridSlot("DM"), id: "7", role: "Half Back", duty: "Defend", slot: "DM" },
      { ...getGridSlot("LCM"), id: "8", role: "Central Midfielder", duty: "Support", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "9", role: "Carrilero", duty: "Support", slot: "RCM" },
      { ...getGridSlot("LST"), id: "10", role: "Advanced Forward", duty: "Attack", slot: "LST" },
      { ...getGridSlot("RST"), id: "11", role: "Target Forward", duty: "Support", slot: "RST" },
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2 Classic",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LB"), id: "2", role: "Full Back", duty: "Support", slot: "LB" },
      { ...getGridSlot("LCB"), id: "3", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("RCB"), id: "4", role: "Central Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("RB"), id: "5", role: "Full Back", duty: "Support", slot: "RB" },
      { ...getGridSlot("LM"), id: "6", role: "Wide Midfielder", duty: "Support", slot: "LM" },
      { ...getGridSlot("LCM"), id: "7", role: "Central Midfielder", duty: "Defend", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "8", role: "Box To Box Midfielder", duty: "Support", slot: "RCM" },
      { ...getGridSlot("RM"), id: "9", role: "Winger", duty: "Attack", slot: "RM" },
      { ...getGridSlot("LST"), id: "10", role: "Advanced Forward", duty: "Attack", slot: "LST" },
      { ...getGridSlot("RST"), id: "11", role: "Target Forward", duty: "Support", slot: "RST" },
    ],
  },
  {
    id: "4-2-4 WIDE",
    name: "4-2-4 Wide",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LB"), id: "2", role: "Full Back", duty: "Support", slot: "LB" },
      { ...getGridSlot("LCB"), id: "3", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("RCB"), id: "4", role: "Central Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("RB"), id: "5", role: "Full Back", duty: "Support", slot: "RB" },
      { ...getGridSlot("LCM"), id: "6", role: "Central Midfielder", duty: "Defend", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "7", role: "Central Midfielder", duty: "Support", slot: "RCM" },
      { ...getGridSlot("LW"), id: "8", role: "Winger", duty: "Attack", slot: "LW" },
      { ...getGridSlot("RW"), id: "9", role: "Winger", duty: "Attack", slot: "RW" },
      { ...getGridSlot("LST"), id: "10", role: "Advanced Forward", duty: "Attack", slot: "LST" },
      { ...getGridSlot("RST"), id: "11", role: "Advanced Forward", duty: "Attack", slot: "RST" },
    ],
  },
  {
    id: "4-1-4-1 DM WIDE",
    name: "4-1-4-1 DM Wide",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LB"), id: "2", role: "Full Back", duty: "Support", slot: "LB" },
      { ...getGridSlot("LCB"), id: "3", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("RCB"), id: "4", role: "Central Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("RB"), id: "5", role: "Full Back", duty: "Support", slot: "RB" },
      { ...getGridSlot("DM"), id: "6", role: "Defensive Midfielder", duty: "Defend", slot: "DM" },
      { ...getGridSlot("LM"), id: "7", role: "Wide Midfielder", duty: "Support", slot: "LM" },
      { ...getGridSlot("LCM"), id: "8", role: "Central Midfielder", duty: "Support", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "9", role: "Central Midfielder", duty: "Attack", slot: "RCM" },
      { ...getGridSlot("RM"), id: "10", role: "Winger", duty: "Attack", slot: "RM" },
      { ...getGridSlot("ST"), id: "11", role: "Advanced Forward", duty: "Attack", slot: "ST" },
    ],
  },
  {
    id: "4-4-2 DIAMOND NARROW",
    name: "4-4-2 Diamond Narrow",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LB"), id: "2", role: "Wing Back", duty: "Support", slot: "LB" },
      { ...getGridSlot("LCB"), id: "3", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("RCB"), id: "4", role: "Central Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("RB"), id: "5", role: "Wing Back", duty: "Support", slot: "RB" },
      { ...getGridSlot("DM"), id: "6", role: "Defensive Midfielder", duty: "Defend", slot: "DM" },
      { ...getGridSlot("LCM"), id: "7", role: "Carrilero", duty: "Support", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "8", role: "Mezzala", duty: "Support", slot: "RCM" },
      { ...getGridSlot("AM"), id: "9", role: "Attacking Midfielder", duty: "Support", slot: "AM" },
      { ...getGridSlot("LST"), id: "10", role: "Advanced Forward", duty: "Attack", slot: "LST" },
      { ...getGridSlot("RST"), id: "11", role: "Advanced Forward", duty: "Attack", slot: "RST" },
    ],
  },
  {
    id: "5-2-3 WIDE",
    name: "5-2-3 Wide",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LCB"), id: "2", role: "Central Defender", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("CB"), id: "3", role: "Central Defender", duty: "Cover", slot: "CB" },
      { ...getGridSlot("RCB"), id: "4", role: "Central Defender", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("LWB"), id: "5", role: "Wing Back", duty: "Support", slot: "LWB" },
      { ...getGridSlot("RWB"), id: "6", role: "Wing Back", duty: "Support", slot: "RWB" },
      { ...getGridSlot("LCM"), id: "7", role: "Central Midfielder", duty: "Defend", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "8", role: "Box To Box Midfielder", duty: "Support", slot: "RCM" },
      { ...getGridSlot("LW"), id: "9", role: "Inside Forward", duty: "Attack", slot: "LW" },
      { ...getGridSlot("RW"), id: "10", role: "Inside Forward", duty: "Attack", slot: "RW" },
      { ...getGridSlot("ST"), id: "11", role: "Advanced Forward", duty: "Attack", slot: "ST" },
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    players: [
      { ...getGridSlot("GK"), id: "1", role: "Sweeper Keeper", duty: "Defend", slot: "GK" },
      { ...getGridSlot("LCB"), id: "2", role: "Wide Centre-Back", duty: "Defend", slot: "LCB" },
      { ...getGridSlot("CB"), id: "3", role: "Central Defender", duty: "Cover", slot: "CB" },
      { ...getGridSlot("RCB"), id: "4", role: "Wide Centre-Back", duty: "Defend", slot: "RCB" },
      { ...getGridSlot("LWB"), id: "5", role: "Wing Back", duty: "Support", slot: "LWB" },
      { ...getGridSlot("RWB"), id: "6", role: "Wing Back", duty: "Support", slot: "RWB" },
      { ...getGridSlot("DM"), id: "7", role: "Defensive Midfielder", duty: "Defend", slot: "DM" },
      { ...getGridSlot("LCM"), id: "8", role: "Central Midfielder", duty: "Support", slot: "LCM" },
      { ...getGridSlot("RCM"), id: "9", role: "Mezzala", duty: "Attack", slot: "RCM" },
      { ...getGridSlot("LST"), id: "10", role: "Advanced Forward", duty: "Attack", slot: "LST" },
      { ...getGridSlot("RST"), id: "11", role: "Target Forward", duty: "Support", slot: "RST" },
    ],
  }
];

export const POSITIONS_DB = {
  GK: ["Goalkeeper", "Sweeper Keeper"],
  CB: ["Central Defender", "Ball Playing Defender", "No-Nonsense Centre-Back", "Wide Centre-Back", "Libero"],
  FB: ["Full Back", "Wing Back", "Inverted Wing Back", "No-Nonsense Full-Back", "Complete Wing-Back"],
  DM: ["Defensive Midfielder", "Deep Lying Playmaker", "Ball Winning Midfielder", "Anchor", "Half Back", "Regista", "Roaming Playmaker", "Segundo Volante"],
  WB: ["Wing Back", "Inverted Wing Back", "Complete Wing-Back", "Defensive Winger"],
  CM: ["Central Midfielder", "Box To Box Midfielder", "Advanced Playmaker", "Mezzala", "Carrilero", "Roaming Playmaker", "Ball Winning Midfielder"],
  WM: ["Wide Midfielder", "Winger", "Inverted Winger", "Wide Target Forward", "Wide Playmaker"],
  AM: ["Attacking Midfielder", "Advanced Playmaker", "Trequartista", "Shadow Striker", "Enganche"],
  AM_W: ["Winger", "Inside Forward", "Inverted Winger", "Raumdeuter", "Advanced Playmaker"],
  ST: ["Advanced Forward", "Deep Lying Forward", "Target Forward", "Poacher", "Complete Forward", "Pressing Forward", "False Nine", "Trequartista"],
};

export function getClosestSlot(x: number, y: number) {
  let closest = GRID_SLOTS[0];
  let minDistance = Infinity;
  for (const slot of GRID_SLOTS) {
    const d = Math.pow(slot.x - x, 2) + Math.pow(slot.y - y, 2);
    if (d < minDistance) {
      minDistance = d;
      closest = slot;
    }
  }
  return closest;
}

export function getValidRolesForPosition(x: number, y: number): string[] {
  const slot = getClosestSlot(x, y);
  return POSITIONS_DB[slot.band as keyof typeof POSITIONS_DB] || POSITIONS_DB.CM;
}

export const ROLE_ABBREVIATIONS: Record<string, string> = {
  "Goalkeeper": "GK",
  "Sweeper Keeper": "SK",
  "Central Defender": "CD",
  "Ball Playing Defender": "BPD",
  "No-Nonsense Centre-Back": "NCB",
  "Wide Centre-Back": "WCB",
  "Libero": "L",
  "Full Back": "FB",
  "Wing Back": "WB",
  "Inverted Wing Back": "IWB",
  "No-Nonsense Full-Back": "NFB",
  "Complete Wing-Back": "CWB",
  "Defensive Midfielder": "DM",
  "Deep Lying Playmaker": "DLP",
  "Ball Winning Midfielder": "BWM",
  "Anchor": "A",
  "Half Back": "HB",
  "Regista": "R",
  "Roaming Playmaker": "RP",
  "Segundo Volante": "SV",
  "Central Midfielder": "CM",
  "Box To Box Midfielder": "B2B",
  "Advanced Playmaker": "AP",
  "Mezzala": "MZ",
  "Carrilero": "CAR",
  "Wide Midfielder": "WM",
  "Winger": "W",
  "Inverted Winger": "IW",
  "Inside Forward": "IF",
  "Raumdeuter": "RD",
  "Advanced Forward": "AF",
  "Deep Lying Forward": "DLF",
  "Target Forward": "TF",
  "Poacher": "P",
  "Complete Forward": "CF",
  "Pressing Forward": "PF",
  "False Nine": "F9",
  "Trequartista": "T",
  "Shadow Striker": "SS",
  "Enganche": "EG",
  "Attacking Midfielder": "AM",
};

export const TACTICAL_STYLES = [
  { id: "Control Possession", name: "Control Possession", desc: "Focuses on high levels of possession and pressing to dominate the game." },
  { id: "Gegenpress", name: "Gegenpress", desc: "A high-intensity style that aims to win the ball back immediately after losing it." },
  { id: "Tiki-Taka", name: "Tiki-Taka", desc: "Intricate short passing and constant movement to break down defenses." },
  { id: "Vertical Tiki-Taka", name: "Vertical Tiki-Taka", desc: "Similar to Tiki-Taka but with a more direct, vertical passing intent." },
  { id: "Wing Play", name: "Wing Play", desc: "Focuses on utilizing the width of the pitch and delivering crosses into the box." },
  { id: "Route One", name: "Route One", desc: "Direct, long-ball football aimed at getting the ball forward as quickly as possible." },
  { id: "Fluid Counter-Attack", name: "Fluid Counter-Attack", desc: "A deep-defending style that transitions rapidly into attack upon winning the ball." },
  { id: "Direct Counter-Attack", name: "Direct Counter-Attack", desc: "More structured and direct than fluid counter-attacking." },
  { id: "Catenaccio", name: "Catenaccio", desc: "Highly defensive, focused on a solid back line and neutralizing opposition threats." },
  { id: "Park The Bus", name: "Park The Bus", desc: "Extreme defensive approach with almost all players behind the ball." }
];

export const MENTALITIES = [
  { id: "Very Defensive", name: "Very Defensive", desc: "Focuses entirely on defensive solidity and minimizing risk." },
  { id: "Defensive", name: "Defensive", desc: "Primarily defensive but looks for structured opportunities to attack." },
  { id: "Cautious", name: "Cautious", desc: "A balanced but careful approach, prioritizing defensive safety." },
  { id: "Balanced", name: "Balanced", desc: "The standard approach, balancing risk and reward." },
  { id: "Positive", name: "Positive", desc: "Looks to control the game and create chances with controlled aggression." },
  { id: "Attacking", name: "Attacking", desc: "Aggressive approach focusing on creating numerous scoring opportunities." },
  { id: "Very Attacking", name: "Very Attacking", desc: "Highly aggressive approach focusing on overwhelming the opposition with numbers in the final third." }
];

export type InstructionType = "select" | "toggle";

export interface InstructionDef {
  id: string;
  name: string;
  type: InstructionType;
  options?: string[];
}

export interface InstructionColumn {
  id: string;
  name: string;
  items: InstructionDef[];
}

export const TEAM_INSTRUCTIONS: Record<string, InstructionColumn[]> = {
  inPossession: [
    {
      id: "attacking_width_col",
      name: "Attacking Width",
      items: [
        { id: "attacking_width", name: "Attacking Width", type: "select", options: ["Extremely Narrow", "Fairly Narrow", "Standard", "Fairly Wide", "Extremely Wide"] }
      ]
    },
    {
      id: "approach_play_col",
      name: "Approach Play",
      items: [
        { id: "pass_into_space", name: "Pass Into Space", type: "toggle" },
        { id: "left_flank", name: "Left Flank", type: "select", options: ["None", "Overlap Left", "Underlap Left"] },
        { id: "right_flank", name: "Right Flank", type: "select", options: ["None", "Overlap Right", "Underlap Right"] },
        { id: "play_out_of_defence", name: "Play Out Of Defence", type: "toggle" },
        { id: "passing_directness", name: "Passing Directness", type: "select", options: ["Much Shorter", "Slightly Shorter", "Standard", "Slightly More Direct", "Much More Direct"] },
        { id: "tempo", name: "Tempo", type: "select", options: ["Much Lower", "Slightly Lower", "Standard", "Slightly Higher", "Much Higher"] },
        { id: "time_wasting", name: "Time Wasting", type: "select", options: ["Never", "Sometimes", "Frequently", "Always"] }
      ]
    },
    {
      id: "final_third_col",
      name: "Final Third",
      items: [
        { id: "work_ball_into_box", name: "Work Ball Into Box", type: "toggle" },
        { id: "shoot_on_sight", name: "Shoot On Sight", type: "toggle" },
        { id: "hit_early_crosses", name: "Hit Early Crosses", type: "toggle" },
        { id: "play_for_set_pieces", name: "Play For Set Pieces", type: "toggle" },
        { id: "dribbling", name: "Dribbling", type: "select", options: ["None", "Run At Defence", "Dribble Less"] },
        { id: "creative_freedom", name: "Creative Freedom", type: "select", options: ["None", "Be More Expressive", "Be More Disciplined"] }
      ]
    }
  ],
  inTransition: [
    {
      id: "possession_lost_col",
      name: "When Possession Has Been Lost",
      items: [
        { id: "when_possession_lost", name: "Action", type: "select", options: ["None", "Counter-Press", "Regroup"] }
      ]
    },
    {
      id: "possession_won_col",
      name: "When Possession Has Been Won",
      items: [
        { id: "when_possession_won", name: "Action", type: "select", options: ["None", "Counter", "Hold Shape"] }
      ]
    },
    {
      id: "gk_in_possession_col",
      name: "Goalkeeper In Possession",
      items: [
        { id: "gk_distribution_pace", name: "Distribution Pace", type: "select", options: ["None", "Distribute Quickly", "Slow Pace Down"] },
        { id: "gk_distribution_area", name: "Distribution Area", type: "select", options: ["None", "Distribute To Centre-Backs", "Distribute To Full-Backs", "Distribute To Playmaker", "Distribute Over Opposition Defence"] },
        { id: "gk_distribution_type", name: "Distribution Type", type: "select", options: ["None", "Roll It Out", "Throw It Long", "Take Short Kicks", "Take Long Kicks"] }
      ]
    }
  ],
  outOfPossession: [
    {
      id: "defensive_shape_col",
      name: "Defensive Shape",
      items: [
        { id: "line_of_engagement", name: "Line of Engagement", type: "select", options: ["Much Lower", "Lower", "Standard", "Higher", "Much Higher"] },
        { id: "defensive_line", name: "Defensive Line", type: "select", options: ["Much Lower", "Lower", "Standard", "Higher", "Much Higher"] }
      ]
    },
    {
      id: "defensive_actions_col",
      name: "Defensive Actions",
      items: [
        { id: "trigger_press", name: "Trigger Press", type: "select", options: ["Much Less Often", "Less Often", "Standard", "More Often", "Much More Often"] },
        { id: "prevent_short_gk_distribution", name: "Prevent Short GK Distribution", type: "toggle" },
        { id: "tackling", name: "Tackling", type: "select", options: ["None", "Get Stuck In", "Stay On Feet"] },
        { id: "pressing_trap", name: "Pressing Trap", type: "select", options: ["None", "Trap Inside", "Trap Outside"] },
        { id: "cross_engagement", name: "Cross Engagement", type: "select", options: ["None", "Stop Crosses", "Invite Crosses"] }
      ]
    }
  ]
};
