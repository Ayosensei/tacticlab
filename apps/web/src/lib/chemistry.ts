import { PlayerPosition } from "@/types/tactic";

export interface ChemistryResult {
  score: number;
  warnings: string[];
  tips: string[];
}

// Helper to determine general position based on Y coordinate
const isDefender = (y: number) => y >= 70 && y < 90;
const isDefensiveMidfielder = (y: number) => y >= 60 && y < 70;
const isCentralMidfielder = (y: number) => y >= 40 && y < 60;
const isAttackingMidfielder = (y: number) => y >= 25 && y < 40;
const isForward = (y: number) => y < 25;

const isLeftFlank = (x: number) => x <= 25;
const isRightFlank = (x: number) => x >= 75;
const isCentral = (x: number) => x > 25 && x < 75;

export function evaluateChemistry(players: PlayerPosition[]): ChemistryResult {
  const warnings: string[] = [];
  const tips: string[] = [];
  let score = 100;

  // Decrease score helper
  const penalize = (points: number, warning: string) => {
    score = Math.max(0, score - points);
    warnings.push(warning);
  };

  // Reward score helper
  const reward = (points: number, tip: string) => {
    score = Math.min(100, score + points);
    tips.push(tip);
  };

  // 1. Balance Duties Spread
  let attackCount = 0;
  let supportCount = 0;
  let defendCount = 0;

  players.forEach((p) => {
    if (p.duty === "Attack") attackCount++;
    if (p.duty === "Support") supportCount++;
    if (p.duty === "Defend" || p.duty === "Cover" || p.duty === "Stopper") defendCount++;
  });

  if (attackCount > 5) penalize(15, "Too many Attack duties. You may be exposed on the counter.");
  if (attackCount < 2) penalize(10, "Not enough Attack duties. You may struggle to penetrate the defense.");
  if (defendCount < 3) penalize(15, "Not enough Defend duties. Your defense will be vulnerable.");
  if (supportCount < 2) penalize(10, "Not enough Support duties. Your team may become disconnected.");

  // Check Flank Duty Overloads
  const leftFlankAttackers = players.filter(p => isLeftFlank(p.x) && p.duty === "Attack");
  const rightFlankAttackers = players.filter(p => isRightFlank(p.x) && p.duty === "Attack");

  if (leftFlankAttackers.length >= 2) penalize(10, "Left flank is overloaded with Attack duties. This leaves massive space behind.");
  if (rightFlankAttackers.length >= 2) penalize(10, "Right flank is overloaded with Attack duties. This leaves massive space behind.");

  // 2. Central Defence
  const centralDefenders = players.filter(p => isDefender(p.y) && isCentral(p.x));
  
  if (centralDefenders.length === 2) {
    const cb1 = centralDefenders[0];
    const cb2 = centralDefenders[1];
    
    if (cb1.duty === "Stopper" && cb2.duty === "Stopper") {
      penalize(15, "Two Stoppers in defence exposes too much space behind.");
    } else if (cb1.duty === "Cover" && cb2.duty === "Cover") {
      penalize(15, "Two Covers in defence exposes too much space in front of them.");
    } else if ((cb1.duty === "Stopper" && cb2.duty === "Cover") || (cb1.duty === "Cover" && cb2.duty === "Stopper")) {
      reward(5, "Stopper-Cover pairing creates an aggressive block with pace to sweep behind. Note: This breaks the offside trap.");
    } else if (cb1.duty === "Defend" && cb2.duty === "Defend") {
      reward(5, "Defend-Defend pairing is excellent for maintaining a solid line and offside trap.");
    }
  }

  // 3. Central Midfield
  const centralMidfielders = players.filter(p => (isDefensiveMidfielder(p.y) || isCentralMidfielder(p.y)) && isCentral(p.x));
  const hasDefendMid = centralMidfielders.some(p => p.duty === "Defend" || p.role === "Anchor" || p.role === "Half Back" || p.role === "Defensive Midfielder");
  
  if (centralMidfielders.length > 0 && !hasDefendMid) {
    penalize(15, "Your central midfield has no dedicated Defend duty. You may be overrun through the middle.");
  }

  const creators = ["Deep Lying Playmaker", "Advanced Playmaker", "Regista", "Roaming Playmaker", "Enganche", "Trequartista"];
  const hasCreator = players.some(p => creators.includes(p.role));
  if (!hasCreator) {
    penalize(5, "Your tactic lacks a primary playmaker/creator to control the game.");
  } else {
    reward(5, "You have a dedicated playmaker to dictate the tempo.");
  }

  // 4. Width and Flanks
  const evaluateFlank = (sidePlayers: PlayerPosition[], sideName: string) => {
    if (sidePlayers.length === 0) return;

    // Lone wide player check
    if (sidePlayers.length === 1) {
      const p = sidePlayers[0];
      if (p.duty === "Attack" && (p.role === "Winger" || p.role === "Wide Midfielder")) {
        penalize(10, `Lone wide player on the ${sideName} has an Attack duty and won't track back enough.`);
      }
      if (p.role === "Inverted Wing Back" || p.role === "Inside Forward") {
        penalize(10, `Lone wide player on the ${sideName} is inverted and won't provide necessary natural width.`);
      }
    }

    // Wide partnership overlap check
    if (sidePlayers.length >= 2) {
      const deep = sidePlayers.find(p => isDefender(p.y) || isDefensiveMidfielder(p.y));
      const advanced = sidePlayers.find(p => isAttackingMidfielder(p.y) || isForward(p.y) || isCentralMidfielder(p.y));
      
      if (deep && advanced) {
        if (deep.duty === "Attack" && advanced.duty === "Support") {
          reward(5, `Great overlap potential on the ${sideName} with attacking full-back and supportive winger.`);
        }
        if (deep.duty === "Support" && advanced.duty === "Attack") {
          reward(5, `Solid combination on the ${sideName} with supportive full-back and direct attacking winger.`);
        }
        if (deep.duty === "Attack" && advanced.duty === "Attack") {
          penalize(10, `Both wide players on the ${sideName} are on Attack duty, leaving the flank completely exposed defensively.`);
        }
        const advancedInverted = ["Inside Forward", "Inverted Winger", "Wide Playmaker"].includes(advanced.role);
        if (advancedInverted && deep.duty === "Attack") {
          reward(5, `The inverted winger on the ${sideName} clears space for your attacking full-back to overlap.`);
        }
      }
    }
  };

  const leftPlayers = players.filter(p => isLeftFlank(p.x));
  const rightPlayers = players.filter(p => isRightFlank(p.x));
  
  if (leftPlayers.length === 0 && rightPlayers.length === 0) {
    penalize(10, "No wide players detected. Your formation is extremely narrow.");
  }
  
  evaluateFlank(leftPlayers, "left");
  evaluateFlank(rightPlayers, "right");

  // 5. Forwards
  const forwards = players.filter(p => isForward(p.y));
  if (forwards.length >= 2) {
    const creatorsST = ["Deep Lying Forward", "False Nine", "Trequartista", "Complete Forward"];
    const finishersST = ["Advanced Forward", "Poacher", "Pressing Forward"];
    const bigMen = ["Target Forward", "Complete Forward"];
    
    let hasCreatorST = false;
    let hasFinisherST = false;
    let hasBigMan = false;
    
    forwards.forEach(p => {
      if (creatorsST.includes(p.role) || p.duty === "Support") hasCreatorST = true;
      if (finishersST.includes(p.role) || p.duty === "Attack") hasFinisherST = true;
      if (bigMen.includes(p.role)) hasBigMan = true;
    });

    if (hasCreatorST && hasFinisherST) {
      reward(5, "Great Creator/Scorer partnership up front.");
    } else if (hasBigMan && hasFinisherST) {
      reward(5, "Classic Big-Man/Little-Man combination up front.");
    } else if (forwards.every(p => p.duty === "Attack")) {
      penalize(10, "All forwards are on Attack duty. They may become isolated from the midfield.");
    }
  }

  // Cap score to 0-100
  score = Math.max(0, Math.min(100, score));

  // Deduplicate tips/warnings just in case
  return {
    score,
    warnings: Array.from(new Set(warnings)),
    tips: Array.from(new Set(tips)),
  };
}
