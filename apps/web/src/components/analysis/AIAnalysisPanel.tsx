"use client";

import { Cpu, Info, AlertTriangle, CheckCircle2, Shield, Sword } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTacticStore } from "@/store/tacticStore";

export function AIAnalysisPanel() {
  const { analysis, isLoading, currentTactic } = useTacticStore();

  if (!analysis) {
    return (
      <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] items-center justify-center p-8 text-center">
        <Cpu className="w-8 h-8 text-emerald-500/20 mb-4 animate-pulse" />
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50">Initializing AI Analysis...</p>
      </aside>
    );
  }

  const { score, penetration, solidity, relativeRisk, suggestions, partnerships } = analysis;

  return (
    <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
      <div className="p-6 flex flex-col gap-8 h-full">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h2 className="text-white font-black text-lg tracking-[0.1em] uppercase">AI Analysis</h2>
            </div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.15em] opacity-50">
              {isLoading ? "Updating Model..." : "Live Predictive Feedback"}
            </span>
          </div>
          <div className="bg-[#10b98110] border border-emerald-500/20 px-2 py-1 rounded">
             <span className="text-[10px] font-black text-emerald-400">v1.2</span>
          </div>
        </div>

        {/* Global Score Widget */}
        <div className="flex items-center justify-center py-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="72" cy="72" r="64" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="10" />
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke={score > 70 ? "#10b981" : score > 40 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray="402"
                strokeDashoffset={402 * (1 - score / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 12px ${score > 70 ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.2)"})` }}
              />
            </svg>
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl font-black text-white tracking-tighter">{Math.round(score)}</span>
              <span className="text-[9px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Tactical Rating</span>
            </div>
          </div>
        </div>

        {/* Risk Profile */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Risk Profile</h3>
          <div className="flex flex-col gap-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest text-slate-400">
                <span className="flex items-center gap-1.5"><Sword className="w-3 h-3 text-red-400" /> In Possession</span>
                <span className="text-white">{Math.round(relativeRisk.inPossession)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 transition-all duration-1000" style={{ width: `${relativeRisk.inPossession}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest text-slate-400">
                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-blue-400" /> Out of Possession</span>
                <span className="text-white">{Math.round(relativeRisk.outOfPossession)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${relativeRisk.outOfPossession}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
           <MetricBox label="Penetration" value={penetration.central} color="emerald" />
           <MetricBox label="Solidity" value={solidity.central} color="indigo" />
        </div>

        {/* AI Insights */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Live Insights</h3>
            <div className="flex flex-col gap-2">
              {suggestions.map((s: any, i: number) => (
                <div key={i} className="bg-[#12141a] p-3 rounded-lg border border-white/5 flex gap-3 shadow-lg group hover:border-white/10 transition-colors">
                  {s.severity === "critical" && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />}
                  {s.severity === "warning" && <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                  {s.severity === "positive" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                  <p className="text-[10px] text-slate-300 leading-relaxed font-bold uppercase tracking-tight">
                    {s.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Partnership Graph */}
        <div className="flex flex-col gap-4 pb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Chemistry Matrix</h3>
            <span className="text-[8px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400">{partnerships.length} Links</span>
          </div>
          <div className="bg-[#050608] p-4 rounded-xl border border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden h-[180px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }} />
            
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 z-10 p-4">
              {/* Draw partnership lines */}
              {partnerships.map((p, i) => {
                const player1 = currentTactic.players.find(pl => pl.id === p.player1Id);
                const player2 = currentTactic.players.find(pl => pl.id === p.player2Id);
                if (!player1 || !player2) return null;
                
                return (
                  <line 
                    key={i}
                    x1={player1.x} y1={player1.y}
                    x2={player2.x} y2={player2.y}
                    stroke={p.partnership_type === "positive" ? "#10b981" : p.partnership_type === "negative" ? "#ef4444" : "rgba(255,255,255,0.1)"}
                    strokeWidth={p.strength * 2}
                    strokeDasharray={p.partnership_type === "positive" ? "" : "2"}
                    className="opacity-40"
                  />
                );
              })}
              
              {/* Draw player nodes */}
              {currentTactic.players.map(p => (
                <g key={p.id}>
                  <circle 
                    cx={p.x} cy={p.y} r="3" 
                    fill="#0a0c10" 
                    stroke={p.duty === "Attack" ? "#ef4444" : p.duty === "Defend" ? "#3b82f6" : "#f59e0b"} 
                    strokeWidth="1" 
                  />
                </g>
              ))}
            </svg>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center text-[7px] font-black uppercase tracking-[0.3em] z-20 text-slate-600">
              Live Positional Graph
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MetricBox({ label, value, color }: { label: string, value: number, color: "emerald" | "indigo" }) {
  return (
    <div className="bg-[#12141a] p-3 rounded-lg border border-white/5 flex flex-col gap-1">
      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-lg font-black text-white">{Math.round(value)}</span>
        <div className={cn("w-1.5 h-1.5 rounded-full mb-1.5", color === "emerald" ? "bg-emerald-400" : "bg-indigo-500")} />
      </div>
    </div>
  );
}
