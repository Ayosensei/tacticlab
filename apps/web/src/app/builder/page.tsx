"use client";

import { Pitch } from "@/components/pitch/Pitch";

export default function BuilderPage() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-[#0d0f14] overflow-hidden relative">
      {/* Subtle background decoration to match reference frames */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
      
      {/* The main pitch is the hero, taking center stage */}
      <Pitch />
    </div>
  );
}
