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

/** A pairwise chemistry relationship between two players */
export interface Synergy {
  player1Id: string;
  player2Id: string;
  /** positive = green bond, negative = clash, tension = amber warning */
  type: "positive" | "negative" | "tension";
  /** 0–100 chemistry score */
  score: number;
  /** Short name, e.g. "Elite Pivot" */
  label: string;
  /** Full coaching description for tooltip */
  description: string;
}

/** A named three-player tactical unit */
export interface CompatibilityTriangle {
  player1Id: string;
  player2Id: string;
  player3Id: string;
  /** Composite score = average of three pair scores */
  score: number;
  /** Pattern name, e.g. "Wide Overlap Triangle" */
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
  /** Pairwise role chemistry bonds */
  synergies: Synergy[];
  /** Named three-player tactical units */
  compatibilityTriangles: CompatibilityTriangle[];
  riskFactors: RiskFactor[];
  suggestions: Suggestion[];
}

export interface Suggestion {
  severity: "critical" | "warning" | "positive";
  area: "left_flank" | "right_flank" | "central" | "defence" | "attack" | "team";
  message: string;
}
