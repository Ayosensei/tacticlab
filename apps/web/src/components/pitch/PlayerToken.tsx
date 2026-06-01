"use client";

import { useState, useRef, useEffect } from "react";
import { PlayerPosition, Duty } from "@/types/tactic";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, Check } from "lucide-react";
import { useTacticStore } from "@/store/tacticStore";
import { getValidRolesForPosition, DUTIES, ROLE_ABBREVIATIONS } from "@/lib/tacticsData";
import { ROLES_DB } from "@/lib/rolesData";

interface PlayerTokenProps {
  player: PlayerPosition;
  readOnly?: boolean;
}

export function PlayerToken({ player, readOnly = false }: PlayerTokenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentTactic, updatePlayerRole, setSelectedPlayerId, setActiveSidebarTab } = useTacticStore();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
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
      {...(readOnly ? {} : listeners)}
      {...(readOnly ? {} : attributes)}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 touch-none z-20 transition-all flex items-center justify-center",
        !readOnly && "active:scale-110",
        isDragging && !readOnly ? "z-50 opacity-100 scale-110 cursor-grabbing shadow-2xl" : (readOnly ? "cursor-default" : "cursor-grab")
      )}
    >
      <div ref={containerRef} className={cn("relative w-full h-full flex items-center justify-center", isDragging ? "drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "")}>
        {/* Modern Jersey Silhouette (Matched to Tactic Builder.png) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-14 h-14 filter drop-shadow-md"
        >
          <path
            d="M 20 20 L 35 10 C 40 15 60 15 65 10 L 80 20 L 80 40 L 70 40 L 70 90 L 30 90 L 30 40 L 20 40 Z"
            fill="#5b21b6"
            style={{ stroke: 'var(--border)' }}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
        
        <button
          onPointerDown={(e) => { 
            e.stopPropagation(); 
            if (readOnly) return;
            setMenuOpen(!menuOpen); 
            setSelectedPlayerId(player.id);
            setActiveSidebarTab("player_instructions");
          }}
          className={cn(
            "absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-[12px] w-max border shadow-xl group/label transition-colors",
            menuOpen ? "border-emerald-500/50" : "border-border hover:border-emerald-500/30"
          )}
        >
          <span className="text-xs font-black uppercase text-foreground tracking-widest leading-none">
            {getRoleAbbreviation(player.role)} - 
          </span>
          <span className={cn("text-xs font-black tracking-widest leading-none", getDutyColor(player.duty))}>
            {getDutyAbbreviation(player.duty)}
          </span>
          {!readOnly && (
            <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${menuOpen ? 'text-emerald-500 rotate-180' : 'text-muted-foreground/50 group-hover/label:text-emerald-500'}`} />
          )}
        </button>

        {/* Dynamic Context Menu */}
        {menuOpen && (
          <div 
            onPointerDown={(e) => e.stopPropagation()} // Prevent DnD dragging while using menu
            className={cn(
              "absolute top-[calc(100%+42px)] w-56 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-lg shadow-2xl z-[100] flex flex-col overflow-hidden",
              player.x < 25 ? "left-0" : player.x > 75 ? "right-0" : "left-1/2 -translate-x-1/2"
            )}
          >
            {/* Duty Segmentation */}
            <div className="flex bg-card p-1 border-b border-border">
              {(Object.keys(ROLES_DB[player.role]?.duties || {}).length > 0 
                ? Object.keys(ROLES_DB[player.role].duties) 
                : DUTIES).map((duty: string) => (
                <button
                  key={duty}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    updatePlayerRole(player.id, player.role, duty as Duty);
                  }}
                  className={cn(
                    "flex-1 py-1.5 text-[11px] font-bold tracking-widest rounded transition-colors",
                    player.duty === duty 
                      ? "bg-foreground/5 text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {getDutyAbbreviation(duty)}
                </button>
              ))}
            </div>
            
            {/* Valid Roles List */}
            <div className="max-h-48 overflow-y-auto p-1 py-2 flex flex-col gap-0.5 role-scroll">
              {getValidRolesForPosition(player.x, player.y, currentTactic.players).map(role => (
                <button
                  key={role}
                  onPointerDown={(e) => { 
                    e.stopPropagation();
                    updatePlayerRole(player.id, role, player.duty); 
                    setMenuOpen(false); 
                  }}
                  className={cn(
                    "text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-between transition-colors",
                    player.role === role 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  {role}
                  {player.role === role && <Check className="w-3 h-3 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
