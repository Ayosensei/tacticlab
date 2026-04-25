"use client";

import { useState, useRef, useEffect } from "react";
import { PlayerPosition, Duty } from "@/types/tactic";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, Check } from "lucide-react";
import { useTacticStore } from "@/store/tacticStore";
import { getValidRolesForPosition, DUTIES, ROLE_ABBREVIATIONS } from "@/lib/tacticsData";

interface PlayerTokenProps {
  player: PlayerPosition;
}

export function PlayerToken({ player }: PlayerTokenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { updatePlayerRole } = useTacticStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const getDutyColor = (duty: string) => {
    switch (duty) {
      case "Attack": return "text-emerald-400"; // Exact Green
      case "Support": return "text-blue-400";   // Exact Blue
      case "Defend": return "text-red-400";     // Exact Red/Orange
      default: return "text-emerald-400";
    }
  };

  const getRoleAbbreviation = (role: string) => {
    return ROLE_ABBREVIATIONS[role] || role.substring(0, 3).toUpperCase();
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
        "absolute -translate-x-1/2 -translate-y-1/2 touch-none z-20 transition-all active:scale-110",
        isDragging ? "z-50 opacity-100 scale-110 cursor-grabbing shadow-2xl" : "cursor-grab"
      )}
    >
      <div className={cn("relative flex flex-col items-center gap-2", isDragging ? "drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "")}>
        {/* Modern Jersey Silhouette (Matched to Tactic Builder.png) */}
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 filter drop-shadow-md"
        >
          <path
            d="M 20 20 L 35 10 C 40 15 60 15 65 10 L 80 20 L 80 40 L 70 40 L 70 90 L 30 90 L 30 40 L 20 40 Z"
            fill="#5b21b6"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* Polished Label Pill serving as Dropdown Trigger */}
        <button
          onPointerDown={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className={cn(
            "flex items-center gap-1.5 bg-[#0d0f14]/90 backdrop-blur-md px-3 py-1.5 rounded-[12px] w-max border shadow-xl group/label transition-colors",
            menuOpen ? "border-emerald-400/50" : "border-white/10 hover:border-emerald-400/30"
          )}
        >
          <span className="text-xs font-black uppercase text-white tracking-widest leading-none">
            {getRoleAbbreviation(player.role)} - 
          </span>
          <span className={cn("text-xs font-black tracking-widest leading-none", getDutyColor(player.duty))}>
            {getDutyAbbreviation(player.duty)}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${menuOpen ? 'text-emerald-400 rotate-180' : 'text-white/30 group-hover/label:text-emerald-400'}`} />
        </button>

        {/* Dynamic Context Menu */}
        {menuOpen && (
          <div 
            ref={menuRef}
            onPointerDown={(e) => e.stopPropagation()} // Prevent DnD dragging while using menu
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-[#0a0c10] border border-white/10 rounded-lg shadow-2xl z-[100] flex flex-col overflow-hidden"
          >
            {/* Duty Segmentation */}
            <div className="flex bg-[#12141a] p-1 border-b border-white/5">
              {DUTIES.map((duty) => (
                <button
                  key={duty}
                  onClick={() => updatePlayerRole(player.id, player.role, duty as Duty)}
                  className={cn(
                    "flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded transition-colors",
                    player.duty === duty 
                      ? "bg-[#1a1d25] text-white shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  {duty}({getDutyAbbreviation(duty)})
                </button>
              ))}
            </div>
            
            {/* Valid Roles List */}
            <div className="max-h-48 overflow-y-auto p-1 py-2 flex flex-col gap-0.5 role-scroll">
              {getValidRolesForPosition(player.x, player.y).map(role => (
                <button
                  key={role}
                  onClick={() => { updatePlayerRole(player.id, role, player.duty); setMenuOpen(false); }}
                  className={cn(
                    "text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-between transition-colors",
                    player.role === role 
                      ? "bg-emerald-400/10 text-emerald-400" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {role}
                  {player.role === role && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
