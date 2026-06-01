"use client";

import { Pitch } from "@/components/pitch/Pitch";
import { AIAnalysisPanel } from "@/components/analysis/AIAnalysisPanel";

export default function AnalysisPage() {
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#0d0f14] overflow-y-auto md:overflow-hidden text-white relative">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
      
      {/* Scrollable Pitch Area */}
      <div className="flex-1 overflow-visible md:overflow-y-auto relative z-10 py-4 px-2 md:py-12 md:px-6 shrink-0 md:shrink">
        <Pitch />
      </div>

      {/* Static AI Analysis Panel */}
      <AIAnalysisPanel />
    </div>
  );
}
