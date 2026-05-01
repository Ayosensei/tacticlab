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
  const channels = {
    wideLeft: 0,
    halfSpaceLeft: 0,
    center: 0,
    halfSpaceRight: 0,
    wideRight: 0,
  };

  let restDefenceCount = 0;
  let buildUpCount = 0;
  let creationCount = 0;
  let conversionCount = 0;

  let dmsOnDefend = 0;
  let attackingWbs = 0;

  tactic.players.forEach(player => {
    let targetX = player.x;
    let targetY = player.y;

    switch (player.role) {
      case "Inverted Wing Back":
        targetX = player.x < 50 ? 35 : 65;
        targetY = 60;
        break;
      case "Inverted Winger":
      case "Inside Forward":
        targetX = player.x < 50 ? 35 : 65;
        targetY = 25;
        break;
      case "Mezzala":
        targetX = player.x < 50 ? 20 : 80;
        break;
      case "False Nine":
      case "Deep Lying Forward":
        targetY = 35;
        break;
      default:
        if (player.duty === "Attack") targetY -= 15;
        else if (player.duty === "Defend") targetY += 5;
    }

    if (targetX < 20) channels.wideLeft += 1;
    else if (targetX < 40) channels.halfSpaceLeft += 1;
    else if (targetX < 60) channels.center += 1;
    else if (targetX < 80) channels.halfSpaceRight += 1;
    else channels.wideRight += 1;

    if (player.y > 60 && player.duty !== "Attack") restDefenceCount += 1;
    if (player.y > 70) buildUpCount += 1;
    if (player.y > 40 && player.y <= 70) creationCount += 1;
    if (player.y <= 40 || player.duty === "Attack") conversionCount += 1;

    if (["Defensive Midfielder", "Anchor", "Half Back"].includes(player.role) && player.duty === "Defend") dmsOnDefend += 1;
    if (["Wing Back", "Complete Wing-Back"].includes(player.role) && player.duty === "Attack") attackingWbs += 1;
  });

  let pressingIntensity = 50;
  const suggestions = [];

  // Counter-Press vs Rest Defence
  const posLost = tactic.inTransition?.when_possession_lost as string;
  if (posLost === "Counter-Press") {
    pressingIntensity += 20;
    if (restDefenceCount < 4) {
      suggestions.push({ severity: "critical", area: "defence", message: "Counter-Press selected with a vulnerable Rest Defence. If the initial press is beaten, your center-backs are completely exposed." });
    }
  } else if (posLost === "Regroup") {
    pressingIntensity -= 20;
  }

  // Counter-Attack Intent
  const posWon = tactic.inTransition?.when_possession_won as string;
  if (posWon === "Counter") {
    const attackDuties = tactic.players.filter(p => p.duty === "Attack").length;
    if (attackDuties < 2) {
      suggestions.push({ severity: "warning", area: "attack", message: "Counter-attack selected, but you have very few Attack duties to provide sprinting outlets." });
    }
  }

  // GK Distribution
  const gkDist = tactic.inTransition?.gk_distribution_area as string;
  if (gkDist === "Distribute Over Opposition Defence") {
    const hasPaceForward = tactic.players.some(p => p.role === "Advanced Forward" || p.role === "Poacher");
    if (!hasPaceForward) {
      suggestions.push({ severity: "warning", area: "attack", message: "Distribute over defence selected, but you lack a pacey forward to chase long balls." });
    }
  }

  // Out of Possession
  let highLine = false;
  let lowLoe = false;

  const dl = tactic.outOfPossession?.defensive_line as string;
  if (dl === "Higher" || dl === "Much Higher") {
    highLine = true;
    const hasSweeperKeeper = tactic.players.some(p => p.role === "Sweeper Keeper");
    if (!hasSweeperKeeper) {
      suggestions.push({ severity: "warning", area: "defence", message: "High defensive line selected without a Sweeper Keeper. You are vulnerable to balls over the top." });
    }
  }

  const loe = tactic.outOfPossession?.line_of_engagement as string;
  if (loe === "Lower" || loe === "Much Lower") {
    lowLoe = true;
  }

  const triggerPress = tactic.outOfPossession?.trigger_press as string;
  if (triggerPress === "Much More Often") {
    pressingIntensity += 30;
    if (lowLoe) {
      suggestions.push({ severity: "warning", area: "defence", message: "Trigger Press Much More Often selected alongside a Low Line of Engagement. Your pressing strategy is disconnected." });
    }
  } else if (triggerPress === "Much Less Often") {
    pressingIntensity -= 30;
  }

  const prevShort = tactic.outOfPossession?.prevent_short_gk_distribution as boolean;
  if (prevShort) {
    const forwardCount = tactic.players.filter(p => p.y < 35).length;
    if (forwardCount < 2) {
      suggestions.push({ severity: "warning", area: "defence", message: "Prevent Short GK Distribution selected with only one forward. They will be easily bypassed." });
    }
  }

  const phases = {
    buildUp: Math.min(100, buildUpCount * 25),
    creation: Math.min(100, creationCount * 25),
    conversion: Math.min(100, conversionCount * 20),
    restDefence: Math.min(100, restDefenceCount * 20),
    pressing: Math.max(0, Math.min(100, pressingIntensity)),
  };


  if (channels.wideLeft < 1 && channels.wideRight < 1) {
    suggestions.push({ severity: "critical", area: "attack", message: "No natural width. Your attacks will be forced entirely through the center." });
  } else if (channels.wideLeft < 1) {
    suggestions.push({ severity: "warning", area: "attack", message: "Lack of width on the left flank. Consider a winger or an overlapping wing-back." });
  } else if (channels.wideRight < 1) {
    suggestions.push({ severity: "warning", area: "attack", message: "Lack of width on the right flank." });
  }

  if (channels.halfSpaceLeft > 2 || channels.halfSpaceRight > 2) {
    suggestions.push({ severity: "warning", area: "attack", message: "Half-space congestion. Too many players moving into the same creative channels." });
  }

  let restDefStructure = "Solid";
  if (restDefenceCount === 5) restDefStructure = "3-2";
  else if (restDefenceCount === 4) restDefStructure = dmsOnDefend > 0 ? "3-1" : "2-2";
  else if (restDefenceCount < 4) restDefStructure = "Vulnerable";

  if (restDefenceCount < 4) {
    suggestions.push({ severity: "critical", area: "defence", message: "Extremely weak Rest Defence. Leaving fewer than 4 players back exposes your center-backs." });
  }

  if (attackingWbs > 1 && dmsOnDefend === 0) {
    suggestions.push({ severity: "critical", area: "defence", message: "Both Wing-Backs attacking without a holding midfielder creates a massive counter-attack risk." });
  }

  // Mock Partnerships
  const partnerships: Partnership[] = [];
  const isCreative = (r: string) => ["Advanced Playmaker", "Deep Lying Playmaker", "Roaming Playmaker", "Trequartista", "Mezzala"].includes(r);
  const isDefensiveMid = (r: string) => ["Anchor", "Defensive Midfielder", "Ball Winning Midfielder", "Half Back"].includes(r);
  const isWingBack = (r: string) => ["Full Back", "Wing Back", "Inverted Wing Back", "Complete Wing-Back"].includes(r);
  const isWinger = (r: string) => ["Winger", "Inside Forward", "Inverted Winger", "Raumdeuter"].includes(r);
  const isCreatorStriker = (r: string) => ["Deep Lying Forward", "Target Forward", "False Nine", "Complete Forward"].includes(r);
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
    phases,
    channelOccupation: channels,
    restDefenceStructure: restDefStructure,
    partnerships,
    suggestions: suggestions as any
  };
}
