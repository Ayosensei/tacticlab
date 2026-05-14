"use client";

import { useState } from "react";
import { Bell, Settings, User, Download, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTacticStore } from "@/store/tacticStore";
import { downloadTacticJson } from "@/lib/exportTactic";
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
  const { currentTactic, setTitle } = useTacticStore();
  const [exported, setExported] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const handleExport = () => {
    downloadTacticJson(currentTactic);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const startEditing = () => {
    setTitleDraft(currentTactic.title);
    setEditingTitle(true);
  };

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) setTitle(trimmed);
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitTitle();
    if (e.key === "Escape") setEditingTitle(false);
  };
  
  return (
    <nav className="h-20 border-b border-white/5 bg-[#12141a] flex items-center justify-between px-8 z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-black text-emerald-400 tracking-tighter shrink-0">
          TACTICLAB
        </h1>

        {/* Inline Editable Tactic Title */}
        <div className="flex items-center gap-2 group/title">
          {editingTitle ? (
            <>
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={handleTitleKeyDown}
                className="bg-transparent border-b border-emerald-400/60 text-white text-sm font-bold uppercase tracking-widest outline-none px-1 py-0.5 min-w-[160px] max-w-[280px] caret-emerald-400"
              />
              <button onClick={commitTitle} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                <Check className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-white/40 tracking-widest uppercase truncate max-w-[220px]">
                {currentTactic.title}
              </span>
              <button
                onClick={startEditing}
                className="opacity-0 group-hover/title:opacity-100 transition-opacity text-white/30 hover:text-emerald-400"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </>
          )}
        </div>

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
        <Button
          id="deploy-tactic-btn"
          size="sm"
          onClick={handleExport}
          className={cn(
            "font-bold text-[10px] uppercase tracking-widest px-6 h-10 gap-2 transition-all duration-300",
            exported
              ? "bg-emerald-400 text-[#0a0c10] scale-95"
              : "bg-emerald-500 hover:bg-emerald-600 text-[#0a0c10]"
          )}
        >
          <Download className="w-3.5 h-3.5" />
          {exported ? "Exported!" : "Export Tactic"}
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
