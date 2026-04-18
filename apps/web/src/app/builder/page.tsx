"use client";

import { Pitch } from "@/components/pitch/Pitch";
import { useTacticStore } from "@/store/tacticStore";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter } from "lucide-react";

export default function BuilderPage() {
  const { currentTactic } = useTacticStore();

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tactic Builder</h2>
          <p className="text-muted-foreground text-sm">
            Configure your formation, roles, and instructions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 border-white/10">
            <Filter className="w-4 h-4" />
            Conditions
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-white/10">
            <PlusCircle className="w-4 h-4" />
            Add Player
          </Button>
        </div>
      </div>

      {/* Main Pitch Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-8 flex items-center justify-center relative overflow-hidden">
          {/* Subtle decoration background */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(100,255,100,0.05),transparent)]" />
          <Pitch />
        </div>

        {/* Right Sidebar - Tactic Details */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="glass p-4 rounded-xl border border-white/10 flex flex-col gap-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary">Live Tactic Info</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Formation</span>
                <span className="font-medium">{currentTactic.formation}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Style</span>
                <span className="font-medium text-emerald-400">{currentTactic.style}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mentality</span>
                <span className="font-medium text-blue-400">{currentTactic.mentality}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Instructions</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {["Short Passing", "Play Out Of Defence", "High Press"].map(i => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{i}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl border border-white/10 mt-auto">
             <div className="flex items-center gap-3 text-amber-400">
               <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
               <span className="text-xs font-bold uppercase">WASM Core Offline</span>
             </div>
             <p className="text-[10px] text-muted-foreground mt-1">
               Engine will initialize in Phase 1.4
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
