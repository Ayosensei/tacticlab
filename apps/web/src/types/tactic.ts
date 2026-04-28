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

export interface ChannelScores {
  left: number;
  right: number;
  central: number;
}

export interface AnalysisResult {
  score: number;                      // 0–100
  penetration: ChannelScores;
  solidity: ChannelScores;
  support: { left: number; right: number; central: number };
  relativeRisk: { inPossession: number; outOfPossession: number; total: number };
  partnerships: Partnership[];
  suggestions: Suggestion[];
}

export interface Partnership {
  player1Id: string;
  player2Id: string;
  strength: number;                   // 0–1
  type: "positive" | "negative" | "neutral";
}

export interface Suggestion {
  severity: "critical" | "warning" | "positive";
  area: "left_flank" | "right_flank" | "central" | "defence" | "attack";
  message: string;
}
