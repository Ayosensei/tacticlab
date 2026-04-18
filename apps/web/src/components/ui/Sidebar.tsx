"use client";

import { LayoutGrid, Users, LineChart, Globe, Settings, Sliders, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Sliders, label: "Style", id: "style" },
  { icon: Target, label: "Mentality", id: "mentality" },
  { icon: LayoutGrid, label: "Formation", id: "formation", active: true },
  { icon: BookOpen, label: "Instructions", id: "instructions" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-[#0a0c10] flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-6 flex flex-col gap-8">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
            Tactical Profile
          </span>
          <h2 className="text-emerald-400 font-bold text-lg tracking-tight uppercase">Strategic Hub</h2>
          <span className="text-[8px] text-muted-foreground uppercase font-medium">v2.1 Kinetic Engine</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "group flex items-center gap-4 px-2 py-3 transition-all duration-200 text-left border-r-2",
                item.active 
                  ? "text-emerald-400 border-emerald-400 bg-emerald-400/5 font-bold" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                item.active ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="text-[11px] uppercase font-bold tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-[10px] uppercase font-bold tracking-widest h-11">
          Analyze Pitch
        </Button>
      </div>
    </aside>
  );
}
