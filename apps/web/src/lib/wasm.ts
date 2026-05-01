import { Tactic, AnalysisResult, PassingTriangle, Synergy, RiskFactor, DutyBalance } from "@/types/tactic";

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
  // ─── Role helpers ───────────────────────────────────────────────
  const isPlaymaker  = (r: string) => ["Advanced Playmaker","Deep Lying Playmaker","Roaming Playmaker","Trequartista","Regista"].includes(r);
  const isDestroyer  = (r: string) => ["Anchor","Defensive Midfielder","Ball Winning Midfielder","Half Back"].includes(r);
  const isWingBack   = (r: string) => ["Full Back","Wing Back","Inverted Wing Back","Complete Wing-Back"].includes(r);
  const isInsideFwd  = (r: string) => ["Inside Forward","Inverted Winger"].includes(r);
  const isWinger     = (r: string) => ["Winger"].includes(r);
  const isCreatorST  = (r: string) => ["Deep Lying Forward","Target Forward","False Nine","Complete Forward"].includes(r);
  const isFinisherST = (r: string) => ["Advanced Forward","Poacher","Pressing Forward"].includes(r);

  // ─── Instruction reads ──────────────────────────────────────────
  const mentality    = tactic.mentality ?? "Balanced";
  const posLost      = (tactic.inTransition?.when_possession_lost    as string) ?? "";
  const posWon       = (tactic.inTransition?.when_possession_won     as string) ?? "";
  const gkDist       = (tactic.inTransition?.gk_distribution_area   as string) ?? "";
  const dl           = (tactic.outOfPossession?.defensive_line       as string) ?? "";
  const loe          = (tactic.outOfPossession?.line_of_engagement   as string) ?? "";
  const triggerPress = (tactic.outOfPossession?.trigger_press        as string) ?? "";
  const prevShort    = (tactic.outOfPossession?.prevent_short_gk_distribution as boolean) ?? false;
  const workBallIn   = (tactic.inPossession?.work_ball_into_box      as boolean) ?? false;
  const tempo        = (tactic.inPossession?.tempo                   as string) ?? "";

  // ─── Derived booleans ───────────────────────────────────────────
  const highLine  = dl === "Higher" || dl === "Much Higher";
  const lowLoe    = loe === "Lower" || loe === "Much Lower";
  const highPress = triggerPress === "Much More Often";
  const highTempo = tempo === "Much Higher" || tempo === "Higher";

  // ─── Player tallies ─────────────────────────────────────────────
  const channels = { wideLeft:0, halfSpaceLeft:0, center:0, halfSpaceRight:0, wideRight:0 };
  let restDefenceCount=0, dmsOnDefend=0, attackingWbs=0;
  let hasDm=false, attackCms=0;
  let leftFlankCover=false, rightFlankCover=false;
  let leftAttackWb=false, rightAttackWb=false;
  let leftInsideFwd=false, rightInsideFwd=false;
  let ams=0, attackStrikers=0;

  tactic.players.forEach(player => {
    let targetX = player.x, targetY = player.y;
    switch (player.role) {
      case "Inverted Wing Back":
        targetX = player.x < 50 ? 35 : 65; targetY = 60; break;
      case "Inverted Winger":
      case "Inside Forward":
        targetX = player.x < 50 ? 35 : 65; targetY = 25; break;
      case "Mezzala":
        targetX = player.x < 50 ? 20 : 80; break;
      case "False Nine":
      case "Deep Lying Forward":
        targetY = 35; break;
      default:
        if (player.duty === "Attack") targetY -= 15;
        else if (player.duty === "Defend") targetY += 5;
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
  const deepMids  = tactic.players.filter(p => p.y > 45 && p.y <= 65).length;
  const buildUpStructure = `${defenders}-${deepMids}`;

  let restDefStructure = "Solid";
  if (restDefenceCount === 5) restDefStructure = "3-2";
  else if (restDefenceCount === 4) restDefStructure = dmsOnDefend > 0 ? "3-1" : "2-2";
  else if (restDefenceCount < 4) restDefStructure = "Vulnerable";

  // ─── Duty balance ────────────────────────────────────────────────
  let defend=0, support=0, attack=0;
  tactic.players.forEach(p => {
    if (p.duty === "Defend") defend++;
    if (p.duty === "Support") support++;
    if (p.duty === "Attack") attack++;
  });
  const dutyBalance: DutyBalance = { defend, support, attack };

  // ─── Suggestions & risks ─────────────────────────────────────────
  const suggestions: any[] = [];
  const riskFactors: RiskFactor[] = [];

  // Existing structural suggestions
  if (posLost === "Counter-Press" && restDefenceCount < 4)
    suggestions.push({ severity:"critical", area:"defence", message:"Counter-Press selected with a vulnerable Rest Defence. If the initial press is beaten, your center-backs are completely exposed." });
  if (posWon === "Counter" && attack < 2)
    suggestions.push({ severity:"warning", area:"attack", message:"Counter-attack selected, but you have very few Attack duties to provide sprinting outlets." });
  if (gkDist === "Distribute Over Opposition Defence" && !tactic.players.some(p => p.role === "Advanced Forward" || p.role === "Poacher"))
    suggestions.push({ severity:"warning", area:"attack", message:"Distribute over defence selected, but you lack a pacey forward to chase long balls." });
  if (highLine && !tactic.players.some(p => p.role === "Sweeper Keeper"))
    suggestions.push({ severity:"warning", area:"defence", message:"High defensive line selected without a Sweeper Keeper. You are vulnerable to balls over the top." });
  if (highPress && lowLoe)
    suggestions.push({ severity:"warning", area:"defence", message:"Trigger Press Much More Often alongside a Low Line of Engagement. Your pressing strategy is disconnected." });
  if (prevShort && tactic.players.filter(p => p.y < 35).length < 2)
    suggestions.push({ severity:"warning", area:"defence", message:"Prevent Short GK Distribution with only one forward. They will be easily bypassed." });
  if (channels.wideLeft < 1 && channels.wideRight < 1)
    suggestions.push({ severity:"critical", area:"attack", message:"No natural width. Your attacks will be forced entirely through the center." });
  else if (channels.wideLeft < 1)
    suggestions.push({ severity:"warning", area:"attack", message:"Lack of width on the left flank. Consider a winger or an overlapping wing-back." });
  else if (channels.wideRight < 1)
    suggestions.push({ severity:"warning", area:"attack", message:"Lack of width on the right flank." });
  if (channels.halfSpaceLeft > 2 || channels.halfSpaceRight > 2)
    suggestions.push({ severity:"warning", area:"attack", message:"Half-space congestion. Too many players moving into the same creative channels." });
  if (restDefenceCount < 4)
    suggestions.push({ severity:"critical", area:"defence", message:"Extremely weak Rest Defence. Leaving fewer than 4 players back exposes your center-backs." });
  if (attackingWbs > 1 && dmsOnDefend === 0)
    suggestions.push({ severity:"critical", area:"defence", message:"Both Wing-Backs attacking without a holding midfielder creates a massive counter-attack risk." });
  if (["4-0","3-0","2-0"].includes(buildUpStructure))
    suggestions.push({ severity:"critical", area:"defence", message:"Flat build-up structure with no pivot. You will struggle to play through a press." });
  if (attack > 4)
    suggestions.push({ severity:"critical", area:"team", message:"Overly Aggressive. 5+ players on Attack duty leaves massive gaps when you lose the ball." });
  if (support < 3)
    suggestions.push({ severity:"warning", area:"team", message:"Disconnected Layers. Less than 3 Support duties. Your defense will struggle to connect to your attack." });

  // ─── Instruction Contradiction Detection ─────────────────────────
  if (highLine && lowLoe)
    riskFactors.push({ area:"defence", severity:"critical", message:"High Line + Low Engagement. Your defensive line is high but nobody presses — the opposition has acres of space to play into your lines." });
  if ((mentality === "Cautious" || mentality === "Defensive") && highTempo)
    riskFactors.push({ area:"central", severity:"warning", message:"Conflicting Risk Profile. A cautious mentality + high tempo creates erratic transitions — players play fast but conservatively." });
  if (mentality === "Attacking" && (dl === "Lower" || dl === "Much Lower"))
    riskFactors.push({ area:"defence", severity:"warning", message:"Conflicting Mentality & Shape. Attacking mentality pushes players high, but your low defensive line leaves a massive unoccupied zone in midfield." });
  if (workBallIn && !tactic.players.some(p => ["Advanced Forward","Complete Forward","Trequartista","Shadow Striker"].includes(p.role) && p.duty === "Attack"))
    riskFactors.push({ area:"attack", severity:"warning", message:"Work Ball Into Box is active but you have no central attacker on Attack duty to receive the ball in the box." });
  if ((gkDist === "Distribute to Centre-Backs" || gkDist === "Distribute to Full-Backs") && !tactic.players.some(p => p.role === "Ball Playing Defender"))
    riskFactors.push({ area:"defence", severity:"warning", message:"GK Distribution to defenders selected, but no Ball Playing Defender. Your defenders may struggle to play out under pressure." });

  // Structural risks
  if (!hasDm && attackCms >= 2) riskFactors.push({ area:"central", severity:"critical", message:"Massive Midfield Gap. No defensive midfielder and multiple CMs bombing forward — the center is vacant on transition." });
  if (leftAttackWb && leftInsideFwd && !leftFlankCover) riskFactors.push({ area:"left_flank", severity:"critical", message:"Left Flank Exposed. Wing-Back attacking, winger cutting inside, no covering midfielder. Extreme counter-attack risk." });
  if (rightAttackWb && rightInsideFwd && !rightFlankCover) riskFactors.push({ area:"right_flank", severity:"critical", message:"Right Flank Exposed. Wing-Back attacking, winger cutting inside, no covering midfielder. Extreme counter-attack risk." });
  if (attackStrikers === 1 && ams === 0) riskFactors.push({ area:"attack", severity:"warning", message:"Striker Isolation. Lone striker on Attack duty with no attacking midfielder behind them." });

  // ─── Synergies + Passing Triangles ───────────────────────────────
  const synergies: Synergy[] = [];
  const passingTriangles: PassingTriangle[] = [];
  const numPlayers = tactic.players.length;

  for (let i = 0; i < numPlayers; i++) {
    for (let j = i + 1; j < numPlayers; j++) {
      const p1 = tactic.players[i], p2 = tactic.players[j];
      const dist = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
      if (dist < 35) {
        // Midfield playmakers
        if (p1.y>40&&p1.y<70&&p2.y>40&&p2.y<70&&p1.x>30&&p1.x<70&&p2.x>30&&p2.x<70) {
          const p1P=isPlaymaker(p1.role), p2P=isPlaymaker(p2.role), p1D=isDestroyer(p1.role), p2D=isDestroyer(p2.role);
          if ((p1P&&p2D)||(p2P&&p1D)) synergies.push({ player1Id:p1.id, player2Id:p2.id, type:"positive", message:"Classic Pivot Synergy (Creator + Destroyer)" });
          if (p1P&&p2P) synergies.push({ player1Id:p1.id, player2Id:p2.id, type:"negative", message:"Playmaker Congestion (Demanding same space)" });
        }
        // Wide overlaps
        const sameFlank = (p1.x<35&&p2.x<35)||(p1.x>65&&p2.x>65);
        if (sameFlank) {
          if ((isWingBack(p1.role)&&isInsideFwd(p2.role))||(isWingBack(p2.role)&&isInsideFwd(p1.role))) {
            const wbA = (isWingBack(p1.role)&&p1.duty==="Attack")||(isWingBack(p2.role)&&p2.duty==="Attack");
            if (wbA) synergies.push({ player1Id:p1.id, player2Id:p2.id, type:"positive", message:"Devastating Wide Overlap" });
          }
          if (isWinger(p1.role)&&isWingBack(p2.role)&&p1.duty===p2.duty) synergies.push({ player1Id:p1.id, player2Id:p2.id, type:"negative", message:"Flank Crowding (Same vertical channel)" });
        }
        // Strikers
        if (p1.y<30&&p2.y<30&&p1.x>30&&p1.x<70&&p2.x>30&&p2.x<70) {
          if ((isCreatorST(p1.role)&&isFinisherST(p2.role))||(isCreatorST(p2.role)&&isFinisherST(p1.role))) synergies.push({ player1Id:p1.id, player2Id:p2.id, type:"positive", message:"Classic Striker Duo (Creator + Finisher)" });
          else if (isFinisherST(p1.role)&&isFinisherST(p2.role)) synergies.push({ player1Id:p1.id, player2Id:p2.id, type:"negative", message:"Disconnected Forwards (No drop-in link player)" });
        }
      }
      // Passing triangles
      for (let k = j + 1; k < numPlayers; k++) {
        const p3 = tactic.players[k];
        const d12=Math.sqrt((p1.x-p2.x)**2+(p1.y-p2.y)**2);
        const d23=Math.sqrt((p2.x-p3.x)**2+(p2.y-p3.y)**2);
        const d31=Math.sqrt((p3.x-p1.x)**2+(p3.y-p1.y)**2);
        if (d12>10&&d12<35&&d23>10&&d23<35&&d31>10&&d31<35) {
          const avg=(d12+d23+d31)/3, v=((d12-avg)**2+(d23-avg)**2+(d31-avg)**2)/3;
          passingTriangles.push({ player1Id:p1.id, player2Id:p2.id, player3Id:p3.id, strength:Math.max(0,Math.min(1,1-(v/100))) });
        }
      }
    }
  }
  passingTriangles.sort((a,b)=>b.strength-a.strength);
  const topTriangles = passingTriangles.slice(0,5);

  // ─── Mentality modifiers ─────────────────────────────────────────
  const mentalityBonus: Record<string,number> = { Defensive:-20, Cautious:-10, Balanced:0, Positive:10, Attacking:20 };
  const mBonus = mentalityBonus[mentality] ?? 0;

  // ─── Penetration score ───────────────────────────────────────────
  let penetration = 30 + Math.min(attack,4)*10 + mBonus;
  synergies.forEach(s => {
    if (s.type==="positive"&&s.message.includes("Overlap")) penetration += 10;
    if (s.type==="positive"&&s.message.includes("Striker")) penetration += 10;
  });

  // ─── Solidity score ──────────────────────────────────────────────
  let solidity = 30 + Math.min(defend,5)*8 - mBonus;
  if (restDefStructure==="3-2"||restDefStructure==="3-1") solidity += 15;
  synergies.forEach(s => { if (s.type==="positive"&&s.message.includes("Pivot")) solidity += 10; });
  riskFactors.forEach(r => { if (r.severity==="critical") solidity -= 15; });
  if (highLine&&!tactic.players.some(p=>p.role==="Sweeper Keeper")) solidity -= 10;

  // ─── Phase ratings ────────────────────────────────────────────────
  const hasPlaymakerRole = tactic.players.some(p => isPlaymaker(p.role));
  const channelSpread = [channels.wideLeft>0, channels.halfSpaceLeft>0, channels.center>0, channels.halfSpaceRight>0, channels.wideRight>0].filter(Boolean).length;
  let inPossessionRating = 30
    + Math.min(support,5)*7
    + channelSpread*5
    + (hasPlaymakerRole ? 10 : 0)
    + (!["4-0","3-0","2-0"].includes(buildUpStructure) ? 10 : 0)
    + mBonus*0.5;

  let outOfPossessionRating = 30
    + Math.min(defend,5)*7
    + (restDefenceCount>=4 ? 15 : 0)
    + (dmsOnDefend>0 ? 10 : 0)
    + (highPress&&!lowLoe ? 10 : 0)
    - (highLine&&!tactic.players.some(p=>p.role==="Sweeper Keeper") ? 10 : 0)
    - mBonus*0.5;
  riskFactors.forEach(r => { if (r.severity==="critical") outOfPossessionRating -= 10; });

  // ─── Tactical Narrative ──────────────────────────────────────────
  const styleAdj: Record<string,string> = {
    Defensive:"A resolute, defensive", Cautious:"A cautious, controlled",
    Balanced:"A balanced", Positive:"A progressive, attacking", Attacking:"A bold, high-octane"
  };
  const patterns: string[] = [];
  if (highLine&&highPress) patterns.push("high-press, high-line shape");
  else if (lowLoe&&(dl==="Lower"||dl==="Much Lower")) patterns.push("deep low-block");
  else if (posWon==="Counter") patterns.push("counter-attacking system");
  if (hasPlaymakerRole) patterns.push("built around a deep playmaker");
  if (synergies.some(s=>s.type==="positive"&&s.message.includes("Overlap"))) patterns.push("wide overloads on the flanks");
  if (restDefStructure==="3-2"||restDefStructure==="3-1") patterns.push("a compact resting defence");
  const patternStr = patterns.length ? ` with ${patterns.join(", ")}` : "";
  const strengthStr = penetration>solidity ? "Best suited for attacking transitions." : "Defensively structured to be difficult to break down.";
  const critCount = riskFactors.filter(r=>r.severity==="critical").length;
  const riskStr = critCount>0 ? ` ${critCount} critical structural risk${critCount>1?"s":""} detected.` : " Structurally sound.";
  const tacticalNarrative = `${styleAdj[mentality]??"A"} ${tactic.formation}${patternStr}. ${strengthStr}${riskStr}`;

  return {
    tacticalNarrative,
    inPossessionRating: Math.max(0,Math.min(100,inPossessionRating)),
    outOfPossessionRating: Math.max(0,Math.min(100,outOfPossessionRating)),
    channelOccupation: channels,
    restDefenceStructure: restDefStructure,
    buildUpStructure,
    dutyBalance,
    penetration: Math.max(0,Math.min(100,penetration)),
    solidity: Math.max(0,Math.min(100,solidity)),
    passingTriangles: topTriangles,
    synergies,
    riskFactors,
    suggestions: suggestions as any,
  };
}
