export type Duty = "Attack" | "Support" | "Defend" | "Automatic" | "Cover" | "Stopper";
export type FmVersion = "FM23" | "FM24";

export interface PlayerPosition {
  id: string;
  role: string;           // e.g., "Striker", "Deep Lying Playmaker"
  duty: Duty;
  x: number;              // 0–100 (% of pitch width, left to right)
  y: number;              // 0–100 (% of pitch height, own goal = 100)
  jerseyNumber?: number;
  name?: string;
}

export interface TacticArrow {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  type: "movement" | "press" | "support" | "overlap";
}

export interface Tactic {
  id?: string;
  title: string;
  formation: string;
  style: string;
  mentality: "Defensive" | "Cautious" | "Balanced" | "Positive" | "Attacking";
  inPossession: Record<string, string | boolean>;
  inTransition: Record<string, string | boolean>;
  outOfPossession: Record<string, string | boolean>;
  players: PlayerPosition[];
  arrows: TacticArrow[];
  fmVersion?: FmVersion;
  isPublic?: boolean;
}

export interface ChannelOccupation {
  wideLeft: number;
  halfSpaceLeft: number;
  center: number;
  halfSpaceRight: number;
  wideRight: number;
}

export interface Synergy {
  player1Id: string;
  player2Id: string;
  type: "positive" | "negative" | "tension";
  score: number;
  label: string;
  message: string; // The description text
}

export interface CompatibilityTriangle {
  player1Id: string;
  player2Id: string;
  player3Id: string;
  score: number;
  label: string;
  description: string;
}

export interface RiskFactor {
  area: "left_flank" | "right_flank" | "central" | "defence" | "attack";
  severity: "critical" | "warning";
  message: string;
}

export interface DutyBalance {
  defend: number;
  support: number;
  attack: number;
}

export interface AnalysisResult {
  tacticalNarrative: string;
  inPossessionRating: number;
  outOfPossessionRating: number;
  channelOccupation: ChannelOccupation;
  restDefenceStructure: string;
  buildUpStructure: string;
  dutyBalance: DutyBalance;
  penetration: number;
  solidity: number;
  synergies: Synergy[];
  compatibilityTriangles: CompatibilityTriangle[];
  riskFactors: RiskFactor[];
  suggestions: Suggestion[];
}

export interface Suggestion {
  severity: "critical" | "warning" | "positive";
  area: "left_flank" | "right_flank" | "central" | "defence" | "attack" | "team";
  message: string;
}
