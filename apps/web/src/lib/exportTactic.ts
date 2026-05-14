import { Tactic } from "@/types/tactic";
import { ROLES_DB } from "./rolesData";

interface PlayerExport {
  slot: number;
  role: string;
  duty: string;
  position: { x: number; y: number };
  instructions: string[];
  hiddenInstructions: string[];
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
      inPossession: Record<string, string | boolean>;
      inTransition: Record<string, string | boolean>;
      outOfPossession: Record<string, string | boolean>;
    };
  };
}

export function exportTactic(tactic: Tactic): TacticExport {
  const players: PlayerExport[] = tactic.players.map((p, i) => {
    const roleData = ROLES_DB[p.role];
    const dutyData = roleData ? (roleData.duties as Record<string, { instructions?: string[]; hiddenInstructions?: string[] }>)[p.duty] : undefined;

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
        "Team instructions (inPossession, inTransition, outOfPossession) correspond to",
        "the Team Instructions panel in FM's tactics screen.",
      ],
    },
    tactic: {
      title: tactic.title,
      formation: tactic.formation,
      mentality: tactic.mentality,
      style: tactic.style,
      players,
      teamInstructions: {
        inPossession: tactic.inPossession,
        inTransition: tactic.inTransition,
        outOfPossession: tactic.outOfPossession,
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
