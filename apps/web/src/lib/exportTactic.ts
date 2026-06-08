import type { Tactic } from "@/types/tactic";
import { ROLES_DB } from "./rolesData";
import { TEAM_INSTRUCTIONS } from "./tacticsData";

interface PlayerExport {
  slot: number;
  role: string;
  duty: string;
  position: { x: number; y: number };
  instructions: string[];
  hiddenInstructions: string[];
}

interface ResolvedInstruction {
  label: string;
  value: string | boolean;
}

interface TacticExport {
  meta: {
    exportedBy: "TacticLab";
    version: "1.0";
    exportedAt: string;
    instructions: string[];
  };
  tactic: {
    title: string;
    formation: string;
    mentality: string;
    style: string;
    players: PlayerExport[];
    teamInstructions: {
      inPossession: ResolvedInstruction[];
      inTransition: ResolvedInstruction[];
      outOfPossession: ResolvedInstruction[];
    };
  };
}

/** Resolve raw key-value instruction records into labelled, human-readable pairs.
 *  Filters out inactive entries (false, "None", undefined). */
function resolveInstructions(
  phase: "inPossession" | "inTransition" | "outOfPossession",
  record: Record<string, string | boolean>
): ResolvedInstruction[] {
  const result: ResolvedInstruction[] = [];

  // Build a flat lookup from instruction id -> name
  const lookup: Record<string, string> = {};
  for (const column of TEAM_INSTRUCTIONS[phase] ?? []) {
    for (const item of column.items) {
      lookup[item.id] = item.name;
    }
  }

  for (const [key, value] of Object.entries(record)) {
    if (value === false || value === "None" || value === undefined) continue;
    const label = lookup[key] ?? key; // fall back to raw key if not found
    result.push({ label, value });
  }

  return result;
}

export function exportTactic(tactic: Tactic): TacticExport {
  const players: PlayerExport[] = tactic.players.map((p, i) => {
    const roleData = ROLES_DB[p.role];
    const dutyData = roleData
      ? (roleData.duties as Record<string, { instructions?: string[]; hiddenInstructions?: string[] }>)[p.duty]
      : undefined;

    const instructions = [
      ...(roleData?.baseInstructions.instructions ?? []),
      ...(dutyData?.instructions ?? []),
    ];
    const hiddenInstructions = [
      ...(roleData?.baseInstructions.hiddenInstructions ?? []),
      ...(dutyData?.hiddenInstructions ?? []),
    ];

    return {
      slot: i + 1,
      role: p.role,
      duty: p.duty,
      position: { x: p.x, y: p.y },
      instructions,
      hiddenInstructions,
    };
  });

  return {
    meta: {
      exportedBy: "TacticLab",
      version: "1.0",
      exportedAt: new Date().toISOString(),
      instructions: [
        "This file is a TacticLab export containing your full tactic configuration.",
        "To use in Football Manager: open FM, go to Tactics, create a new tactic,",
        "and manually replicate the roles, duties, and team instructions listed below.",
        "The 'instructions' field per player maps directly to Player Instructions in-game.",
        "The 'hiddenInstructions' are engine defaults applied automatically by FM for this role.",
        "teamInstructions list only active (non-default) settings per phase.",
      ],
    },
    tactic: {
      title: tactic.title,
      formation: tactic.formation,
      mentality: tactic.mentality,
      style: tactic.style,
      players,
      teamInstructions: {
        inPossession: resolveInstructions("inPossession", tactic.inPossession),
        inTransition: resolveInstructions("inTransition", tactic.inTransition),
        outOfPossession: resolveInstructions("outOfPossession", tactic.outOfPossession),
      },
    },
  };
}

export function downloadTacticJson(tactic: Tactic): void {
  const payload = exportTactic(tactic);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${tactic.title.replace(/\s+/g, "_").toLowerCase()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
