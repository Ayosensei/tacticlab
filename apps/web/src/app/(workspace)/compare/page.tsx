"use client";

import { useTacticStore } from "@/store/tacticStore";
import { Pitch } from "@/components/pitch/Pitch";
import { FORMATIONS } from "@/lib/tacticsData";
import { ChevronDown, BarChart2 } from "lucide-react";
import { useState } from "react";
import { scoreTactic } from "@/lib/wasm";

export default function ComparePage() {
  const { currentTactic, analysis: currentAnalysis, comparisonTactic, comparisonAnalysis, setComparisonTactic } = useTacticStore();

  const loadComparison = async (formationId: string) => {
    if (formationId === "none") {
      setComparisonTactic(null);
      return;
    }
    const form = FORMATIONS.find(f => f.id === formationId);
    if (form) {
      const tactic = {
        title: form.name,
        formation: form.name,
        style: currentTactic.style, // keep same style for fair comparison
        mentality: currentTactic.mentality,
        inPossession: {},
        inTransition: {},
        outOfPossession: {},
        players: JSON.parse(JSON.stringify(form.players)),
        arrows: []
      };
      setComparisonTactic(tactic as any);
    }
  };

  const StatBar = ({ label, val1, val2 }: { label: string; val1: number; val2: number }) => (
    <div className="flex flex-col gap-1 mb-4">
      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400">
        <span>{val1}</span>
        <span>{label}</span>
        <span>{val2 !== undefined ? val2 : '-'}</span>
      </div>
      <div className="flex h-1.5 bg-[#12141a] rounded-full overflow-hidden relative">
        <div 
          className="absolute right-1/2 top-0 bottom-0 bg-emerald-500 transition-all duration-500" 
          style={{ width: `${val1 / 2}%` }}
        />
        <div 
          className="absolute left-1/2 top-0 bottom-0 bg-indigo-500 transition-all duration-500" 
          style={{ width: val2 ? `${val2 / 2}%` : '0%' }}
        />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20" />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-[#0d0f14] overflow-y-auto relative text-white flex flex-col">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
      
      {/* Compare Header */}
      <div className="w-full flex border-b border-white/5 relative z-10 shrink-0">
        {/* Left Side Header */}
        <div className="flex-1 p-4 flex items-center justify-center border-r border-white/5">
          <span className="text-[12px] font-black uppercase text-emerald-400 tracking-[0.2em]">
            {currentTactic.formation} (Current)
          </span>
        </div>

        {/* Right Side Header */}
        <div className="flex-1 p-4 flex items-center justify-center relative group/selector">
          <button className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] transition-colors hover:text-white text-indigo-400">
            {comparisonTactic ? comparisonTactic.formation : "Select Tactic to Compare"}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>

          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover/selector:opacity-100 group-hover/selector:pointer-events-auto transition-all duration-200 z-50">
            <div className="bg-[#0a0c10] border border-white/10 rounded-md shadow-2xl flex flex-col p-1 w-56 max-h-[300px] overflow-y-auto">
              <button
                onClick={() => loadComparison("none")}
                className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded text-slate-500 hover:bg-white/5 hover:text-white"
              >
                Clear Comparison
              </button>
              <div className="h-[1px] w-full bg-white/5 my-1" />
              {FORMATIONS.map(form => (
                <button
                  key={form.id}
                  onClick={() => loadComparison(form.id)}
                  className={`text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded transition-colors ${
                    comparisonTactic?.formation === form.name 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {form.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Split Pitches */}
      <div className="flex flex-1 relative z-10 min-h-[600px]">
        {/* Left Pitch */}
        <div className="flex-1 p-8 border-r border-white/5 flex flex-col relative scale-[0.85] origin-top">
          <Pitch tactic={currentTactic} analysis={currentAnalysis} />
        </div>

        {/* Right Pitch */}
        <div className="flex-1 p-8 flex flex-col relative scale-[0.85] origin-top">
          {comparisonTactic ? (
            <Pitch tactic={comparisonTactic} analysis={comparisonAnalysis} readOnly={true} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center opacity-30 flex flex-col items-center gap-4">
                <BarChart2 className="w-16 h-16" />
                <span className="text-[11px] uppercase font-bold tracking-widest">Select a tactic from the dropdown above</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Stats Footer */}
      <div className="w-full bg-[#0a0c10] border-t border-white/5 p-8 relative z-10 shrink-0">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] text-center mb-8">
          Tactical Metrics Comparison
        </h3>
        <div className="max-w-2xl mx-auto">
          <StatBar 
            label="In Possession Rating" 
            val1={currentAnalysis?.inPossessionRating || 0} 
            val2={comparisonAnalysis?.inPossessionRating || 0} 
          />
          <StatBar 
            label="Out of Possession Rating" 
            val1={currentAnalysis?.outOfPossessionRating || 0} 
            val2={comparisonAnalysis?.outOfPossessionRating || 0} 
          />
          <StatBar 
            label="Penetration Score" 
            val1={currentAnalysis?.penetration || 0} 
            val2={comparisonAnalysis?.penetration || 0} 
          />
          <StatBar 
            label="Solidity Score" 
            val1={currentAnalysis?.solidity || 0} 
            val2={comparisonAnalysis?.solidity || 0} 
          />
        </div>
      </div>
    </div>
  );
}
