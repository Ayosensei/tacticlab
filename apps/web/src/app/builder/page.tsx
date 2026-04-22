"use client";

import { Pitch } from "@/components/pitch/Pitch";

export default function BuilderPage() {
  return (
    <div className="h-full w-full bg-[#0d0f14] overflow-y-auto relative text-white">
      {/* Subtle background decoration to match reference frames */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
      
      {/* Main Pitch Area */}
      <div className="w-full min-h-full py-12 px-6 flex flex-col items-center justify-start relative z-10">
        <Pitch />
      </div>
    </div>
  );
}
