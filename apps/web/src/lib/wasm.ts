import { Tactic, AnalysisResult } from "@/types/tactic";

let wasmModule: any = null;

export async function getWasm() {
  if (typeof window === "undefined") return null;
  
  if (!wasmModule) {
    try {
      // In a real production environment, we'd load the compiled wasm here
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

  // TypeScript Fallback (Mock Engine)
  return mockAnalyzeTactic(tactic);
}

function mockAnalyzeTactic(tactic: Tactic): AnalysisResult {
  const attackDuties = tactic.players.filter(p => p.duty === "Attack").length;
  const defendDuties = tactic.players.filter(p => p.duty === "Defend").length;
  
  // Basic scoring logic mirroring the Rust engine
  const penetration = {
    left: Math.min(100, tactic.players.filter(p => p.x < 30 && p.y < 40).length * 25),
    right: Math.min(100, tactic.players.filter(p => p.x > 70 && p.y < 40).length * 25),
    central: Math.min(100, tactic.players.filter(p => p.x >= 30 && p.x <= 70 && p.y < 40).length * 25),
  };

  const solidity = {
    left: Math.min(100, tactic.players.filter(p => p.x < 30 && p.y > 60).length * 30),
    right: Math.min(100, tactic.players.filter(p => p.x > 70 && p.y > 60).length * 30),
    central: Math.min(100, tactic.players.filter(p => p.x >= 30 && p.x <= 70 && p.y > 60).length * 30),
  };

  const suggestions = [];
  if (attackDuties > 5) {
    suggestions.push({
      severity: "warning",
      area: "attack",
      message: "High risk: Too many attacking duties can leave your midfield disconnected."
    });
  }
  if (defendDuties < 3) {
    suggestions.push({
      severity: "critical",
      area: "defence",
      message: "Defensive instability: At least 3 players should have defensive duties."
    });
  }

  const score = Math.round((penetration.central * 0.4) + (solidity.central * 0.4) + (attackDuties * 5));

  return {
    score: Math.min(100, score),
    penetration,
    solidity,
    support: { left: 70, right: 70, central: 80 },
    relativeRisk: {
      inPossession: 40 + (attackDuties * 5),
      outOfPossession: 30 + (10 - defendDuties) * 10,
      total: 50
    },
    partnerships: [],
    suggestions: suggestions as any
  };
}
