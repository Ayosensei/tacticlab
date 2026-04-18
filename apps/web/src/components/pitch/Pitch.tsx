"use client";

import { useTacticStore } from "@/store/tacticStore";
import { PlayerToken } from "./PlayerToken";

export function Pitch() {
  const { currentTactic } = useTacticStore();

  return (
    <div className="relative aspect-[74/105] max-h-[85vh] w-auto mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 pitch-gradient">
      {/* Pitch Markings */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      >
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="white" strokeWidth="0.5" />
        
        {/* Halfway line */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="9.15" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="0.5" fill="white" />

        {/* Home Box */}
        <rect x="21" y="83.5" width="58" height="16.5" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="37" y="94.5" width="26" height="5.5" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 37 83.5 A 9.15 9.15 0 0 1 63 83.5" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="50" cy="89" r="0.5" fill="white" />

        {/* Away Box */}
        <rect x="21" y="0" width="58" height="16.5" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="37" y="0" width="26" height="5.5" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 37 16.5 A 9.15 9.15 0 0 0 63 16.5" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="50" cy="11" r="0.5" fill="white" />

        {/* Corner arcs */}
        <path d="M 0 1 L 1 1 L 1 0" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 99 0 L 99 1 L 100 1" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 100 99 L 99 99 L 99 100" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M 1 100 L 1 99 L 0 99" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>

      {/* Players */}
      <div className="absolute inset-0">
        {currentTactic.players.map((player) => (
          <PlayerToken key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
