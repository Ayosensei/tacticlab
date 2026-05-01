"use client";

import { Cpu, Info, AlertTriangle, CheckCircle2, ShieldAlert, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTacticStore } from "@/store/tacticStore";

export function AIAnalysisPanel() {
  const { analysis, isLoading, currentTactic } = useTacticStore();

  if (!analysis) {
    return (
      <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] items-center justify-center p-8 text-center">
        <Cpu className="w-8 h-8 text-emerald-500/20 mb-4 animate-pulse" />
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50">Initializing Tactical Engine...</p>
      </aside>
    );
  }

  // Handle potential type mismatch during hot reload
  const phases = (analysis as any).phases;
  const channelOccupation = (analysis as any).channelOccupation;
  const restDefenceStructure = (analysis as any).restDefenceStructure;
  const buildUpStructure = (analysis as any).buildUpStructure;
  const verticalCompactness = (analysis as any).verticalCompactness;
  const suggestions = analysis.suggestions;
  const passingTriangles = (analysis as any).passingTriangles;

  if (!phases || !channelOccupation) {
     return (
      <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 items-center justify-center p-8 text-center">
        <p className="text-xs text-amber-500 font-bold">Awaiting structural update...</p>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
      <div className="p-6 flex flex-col gap-8 h-full">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <h2 className="text-white font-black text-lg tracking-[0.1em] uppercase">Structural Analysis</h2>
            </div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.15em] opacity-50">
              {isLoading ? "Recalculating..." : "Positional Play Engine"}
            </span>
          </div>
          <div className="bg-[#4f46e510] border border-indigo-500/20 px-2 py-1 rounded">
             <span className="text-[10px] font-black text-indigo-400">FM-NATIVE</span>
          </div>
        </div>

        {/* Structural Metrics */}
        {/* Structural Metrics */}
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#12141a] p-4 rounded-xl border border-white/5 shadow-lg flex flex-col justify-between relative group cursor-help">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    <p className="text-[10px] text-slate-300 font-medium">The number of players staying back while in possession to defend against counter-attacks. Aim for at least 4.</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1">
                   <ShieldAlert className="w-3 h-3 text-emerald-500" /> Rest Defence
                </span>
                <span className="text-2xl font-black text-white tracking-tighter">
                    {restDefenceStructure}
                </span>
            </div>
            
            <div className="bg-[#12141a] p-4 rounded-xl border border-white/5 shadow-lg flex flex-col justify-between relative group cursor-help">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    <p className="text-[10px] text-slate-300 font-medium">Your deep structure (Defenders - Pivots). A 3-2 or 4-1 is ideal for beating the press.</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1">
                   <Navigation className="w-3 h-3 text-indigo-400" /> Build-Up
                </span>
                <span className="text-2xl font-black text-white tracking-tighter">
                    {buildUpStructure}
                </span>
            </div>

            <div className="col-span-2 bg-[#12141a] p-3 rounded-xl border border-white/5 shadow-lg flex items-center justify-between relative group cursor-help">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                    <p className="text-[10px] text-slate-300 font-medium">Distance between your highest attacker and deepest defender. Ideal mid-block is ~25-30m. &gt;55m is too stretched.</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                   Vertical Compactness
                </span>
                <span className={cn(
                    "text-lg font-black",
                    verticalCompactness > 55 ? "text-rose-500" : verticalCompactness < 25 ? "text-amber-500" : "text-emerald-400"
                )}>
                    {Math.round(verticalCompactness)}m
                </span>
            </div>
        </div>

        {/* Channel Occupation Map */}
        <div className="flex flex-col gap-4 relative group cursor-help">
          <div className="absolute bottom-full left-0 mb-2 w-full p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <p className="text-[10px] text-slate-300 font-medium">Visualizes player movement vectors into the 5 vertical channels (Juego de Posición). Avoid overcrowding the half-spaces and ensure you have natural width.</p>
          </div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] group-hover:text-white transition-colors">Channel Occupation (In Possession)</h3>
          <div className="flex h-24 gap-1 w-full bg-[#050608] border border-white/5 rounded-md p-2">
             <ChannelBar label="L" value={channelOccupation.wideLeft} max={3} />
             <ChannelBar label="HL" value={channelOccupation.halfSpaceLeft} max={3} isHalfSpace />
             <ChannelBar label="C" value={channelOccupation.center} max={4} />
             <ChannelBar label="HR" value={channelOccupation.halfSpaceRight} max={3} isHalfSpace />
             <ChannelBar label="R" value={channelOccupation.wideRight} max={3} />
          </div>
        </div>

        {/* Tactical Phases */}
        <div className="flex flex-col gap-3 relative group cursor-help">
          <div className="absolute bottom-full left-0 mb-2 w-full p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <p className="text-[10px] text-slate-300 font-medium">Evaluates your team's effectiveness across the 4 major phases of play based on player duties, strata, and instructions.</p>
          </div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] group-hover:text-white transition-colors">Phase Effectiveness</h3>
          <div className="grid grid-cols-2 gap-2">
             <PhaseBox label="Build-Up" value={phases.buildUp} />
             <PhaseBox label="Creation" value={phases.creation} />
             <PhaseBox label="Conversion" value={phases.conversion} />
             <PhaseBox label="Pressing" value={phases.pressing} />
          </div>
        </div>

        {/* AI Insights */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Tactical Feedback</h3>
            <div className="flex flex-col gap-2">
              {suggestions.map((s: any, i: number) => (
                <div key={i} className="bg-[#12141a] p-3 rounded-lg border border-white/5 flex gap-3 shadow-lg group hover:border-white/10 transition-colors">
                  {s.severity === "critical" && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />}
                  {s.severity === "warning" && <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                  {s.severity === "positive" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                  <p className="text-[10px] text-slate-300 leading-relaxed font-bold tracking-tight">
                    {s.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function PhaseBox({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-[#12141a] p-2.5 rounded-lg border border-white/5 flex flex-col gap-1.5">
      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      <div className="w-full bg-[#0a0c10] h-1.5 rounded-full overflow-hidden">
         <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
            style={{ width: `${value}%` }}
         />
      </div>
    </div>
  );
}

function ChannelBar({ label, value, max, isHalfSpace = false }: { label: string, value: number, max: number, isHalfSpace?: boolean }) {
    // Fill percentage based on expected max occupancy
    const fillPercent = Math.min(100, (value / max) * 100);
    const isEmpty = value === 0;
    const isOvercrowded = value > 2;

    return (
        <div className={cn(
            "flex-1 flex flex-col justify-end items-center relative rounded-sm overflow-hidden",
            isHalfSpace ? "bg-[#ffffff03]" : "bg-[#ffffff01]"
        )}>
            {/* Active Fill */}
            <div 
                className={cn(
                    "w-full transition-all duration-700 ease-out absolute bottom-0",
                    isEmpty ? "bg-transparent" : isOvercrowded ? "bg-amber-500/40" : "bg-emerald-500/40"
                )}
                style={{ height: `${fillPercent}%` }}
            />
            {/* Label */}
            <span className="text-[8px] font-black uppercase text-slate-500 mb-1 z-10">{label}</span>
            {/* Value (Number of players) */}
            <span className={cn(
                "text-[10px] font-black z-10 mb-2",
                isEmpty ? "text-rose-500" : isOvercrowded ? "text-amber-400" : "text-white"
            )}>
                {value}
            </span>
        </div>
    );
}
