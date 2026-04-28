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
    <div className="w-80 bg-[#0a0c10] border-r border-[#ffffff0a] h-[calc(100vh-80px)] overflow-y-auto flex flex-col z-40 relative shadow-[20px_0_40px_rgba(0,0,0,0.5)] transform transition-transform duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-[#0d0f14] sticky top-0 z-10">
        <h3 className="text-emerald-400 font-black text-lg tracking-tight uppercase">
          {activeSidebarTab} Options
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {activeSidebarTab === "style" && "Select the primary philosophy shaping your team's intent."}
          {activeSidebarTab === "mentality" && "Define the baseline risk and aggression level."}
          {activeSidebarTab === "formation" && "Choose a structural framework for your team."}
          {activeSidebarTab === "player_instructions" && "Configure specific tactical behaviors for this role."}
          {activeSidebarTab !== "style" && activeSidebarTab !== "mentality" && activeSidebarTab !== "formation" && activeSidebarTab !== "player_instructions" && "Configure tactical instructions."}
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

          const dutyOverrides = roleData.duties[player.duty as any] || {};
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

              {(roleData.baseTraits.complementary.length > 0 || roleData.baseTraits.contrasting.length > 0) && (
                <div className="bg-[#12141a] p-4 rounded-lg border border-white/5">
                  <h5 className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-3">Player Traits</h5>
                  
                  {roleData.baseTraits.complementary.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[8px] text-emerald-400 uppercase font-black mb-1 block">Complementary</span>
                      <ul className="list-disc pl-3 text-[10px] text-muted-foreground flex flex-col gap-1">
                        {roleData.baseTraits.complementary.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                  
                  {roleData.baseTraits.contrasting.length > 0 && (
                    <div>
                      <span className="text-[8px] text-red-400 uppercase font-black mb-1 block">Contrasting</span>
                      <ul className="list-disc pl-3 text-[10px] text-muted-foreground flex flex-col gap-1">
                        {roleData.baseTraits.contrasting.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {activeSidebarTab === "instructions" && (
          <div className="flex flex-col gap-4">
            {/* Sub-tabs for Phases */}
            <div className="flex gap-1 p-1 bg-[#12141a] rounded-lg border border-white/5">
              {(["inPossession", "inTransition", "outOfPossession"] as const).map((phase) => (
                <button
                  key={phase}
                  onClick={() => setActiveInstructionPhase(phase)}
                  className={cn(
                    "flex-1 py-2 px-1 text-[9px] uppercase font-bold tracking-widest rounded transition-colors text-center",
                    activeInstructionPhase === phase 
                      ? "bg-[#1a1d25] text-emerald-400 shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  {phase.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>

            {/* Instruction Groups */}
            <div className="flex flex-col gap-4 mt-2">
              {TEAM_INSTRUCTIONS[activeInstructionPhase].map((group) => (
                <div key={group.id} className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    {group.name}
                  </span>
                  <div className="flex flex-col gap-1">
                    {group.options.map((option) => {
                      const isActive = currentTactic[activeInstructionPhase].includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => toggleInstruction(activeInstructionPhase, group.options, option)}
                          className={cn(
                            "flex items-center justify-between text-left px-3 py-2.5 rounded border transition-all duration-200",
                            isActive 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                              : "bg-[#12141a] border-white/5 hover:border-white/20 hover:bg-white/5 text-slate-300"
                          )}
                        >
                          <span className="text-[11px] font-bold tracking-wide">
                            {option}
                          </span>
                          {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSidebarTab !== "style" && activeSidebarTab !== "mentality" && activeSidebarTab !== "formation" && activeSidebarTab !== "player_instructions" && activeSidebarTab !== "instructions" && (
          <div className="p-4 bg-[#12141a] rounded border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Panel under construction
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
