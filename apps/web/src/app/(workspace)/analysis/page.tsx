"use client";

import { Pitch } from "@/components/pitch/Pitch";
import { AIAnalysisPanel } from "@/components/analysis/AIAnalysisPanel";

export default function AnalysisPage() {
  return (
    <div className="flex h-full w-full bg-[#0d0f14] overflow-hidden text-white relative">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
      
      {/* Scrollable Pitch Area */}
      <div className="flex-1 overflow-y-auto relative z-10 py-12 px-6">
        <Pitch />
      </div>

      {/* Static AI Analysis Panel */}
      <AIAnalysisPanel />
    </div>
  );
}
