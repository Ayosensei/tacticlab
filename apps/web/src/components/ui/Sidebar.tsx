"use client";

import { LayoutGrid, Users, LineChart, Globe, Settings, History } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutGrid, label: "Builder", href: "/builder" },
  { icon: LineChart, label: "Analysis", href: "/analysis" },
  { icon: Globe, label: "Community", href: "/community" },
  { icon: History, label: "History", href: "/history" },
];

const secondaryItems = [
  { icon: Users, label: "Team Info", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r glass flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground px-2 uppercase tracking-wider">
          Main Menu
        </span>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
              pathname === item.href 
                ? "bg-primary/20 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto p-4 flex flex-col gap-2 border-t border-white/5">
        <span className="text-xs font-semibold text-muted-foreground px-2 uppercase tracking-wider">
          System
        </span>
        {secondaryItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
