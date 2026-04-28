"use client";

import { useState } from "react";
import { useTacticStore } from "@/store/tacticStore";
import { TACTICAL_STYLES, MENTALITIES, FORMATIONS, TEAM_INSTRUCTIONS } from "@/lib/tacticsData";
import { ROLES_DB } from "@/lib/rolesData";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ConfigPanel() {
  const { activeSidebarTab, currentTactic, setStyle, setMentality, setFormation, selectedPlayerId, toggleInstruction } = useTacticStore();
  const [activeInstructionPhase, setActiveInstructionPhase] = useState<"inPossession" | "inTransition" | "outOfPossession">("inPossession");

  if (!activeSidebarTab) return null;

  return (
    <div 
      id="config-panel-container"
      className={cn(
        "bg-[#0a0c10] border-r border-[#ffffff0a] h-[calc(100vh-80px)] overflow-hidden flex flex-col z-[100] shadow-[20px_0_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out shrink-0",
        activeSidebarTab === "instructions" ? "w-[calc(100vw-16rem)]" : "w-80"
      )}
    >
      
      {activeSidebarTab !== "instructions" && (
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-[#0d0f14] sticky top-0 z-10">
            <h3 className="text-emerald-400 font-black text-lg tracking-tight uppercase">
              {activeSidebarTab.replace(/_/g, ' ')} Options
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {activeSidebarTab === "style" && "Select the primary philosophy shaping your team's intent."}
              {activeSidebarTab === "mentality" && "Define the baseline risk and aggression level."}
              {activeSidebarTab === "formation" && "Choose a structural framework for your team."}
              {activeSidebarTab === "player_instructions" && "Configure specific tactical behaviors for this role."}
            </p>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-3">
            {activeSidebarTab === "style" && TACTICAL_STYLES.map((style) => {
              const isActive = currentTactic.style === style.name;
              return (
                <button
                  key={style.id}
                  onClick={() => setStyle(style.name)}
                  className={cn(
                    "flex flex-col text-left p-4 rounded-lg border transition-all duration-200",
                    isActive
                      ? "bg-[#162a22] border-emerald-500/30"
                      : "bg-[#12141a] border-white/5 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-widest",
                      isActive ? "text-emerald-400" : "text-slate-200"
                    )}>
                      {style.name}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                    {style.desc}
                  </p>
                </button>
              );
            })}

            {activeSidebarTab === "mentality" && MENTALITIES.map((mentality) => {
              const isActive = currentTactic.mentality === mentality.name;
              return (
                <button
                  key={mentality.id}
                  onClick={() => setMentality(mentality.name as any)}
                  className={cn(
                    "flex flex-col text-left p-4 rounded-lg border transition-all duration-200",
                    isActive
                      ? "bg-[#162a22] border-emerald-500/30"
                      : "bg-[#12141a] border-white/5 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="flex justify-between items-center w-full mb-2">
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-widest",
                      isActive ? "text-emerald-400" : "text-slate-200"
                    )}>
                      {mentality.name}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                    {mentality.desc}
                  </p>
                </button>
              );
            })}

            {activeSidebarTab === "formation" && FORMATIONS.map((formation) => {
              const isActive = currentTactic.formation === formation.name;
              return (
                <button
                  key={formation.id}
                  onClick={() => setFormation(formation.id)}
                  className={cn(
                    "flex flex-col text-left p-4 rounded-lg border transition-all duration-200",
                    isActive
                      ? "bg-[#162a22] border-emerald-500/30"
                      : "bg-[#12141a] border-white/5 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-widest",
                      isActive ? "text-emerald-400" : "text-slate-200"
                    )}>
                      {formation.name}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}

            {activeSidebarTab === "player_instructions" && (() => {
              const player = currentTactic.players.find(p => p.id === selectedPlayerId);
              if (!player) return (
                <div className="p-4 text-center text-xs text-muted-foreground">Select a player on the pitch to view instructions.</div>
              );

              const roleData = ROLES_DB[player.role];
              if (!roleData) return (
                <div className="p-4 text-center text-xs text-muted-foreground">No data found for {player.role}.</div>
              );

              const duties = roleData.duties as any;
              const dutyOverrides = (duties && duties[player.duty]) || {};
              const activeInstructions = [
                ...roleData.baseInstructions.instructions,
                ...(dutyOverrides.instructions || [])
              ];
              const activeHidden = [
                ...roleData.baseInstructions.hiddenInstructions,
                ...(dutyOverrides.hiddenInstructions || [])
              ];

              return (
                <div className="flex flex-col gap-4">
                  <div className="bg-[#12141a] p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-emerald-400 font-black tracking-widest uppercase text-[11px]">{player.role}</h4>
                      <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded uppercase">{player.duty}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{roleData.description}</p>
                  </div>

                  {(activeInstructions.length > 0 || activeHidden.length > 0) && (
                    <div className="bg-[#12141a] p-4 rounded-lg border border-white/5">
                      <h5 className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-3">Tactical Instructions</h5>
                      <div className="flex flex-col gap-2">
                        {activeInstructions.map((inst, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-200">
                            <Check className="w-3 h-3 text-emerald-400" />
                            {inst}
                          </div>
                        ))}
                        {activeHidden.map((inst, i) => (
                          <div key={`h-${i}`} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 italic">
                            <Check className="w-3 h-3 text-emerald-600 opacity-50" />
                            {inst} (Engine Default)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Full-width Instructions Panel */}
      {activeSidebarTab === "instructions" && (
        <div className="flex flex-col h-full bg-[#0a0c10] relative z-[110]">
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-[#0d0f14] flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-emerald-400 font-black text-lg tracking-tight uppercase">
                Team Instructions
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50 mt-1">
                Strategy Configuration
              </p>
            </div>
            <div className="bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                {activeInstructionPhase.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          </div>

          {/* Phase Sub-tabs */}
          <div className="flex border-b border-white/5 bg-[#0a0c10] shrink-0">
            {(["inPossession", "inTransition", "outOfPossession"] as const).map((phase) => (
              <button
                key={phase}
                onClick={() => setActiveInstructionPhase(phase)}
                className={cn(
                  "flex-1 py-4 px-6 text-[10px] uppercase font-black tracking-[0.2em] transition-colors text-center border-b-2",
                  activeInstructionPhase === phase
                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                    : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {phase.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>

          {/* 3 Columns Grid */}
          <div className="flex-1 p-8 grid grid-cols-3 gap-8 overflow-y-auto bg-[#0d0f14] relative min-h-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.03),transparent)] pointer-events-none" />

            {TEAM_INSTRUCTIONS[activeInstructionPhase]?.map((column) => (
              <div key={column.id} className="flex flex-col gap-5 z-10">
                <div className="border-b-2 border-emerald-500/20 pb-3 mb-2">
                  <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] text-center">
                    {column.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {column.items.map((item) => {
                    const phaseData = (currentTactic[activeInstructionPhase] as any) || {};
                    const value = phaseData[item.id];

                    if (item.type === "toggle") {
                      const isActive = value === true;
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleInstruction(activeInstructionPhase, item.id, !isActive)}
                          className={cn(
                            "flex items-center justify-between text-left px-4 py-3 rounded-lg border transition-all duration-200 group relative overflow-hidden",
                            isActive
                              ? "bg-[#115e3b] border-[#1f8757] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                              : "bg-[#161b22] border-white/5 hover:border-white/20 hover:bg-[#1c222b]"
                          )}
                        >
                          <span className={cn(
                            "text-[11px] font-bold tracking-wide relative z-10",
                            isActive ? "text-white" : "text-slate-300"
                          )}>
                            {item.name}
                          </span>
                          {isActive && <Check className="w-4 h-4 text-white relative z-10" />}
                        </button>
                      );
                    }

                    if (item.type === "select" && item.options) {
                      return (
                        <div key={item.id} className="flex flex-col gap-1.5 relative group">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1 group-hover:text-slate-400 transition-colors">
                            {item.name}
                          </label>
                          <select
                            value={(value as string) || "None"}
                            onChange={(e) => toggleInstruction(activeInstructionPhase, item.id, e.target.value)}
                            className="w-full bg-[#161b22] border border-white/5 hover:border-white/20 text-slate-200 text-[11px] font-bold rounded-lg px-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-[#1a2028] transition-all appearance-none cursor-pointer"
                          >
                            {item.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-[26px] pointer-events-none opacity-50">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
