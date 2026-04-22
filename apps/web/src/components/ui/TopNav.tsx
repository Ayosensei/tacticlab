"use client";

import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Builder", href: "/builder" },
  { label: "Analysis", href: "/analysis" },
  { label: "Compare", href: "/compare" },
  { label: "Community", href: "/community" },
];

export function TopNav() {
  const pathname = usePathname();
  
  return (
    <nav className="h-20 border-b border-white/5 bg-[#12141a] flex items-center justify-between px-8 z-50">
      <div className="flex items-center gap-12">
        <h1 className="text-2xl font-black text-emerald-400 tracking-tighter">
          TACTICLAB
        </h1>
        
        <div className="flex items-center gap-8 h-full">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[10px] uppercase font-bold tracking-[0.2em] transition-all hover:text-emerald-400 h-20 flex items-center border-b-2",
                  isActive ? "text-emerald-400 border-emerald-400" : "text-muted-foreground border-transparent"
                )}
              >
                {link.label}
              </Link>
            );
          })}
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
