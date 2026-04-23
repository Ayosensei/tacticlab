export const FORMATIONS = [
  {
    id: "4-3-3 WIDE",
    name: "4-3-3 Wide",
    players: [
      { id: "1", role: "Goalkeeper", duty: "Defend", x: 50, y: 96 },
      { id: "2", role: "Full Back", duty: "Support", x: 12, y: 80 },
      { id: "3", role: "Central Defender", duty: "Defend", x: 35, y: 82 },
      { id: "4", role: "Ball Playing Defender", duty: "Defend", x: 65, y: 82 },
      { id: "5", role: "Full Back", duty: "Defend", x: 88, y: 80 },
      { id: "6", role: "Deep Lying Playmaker", duty: "Defend", x: 50, y: 66 },
      { id: "7", role: "Advanced Playmaker", duty: "Support", x: 35, y: 48 },
      { id: "8", role: "Mezzala", duty: "Attack", x: 65, y: 48 },
      { id: "9", role: "Winger", duty: "Support", x: 12, y: 25 },
      { id: "10", role: "Winger", duty: "Support", x: 88, y: 25 },
      { id: "11", role: "Center Forward", duty: "Attack", x: 50, y: 15 },
    ],
  },
  {
    id: "4-2-3-1 WIDE",
    name: "4-2-3-1 Wide",
    players: [
      { id: "1", role: "Goalkeeper", duty: "Defend", x: 50, y: 96 },
      { id: "2", role: "Full Back", duty: "Support", x: 12, y: 80 },
      { id: "3", role: "Central Defender", duty: "Defend", x: 35, y: 82 },
      { id: "4", role: "Ball Playing Defender", duty: "Defend", x: 65, y: 82 },
      { id: "5", role: "Full Back", duty: "Defend", x: 88, y: 80 },
      { id: "6", role: "Deep Lying Playmaker", duty: "Defend", x: 35, y: 66 },
      { id: "7", role: "Ball Winning Midfielder", duty: "Support", x: 65, y: 66 },
      { id: "8", role: "Attacking Midfielder", duty: "Support", x: 50, y: 35 },
      { id: "9", role: "Inside Forward", duty: "Attack", x: 12, y: 25 },
      { id: "10", role: "Winger", duty: "Support", x: 88, y: 25 },
      { id: "11", role: "Advanced Forward", duty: "Attack", x: 50, y: 15 },
    ],
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1 Asymmetric",
    players: [
      { id: "1", role: "Sweeper Keeper", duty: "Defend", x: 50, y: 96 },
      { id: "2", role: "Wide Centre-Back", duty: "Defend", x: 25, y: 82 },
      { id: "3", role: "Central Defender", duty: "Cover", x: 50, y: 82 },
      { id: "4", role: "Wide Centre-Back", duty: "Defend", x: 75, y: 82 },
      { id: "5", role: "Wing Back", duty: "Support", x: 12, y: 55 },
      { id: "6", role: "Wing Back", duty: "Attack", x: 88, y: 55 },
      { id: "7", role: "Central Midfielder", duty: "Defend", x: 38, y: 55 },
      { id: "8", role: "Box To Box Midfielder", duty: "Support", x: 62, y: 55 },
      { id: "9", role: "Advanced Playmaker", duty: "Support", x: 35, y: 35 },
      { id: "10", role: "Shadow Striker", duty: "Attack", x: 65, y: 35 },
      { id: "11", role: "Pressing Forward", duty: "Attack", x: 50, y: 15 },
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2 Catenaccio",
    players: [
      { id: "1", role: "Goalkeeper", duty: "Defend", x: 50, y: 96 },
      { id: "2", role: "Central Defender", duty: "Defend", x: 30, y: 82 },
      { id: "3", role: "Central Defender", duty: "Cover", x: 50, y: 84 },
      { id: "4", role: "Central Defender", duty: "Defend", x: 70, y: 82 },
      { id: "5", role: "Wing Back", duty: "Defend", x: 10, y: 70 },
      { id: "6", role: "Wing Back", duty: "Defend", x: 90, y: 70 },
      { id: "7", role: "Half Back", duty: "Defend", x: 50, y: 64 },
      { id: "8", role: "Central Midfielder", duty: "Support", x: 35, y: 50 },
      { id: "9", role: "Carrilero", duty: "Support", x: 65, y: 50 },
      { id: "10", role: "Advanced Forward", duty: "Attack", x: 38, y: 18 },
      { id: "11", role: "Target Forward", duty: "Support", x: 62, y: 18 },
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

export function getValidRolesForPosition(x: number, y: number): string[] {
  // GK
  if (y >= 90) return POSITIONS_DB.GK;
  
  const isCentral = x >= 25 && x <= 75;
  
  // Defenders
  if (y >= 75 && y < 90) {
    return isCentral ? POSITIONS_DB.CB : POSITIONS_DB.FB;
  }
  // Defensive Mids / Wing Backs
  if (y >= 60 && y < 75) {
    return isCentral ? POSITIONS_DB.DM : POSITIONS_DB.WB;
  }
  // Central Mids / Wide Mids
  if (y >= 45 && y < 60) {
    return isCentral ? POSITIONS_DB.CM : POSITIONS_DB.WM;
  }
  // Attacking Mids
  if (y >= 30 && y < 45) {
    return isCentral ? POSITIONS_DB.AM : POSITIONS_DB.AM_W;
  }
  // Strikers
  if (y < 30) {
    return isCentral ? POSITIONS_DB.ST : POSITIONS_DB.AM_W;
  }
  
  return POSITIONS_DB.CM; // fallback
}

export const DUTIES = ["Defend", "Support", "Attack", "Automatic"];
export type DutyType = typeof DUTIES[number];
