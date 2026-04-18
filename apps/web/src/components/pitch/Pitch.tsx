"use client";

import { useTacticStore } from "@/store/tacticStore";
import { PlayerToken } from "./PlayerToken";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useRef } from "react";

export function Pitch() {
  const { currentTactic, updatePlayerPosition } = useTacticStore();
  const pitchRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement before dragging starts
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const playerId = active.id as string;

    if (!pitchRef.current) return;

    // Get the dimensions of the pitch
    const rect = pitchRef.current.getBoundingClientRect();
    
    // Find the player to get current position
    const player = currentTactic.players.find(p => p.id === playerId);
    if (!player) return;

    // Calculate new percentage based on delta and container size
    const deltaXPercent = (delta.x / rect.width) * 100;
    const deltaYPercent = (delta.y / rect.height) * 100;

    let newX = player.x + deltaXPercent;
    let newY = player.y + deltaYPercent;

    // Clamp to pitch boundaries
    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));

    updatePlayerPosition(playerId, newX, newY);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div 
        ref={pitchRef}
        className="relative aspect-[74/105] max-h-[85vh] w-auto mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-[#050608]"
      >
        {/* Field Lines - More realistic dark green and thin lines */}
        <div className="absolute inset-x-8 inset-y-8 bg-[#0a0f0d] border border-white/5 shadow-inner">
           {/* Grass pattern could go here */}
        </div>

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        >
          {/* Outer line */}
          <rect x="5" y="5" width="90" height="90" fill="none" stroke="white" strokeWidth="0.2" />
          
          {/* Halfway line */}
          <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="9.15" fill="none" stroke="white" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="0.2" fill="white" />

          {/* Goal Area Top */}
          <rect x="35" y="5" width="30" height="15" fill="none" stroke="white" strokeWidth="0.2" />
          <rect x="42" y="5" width="16" height="5" fill="none" stroke="white" strokeWidth="0.2" />
          <circle cx="50" cy="16" r="0.2" fill="white" />

          {/* Goal Area Bottom */}
          <rect x="35" y="80" width="30" height="15" fill="none" stroke="white" strokeWidth="0.2" />
          <rect x="42" y="90" width="16" height="5" fill="none" stroke="white" strokeWidth="0.2" />
          <circle cx="50" cy="84" r="0.2" fill="white" />
        </svg>

        {/* Players */}
        <div className="absolute inset-0">
          {currentTactic.players.map((player) => (
            <PlayerToken key={player.id} player={player} />
          ))}
        </div>

        {/* Formation Header Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="bg-[#12141a]/90 backdrop-blur-md px-6 py-2 rounded border border-white/10 shadow-2xl flex items-center gap-4">
            <span className="text-[12px] font-black uppercase text-emerald-400 tracking-widest">{currentTactic.formation} WIDE</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
