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
  if (totalAttackWeight > 7) suggestions.push({ severity: "warning", area: "attack", message: "Highly aggressive setup. High risk on counter-attacks." });
  if (totalDefendWeight < 4) suggestions.push({ severity: "critical", area: "defence", message: "Critical lack of defensive cover in the back line." });

  const score = Math.min(100, (penetration.central * 40 + solidity.central * 50 + totalAttackWeight * 2));

  // Mock Partnerships based on proximity
  const partnerships: Partnership[] = [];
  for (let i = 0; i < tactic.players.length; i++) {
    for (let j = i + 1; j < tactic.players.length; j++) {
      const p1 = tactic.players[i];
      const p2 = tactic.players[j];
      const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      if (dist < 25) {
        partnerships.push({
          player1Id: p1.id,
          player2Id: p2.id,
          strength: 1 - dist / 25,
          partnership_type: dist < 15 ? "positive" : "neutral"
        });
      }
    }
  }

  return {
    score,
    penetration: { left: Math.min(100, penetration.left * 40), right: Math.min(100, penetration.right * 40), central: Math.min(100, penetration.central * 40) },
    solidity: { left: Math.min(100, solidity.left * 50), right: Math.min(100, solidity.right * 50), central: Math.min(100, solidity.central * 50) },
    support: { left: 70, right: 70, central: 70 },
    relativeRisk: {
      inPossession: Math.min(100, totalAttackWeight * 12),
      outOfPossession: Math.max(0, 100 - totalDefendWeight * 15),
      total: score
    },
    partnerships,
    suggestions: suggestions as any
  };
}
