"use client";

import { useTacticStore } from "@/store/tacticStore";
import { TACTICAL_STYLES } from "@/lib/tacticsData";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ConfigPanel() {
  const { activeSidebarTab, currentTactic, setStyle } = useTacticStore();

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
          {activeSidebarTab !== "style" && "Configure tactical instructions."}
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

        {activeSidebarTab !== "style" && (
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
