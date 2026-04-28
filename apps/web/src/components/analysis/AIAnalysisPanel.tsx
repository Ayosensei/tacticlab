"use client";

import { Cpu, CircleDot, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTacticStore } from "@/store/tacticStore";

export function AIAnalysisPanel() {
  const { analysis, isLoading } = useTacticStore();

  if (!analysis) {
    return (
      <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] items-center justify-center p-8 text-center">
        <Cpu className="w-8 h-8 text-emerald-500/20 mb-4 animate-pulse" />
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50">Initializing AI Analysis...</p>
      </aside>
    );
  }

  const { score, penetration, solidity, support, suggestions, partnerships } = analysis;

  return (
    <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
      <div className="p-6 flex flex-col gap-8 h-full">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h2 className="text-white font-black text-lg tracking-[0.1em] uppercase">AI Analysis</h2>
          </div>
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.15em] opacity-50">
            {isLoading ? "Updating Model..." : "Live Predictive Feedback"}
          </span>
        </div>

        {/* Global Score Widget */}
        <div className="flex items-center justify-center py-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke="rgba(16,185,129,0.05)"
                strokeWidth="10"
              />
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

        {/* Metrics */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Core Metrics</h3>
          
          <MetricBar label="Penetration" value={penetration.central} colorClass="bg-emerald-400" />
          <MetricBar label="Solidity" value={solidity.central} colorClass="bg-indigo-500" />
          <MetricBar label="Support" value={support.central || 70} colorClass="bg-slate-200" />
        </div>

        {/* AI Insights */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Observations</h3>
            <div className="flex flex-col gap-2">
              {suggestions.map((s: any, i: number) => (
                <div key={i} className="bg-[#12141a] p-3 rounded border border-white/5 flex gap-3 shadow-lg group hover:border-white/10 transition-colors">
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

        {/* Key Partnerships Graph */}
        <div className="flex flex-col gap-4 pb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Partnership Graph</h3>
            <span className="text-[8px] font-bold bg-white/5 px-2 py-0.5 rounded text-slate-400">{partnerships.length} Active</span>
          </div>
          <div className="bg-[#12141a] p-6 rounded-md border border-white/5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden h-[140px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }} />
            
            <svg viewBox="0 0 200 120" className="w-full h-full absolute inset-0 z-10 p-2">
              {/* If we had partnership links, we'd map them here */}
              {partnerships.slice(0, 5).map((p, i) => (
                <line 
                  key={i}
                  x1="100" y1="60" // Mock center for now
                  x2={Math.random() * 200} y2={Math.random() * 120}
                  stroke={p.strength > 0.7 ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))}
              
              <circle cx="100" cy="60" r="15" fill="#0d0f14" stroke="#10b981" strokeWidth="2" className="animate-pulse" />
              <text x="100" y="64" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">CORE</text>
            </svg>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center text-[8px] font-bold uppercase tracking-widest z-20">
              <span className="text-slate-500 italic">Positional Chemistry Matrix</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MetricBar({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
  return (
    <div className="bg-[#12141a] p-3 rounded border border-white/5 shadow-md">
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className={cn("w-1 h-1 rounded-full", colorClass)} />
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.1em] uppercase">{label}</span>
          </div>
          <span className="text-[10px] font-black text-white tracking-widest">{Math.round(value)}</span>
        </div>
        <div className="h-1 w-full bg-[#0a0c10] rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)} 
            style={{ width: `${value}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
