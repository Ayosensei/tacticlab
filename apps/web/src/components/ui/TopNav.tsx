"use client";

import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Builder", active: true },
  { label: "Analysis" },
  { label: "Compare" },
  { label: "Community" },
];

export function TopNav() {
  return (
    <nav className="h-20 border-b border-white/5 bg-[#12141a] flex items-center justify-between px-8 z-50">
      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-black text-emerald-400 tracking-tighter italic">
          TACTICLAB
        </h1>
        
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.label}
              className={cn(
                "text-[10px] uppercase font-bold tracking-[0.2em] transition-all hover:text-emerald-400",
                link.active ? "text-emerald-400 border-b-2 border-emerald-400 pb-1 -mb-[2px]" : "text-muted-foreground"
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-[#0a0c10] font-bold text-[10px] uppercase tracking-widest px-6 h-10">
          Deploy Tactic
        </Button>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <Bell className="w-5 h-5 hover:text-foreground cursor-pointer" />
          <Settings className="w-5 h-5 hover:text-foreground cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/20">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </nav>
  );
}
