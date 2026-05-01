"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Cpu, Info, AlertTriangle, CheckCircle2, ShieldAlert, Navigation, Swords, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTacticStore } from "@/store/tacticStore";

const MIN_WIDTH = 240;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 320;

export function AIAnalysisPanel() {
  const { analysis, isLoading } = useTacticStore();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [width]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.clientX; // dragging left = wider
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + delta));
    setWidth(newWidth);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  if (!analysis) {
    return (
      <aside
        className="border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] items-center justify-center p-8 text-center relative"
        style={{ width }}
      >
        <Cpu className="w-8 h-8 text-emerald-500/20 mb-4 animate-pulse" />
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50">Initializing Tactical Engine...</p>
        {/* Drag Handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-indigo-500/40 active:bg-indigo-500/60 transition-colors group"
          title="Drag to resize"
        />
      </aside>
    );
  }

  const a = analysis as any;
  const tacticalNarrative     = a.tacticalNarrative     as string  ?? "";
  const inPossessionRating    = a.inPossessionRating    as number  ?? 0;
  const outOfPossessionRating = a.outOfPossessionRating as number  ?? 0;
  const channelOccupation     = a.channelOccupation;
  const restDefenceStructure  = a.restDefenceStructure  as string  ?? "";
  const buildUpStructure      = a.buildUpStructure      as string  ?? "";
  const dutyBalance           = a.dutyBalance           ?? { defend:0, support:0, attack:0 };
  const penetration           = a.penetration           as number  ?? 0;
  const solidity              = a.solidity              as number  ?? 0;
  const suggestions           = analysis.suggestions    ?? [];
  const synergies             = a.synergies             ?? [];
  const riskFactors           = a.riskFactors           ?? [];

  if (!channelOccupation) {
    return (
      <aside className="w-80 border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 items-center justify-center p-8 text-center">
        <p className="text-xs text-amber-500 font-bold">Awaiting structural update...</p>
      </aside>
    );
  }

  return (
    <aside
      className="border-l border-white/5 bg-[#0a0c10] flex flex-col h-[calc(100vh-80px)] overflow-y-auto shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] relative"
      style={{ width }}
    >
      {/* Drag Handle — left edge */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-indigo-500/40 active:bg-indigo-500/60 transition-colors z-50 group"
        title="Drag to resize"
      >
        {/* Visual indicator dots */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-0.5 h-1 rounded-full bg-indigo-400" />
          <div className="w-0.5 h-1 rounded-full bg-indigo-400" />
          <div className="w-0.5 h-1 rounded-full bg-indigo-400" />
        </div>
      </div>
      <div className="p-6 flex flex-col gap-7 h-full">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <h2 className="text-white font-black text-lg tracking-[0.1em] uppercase">Analysis</h2>
            </div>
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.15em] opacity-50">
              {isLoading ? "Recalculating..." : "Tactical Engine v2"}
            </span>
          </div>
          <div className="bg-[#4f46e510] border border-indigo-500/20 px-2 py-1 rounded">
            <span className="text-[10px] font-black text-indigo-400">LIVE</span>
          </div>
        </div>

        {/* ── Tactical Narrative ── */}
        {tacticalNarrative && (
          <div className="bg-gradient-to-br from-[#12141a] to-[#0d0f14] p-4 rounded-xl border border-white/8 shadow-lg">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2 block">Tactical Summary</span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{tacticalNarrative}</p>
          </div>
        )}

        {/* ── Phase Ratings ── */}
        <div className="grid grid-cols-2 gap-2 relative group cursor-help">
          <div className="absolute bottom-full left-0 mb-2 w-full p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            <p className="text-[10px] text-slate-300 font-medium">Ratings for each phase of play — how effective your tactic is with and without the ball. Affected by mentality, instructions, and player roles.</p>
          </div>
          <div className="bg-[#12141a] p-3 rounded-xl border border-emerald-500/15 flex flex-col gap-2 shadow-lg">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Swords className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">In Possession</span>
            </div>
            <span className="text-3xl font-black text-white leading-none">{Math.round(inPossessionRating)}</span>
            <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${inPossessionRating}%` }} />
            </div>
          </div>
          <div className="bg-[#12141a] p-3 rounded-xl border border-indigo-500/15 flex flex-col gap-2 shadow-lg">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Shield className="w-3 h-3 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Out of Poss.</span>
            </div>
            <span className="text-3xl font-black text-white leading-none">{Math.round(outOfPossessionRating)}</span>
            <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${outOfPossessionRating}%` }} />
            </div>
          </div>
        </div>

        {/* ── DNA Scores ── */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#12141a] p-3 rounded-xl border border-white/5 flex flex-col gap-2 relative group cursor-help">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
              <p className="text-[10px] text-slate-300 font-medium">How well this tactic attacks space. Driven by attack duties, overlaps, and mentality.</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Penetration</span>
              <span className="text-sm font-black text-white">{Math.round(penetration)}</span>
            </div>
            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${penetration}%` }} />
            </div>
          </div>
          <div className="bg-[#12141a] p-3 rounded-xl border border-white/5 flex flex-col gap-2 relative group cursor-help">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
              <p className="text-[10px] text-slate-300 font-medium">How well this tactic protects space. Driven by defend duties, pivots, and rest defence structure.</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Solidity</span>
              <span className="text-sm font-black text-white">{Math.round(solidity)}</span>
            </div>
            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${solidity}%` }} />
            </div>
          </div>
        </div>

        {/* ── Duty Balance ── */}
        <div className="flex flex-col gap-2 relative group cursor-help">
          <div className="absolute bottom-full left-0 mb-2 w-full p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
            <p className="text-[10px] text-slate-300 font-medium">The D/S/A ratio. Aim for ~4 Defend, ~4 Support, ~3 Attack for a balanced tactic.</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Duty Balance</span>
            <div className="flex gap-2 text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-400">{dutyBalance.defend}D</span>
              <span className="text-emerald-400">{dutyBalance.support}S</span>
              <span className="text-amber-400">{dutyBalance.attack}A</span>
            </div>
          </div>
          <div className="flex h-2 w-full rounded-full overflow-hidden border border-white/5">
            <div className="bg-slate-600 transition-all duration-500" style={{ width: `${(dutyBalance.defend / 11) * 100}%` }} />
            <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(dutyBalance.support / 11) * 100}%` }} />
            <div className="bg-amber-500 transition-all duration-500" style={{ width: `${(dutyBalance.attack / 11) * 100}%` }} />
          </div>
        </div>

        {/* ── Shape Metrics ── */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#12141a] p-3 rounded-xl border border-white/5 flex flex-col gap-1 relative group cursor-help">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <p className="text-[10px] text-slate-300 font-medium">Players staying back while in possession. Aim for at least 4.</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-emerald-500" /> Rest Defence
            </span>
            <span className="text-2xl font-black text-white tracking-tighter">{restDefenceStructure}</span>
          </div>
          <div className="bg-[#12141a] p-3 rounded-xl border border-white/5 flex flex-col gap-1 relative group cursor-help">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <p className="text-[10px] text-slate-300 font-medium">Deep player structure (Defenders-Pivots). A 3-2 or 4-1 is ideal for playing through a press.</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400" /> Build-Up
            </span>
            <span className="text-2xl font-black text-white tracking-tighter">{buildUpStructure}</span>
          </div>
        </div>

        {/* ── Channel Occupation ── */}
        <div className="flex flex-col gap-3 relative group cursor-help">
          <div className="absolute bottom-full left-0 mb-2 w-full p-2 bg-[#0a0c10] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            <p className="text-[10px] text-slate-300 font-medium">Player movement vectors across the 5 vertical channels. Avoid overcrowding half-spaces; ensure width on both flanks.</p>
          </div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] group-hover:text-white transition-colors">Channel Occupation</h3>
          <div className="flex h-20 gap-1 w-full bg-[#050608] border border-white/5 rounded-md p-2">
            <ChannelBar label="L"  value={channelOccupation.wideLeft}       max={3} />
            <ChannelBar label="HL" value={channelOccupation.halfSpaceLeft}   max={3} isHalfSpace />
            <ChannelBar label="C"  value={channelOccupation.center}          max={4} />
            <ChannelBar label="HR" value={channelOccupation.halfSpaceRight}  max={3} isHalfSpace />
            <ChannelBar label="R"  value={channelOccupation.wideRight}       max={3} />
          </div>
        </div>

        {/* ── Structural Risks (contradictions + positional) ── */}
        {riskFactors.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Structural Risks
            </h3>
            <div className="flex flex-col gap-2">
              {riskFactors.map((r: any, i: number) => (
                <div key={i} className="bg-rose-500/8 p-3 rounded-lg border border-rose-500/20 flex gap-3 shadow-[0_0_15px_rgba(244,63,94,0.08)]">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-rose-200 leading-relaxed font-semibold">{r.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Role Compatibility ── */}
        {synergies.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Role Compatibility</h3>
            <div className="flex flex-col gap-2">
              {synergies.slice(0, 4).map((s: any, i: number) => (
                <div key={i} className={cn(
                  "p-2.5 rounded-lg border flex items-center gap-2.5",
                  s.type === "positive"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                )}>
                  {s.type === "positive"
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  }
                  <p className="text-[10px] text-slate-300 font-semibold tracking-tight">{s.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── General Feedback ── */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">General Feedback</h3>
            <div className="flex flex-col gap-2">
              {suggestions.map((s: any, i: number) => (
                <div key={i} className="bg-[#12141a] p-3 rounded-lg border border-white/5 flex gap-3 hover:border-white/10 transition-colors">
                  {s.severity === "critical" && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />}
                  {s.severity === "warning"  && <Info          className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                  {s.severity === "positive" && <CheckCircle2  className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                  <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">{s.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}

function ChannelBar({ label, value, max, isHalfSpace = false }: { label: string, value: number, max: number, isHalfSpace?: boolean }) {
  const fillPercent = Math.min(100, (value / max) * 100);
  const isEmpty = value === 0;
  const isOvercrowded = value > 2;
  return (
    <div className={cn("flex-1 flex flex-col justify-end items-center relative rounded-sm overflow-hidden", isHalfSpace ? "bg-[#ffffff03]" : "bg-[#ffffff01]")}>
      <div
        className={cn("w-full transition-all duration-700 ease-out absolute bottom-0", isEmpty ? "bg-transparent" : isOvercrowded ? "bg-amber-500/40" : "bg-emerald-500/40")}
        style={{ height: `${fillPercent}%` }}
      />
      <span className="text-[8px] font-black uppercase text-slate-500 mb-1 z-10">{label}</span>
      <span className={cn("text-[10px] font-black z-10 mb-1.5", isEmpty ? "text-rose-500" : isOvercrowded ? "text-amber-400" : "text-white")}>{value}</span>
    </div>
  );
}
