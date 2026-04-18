"use client";

import { useTacticStore } from "@/store/tacticStore";
import { Save, Share2, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const { currentTactic } = useTacticStore();

  return (
    <nav className="h-16 border-b glass flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
          TacticLab
        </h1>
        <div className="h-6 w-px bg-white/10" />
        <span className="text-sm font-medium text-muted-foreground">
          {currentTactic.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Upload className="w-4 h-4" />
          Import .tac
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/5">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:opacity-90">
          <Save className="w-4 h-4" />
          Save Tactic
        </Button>
      </div>
    </nav>
  );
}
