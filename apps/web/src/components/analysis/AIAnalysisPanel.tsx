"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Cpu, Info, AlertTriangle, CheckCircle2, ShieldAlert, Navigation, Swords, Shield, Zap, Activity, Layers, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTacticStore } from "@/store/tacticStore";

const MIN_WIDTH = 240;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 340; // slightly wider for better tabs

export function AIAnalysisPanel() {
  const { analysis, isLoading, triggerAnalysis } = useTacticStore();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [activeTab, setActiveTab] = useState<'overview' | 'structure' | 'feedback'>('overview');
  
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);
  // Preserve scroll position across width-driven re-renders
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);

  useEffect(() => {
    if (!analysis && !isLoading) {
      triggerAnalysis();
    }
  }, [analysis, isLoading, triggerAnalysis]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    // Save scroll before resize state change
    savedScroll.current = scrollRef.current?.scrollTop ?? 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [width]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.clientX;
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + delta));
    setWidth(newWidth);
    // Restore scroll after layout shift
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = savedScroll.current;
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  const dragHandle = (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-indigo-500/40 active:bg-indigo-500/60 transition-colors z-50 group"
      title="Drag to resize"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-0.5 h-1 rounded-full bg-indigo-400" />
        <div className="w-0.5 h-1 rounded-full bg-indigo-400" />
        <div className="w-0.5 h-1 rounded-full bg-indigo-400" />
      </div>
    </div>
  );

  if (!analysis) {
    return (
      <aside
        className="border-l border-border bg-background flex flex-col h-[calc(100vh-80px)] shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] items-center justify-center p-8 text-center relative"
        style={{ width }}
      >
        {dragHandle}
        <Cpu className="w-8 h-8 text-emerald-500/20 mb-4 animate-pulse" />
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50">Initializing Tactical Engine...</p>
      </aside>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = analysis as Record<string, any>;
  const tacticalNarrative     = (a.tacticalNarrative     as string)  ?? "";
  const inPossessionRating    = (a.inPossessionRating    as number)  ?? 0;
  const outOfPossessionRating = (a.outOfPossessionRating as number)  ?? 0;
  const channelOccupation     = a.channelOccupation      ?? { wideLeft:0, halfSpaceLeft:0, center:0, halfSpaceRight:0, wideRight:0 };
  const restDefenceStructure  = (a.restDefenceStructure  as string)  ?? "";
  const buildUpStructure      = (a.buildUpStructure      as string)  ?? "";
  const dutyBalance           = a.dutyBalance            ?? { defend:0, support:0, attack:0 };
  const penetration           = (a.penetration           as number)  ?? 0;
  const solidity              = (a.solidity              as number)  ?? 0;
  const suggestions           = a.suggestions            ?? [];
  const synergies             = a.synergies              ?? [];
  const riskFactors           = a.riskFactors            ?? [];

  return (
    <aside
      className="border-l border-border bg-background flex flex-col h-[calc(100vh-80px)] shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] relative"
      style={{ width }}
    >
      {dragHandle}

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-indigo-500" />
                <h2 className="text-foreground font-black text-lg tracking-[0.1em] uppercase">Analysis</h2>
              </div>
              <span className={cn("text-[9px] uppercase font-bold tracking-[0.15em]", isLoading ? "text-amber-400 opacity-100 animate-pulse" : "text-muted-foreground opacity-50")}>
                {isLoading ? "Recalculating..." : "Tactical Engine v2"}
              </span>
            </div>
            <div className="bg-[#4f46e510] border border-indigo-500/20 px-2 py-1 rounded">
              <span className="text-[10px] font-black text-indigo-400">LIVE</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-card p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded transition-colors", activeTab === 'overview' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <Activity className="w-3 h-3" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded transition-colors", activeTab === 'structure' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <Layers className="w-3 h-3" /> Structure
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded transition-colors", activeTab === 'feedback' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <MessageSquare className="w-3 h-3" /> Feedback
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="overflow-y-auto flex-1 p-6 pt-4 flex flex-col gap-6">
          
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {tacticalNarrative && (
                <div className="bg-gradient-to-br from-card to-background p-4 rounded-xl border border-border shadow-lg">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">Tactical Summary</span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{tacticalNarrative}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Tooltip text="Rates how effective your tactic is with the ball. Driven by mentality, playmakers, duty balance and channel spread.">
                  <div className="bg-card p-4 rounded-xl border border-border flex flex-col items-center justify-center shadow-lg hover:border-emerald-500/30 transition-colors">
                    <CircularProgress 
                      value={inPossessionRating} 
                      icon={Swords} 
                      label="In Possession" 
                      colorClass="text-emerald-400" 
                      gradientFrom="#10b981" 
                      gradientTo="#059669" 
                    />
                  </div>
                </Tooltip>
                <Tooltip text="Rates how effective your tactic is without the ball. Driven by rest defence, pivots, pressing shape, and defensive line.">
                  <div className="bg-card p-4 rounded-xl border border-border flex flex-col items-center justify-center shadow-lg hover:border-indigo-500/30 transition-colors">
                    <CircularProgress 
                      value={outOfPossessionRating} 
                      icon={Shield} 
                      label="Out of Poss." 
                      colorClass="text-indigo-400" 
                      gradientFrom="#6366f1" 
                      gradientTo="#4f46e5" 
                    />
                  </div>
                </Tooltip>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Tooltip text="How aggressively this tactic attacks space. Driven by attack duties, wide overlaps, and mentality.">
                  <div className="bg-card p-3 rounded-xl border border-border flex flex-col gap-2 hover:border-foreground/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Penetration</span>
                      <span className="text-sm font-black text-foreground">{Math.round(penetration)}</span>
                    </div>
                    <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${penetration}%` }} />
                    </div>
                  </div>
                </Tooltip>
                <Tooltip text="How well this tactic protects space. Driven by defend duties, pivots, and rest defence structure.">
                  <div className="bg-card p-3 rounded-xl border border-border flex flex-col gap-2 hover:border-foreground/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Solidity</span>
                      <span className="text-sm font-black text-foreground">{Math.round(solidity)}</span>
                    </div>
                    <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${solidity}%` }} />
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>
          )}

          {/* ── STRUCTURE TAB ── */}
          {activeTab === 'structure' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <Tooltip text="Players staying back while in possession. Aim for at least 4 to resist counter-attacks.">
                  <div className="bg-card p-4 rounded-xl border border-border flex flex-col gap-1 items-center justify-center text-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-3 h-3 text-emerald-500" /> Rest Defence
                    </span>
                    <span className="text-3xl font-black text-foreground tracking-tighter">{restDefenceStructure}</span>
                  </div>
                </Tooltip>
                <Tooltip text="Deep player structure (Defenders–Pivots). A 3-2 or 4-1 is ideal for playing through a press.">
                  <div className="bg-card p-4 rounded-xl border border-border flex flex-col gap-1 items-center justify-center text-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-indigo-500" /> Build-Up
                    </span>
                    <span className="text-3xl font-black text-foreground tracking-tighter">{buildUpStructure}</span>
                  </div>
                </Tooltip>
              </div>

              <Tooltip text="The D/S/A duty ratio. Aim for ~4 Defend, ~4 Support, ~3 Attack for a balanced tactic.">
                <div className="bg-card p-4 rounded-xl border border-border flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Duty Balance</span>
                    <div className="flex gap-2 text-[9px] font-black uppercase tracking-widest">
                      <span className="text-muted-foreground">{dutyBalance.defend}D</span>
                      <span className="text-emerald-500">{dutyBalance.support}S</span>
                      <span className="text-amber-500">{dutyBalance.attack}A</span>
                    </div>
                  </div>
                  <div className="flex h-2 w-full rounded-full overflow-hidden border border-border">
                    <div className="bg-muted-foreground/50 transition-all duration-500" style={{ width: `${(dutyBalance.defend / 11) * 100}%` }} />
                    <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(dutyBalance.support / 11) * 100}%` }} />
                    <div className="bg-amber-500 transition-all duration-500" style={{ width: `${(dutyBalance.attack / 11) * 100}%` }} />
                  </div>
                </div>
              </Tooltip>

              <Tooltip text="Player movement vectors across the 5 vertical channels. Avoid overcrowding half-spaces; ensure width on both flanks." wide>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Channel Occupation</h3>
                  <ChannelOccupationPitch occupation={channelOccupation} />
                </div>
              </Tooltip>
            </div>
          )}

          {/* ── FEEDBACK TAB ── */}
          {activeTab === 'feedback' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {riskFactors.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Structural Risks
                  </h3>
                  <div className="flex flex-col gap-2">
                    {riskFactors.map((r: { message: string }, i: number) => (
                      <div key={i} className="bg-rose-500/8 p-3 rounded-lg border border-rose-500/20 flex gap-3">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-rose-200 leading-relaxed font-medium">{r.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {synergies.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Role Compatibility</h3>
                  <div className="flex flex-col gap-2">
                    {synergies.slice(0, 6).map((s: { score: number, label: string, message: string }, i: number) => {
                      const isPositive = s.score >= 70;
                      const isWarning = s.score > 40 && s.score < 70;
                      return (
                        <div key={i} className={cn(
                          "p-3 rounded-lg border flex flex-col gap-2",
                          isPositive ? "bg-emerald-500/5 border-emerald-500/20" : 
                          isWarning ? "bg-amber-500/5 border-amber-500/20" : 
                          "bg-rose-500/5 border-rose-500/20"
                        )}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isPositive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : 
                               isWarning ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> : 
                               <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{s.label}</span>
                            </div>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded",
                              isPositive ? "bg-emerald-500/20 text-emerald-500" :
                              isWarning ? "bg-amber-500/20 text-amber-500" :
                              "bg-rose-500/20 text-rose-500"
                            )}>
                              {s.score}/100
                            </span>
                          </div>
                          <p className="text-[9.5px] text-muted-foreground leading-relaxed font-medium pl-5">{s.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">General Feedback</h3>
                  <div className="flex flex-col gap-2">
                    {suggestions.map((s: { severity: string, message: string }, i: number) => (
                      <div key={i} className="bg-card p-3 rounded-lg border border-border flex gap-3 hover:border-foreground/10 transition-colors">
                        {s.severity === "critical" && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />}
                        {s.severity === "warning"  && <Info          className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                        {s.severity === "positive" && <CheckCircle2  className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />}
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{s.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </aside>
  );
}

// ── Components ────────────────────────────────────────────────────────────

function CircularProgress({ value, icon: Icon, label, colorClass, gradientFrom, gradientTo }: { value: number, icon: React.ElementType, label: string, colorClass: string, gradientFrom: string, gradientTo: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const gradientId = `grad-${label.replace(/\s+/g, '')}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-foreground/5" />
          <circle 
            cx="50" cy="50" r={radius} 
            stroke={`url(#${gradientId})`} 
            strokeWidth="6" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={cn("w-3.5 h-3.5 mb-0.5 opacity-80", colorClass)} />
          <span className="text-xl font-black text-foreground leading-none">{Math.round(value)}</span>
        </div>
      </div>
      <span className={cn("text-[9px] font-black uppercase tracking-widest text-center", colorClass)}>{label}</span>
    </div>
  );
}

