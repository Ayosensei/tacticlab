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

export const FORMATIONS = [
  {
    id: "4-3-3 WIDE",
    name: "4-3-3 Wide",
    players: [
      { id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK", ...getGridSlot("GK") },
      { id: "2", role: "Full Back", duty: "Support", slot: "LB", ...getGridSlot("LB") },
      { id: "3", role: "Central Defender", duty: "Defend", slot: "LCB", ...getGridSlot("LCB") },
      { id: "4", role: "Ball Playing Defender", duty: "Defend", slot: "RCB", ...getGridSlot("RCB") },
      { id: "5", role: "Full Back", duty: "Defend", slot: "RB", ...getGridSlot("RB") },
      { id: "6", role: "Deep Lying Playmaker", duty: "Defend", slot: "DM", ...getGridSlot("DM") },
      { id: "7", role: "Advanced Playmaker", duty: "Support", slot: "LCM", ...getGridSlot("LCM") },
      { id: "8", role: "Mezzala", duty: "Attack", slot: "RCM", ...getGridSlot("RCM") },
      { id: "9", role: "Winger", duty: "Support", slot: "LW", ...getGridSlot("LW") },
      { id: "10", role: "Winger", duty: "Support", slot: "RW", ...getGridSlot("RW") },
      { id: "11", role: "Advanced Forward", duty: "Attack", slot: "ST", ...getGridSlot("ST") },
    ],
  },
  {
    id: "4-2-3-1 WIDE",
    name: "4-2-3-1 Wide",
    players: [
      { id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK", ...getGridSlot("GK") },
      { id: "2", role: "Full Back", duty: "Support", slot: "LB", ...getGridSlot("LB") },
      { id: "3", role: "Central Defender", duty: "Defend", slot: "LCB", ...getGridSlot("LCB") },
      { id: "4", role: "Ball Playing Defender", duty: "Defend", slot: "RCB", ...getGridSlot("RCB") },
      { id: "5", role: "Full Back", duty: "Defend", slot: "RB", ...getGridSlot("RB") },
      { id: "6", role: "Deep Lying Playmaker", duty: "Defend", slot: "LDM", ...getGridSlot("LDM") },
      { id: "7", role: "Ball Winning Midfielder", duty: "Support", slot: "RDM", ...getGridSlot("RDM") },
      { id: "8", role: "Attacking Midfielder", duty: "Support", slot: "AM", ...getGridSlot("AM") },
      { id: "9", role: "Inside Forward", duty: "Attack", slot: "LW", ...getGridSlot("LW") },
      { id: "10", role: "Winger", duty: "Support", slot: "RW", ...getGridSlot("RW") },
      { id: "11", role: "Advanced Forward", duty: "Attack", slot: "ST", ...getGridSlot("ST") },
    ],
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1 Asymmetric",
    players: [
      { id: "1", role: "Sweeper Keeper", duty: "Defend", slot: "GK", ...getGridSlot("GK") },
      { id: "2", role: "Wide Centre-Back", duty: "Defend", slot: "LCB", ...getGridSlot("LCB") },
      { id: "3", role: "Central Defender", duty: "Cover", slot: "CB", ...getGridSlot("CB") },
      { id: "4", role: "Wide Centre-Back", duty: "Defend", slot: "RCB", ...getGridSlot("RCB") },
      { id: "5", role: "Wing Back", duty: "Support", slot: "LWB", ...getGridSlot("LWB") },
      { id: "6", role: "Wing Back", duty: "Attack", slot: "RWB", ...getGridSlot("RWB") },
      { id: "7", role: "Central Midfielder", duty: "Defend", slot: "LCM", ...getGridSlot("LCM") },
      { id: "8", role: "Box To Box Midfielder", duty: "Support", slot: "RCM", ...getGridSlot("RCM") },
      { id: "9", role: "Advanced Playmaker", duty: "Support", slot: "LAM", ...getGridSlot("LAM") },
      { id: "10", role: "Shadow Striker", duty: "Attack", slot: "RAM", ...getGridSlot("RAM") },
      { id: "11", role: "Pressing Forward", duty: "Attack", slot: "ST", ...getGridSlot("ST") },
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2 Catenaccio",
    players: [
      { id: "1", role: "Goalkeeper", duty: "Defend", slot: "GK", ...getGridSlot("GK") },
      { id: "2", role: "Central Defender", duty: "Defend", slot: "LCB", ...getGridSlot("LCB") },
      { id: "3", role: "Central Defender", duty: "Cover", slot: "CB", ...getGridSlot("CB") },
      { id: "4", role: "Central Defender", duty: "Defend", slot: "RCB", ...getGridSlot("RCB") },
      { id: "5", role: "Wing Back", duty: "Defend", slot: "LWB", ...getGridSlot("LWB") },
      { id: "6", role: "Wing Back", duty: "Defend", slot: "RWB", ...getGridSlot("RWB") },
      { id: "7", role: "Half Back", duty: "Defend", slot: "DM", ...getGridSlot("DM") },
      { id: "8", role: "Central Midfielder", duty: "Support", slot: "LCM", ...getGridSlot("LCM") },
      { id: "9", role: "Carrilero", duty: "Support", slot: "RCM", ...getGridSlot("RCM") },
      { id: "10", role: "Advanced Forward", duty: "Attack", slot: "LST", ...getGridSlot("LST") },
      { id: "11", role: "Target Forward", duty: "Support", slot: "RST", ...getGridSlot("RST") },
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
    // Pythagorean distance in percent-space
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
  "Roaming Playmaker": "RPM",
  "Segundo Volante": "SV",
  "Central Midfielder": "CM",
  "Box To Box Midfielder": "BBM",
  "Advanced Playmaker": "AP",
  "Mezzala": "MEZ",
  "Carrilero": "CAR",
  "Wide Midfielder": "WM",
  "Winger": "W",
  "Inverted Winger": "IW",
  "Wide Target Forward": "WTF",
  "Wide Playmaker": "WP",
  "Attacking Midfielder": "AM",
  "Trequartista": "T",
  "Shadow Striker": "SS",
  "Enganche": "EG",
  "Inside Forward": "IF",
  "Raumdeuter": "RMD",
  "Advanced Forward": "AF",
  "Deep Lying Forward": "DLF",
  "Target Forward": "TF",
  "Poacher": "P",
  "Complete Forward": "CF",
  "Pressing Forward": "PF",
  "False Nine": "F9"
};

export const DUTIES = ["Defend", "Support", "Attack", "Automatic", "Cover", "Stopper"];
export type DutyType = typeof DUTIES[number];

export const TACTICAL_STYLES = [
  { id: "gegenpress", name: "Gegenpress", desc: "High-intensity pressing system designed to win the ball back immediately after losing possession in advanced areas." },
  { id: "tiki_taka", name: "Tiki-Taka", desc: "Possession-based approach focusing on short passing, extreme technical control, and patient build-up." },
  { id: "vertical_tiki_taka", name: "Vertical Tiki-Taka", desc: "A more direct version of Tiki-Taka that aims to penetrate the opposition lines quickly while maintaining possession." },
  { id: "fluid_counter_attack", name: "Fluid Counter-Attack", desc: "Draws opponents forward before striking quickly using fluid positional interplay during transitions." },
  { id: "direct_counter_attack", name: "Direct Counter-Attack", desc: "Deep defensive block that rapidly bypasses the midfield to exploit spaces behind the opponent's defense." },
  { id: "catenaccio", name: "Catenaccio", desc: "Ultra-defensive system prioritizing structural solidity and a sweeper system to nullify opposition attacks." },
  { id: "park_the_bus", name: "Park the Bus", desc: "Extreme defensive setup focusing solely on keeping a clean sheet with minimal attacking intent." },
  { id: "custom", name: "Custom", desc: "A bespoke tactical style shaped entirely by your unique instructions and player roles." }
];

export const MENTALITIES = [
  { id: "Defensive", name: "Defensive", desc: "Prioritizes defensive solidity above all else, keeping numbers behind the ball and limiting forward runs." },
  { id: "Cautious", name: "Cautious", desc: "Focuses on maintaining a solid defensive shape while selectively committing players forward on the counter." },
  { id: "Balanced", name: "Balanced", desc: "A neutral approach adapting to match situations without heavily committing to attack or defense." },
  { id: "Positive", name: "Positive", desc: "Aims to control the game and dictate play, committing more players forward while managing defensive risk." },
  { id: "Attacking", name: "Attacking", desc: "Highly aggressive approach focusing on overwhelming the opposition with numbers in the final third." }
];
