"use client";

import { Cpu, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAnalysisPanel() {
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
            Predictive Modeling
          </span>
        </div>

        {/* Global Score Widget */}
        <div className="flex items-center justify-center py-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="rgba(16,185,129,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="rgba(16,185,129,1)"
                strokeWidth="8"
                strokeDasharray="452"
                strokeDashoffset={452 * (1 - 0.88)}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 12px rgba(16,185,129,0.8))" }}
              />
            </svg>
            <div className="text-center flex flex-col items-center">
              <span className="text-4xl font-black text-white tracking-tighter shadow-sm">88</span>
              <span className="text-[9px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Score</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Metrics</h3>
          
          <MetricBar label="Penetration" value={92} colorClass="bg-emerald-400" textClass="text-emerald-400" />
          <MetricBar label="Solidity" value={76} colorClass="bg-indigo-500" textClass="text-indigo-400" />
          <MetricBar label="Support" value={84} colorClass="bg-slate-200" textClass="text-slate-200" />
        </div>

        {/* AI Insights */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">AI Insights</h3>
          
          <div className="bg-[#12141a] p-4 rounded-md border border-white/5 flex gap-3 shadow-lg">
            <CircleDot className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Left flank exposed on counter-attacks due to high full-back positioning.
            </p>
          </div>
          
          <div className="bg-[#12141a] p-4 rounded-md border border-white/5 flex gap-3 shadow-lg">
            <CircleDot className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Strong central midfield density creates optimal passing triangles.
            </p>
          </div>
        </div>

        {/* Key Partnerships */}
        <div className="flex flex-col gap-4 pb-8">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Key Partnerships</h3>
          <div className="bg-[#12141a] p-6 rounded-md border border-white/5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden h-[120px]">
            {/* Background geometric grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]" style={{ backgroundSize: '12px 12px' }} />
            
            {/* Micro Graph SVG */}
            <svg viewBox="0 0 200 100" className="w-full h-full absolute inset-0 pt-2 z-10">
              <line x1="40" y1="30" x2="100" y2="70" stroke="rgba(16,185,129,0.5)" strokeWidth="2" strokeDasharray="4" />
              <line x1="100" y1="70" x2="160" y2="40" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
              
              <circle cx="40" cy="30" r="10" fill="#050608" stroke="#10b981" strokeWidth="2" />
              <text x="40" y="34" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">8</text>
              
              <circle cx="100" cy="70" r="12" fill="#050608" stroke="#6366f1" strokeWidth="2" />
              <text x="100" y="74" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">6</text>
              
              <circle cx="160" cy="40" r="10" fill="#050608" stroke="#f1f5f9" strokeWidth="2" />
              <text x="160" y="44" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">10</text>
            </svg>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-[8px] font-bold uppercase tracking-widest z-20">
              <span className="text-emerald-400">Penetration</span>
              <span className="text-slate-400">Solidity</span>
              <span className="text-slate-200">Partnerships</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MetricBar({ label, value, colorClass, textClass }: { label: string, value: number, colorClass: string, textClass: string }) {
  return (
    <div className="bg-[#12141a] p-3 rounded border border-white/5 shadow-md flex items-center gap-4">
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", colorClass)} />
            <span className="text-[9px] font-bold text-white tracking-[0.1em] uppercase">{label}</span>
          </div>
          <span className="text-[10px] font-bold text-white tracking-widest">{value}<span className="text-muted-foreground opacity-50">/100</span></span>
        </div>
        <div className="h-1 w-full bg-[#0a0c10] rounded-full overflow-hidden mt-1">
          <div className={cn("h-full rounded-full transition-all duration-1000", colorClass)} style={{ width: `${value}%` }} />
        </div>
      </div>
    </div>
  );
}
