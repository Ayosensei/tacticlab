"use client";

import { useTacticStore } from "@/store/tacticStore";
import { PlayerToken } from "./PlayerToken";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function Pitch() {
  const { currentTactic, updatePlayerPosition } = useTacticStore();
  const pitchRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

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
    const { active, delta } = event;
    const playerId = active.id as string;

    if (!pitchRef.current) return;

    const rect = pitchRef.current.getBoundingClientRect();
    const player = currentTactic.players.find(p => p.id === playerId);
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

        {/* Players Layer */}
        <div className="absolute inset-0 z-30">
          <div className="relative w-full h-full">
            {currentTactic.players.map((player) => (
              <PlayerToken key={player.id} player={player} />
            ))}
          </div>
        </div>

        {/* Top Formation Badge (Exact match for Tactic Builder.png) */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-50">
          <button className="bg-[#12141a] hover:bg-[#1a1d25] transition-colors flex items-center justify-center min-w-[120px] h-[34px] px-4 rounded border border-white/5 gap-3 shadow-2xl">
            <span className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.2em]">
              {currentTactic.formation} WIDE
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
          </button>
        </div>
      </div>
    </DndContext>
  );
}
