"use client";

import { Search, Flame, Star, ChevronDown, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  return (
    <div className="h-full w-full bg-[#0a0c10] overflow-y-auto text-white">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-8 pt-12 pb-8">
        <div className="flex items-end justify-between mb-16">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black uppercase tracking-[0.1em]">Tactical Library</h1>
            <p className="text-muted-foreground text-sm">Explore, analyze, and deploy high-performance tactical systems from the global community.</p>
          </div>
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tactics, creators..." 
              className="w-full bg-[#12141a] border border-white/5 rounded-md h-12 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-400/50 transition-colors placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Trending Section */}
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest">Trending Systems</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-16">
          <TrendingCard 
            title="Klopp Kinetic V2" 
            formation="4-3-3 Gegenpress" 
            rating={4.9} 
            tags={["High Line", "Attacking"]}
            colorTheme="emerald"
            action="use"
          />
          <TrendingCard 
            title="Pep Fluidity" 
            formation="3-2-4-1 Positional" 
            rating={4.8} 
            tags={["Possession", "Patient"]}
            colorTheme="indigo"
            action="view"
          />
          <TrendingCard 
            title="Deep Block Plus" 
            formation="5-3-2 Catenaccio" 
            rating={4.7} 
            tags={["Defensive", "Counter"]}
            colorTheme="rose"
            action="view"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
          <div className="flex gap-4">
            <FilterDropdown label="Formation" />
            <FilterDropdown label="Style" />
            <FilterDropdown label="Rating" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Sort by:</span>
            <FilterDropdown label="Highest Rated" solid />
          </div>
        </div>

        {/* Standard Grid */}
        <div className="grid grid-cols-4 gap-6 pb-20">
          <StandardCard 
            title="4-2-3-1 WIDE" 
            desc="Direct counter-attacking system." 
            rating={4.5} 
            tag="Counter"
            dots={[
              [50, 85], // G
              [20, 70], [35, 75], [65, 75], [80, 70], // Def
              [40, 50], [60, 50], // DM
              [20, 35], [50, 30], [80, 35], // AM
              [50, 15] // CF
            ]}
          />
          <StandardCard 
            title="3-4-2-1 ASYMMETRIC" 
            desc="Overload one flank to create space." 
            rating={4.2} 
            tag="Overload"
            dots={[
              [50, 85],
              [30, 75], [50, 75], [70, 75],
              [20, 50], [40, 50], [60, 50], [80, 50],
              [35, 30], [65, 30],
              [50, 15]
            ]}
          />
          <StandardCard 
            title="4-4-2 CLASSIC" 
            desc="Solid banks of four, target man up top." 
            rating={4.0} 
            tag="Direct"
            dots={[
              [50, 85],
              [20, 70], [40, 70], [60, 70], [80, 70],
              [20, 45], [40, 45], [60, 45], [80, 45],
              [40, 20], [60, 20]
            ]}
          />
          <StandardCard 
            title="5-4-1 PARK BUS" 
            desc="Extreme defensive solidity." 
            rating={3.8} 
            tag="Defensive"
            dots={[
              [50, 90],
              [15, 75], [30, 80], [50, 80], [70, 80], [85, 75],
              [20, 55], [40, 60], [60, 60], [80, 55],
              [50, 30]
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function TrendingCard({ title, formation, rating, tags, colorTheme, action }: { title: string, formation: string, rating: number, tags: string[], colorTheme: "emerald" | "indigo" | "rose", action: "use" | "view" }) {
  const isEmerald = colorTheme === "emerald";
  
  return (
    <div className="bg-[#12141a] border border-white/5 rounded-lg flex flex-col overflow-hidden hover:border-white/10 transition-colors shadow-xl group">
      <div className="p-5 pb-2">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">{formation}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-white fill-white" />
            <span className="text-xs font-bold">{rating}</span>
          </div>
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight mb-4">{title}</h3>
      </div>
      
      {/* Mini Pitch Area */}
      <div className="relative h-40 bg-[#0d0f14] mx-5 mb-4 rounded-md border border-white/5 overflow-hidden flex items-center justify-center">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] ${isEmerald ? 'from-emerald-500/10' : colorTheme === 'indigo' ? 'from-indigo-500/10' : 'from-rose-500/10'} to-transparent opacity-50`} />
        {/* Simple grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        <svg viewBox="0 0 100 60" className="w-3/4 h-3/4 opacity-20">
          <rect x="0" y="0" width="100" height="60" fill="none" stroke="white" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="60" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.5" />
          <rect x="0" y="15" width="15" height="30" fill="none" stroke="white" strokeWidth="0.5" />
          <rect x="85" y="15" width="15" height="30" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="px-5 pb-5 flex flex-col flex-1 justify-end">
        <div className="flex gap-2 mb-4">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-[#1a1d25] rounded text-[9px] uppercase font-bold tracking-widest text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        
        {action === "use" ? (
          <Button className="w-full bg-[#162a22] hover:bg-[#1a382b] border border-emerald-500/30 text-[10px] uppercase font-bold tracking-widest text-emerald-400 gap-2">
            Use This Tactic <Download className="w-3 h-3" />
          </Button>
        ) : (
          <Button variant="outline" className="w-full border-white/5 hover:bg-white/5 text-[10px] uppercase font-bold tracking-widest gap-2 bg-[#0d0f14]">
            View Details <Eye className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ label, solid }: { label: string, solid?: boolean }) {
  return (
    <button className={`flex items-center gap-3 px-4 py-2 ${solid ? 'bg-[#12141a]' : 'bg-[#0d0f14]'} border border-white/5 hover:bg-white/5 rounded transition-colors text-[11px] font-bold uppercase tracking-widest`}>
      {label}
      <ChevronDown className="w-3 h-3 text-muted-foreground" />
    </button>
  );
}

function StandardCard({ title, desc, rating, tag, dots }: { title: string, desc: string, rating: number, tag: string, dots: number[][] }) {
  return (
    <div className="bg-[#12141a] border border-white/5 rounded-lg flex flex-col overflow-hidden hover:border-white/10 transition-colors shadow-lg">
      <div className="h-40 bg-[#0d0f14] border-b border-white/5 relative flex items-center justify-center p-4">
        {/* Faint crosshair bg like the reference */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-px bg-white/50" />
          <div className="h-full w-px bg-white/50 absolute" />
        </div>
        <div className="absolute w-8 h-8 rounded border border-white/10 flex items-center justify-center opacity-20 bg-[#12141a]">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
        </div>
        
        {/* Geometric representation of formation */}
        <div className="relative w-full h-full max-w-[120px] mx-auto z-10">
          {dots.map((dot, i) => (
            <div 
              key={i} 
              className="absolute w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ 
                left: `${dot[0]}%`, 
                top: `${dot[1]}%`,
                backgroundColor: i === 0 ? '#fb923c' : i < 5 ? '#a78bfa' : i < 9 ? '#34d399' : '#f87171',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black tracking-widest uppercase">{title}</h4>
          <div className="flex items-center gap-1">
            <Star className="w-2 h-2 text-white fill-white" />
            <span className="text-[10px] font-bold">{rating}</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
        <div className="mt-2">
          <span className="px-2 py-1 bg-[#1a1d25] rounded text-[8px] uppercase font-bold tracking-widest text-slate-300">
            {tag}
          </span>
        </div>
        <Button variant="outline" className="w-full mt-4 border-white/5 hover:bg-white/5 text-[9px] uppercase font-bold tracking-widest bg-[#0d0f14] h-8">
          Use Tactic
        </Button>
      </div>
    </div>
  );
}
