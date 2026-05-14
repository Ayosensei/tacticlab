import { ROLES_DB } from "./rolesData";
import { Duty } from "@/types/tactic";

export interface HeatmapData {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: string;
  opacity: number;
}

export interface MovementData {
  id: string;
  path: string; // SVG path string (d attribute) relative to player position
  color: string;
}

export function getVisualizationData(role: string, duty: Duty, x: number, y: number) {
  const roleData = ROLES_DB[role];
  const heatmaps: HeatmapData[] = [];
  const movements: MovementData[] = [];

  if (!roleData) return { heatmaps, movements };

  // Combine traits from base and specific duty
  const baseTraits = roleData.baseTraits.complementary || [];
  const dutyTraits = (roleData.duties as any)[duty]?.traits?.complementary || [];
  const allTraits = [...baseTraits, ...dutyTraits];
  
  // Combine instructions
  const baseInst = roleData.baseInstructions.instructions || [];
  const baseHidden = roleData.baseInstructions.hiddenInstructions || [];
  const dutyInst = (roleData.duties as any)[duty]?.instructions || [];
  const dutyHidden = (roleData.duties as any)[duty]?.hiddenInstructions || [];
  const allInstructions = [...baseInst, ...baseHidden, ...dutyInst, ...dutyHidden].map(i => i.toLowerCase());

  // Determine color based on duty
  let strokeColor = "rgba(16, 185, 129, 0.7)"; // Emerald for Attack
  if (duty === "Support") strokeColor = "rgba(96, 165, 250, 0.7)"; // Blue
  if (duty === "Defend" || duty === "Cover" || duty === "Stopper") strokeColor = "rgba(248, 113, 113, 0.7)"; // Red

  let heatmapColor = "16, 185, 129"; // rgb for emerald
  if (duty === "Support") heatmapColor = "96, 165, 250";
  if (duty === "Defend" || duty === "Cover" || duty === "Stopper") heatmapColor = "248, 113, 113";

  // Check Flank
  const isLeft = x <= 50;

  // 1. Heatmaps
  // Default small heatmap for everyone
  heatmaps.push({
    id: `base-${role}-${duty}`,
    cx: 0,
    cy: 0,
    rx: 6,
    ry: 6,
    color: heatmapColor,
    opacity: 0.4
  });

  if (allInstructions.includes("roam from position") || allInstructions.includes("use more creative freedom")) {
    heatmaps.push({
      id: `roam-${role}-${duty}`,
      cx: 0,
      cy: 0,
      rx: 15,
      ry: 10,
      color: heatmapColor,
      opacity: 0.2
    });
  }

  // 2. Movements
  const addMovement = (path: string, colorOverride?: string) => {
    movements.push({
      id: `mov-${role}-${duty}-${movements.length}`,
      path,
      color: colorOverride || strokeColor
    });
  };

  // Trait/Instruction to SVG Path Mappings (assuming 0,0 is the player)
  // Down = positive y (towards own goal)
  // Up = negative y (towards opponent goal)

  const getsForward = allTraits.includes("Gets Forward Whenever Possible") || allInstructions.includes("get further forward");
  const comesDeep = allTraits.includes("Comes Deep To Get Ball") || allInstructions.includes("drop deeper") || allInstructions.includes("drop deep more") || allInstructions.includes("drop deep much more");
  const hugsLine = allTraits.includes("Hugs Line") || allInstructions.includes("stay wider");
  const cutsInside = allTraits.includes("Cuts Inside From Both Flanks") || allInstructions.includes("cut inside with ball");
  const movesIntoChannels = allTraits.includes("Moves Into Channels") || allInstructions.includes("move into channels");
  const dropsIntoDefence = allInstructions.includes("drop deep more") && role === "Half Back";

  if (getsForward) {
    addMovement("M 0,0 Q 0,-8 0,-15");
  }

  if (comesDeep && !dropsIntoDefence) {
    addMovement("M 0,0 Q 0,5 0,10");
  }

  if (dropsIntoDefence) {
    addMovement("M 0,0 Q 0,8 0,15");
  }

  if (hugsLine) {
    // Determine which way is "wide"
    const dir = isLeft ? -1 : 1;
    // Curved path moving slightly forward and wide
    addMovement(`M 0,0 Q ${dir * 5},-5 ${dir * 5},-12`);
  }

  if (cutsInside) {
    // Determine which way is "inside"
    const dir = isLeft ? 1 : -1;
    // Diagonal inward curve
    addMovement(`M 0,0 Q ${dir * 8},-8 ${dir * 12},-15`);
  }

  if (movesIntoChannels) {
    // Channels are between CB and FB, roughly slightly angled outward from center
    // Or outward from ST position
    const dir = isLeft ? -1 : 1;
    addMovement(`M 0,0 Q ${dir * 5},-8 ${dir * 8},-12`);
  }

  if (allTraits.includes("Arrives Late In Opponents' Area")) {
    // A long dashed line? We can just use a slightly longer path
    addMovement("M 0,0 Q 0,-15 0,-25");
  }

  // Generic fallback if no specific movement is detected but they are on attack duty
  if (movements.length === 0 && duty === "Attack") {
    addMovement("M 0,0 Q 0,-5 0,-10");
  }

  return { heatmaps, movements };
}