function ChannelOccupationPitch({ occupation }: { occupation: { wideLeft: number, halfSpaceLeft: number, center: number, halfSpaceRight: number, wideRight: number } }) {
  return (
    <div className="relative w-full aspect-[4/3] bg-background border border-border rounded-lg overflow-hidden flex">
      {/* Background pitch markings */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 border border-foreground" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/4 border border-t-0 border-foreground" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/4 border border-b-0 border-foreground" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-foreground" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-foreground rounded-full" />
      </div>

      <MiniPitchLane label="L" value={occupation.wideLeft} max={3} />
      <MiniPitchLane label="HL" value={occupation.halfSpaceLeft} max={3} isHalfSpace />
      <MiniPitchLane label="C" value={occupation.center} max={4} />
      <MiniPitchLane label="HR" value={occupation.halfSpaceRight} max={3} isHalfSpace />
      <MiniPitchLane label="R" value={occupation.wideRight} max={3} />
    </div>
  );
}

function MiniPitchLane({ label, value, max, isHalfSpace = false }: { label: string, value: number, max: number, isHalfSpace?: boolean }) {
  const fillPercent = Math.min(100, (value / max) * 100);
  const isEmpty = value === 0;
  const isOvercrowded = value > 2;
  
  return (
    <div className={cn("flex-1 h-full relative border-r border-border last:border-r-0 flex flex-col justify-end items-center pb-2", isHalfSpace ? "bg-foreground/5" : "")}>
      <div
        className={cn(
          "absolute bottom-0 left-0 w-full transition-all duration-700 ease-out", 
          isEmpty ? "bg-transparent" : isOvercrowded ? "bg-amber-500/30" : "bg-emerald-500/30"
        )}
        style={{ height: `${fillPercent}%` }}
      />
      <div className={cn(
        "z-10 flex flex-col items-center justify-center p-1 rounded backdrop-blur-sm",
        isEmpty ? "bg-rose-500/10 text-rose-500" : isOvercrowded ? "bg-amber-500/10 text-amber-500" : "bg-background/40 text-foreground"
      )}>
        <span className="text-[10px] font-black leading-none mb-1">{value}</span>
        <span className="text-[7px] font-black uppercase opacity-70 leading-none">{label}</span>
      </div>
    </div>
  );
}

// ── Tooltip wrapper ────────────────────────────────────────────────────────────
function Tooltip({ children, text, wide = false }: { children: React.ReactNode; text: string; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const showTip = () => {
    if (!ref.current || !tipRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    tipRef.current.style.top  = `${rect.top - 8}px`;
    tipRef.current.style.left = `${rect.left}px`;
    tipRef.current.style.width = wide ? `${rect.width}px` : "200px";
    tipRef.current.style.transform = "translateY(-100%)";
    tipRef.current.style.opacity = "1";
    tipRef.current.style.pointerEvents = "none";
  };

  const hideTip = () => {
    if (!tipRef.current) return;
    tipRef.current.style.opacity = "0";
  };

  return (
    <div ref={ref} onMouseEnter={showTip} onMouseLeave={hideTip} className="cursor-help relative">
      {children}
      <div
        ref={tipRef}
        className="fixed z-[9999] p-2 bg-background border border-border rounded shadow-2xl opacity-0 transition-opacity duration-150 pointer-events-none"
      >
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
