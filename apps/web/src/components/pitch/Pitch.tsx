"use client";

import { useTacticStore } from "@/store/tacticStore";
import { PlayerToken } from "./PlayerToken";
import { FORMATIONS } from "@/lib/tacticsData";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Tactic, AnalysisResult } from "@/types/tactic";

interface PitchProps {
  tactic?: Tactic | null;
  analysis?: AnalysisResult | null;
  readOnly?: boolean;
}

export function Pitch({ tactic: propTactic, analysis: propAnalysis, readOnly = false }: PitchProps = {}) {
  const { currentTactic, analysis: storeAnalysis, updatePlayerPosition, setFormation } = useTacticStore();
  const pitchRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const currentTacticData = propTactic || currentTactic;
  const currentAnalysisData = propAnalysis !== undefined ? propAnalysis : storeAnalysis;
  const [hoveredOverlay, setHoveredOverlay] = useState<{
    x: number;
    y: number;
    label: string;
    description: string;
    score: number;
  } | null>(null);

  // Overlay Controls
  const [showLines, setShowLines] = useState(true);
  const [showTriangles, setShowTriangles] = useState(true);
  const [showClashes, setShowClashes] = useState(true);

  // Extract metrics from analysis
  const compTriangles = (currentAnalysisData as any)?.compatibilityTriangles || [];
  const synergies = (currentAnalysisData as any)?.synergies || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnly) return;
    const { active, delta } = event;
    const playerId = active.id as string;

    if (!pitchRef.current) return;

    const rect = pitchRef.current.getBoundingClientRect();
    const player = currentTacticData.players.find(p => p.id === playerId);
    if (!player) return;

    const deltaXPercent = (delta.x / rect.width) * 100;
    const deltaYPercent = (delta.y / rect.height) * 100;

    let newX = player.x + deltaXPercent;
    let newY = player.y + deltaYPercent;

    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    updatePlayerPosition(playerId, newX, newY);
  };

  if (!isMounted) return <div className="h-full aspect-[68/105] bg-[#12141a] rounded-lg animate-pulse" />;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div 
        ref={pitchRef}
        className="relative flex-none aspect-[68/105] w-full max-w-[800px] mx-auto border border-white/10 bg-[#12141a] shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-lg group mt-8 mb-20"
      >
        {/* Pitch Greenish Dark Background */}
        <div className="absolute inset-0 bg-[#12141a] rounded-lg overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_100%)]" />
        </div>

        {/* Mathematically precise Field Marks (viewBox matches 68x105 ratio with margin) */}
        <svg
          viewBox="-1 -1 70 107"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        >
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.2" fill="none">
            {/* Outer line */}
            <rect x="0" y="0" width="68" height="105" />
            
            {/* Halfway line */}
            <line x1="0" y1="52.5" x2="68" y2="52.5" />
            <circle cx="34" cy="52.5" r="9.15" />
            <circle cx="34" cy="52.5" r="0.4" fill="rgba(255,255,255,0.4)" />

            {/* Goal Area Top */}
            <rect x="13.84" y="0" width="40.32" height="16.5" />
            <rect x="24.84" y="0" width="18.32" height="5.5" />
            <path d="M 26.69 16.5 A 9.15 9.15 0 0 0 41.31 16.5" />
            
            {/* Goal Area Bottom */}
            <rect x="13.84" y="88.5" width="40.32" height="16.5" />
            <rect x="24.84" y="99.5" width="18.32" height="5.5" />
            <path d="M 26.69 88.5 A 9.15 9.15 0 0 1 41.31 88.5" />
            
            {/* Penalty spots and arcs */}
            <circle cx="34" cy="11" r="0.4" fill="rgba(255,255,255,0.4)" />
            <circle cx="34" cy="94" r="0.4" fill="rgba(255,255,255,0.4)" />
          </g>
        </svg>

        {/* Tactical Analysis Overlays Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* pointer-events-auto on the SVG so lines and triangles can be hovered later */}
          <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-auto" preserveAspectRatio="none">
            {/* Compatibility Triangles */}
            {showTriangles && compTriangles.map((tri: any, idx: number) => {
              const p1 = currentTacticData.players.find(p => p.id === tri.player1Id);
              const p2 = currentTacticData.players.find(p => p.id === tri.player2Id);
              const p3 = currentTacticData.players.find(p => p.id === tri.player3Id);
              if (!p1 || !p2 || !p3) return null;
              
              // Color based on score thresholds
              let color = "rgba(245, 158, 11, 0.15)"; // Amber (tension/okay)
              let stroke = "rgba(245, 158, 11, 0.4)";
              if (tri.score >= 80) {
                color = "rgba(16, 185, 129, 0.15)"; // Emerald (elite)
                stroke = "rgba(16, 185, 129, 0.5)";
              } else if (tri.score >= 60) {
                color = "rgba(99, 102, 241, 0.15)"; // Indigo (good)
                stroke = "rgba(99, 102, 241, 0.5)";
              }
              
              const handleMove = (e: React.PointerEvent) => {
                setHoveredOverlay({
                  x: e.clientX,
                  y: e.clientY,
                  label: tri.label,
                  description: tri.description,
                  score: tri.score
                });
              };

              return (
                <polygon 
                  key={`tri-${idx}`}
                  points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                  fill={color}
                  stroke={stroke}
                  strokeWidth="0.5"
                  className="transition-all duration-700 ease-out cursor-help"
                  onPointerMove={handleMove}
                  onPointerLeave={() => setHoveredOverlay(null)}
                />
              );
            })}

            {/* Role Chemistry Lines */}
            {showLines && synergies.map((syn: any, idx: number) => {
              const isPositive = syn.type === "positive";
              
              // Filter out clashes if toggled off
              if (!showClashes && !isPositive) return null;

              const p1 = currentTacticData.players.find(p => p.id === syn.player1Id);
              const p2 = currentTacticData.players.find(p => p.id === syn.player2Id);
              if (!p1 || !p2) return null;
              
              // Scale intensity: score 70->0.4 opacity, 100->0.9 opacity. 
              // For negative: score 40->0.4, 0->0.9
              const intensity = isPositive 
                ? Math.max(0.3, (syn.score - 50) / 50)
                : Math.max(0.3, (50 - syn.score) / 50);

              const strokeColor = isPositive 
                ? `rgba(16, 185, 129, ${intensity + 0.1})` // Emerald
                : `rgba(244, 63, 94, ${intensity + 0.1})`; // Rose

              const strokeDash = isPositive ? "none" : "2,2"; // Dashed for negative
              const strokeWidth = 0.5 + (intensity * 1.5); // 0.5px to 2px
              
              const handleMove = (e: React.PointerEvent) => {
                setHoveredOverlay({
                  x: e.clientX,
                  y: e.clientY,
                  label: syn.label,
                  description: syn.message,
                  score: syn.score
                });
              };

              return (
                <line 
                  key={`syn-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  className="transition-all duration-700 ease-out cursor-help"
                  onPointerMove={handleMove}
                  onPointerLeave={() => setHoveredOverlay(null)}
                />
              );
            })}
          </svg>
        </div>

        {/* Players Layer */}
        <div className="absolute inset-0 z-30">
          <div className="relative w-full h-full">
            {currentTacticData.players.map((player) => (
              <PlayerToken key={player.id} player={player} readOnly={readOnly} />
            ))}
          </div>
        </div>

        {/* Top Formation Badge Dropdown */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="relative group/formation">
            <button className="bg-[#12141a] hover:bg-[#1a1d25] transition-colors flex items-center justify-center min-w-[120px] h-[34px] px-4 rounded border border-white/5 gap-3 shadow-2xl">
              <span className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.2em]">
                {currentTacticData.formation}
              </span>
              {!readOnly && <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />}
            </button>
            
            {/* Simple CSS Dropdown Formations list */}
            {!readOnly && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover/formation:opacity-100 group-hover/formation:pointer-events-auto transition-all duration-200">
                <div className="bg-[#0a0c10] border border-white/10 rounded-md shadow-2xl flex flex-col p-1 w-48">
                  {FORMATIONS.map(form => (
                    <button
                      key={form.id}
                      onClick={() => setFormation(form.id)}
                      className={`text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded transition-colors ${
                        currentTacticData.formation === form.name 
                          ? "bg-emerald-400/10 text-emerald-400" 
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {form.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay Toggles */}
        <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setShowLines(!showLines)}
            className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded transition-all border ${showLines ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" : "bg-[#12141a] text-slate-500 border-white/5 hover:text-white"}`}
          >
            Chemistry Lines
          </button>
          <button 
            onClick={() => setShowTriangles(!showTriangles)}
            className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded transition-all border ${showTriangles ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-[#12141a] text-slate-500 border-white/5 hover:text-white"}`}
          >
            Triangles
          </button>
          <button 
            onClick={() => setShowClashes(!showClashes)}
            disabled={!showLines}
            className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded transition-all border ${showClashes ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-[#12141a] text-slate-500 border-white/5 hover:text-white"} ${!showLines ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            Show Clashes
          </button>
        </div>

        {/* Hover Tooltip Overlay */}
        {hoveredOverlay && (
          <div 
            className="fixed z-[100] pointer-events-none w-64 bg-[#0a0c10] border border-white/10 rounded-xl shadow-2xl p-3 flex flex-col gap-1.5"
            style={{ 
              left: hoveredOverlay.x + 15, 
              top: hoveredOverlay.y + 15 
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black text-white uppercase tracking-widest truncate">{hoveredOverlay.label}</span>
              <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                hoveredOverlay.score >= 80 ? "bg-emerald-500/20 text-emerald-400" :
                hoveredOverlay.score >= 60 ? "bg-indigo-500/20 text-indigo-400" :
                hoveredOverlay.score >= 40 ? "bg-amber-500/20 text-amber-400" :
                "bg-rose-500/20 text-rose-400"
              }`}>
                {hoveredOverlay.score}/100
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              {hoveredOverlay.description}
            </p>
          </div>
        )}

      </div>
    </DndContext>
  );
}
