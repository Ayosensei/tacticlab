import { Tactic, AnalysisResult, CompatibilityTriangle, Synergy, RiskFactor, DutyBalance } from "@/types/tactic";

const wasmModule: unknown = null;

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
  // ─── Role helpers ───────────────────────────────────────────────
  const isPlaymaker = (r: string) => ["Advanced Playmaker", "Deep Lying Playmaker", "Roaming Playmaker", "Trequartista", "Regista"].includes(r);
  const isDestroyer = (r: string) => ["Anchor", "Defensive Midfielder", "Ball Winning Midfielder", "Half Back"].includes(r);
  const isWingBack = (r: string) => ["Full Back", "Wing Back", "Inverted Wing Back", "Complete Wing-Back"].includes(r);
  const isInsideFwd = (r: string) => ["Inside Forward", "Inverted Winger"].includes(r);
  const isWinger = (r: string) => ["Winger"].includes(r);


  // ─── Instruction reads ──────────────────────────────────────────
  const mentality = tactic.mentality ?? "Balanced";
  const posLost = (tactic.inTransition?.when_possession_lost as string) ?? "";
  const posWon = (tactic.inTransition?.when_possession_won as string) ?? "";
  const gkDist = (tactic.inTransition?.gk_distribution_area as string) ?? "";
  const dl = (tactic.outOfPossession?.defensive_line as string) ?? "";
  const loe = (tactic.outOfPossession?.line_of_engagement as string) ?? "";
  const triggerPress = (tactic.outOfPossession?.trigger_press as string) ?? "";
  const prevShort = (tactic.outOfPossession?.prevent_short_gk_distribution as boolean) ?? false;
  const workBallIn = (tactic.inPossession?.work_ball_into_box as boolean) ?? false;
  const tempo = (tactic.inPossession?.tempo as string) ?? "";

  // ─── Derived booleans ───────────────────────────────────────────
  const highLine = dl === "Higher" || dl === "Much Higher";
  const lowLoe = loe === "Lower" || loe === "Much Lower";
  const highPress = triggerPress === "Much More Often";
  const highTempo = tempo === "Much Higher" || tempo === "Higher";

  // ─── Player tallies ─────────────────────────────────────────────
  const channels = { wideLeft: 0, halfSpaceLeft: 0, center: 0, halfSpaceRight: 0, wideRight: 0 };
  let restDefenceCount = 0, dmsOnDefend = 0, attackingWbs = 0;
  let hasDm = false, attackCms = 0;
  let leftFlankCover = false, rightFlankCover = false;
  let leftAttackWb = false, rightAttackWb = false;
  let leftInsideFwd = false, rightInsideFwd = false;
  let ams = 0, attackStrikers = 0;

  tactic.players.forEach(player => {
    let targetX = player.x;
    switch (player.role) {
      case "Inverted Wing Back":
        targetX = player.x < 50 ? 35 : 65; break;
      case "Inverted Winger":
      case "Inside Forward":
        targetX = player.x < 50 ? 35 : 65; break;
      case "Mezzala":
        targetX = player.x < 50 ? 20 : 80; break;
      case "False Nine":
      case "Deep Lying Forward":
        break;
      default:
        break;
    }
    if (targetX < 20) channels.wideLeft++;
    else if (targetX < 40) channels.halfSpaceLeft++;
    else if (targetX < 60) channels.center++;
    else if (targetX < 80) channels.halfSpaceRight++;
    else channels.wideRight++;

    if (player.y > 60 && player.duty !== "Attack") restDefenceCount++;
    if (isDestroyer(player.role) && player.duty === "Defend") dmsOnDefend++;
    if (isWingBack(player.role) && player.duty === "Attack") attackingWbs++;
    if (player.y > 60 && player.y < 70) hasDm = true;
    if (player.y >= 40 && player.y <= 60 && player.x > 30 && player.x < 70 && player.duty === "Attack") attackCms++;
    if (isWingBack(player.role) && player.duty === "Attack") {
      if (player.x < 50) leftAttackWb = true; else rightAttackWb = true;
    }
    if (isInsideFwd(player.role)) {
      if (player.x < 50) leftInsideFwd = true; else rightInsideFwd = true;
    }
    if (player.y > 40 && player.y <= 70) {
      if (player.x < 40 && (player.duty === "Defend" || player.role === "Carrilero")) leftFlankCover = true;
      if (player.x > 60 && (player.duty === "Defend" || player.role === "Carrilero")) rightFlankCover = true;
    }
    if (player.y > 20 && player.y < 40 && player.x > 30 && player.x < 70) ams++;
    if (player.y <= 20 && player.duty === "Attack") attackStrikers++;
  });

  const defenders = tactic.players.filter(p => p.y > 65).length;
  const deepMids = tactic.players.filter(p => p.y > 45 && p.y <= 65).length;
  const buildUpStructure = `${defenders}-${deepMids}`;

  let restDefStructure = "Solid";
  if (restDefenceCount === 5) restDefStructure = "3-2";
  else if (restDefenceCount === 4) restDefStructure = dmsOnDefend > 0 ? "3-1" : "2-2";
  else if (restDefenceCount < 4) restDefStructure = "Vulnerable";

  // ─── Duty balance ────────────────────────────────────────────────
  let defend = 0, support = 0, attack = 0;
  tactic.players.forEach(p => {
    if (p.duty === "Defend") defend++;
    if (p.duty === "Support") support++;
    if (p.duty === "Attack") attack++;
  });
  const dutyBalance: DutyBalance = { defend, support, attack };

  // ─── Suggestions & risks ─────────────────────────────────────────
  const suggestions: { severity: string, area: string, message: string }[] = [];
  const riskFactors: RiskFactor[] = [];

  // Existing structural suggestions
  if (posLost === "Counter-Press" && restDefenceCount < 4)
    suggestions.push({ severity: "critical", area: "defence", message: "Counter-Press selected with a vulnerable Rest Defence. If the initial press is beaten, your center-backs are completely exposed." });
  if (posWon === "Counter" && attack < 2)
    suggestions.push({ severity: "warning", area: "attack", message: "Counter-attack selected, but you have very few Attack duties to provide sprinting outlets." });
  if (gkDist === "Distribute Over Opposition Defence" && !tactic.players.some(p => p.role === "Advanced Forward" || p.role === "Poacher"))
    suggestions.push({ severity: "warning", area: "attack", message: "Distribute over defence selected, but you lack a pacey forward to chase long balls." });
  if (highLine && !tactic.players.some(p => p.role === "Sweeper Keeper"))
    suggestions.push({ severity: "warning", area: "defence", message: "High defensive line selected without a Sweeper Keeper. You are vulnerable to balls over the top." });
  if (highPress && lowLoe)
    suggestions.push({ severity: "warning", area: "defence", message: "Trigger Press Much More Often alongside a Low Line of Engagement. Your pressing strategy is disconnected." });
  if (prevShort && tactic.players.filter(p => p.y < 35).length < 2)
    suggestions.push({ severity: "warning", area: "defence", message: "Prevent Short GK Distribution with only one forward. They will be easily bypassed." });
  if (channels.wideLeft < 1 && channels.wideRight < 1)
    suggestions.push({ severity: "critical", area: "attack", message: "No natural width. Your attacks will be forced entirely through the center." });
  else if (channels.wideLeft < 1)
    suggestions.push({ severity: "warning", area: "attack", message: "Lack of width on the left flank. Consider a winger or an overlapping wing-back." });
  else if (channels.wideRight < 1)
    suggestions.push({ severity: "warning", area: "attack", message: "Lack of width on the right flank." });
  if (channels.halfSpaceLeft > 2 || channels.halfSpaceRight > 2)
    suggestions.push({ severity: "warning", area: "attack", message: "Half-space congestion. Too many players moving into the same creative channels." });
  if (restDefenceCount < 4)
    suggestions.push({ severity: "critical", area: "defence", message: "Extremely weak Rest Defence. Leaving fewer than 4 players back exposes your center-backs." });
  if (attackingWbs > 1 && dmsOnDefend === 0)
    suggestions.push({ severity: "critical", area: "defence", message: "Both Wing-Backs attacking without a holding midfielder creates a massive counter-attack risk." });
  if (["4-0", "3-0", "2-0"].includes(buildUpStructure))
    suggestions.push({ severity: "critical", area: "defence", message: "Flat build-up structure with no pivot. You will struggle to play through a press." });
  if (attack > 4)
    suggestions.push({ severity: "critical", area: "team", message: "Overly Aggressive. 5+ players on Attack duty leaves massive gaps when you lose the ball." });
  if (support < 3)
    suggestions.push({ severity: "warning", area: "team", message: "Disconnected Layers. Less than 3 Support duties. Your defense will struggle to connect to your attack." });

  // ─── Instruction Contradiction Detection ─────────────────────────
  if (highLine && lowLoe)
    riskFactors.push({ area: "defence", severity: "critical", message: "High Line + Low Engagement. Your defensive line is high but nobody presses — the opposition has acres of space to play into your lines." });
  if ((mentality === "Cautious" || mentality === "Defensive") && highTempo)
    riskFactors.push({ area: "central", severity: "warning", message: "Conflicting Risk Profile. A cautious mentality + high tempo creates erratic transitions — players play fast but conservatively." });
  if (mentality === "Attacking" && (dl === "Lower" || dl === "Much Lower"))
    riskFactors.push({ area: "defence", severity: "warning", message: "Conflicting Mentality & Shape. Attacking mentality pushes players high, but your low defensive line leaves a massive unoccupied zone in midfield." });
  if (workBallIn && !tactic.players.some(p => ["Advanced Forward", "Complete Forward", "Trequartista", "Shadow Striker"].includes(p.role) && p.duty === "Attack"))
    riskFactors.push({ area: "attack", severity: "warning", message: "Work Ball Into Box is active but you have no central attacker on Attack duty to receive the ball in the box." });
  if ((gkDist === "Distribute to Centre-Backs" || gkDist === "Distribute to Full-Backs") && !tactic.players.some(p => p.role === "Ball Playing Defender"))
    riskFactors.push({ area: "defence", severity: "warning", message: "GK Distribution to defenders selected, but no Ball Playing Defender. Your defenders may struggle to play out under pressure." });

  // Structural risks
  if (!hasDm && attackCms >= 2) riskFactors.push({ area: "central", severity: "critical", message: "Massive Midfield Gap. No defensive midfielder and multiple CMs bombing forward — the center is vacant on transition." });
  if (leftAttackWb && leftInsideFwd && !leftFlankCover) riskFactors.push({ area: "left_flank", severity: "critical", message: "Left Flank Exposed. Wing-Back attacking, winger cutting inside, no covering midfielder. Extreme counter-attack risk." });
  if (rightAttackWb && rightInsideFwd && !rightFlankCover) riskFactors.push({ area: "right_flank", severity: "critical", message: "Right Flank Exposed. Wing-Back attacking, winger cutting inside, no covering midfielder. Extreme counter-attack risk." });
  if (attackStrikers === 1 && ams === 0) riskFactors.push({ area: "attack", severity: "warning", message: "Striker Isolation. Lone striker on Attack duty with no attacking midfielder behind them." });

  // ─── Synergies + Compatibility Triangles ───────────────────────────────
  const synergies: Synergy[] = [];
  const compTriangles: CompatibilityTriangle[] = [];
  const numPlayers = tactic.players.length;

  for (let i = 0; i < numPlayers; i++) {
    for (let j = i + 1; j < numPlayers; j++) {
      const p1 = tactic.players[i], p2 = tactic.players[j];
      const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

      // Distance gate - players must be close enough to interact
      if (dist > 40) continue;

      let score = 50; // Default neutral score
      let label = "";
      let desc = "";
      let type: "positive" | "negative" | "tension" = "tension";

      const r1 = p1.role, d1 = p1.duty;
      const r2 = p2.role, d2 = p2.duty;

      // Positive Bonds
      if (
        (r1 === "Deep Lying Playmaker" && ["Support", "Defend"].includes(d1) && r2 === "Anchor" && d2 === "Defend") ||
        (r2 === "Deep Lying Playmaker" && ["Support", "Defend"].includes(d2) && r1 === "Anchor" && d1 === "Defend")
      ) { score = 95; label = "Elite Pivot"; desc = "Perfect balance of deep creation and ultimate defensive security."; }
      else if (
        (r1 === "Deep Lying Playmaker" && ["Support", "Defend"].includes(d1) && r2 === "Defensive Midfielder" && d2 === "Defend") ||
        (r2 === "Deep Lying Playmaker" && ["Support", "Defend"].includes(d2) && r1 === "Defensive Midfielder" && d1 === "Defend")
      ) { score = 90; label = "Classic Double Pivot"; desc = "Solid defensive base with reliable ball progression."; }
      else if (
        (r1 === "Regista" && d1 === "Support" && r2 === "Anchor" && d2 === "Defend") ||
        (r2 === "Regista" && d2 === "Support" && r1 === "Anchor" && d1 === "Defend")
      ) { score = 95; label = "Regista Shield"; desc = "The Anchor provides the absolute defensive cover needed for the Regista to roam."; }
      else if (
        (r1 === "Inside Forward" && d1 === "Attack" && r2 === "Wing Back" && d2 === "Attack") ||
        (r2 === "Inside Forward" && d2 === "Attack" && r1 === "Wing Back" && d1 === "Attack")
      ) { score = 92; label = "Devastating Overlap"; desc = "The IF empties the flank, perfectly paving the way for the attacking Wing-Back."; }
      else if (
        (r1 === "Target Forward" && r2 === "Deep Lying Forward" && d2 === "Support") ||
        (r2 === "Target Forward" && r1 === "Deep Lying Forward" && d1 === "Support")
      ) { score = 90; label = "Big-Small Partnership"; desc = "Classic physical focal point paired with an intelligent mobile creator."; }
      else if (
        (r1 === "Complete Forward" && r2 === "Trequartista" && d2 === "Support") ||
        (r2 === "Complete Forward" && r1 === "Trequartista" && d1 === "Support")
      ) { score = 87; label = "Free Pair"; desc = "Elite, unstructured attacking interchange that is impossible to man-mark."; }
      else if (
        (r1 === "Mezzala" && d1 === "Attack" && r2 === "Deep Lying Playmaker" && d2 === "Support") ||
        (r2 === "Mezzala" && d2 === "Attack" && r1 === "Deep Lying Playmaker" && d1 === "Support")
      ) { score = 85; label = "Half-Space Chain"; desc = "DLP dictates the tempo while the Mezzala exploits the half-space ahead of him."; }
      else if (
        (r1 === "Poacher" && d1 === "Attack" && r2 === "Advanced Playmaker" && d2 === "Support") ||
        (r2 === "Poacher" && d2 === "Attack" && r1 === "Advanced Playmaker" && d1 === "Support")
      ) { score = 85; label = "Poacher + Creator"; desc = "The AP constantly seeks the through-ball that the Poacher thrives on."; }
      else if (
        (r1 === "Advanced Playmaker" && d1 === "Support" && r2 === "Mezzala" && d2 === "Attack") ||
        (r2 === "Advanced Playmaker" && d2 === "Support" && r1 === "Mezzala" && d1 === "Attack")
      ) { score = 82; label = "Box-to-Box Creative"; desc = "AP dictates from deep while Mezzala finds pockets of space higher up."; }
      else if (
        (r1 === "Advanced Playmaker" && d1 === "Support" && r2 === "Advanced Forward" && d2 === "Attack") ||
        (r2 === "Advanced Playmaker" && d2 === "Support" && r1 === "Advanced Forward" && d1 === "Attack")
      ) { score = 80; label = "Creator + Runner"; desc = "Classic combination of a through-ball specialist and a willing runner."; }
      else if (
        (r1 === "Ball Playing Defender" && d1 === "Defend" && r2 === "Deep Lying Playmaker" && ["Support", "Defend"].includes(d2)) ||
        (r2 === "Ball Playing Defender" && d2 === "Defend" && r1 === "Deep Lying Playmaker" && ["Support", "Defend"].includes(d1))
      ) { score = 85; label = "Build-From-Back Chain"; desc = "BPD steps up to confidently find the DLP, bypassing the first line of press."; }
      else if (
        (r1 === "Winger" && r2 === "Full Back" && (Math.abs(p1.x - p2.x) < 20)) ||
        (r2 === "Winger" && r1 === "Full Back" && (Math.abs(p1.x - p2.x) < 20))
      ) { score = 78; label = "Classic Flank"; desc = "Traditional wide pairing providing width and overlapping support."; }

      // Negative Bonds (Clashes)
      else if (isPlaymaker(r1) && isPlaymaker(r2) && dist < 20) {
        score = 20; label = "Playmaker Congestion"; desc = "Two primary creators occupying the exact same zone, demanding the same ball.";
      }
      else if (r1 === "Poacher" && r2 === "Poacher") {
        score = 20; label = "Disconnected Forwards"; desc = "Two purely finishing strikers with nobody linking the midfield to the attack.";
      }
      else if (isWinger(r1) && d1 === d2 && isWinger(r2) && (Math.abs(p1.x - p2.x) < 20)) {
        score = 25; label = "Flank Crowding"; desc = "Both players want to stay wide and cross, stealing each other's space.";
      }
      else if (r1 === "Target Forward" && r2 === "Poacher") {
        score = 35; label = "No Link-Up"; desc = "Physical presence and a runner, but neither drops deep to connect the play.";
      }

      if (score >= 70) {
        type = "positive";
        synergies.push({ player1Id: p1.id, player2Id: p2.id, type, score, label, message: desc });
      } else if (score <= 40) {
        type = "negative";
        synergies.push({ player1Id: p1.id, player2Id: p2.id, type, score, label, message: desc });
      }
    }
  }

  // Find 3-player compatibility triangles
  // A valid triangle requires all 3 edges (synergies) to have score >= 50
  for (let i = 0; i < numPlayers; i++) {
    for (let j = i + 1; j < numPlayers; j++) {
      for (let k = j + 1; k < numPlayers; k++) {
        const p1 = tactic.players[i], p2 = tactic.players[j], p3 = tactic.players[k];

        // Find pairwise scores. If no explicit synergy exists, assume base score of 50.
        const s12 = synergies.find(s => (s.player1Id === p1.id && s.player2Id === p2.id) || (s.player1Id === p2.id && s.player2Id === p1.id))?.score ?? 50;
        const s23 = synergies.find(s => (s.player1Id === p2.id && s.player2Id === p3.id) || (s.player1Id === p3.id && s.player2Id === p2.id))?.score ?? 50;
        const s31 = synergies.find(s => (s.player1Id === p3.id && s.player2Id === p1.id) || (s.player1Id === p1.id && s.player2Id === p3.id))?.score ?? 50;

        if (s12 >= 50 && s23 >= 50 && s31 >= 50) {
          const compScore = Math.round((s12 + s23 + s31) / 3);

          let patternLabel = "";
          let patternDesc = "";

          const roles = [p1.role, p2.role, p3.role];
          const hasDLP = roles.includes("Deep Lying Playmaker");
          const hasAnchorDM = roles.includes("Anchor") || roles.includes("Defensive Midfielder");
          const hasCM = roles.some(r => r.includes("Midfielder") || r === "Mezzala" || r === "Carrilero");
          const hasWB = roles.includes("Wing Back") || roles.includes("Complete Wing-Back");
          const hasIF = roles.includes("Inside Forward") || roles.includes("Inverted Winger");
          const hasAM = roles.includes("Advanced Playmaker") || roles.includes("Attacking Midfielder");

          if (hasAnchorDM && hasDLP && hasCM) {
            patternLabel = "Double Pivot Hub";
            patternDesc = "Ultimate central control unit blending protection and playmaking.";
          } else if (hasWB && hasIF && hasAM) {
            patternLabel = "Wide Overlap Triangle";
            patternDesc = "Classic wide progression unit. AM feeds the IF cutting inside, while WB overlaps.";
          } else if (compScore > 65) {
            patternLabel = "Cohesive Unit";
            patternDesc = "Strong collective understanding between these roles.";
          }

          if (patternLabel !== "") {
            compTriangles.push({
              player1Id: p1.id, player2Id: p2.id, player3Id: p3.id,
              score: compScore, label: patternLabel, description: patternDesc
            });
          }
        }
      }
    }
  }

  // Sort synergies by impact (highest positive or lowest negative first)
  synergies.sort((a, b) => {
    const impactA = Math.abs(a.score - 50);
    const impactB = Math.abs(b.score - 50);
    return impactB - impactA;
  });

  compTriangles.sort((a, b) => b.score - a.score);

  // ─── Mentality modifiers ─────────────────────────────────────────
  const mentalityBonus: Record<string, number> = { Defensive: -20, Cautious: -10, Balanced: 0, Positive: 10, Attacking: 20 };
  const mBonus = mentalityBonus[mentality] ?? 0;

  // ─── Penetration score ───────────────────────────────────────────
  let penetration = 30 + Math.min(attack, 4) * 10 + mBonus;
  synergies.forEach(s => {
    if (s.type === "positive" && s.label.includes("Overlap")) penetration += 10;
    if (s.type === "positive" && s.label.includes("Pair")) penetration += 10;
  });

  // ─── Solidity score ──────────────────────────────────────────────
  let solidity = 30 + Math.min(defend, 5) * 8 - mBonus;
  if (restDefStructure === "3-2" || restDefStructure === "3-1") solidity += 15;
  synergies.forEach(s => { if (s.type === "positive" && s.label.includes("Pivot")) solidity += 10; });
  riskFactors.forEach(r => { if (r.severity === "critical") solidity -= 15; });
  if (highLine && !tactic.players.some(p => p.role === "Sweeper Keeper")) solidity -= 10;

  // ─── Phase ratings ────────────────────────────────────────────────
  const hasPlaymakerRole = tactic.players.some(p => isPlaymaker(p.role));
  const channelSpread = [channels.wideLeft > 0, channels.halfSpaceLeft > 0, channels.center > 0, channels.halfSpaceRight > 0, channels.wideRight > 0].filter(Boolean).length;
  const inPossessionRating = 30
    + Math.min(support, 5) * 7
    + channelSpread * 5
    + (hasPlaymakerRole ? 10 : 0)
    + (!["4-0", "3-0", "2-0"].includes(buildUpStructure) ? 10 : 0)
    + mBonus * 0.5;

  let outOfPossessionRating = 30
    + Math.min(defend, 5) * 7
    + (restDefenceCount >= 4 ? 15 : 0)
    + (dmsOnDefend > 0 ? 10 : 0)
    + (highPress && !lowLoe ? 10 : 0)
    - (highLine && !tactic.players.some(p => p.role === "Sweeper Keeper") ? 10 : 0)
    - mBonus * 0.5;
  riskFactors.forEach(r => { if (r.severity === "critical") outOfPossessionRating -= 10; });

  // ─── Tactical Narrative ──────────────────────────────────────────
  const styleAdj: Record<string, string> = {
    Defensive: "A resolute, defensive", Cautious: "A cautious, controlled",
    Balanced: "A balanced", Positive: "A progressive, attacking", Attacking: "A bold, high-octane"
  };
  const patterns: string[] = [];
  if (highLine && highPress) patterns.push("high-press, high-line shape");
  else if (lowLoe && (dl === "Lower" || dl === "Much Lower")) patterns.push("deep low-block");
  else if (posWon === "Counter") patterns.push("counter-attacking system");
  if (hasPlaymakerRole) patterns.push("built around a deep playmaker");
  if (synergies.some(s => s.type === "positive" && s.label.includes("Overlap"))) patterns.push("wide overloads on the flanks");
  if (restDefStructure === "3-2" || restDefStructure === "3-1") patterns.push("a compact resting defence");
  const patternStr = patterns.length ? ` with ${patterns.join(", ")}` : "";
  const strengthStr = penetration > solidity ? "Best suited for attacking transitions." : "Defensively structured to be difficult to break down.";
  const critCount = riskFactors.filter(r => r.severity === "critical").length;
  const riskStr = critCount > 0 ? ` ${critCount} critical structural risk${critCount > 1 ? "s" : ""} detected.` : " Structurally sound.";
  const tacticalNarrative = `${styleAdj[mentality] ?? "A"} ${tactic.formation}${patternStr}. ${strengthStr}${riskStr}`;

  return {
    tacticalNarrative,
    inPossessionRating: Math.max(0, Math.min(100, inPossessionRating)),
    outOfPossessionRating: Math.max(0, Math.min(100, outOfPossessionRating)),
    channelOccupation: channels,
    restDefenceStructure: restDefStructure,
    buildUpStructure,
    dutyBalance,
    penetration: Math.max(0, Math.min(100, penetration)),
    solidity: Math.max(0, Math.min(100, solidity)),
    compatibilityTriangles: compTriangles,
    synergies,
    riskFactors,
    suggestions: suggestions as unknown as { severity: string, area: string, message: string }[],
  };
}
