"use client";

import { PlayerPosition } from "@/types/tactic";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PlayerTokenProps {
  player: PlayerPosition;
}

export function PlayerToken({ player }: PlayerTokenProps) {
  const getDutyColor = (duty: string) => {
    switch (duty) {
      case "Attack": return "text-red-400 border-red-400";
      case "Support": return "text-blue-400 border-blue-400";
      case "Defend": return "text-neutral-400 border-neutral-400";
      default: return "text-green-400 border-green-400";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-default group"
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      <div className="relative flex flex-col items-center gap-1">
        {/* Token Circle */}
        <div className="w-12 h-12 rounded-full glass border-2 flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
          {player.jerseyNumber || "?"}
        </div>
        
        {/* Label Container */}
        <div className="flex flex-col items-center bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 min-w-[80px]">
          <span className="text-[10px] font-bold uppercase truncate max-w-[100px] text-white">
            {player.name || player.role}
          </span>
          <span className={cn("text-[8px] font-medium uppercase", getDutyColor(player.duty))}>
            {player.duty}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
