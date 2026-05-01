import { Tactic, AnalysisResult, Partnership } from "@/types/tactic";

let wasmModule: any = null;

export async function getWasm() {
  if (typeof window === "undefined") return null;
  
  if (!wasmModule) {
    try {
      // wasmModule = await import("../../public/wasm/tacticlab_core");
      // await wasmModule.default();
    } catch (e) {
      console.warn("WASM module not found, using TypeScript fallback", e);
    }
  }
  return wasmModule;
}

export async function scoreTactic(tactic: Tactic): Promise<AnalysisResult> {
  const wasm = await getWasm();
  
  if (wasm && wasm.score_tactic) {
    const json = wasm.score_tactic(JSON.stringify(tactic));
    return JSON.parse(json);
  }

  return mockAnalyzeTactic(tactic);
}

function mockAnalyzeTactic(tactic: Tactic): AnalysisResult {
  let totalAttackWeight = 0;
  let totalDefendWeight = 0;
  
  let attackDuties = 0;
  let supportDuties = 0;
  let defendDuties = 0;
  
  let hasBpd = false;
  let hasTrueWinger = false;

  const getWeights = (role: string, duty: string) => {
    let base = [0.5, 0.5];
    if (["Advanced Forward", "Poacher", "Shadow Striker"].includes(role)) base = [1.2, 0.0];
    else if (["Winger", "Inside Forward", "Inverted Winger"].includes(role)) base = [1.0, 0.2];
    else if (["Central Defender", "Ball Playing Defender"].includes(role)) base = [0.0, 1.2];
    else if (["Anchor", "Defensive Midfielder", "Ball Winning Midfielder"].includes(role)) base = [0.1, 1.0];
    else if (["Full Back", "Wing Back"].includes(role)) base = [0.4, 0.8];
    
    const mod = duty === "Attack" ? [1.3, 0.7] : duty === "Defend" ? [0.7, 1.3] : [1.0, 1.0];
    return [base[0] * mod[0], base[1] * mod[1]];
  };

  const penetration = { left: 0, right: 0, central: 0 };
  const solidity = { left: 0, right: 0, central: 0 };

  tactic.players.forEach(p => {
    const [atk, def] = getWeights(p.role, p.duty);
    totalAttackWeight += atk;
    totalDefendWeight += def;
    
    if (p.duty === "Attack") attackDuties++;
    else if (p.duty === "Support") supportDuties++;
    else if (p.duty === "Defend") defendDuties++;
    
    if (p.role === "Ball Playing Defender") hasBpd = true;
    if (p.role === "Winger") hasTrueWinger = true;

    const isLeft = p.x < 35;
    const isRight = p.x > 65;
    const contributionAtk = atk * (1 - p.y / 100);
    const contributionDef = def * (p.y / 100);

    if (p.y < 45) {
      if (isLeft) penetration.left += contributionAtk;
      else if (isRight) penetration.right += contributionAtk;
      else penetration.central += contributionAtk;
    }
    if (p.y > 55) {
      if (isLeft) solidity.left += contributionDef;
      else if (isRight) solidity.right += contributionDef;
      else solidity.central += contributionDef;
    }
  });

  const suggestions = [];
  
  if (attackDuties > 4) suggestions.push({ severity: "warning", area: "attack", message: "Too many Attack duties. Players may isolate themselves." });
  else if (attackDuties < 2) suggestions.push({ severity: "warning", area: "attack", message: "Insufficient Attack duties. You may lack penetration." });
  
  if (defendDuties < 3) suggestions.push({ severity: "critical", area: "defence", message: "Critical lack of Defend duties." });

  const passing = tactic.inPossession?.passing_directness as string;
  if (passing === "Much Shorter" && !hasBpd) {
    suggestions.push({ severity: "warning", area: "central", message: "Much Shorter passing selected, but no Ball Playing Defenders." });
  }
  
  const width = tactic.inPossession?.attacking_width as string;
  if (width === "Extremely Wide" && !hasTrueWinger) {
    suggestions.push({ severity: "warning", area: "attack", message: "Extremely Wide attacking width, but lack true Wingers." });
  }
  
  const loe = tactic.outOfPossession?.line_of_engagement as string;
  const dl = tactic.outOfPossession?.defensive_line as string;
  if ((loe === "Higher" || loe === "Much Higher") && (dl === "Lower" || dl === "Much Lower")) {
    suggestions.push({ severity: "critical", area: "defence", message: "Disconnected shape: High engagement line with low defensive line." });
    solidity.central *= 0.7;
  }

  const midfieldCount = tactic.players.filter(p => p.y >= 40 && p.y <= 60).length;
  if (midfieldCount < 2) {
      suggestions.push({ severity: "warning", area: "central", message: "Midfield gap detected. You may struggle to maintain possession." });
  }

  const score = Math.min(100, (penetration.central * 40 * 0.3 + solidity.central * 50 * 0.3 + (midfieldCount * 25 * 0.2) + totalAttackWeight * 2));

  // Mock Partnerships
  const partnerships: Partnership[] = [];
  
  const isCreative = (r: string) => ["Advanced Playmaker", "Deep Lying Playmaker", "Roaming Playmaker", "Trequartista", "Mezzala"].includes(r);
  const isDefensiveMid = (r: string) => ["Anchor", "Defensive Midfielder", "Ball Winning Midfielder", "Half Back"].includes(r);
  const isWingBack = (r: string) => ["Full Back", "Wing Back", "Inverted Wing Back"].includes(r);
  const isWinger = (r: string) => ["Winger", "Inside Forward", "Inverted Winger"].includes(r);
  const isCreatorStriker = (r: string) => ["Deep Lying Forward", "Target Forward", "False Nine"].includes(r);
  const isFinisherStriker = (r: string) => ["Advanced Forward", "Poacher", "Pressing Forward"].includes(r);

  for (let i = 0; i < tactic.players.length; i++) {
    for (let j = i + 1; j < tactic.players.length; j++) {
      const p1 = tactic.players[i];
      const p2 = tactic.players[j];
      const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      
      if (dist < 35) {
        let strength = Math.max(0, 1 - dist / 35);
        let p_type: "neutral" | "positive" | "negative" = "neutral";
        
        // Midfield
        if (p1.y > 40 && p1.y < 70 && p2.y > 40 && p2.y < 70 && p1.x > 30 && p1.x < 70 && p2.x > 30 && p2.x < 70) {
            const p1C = isCreative(p1.role); const p2C = isCreative(p2.role);
            const p1D = isDefensiveMid(p1.role); const p2D = isDefensiveMid(p2.role);
            if ((p1C && p2D) || (p2C && p1D)) { strength += 0.3; p_type = "positive"; }
            if (p1C && p2C) { strength -= 0.2; p_type = "negative"; }
        }
        
        // Flanks
        const sameFlank = (p1.x < 35 && p2.x < 35) || (p1.x > 65 && p2.x > 65);
        if (sameFlank) {
            if ((isWingBack(p1.role) && isWinger(p2.role)) || (isWingBack(p2.role) && isWinger(p1.role))) {
                if ((p1.duty === "Attack" && p2.duty === "Support") || (p2.duty === "Attack" && p1.duty === "Support")) {
                    strength += 0.3; p_type = "positive";
                }
            }
            if (p1.duty === "Attack" && p2.duty === "Attack") {
                strength -= 0.3; p_type = "negative";
            }
        }
        
        // Strikers
        if (p1.y < 30 && p2.y < 30 && p1.x > 30 && p1.x < 70 && p2.x > 30 && p2.x < 70) {
            if ((isCreatorStriker(p1.role) && isFinisherStriker(p2.role)) || (isCreatorStriker(p2.role) && isFinisherStriker(p1.role))) {
                strength += 0.3; p_type = "positive";
            } else if (isFinisherStriker(p1.role) && isFinisherStriker(p2.role)) {
                strength -= 0.2; p_type = "negative";
            }
        }
        
        if (strength > 0) {
            partnerships.push({
              player1Id: p1.id,
              player2Id: p2.id,
              strength: Math.min(1, strength),
              partnership_type: p_type
            });
        }
      }
    }
  }

  return {
    score,
    penetration: { left: Math.min(100, penetration.left * 40), right: Math.min(100, penetration.right * 40), central: Math.min(100, penetration.central * 40) },
    solidity: { left: Math.min(100, solidity.left * 50), right: Math.min(100, solidity.right * 50), central: Math.min(100, solidity.central * 50) },
    support: { left: Math.min(100, midfieldCount * 25 * 0.8), right: Math.min(100, midfieldCount * 25 * 0.8), central: Math.min(100, midfieldCount * 25) },
    relativeRisk: {
      inPossession: Math.min(100, totalAttackWeight * 12),
      outOfPossession: Math.max(0, 100 - totalDefendWeight * 15),
      total: score
    },
    partnerships,
    suggestions: suggestions as any
  };
}
