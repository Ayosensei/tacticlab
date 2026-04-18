"use client";

import { PlayerPosition } from "@/types/tactic";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown } from "lucide-react";

interface PlayerTokenProps {
  player: PlayerPosition;
}

export function PlayerToken({ player }: PlayerTokenProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
  });

  const getDutyColor = (duty: string) => {
    switch (duty) {
      case "Attack": return "text-emerald-400";
      case "Support": return "text-blue-400";
      case "Defend": return "text-red-400";
      default: return "text-emerald-400";
    }
  };

  const getRoleAbbreviation = (role: string) => {
    // Naive abbreviation mapping
    const map: Record<string, string> = {
      "Goalkeeper": "G",
      "Central Defender": "CD",
      "Full Back": "FB",
      "Ball Playing Defender": "BPD",
      "Deep Lying Playmaker": "DLP",
      "Advanced Playmaker": "AP",
      "Mezzala": "MEZ",
      "Winger": "W",
      "Deep Lying Forward": "DLF",
      "Advanced Forward": "AF",
      "Center Forward": "CF"
    };
    return map[role] || role.substring(0, 3).toUpperCase();
  };

  const getDutyAbbreviation = (duty: string) => {
    switch (duty) {
      case "Attack": return "At";
      case "Support": return "Su";
      case "Defend": return "De";
      default: return duty.substring(0, 2);
    }
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        left: `${player.x}%`,
        top: `${player.y}%`,
      }}
      {...listeners}
      {...attributes}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 touch-none z-20 transition-transform active:scale-110",
        isDragging ? "z-50 opacity-50 cursor-grabbing" : "cursor-grab"
      )}
    >
      <div className="relative flex flex-col items-center gap-1.5">
        {/* Jersey Icon (Purple) */}
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 drop-shadow-xl"
        >
          <path
            d="M 20 20 L 35 10 C 40 15 60 15 65 10 L 80 20 L 80 40 L 70 40 L 70 90 L 30 90 L 30 40 L 20 40 Z"
            fill="#5b21b6" // Deep purple
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        
        {/* Label Container */}
        <div className="flex items-center gap-1.5 bg-[#12141a] px-3 py-1 rounded-md border border-white/10 shadow-lg min-w-[70px] justify-center">
          <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">
            {getRoleAbbreviation(player.role)} - 
          </span>
          <span className={cn("text-[10px] font-black uppercase tracking-widest leading-none", getDutyColor(player.duty))}>
            {getDutyAbbreviation(player.duty)}
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
        </div>
      </div>
    </div>
  );
}
