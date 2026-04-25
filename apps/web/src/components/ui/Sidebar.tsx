"use client";

import { LayoutGrid, Sliders, Target, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTacticStore } from "@/store/tacticStore";

const navItems = [
  { icon: Sliders, label: "Style", id: "style" },
  { icon: Target, label: "Mentality", id: "mentality" },
  { icon: LayoutGrid, label: "Formation", id: "formation", active: true },
  { icon: BookOpen, label: "Instructions", id: "instructions" },
];

export function Sidebar() {
  const { activeSidebarTab, setActiveSidebarTab } = useTacticStore();

  return (
    <aside className="w-64 border-r border-[#ffffff0a] bg-[#0d0f14] flex flex-col h-[calc(100vh-80px)] overflow-y-auto z-50">
      <div className="p-6 flex flex-col gap-10">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] block mb-2 opacity-50">
            Tactical Profile
          </span>
          <h2 className="text-emerald-400 font-black text-xl tracking-tight uppercase">Strategic Hub</h2>
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-50">v2.1 Kinetic Engine</span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = activeSidebarTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSidebarTab(isActive ? null : item.id)}
                className={cn(
                  "group flex items-center gap-4 px-3 py-3 transition-all duration-200 text-left relative",
                  isActive 
                    ? "text-emerald-400 bg-emerald-400/5 font-bold after:absolute after:right-0 after:top-0 after:h-full after:w-1 after:bg-emerald-400" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="text-[11px] uppercase font-bold tracking-[0.15em]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-[10px] uppercase font-bold tracking-[0.2em] h-12 gap-3 group">
          <BarChart3 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          Analyze Pitch
        </Button>
      </div>
    </aside>
  );
}
