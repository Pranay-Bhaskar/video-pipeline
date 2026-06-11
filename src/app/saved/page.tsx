"use client";

import { Bookmark } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

export default function SavedPage() {
  return (
    <div className="min-h-dvh bg-[#0d0d16] pb-24">
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-xl font-bold text-white">Saved</h1>
        <p className="text-sm text-[#555577] mt-1">Your saved places and videos</p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1e1e2e] flex items-center justify-center mb-4">
          <Bookmark className="w-8 h-8 text-[#2a2a3e]" />
        </div>
        <h2 className="text-base font-semibold text-white mb-2">Nothing saved yet</h2>
        <p className="text-sm text-[#555577]">
          Tap the bookmark icon on any video to save it here for later.
        </p>
        <div className="mt-4 bg-[#161622] border border-[#2a2a3e] rounded-xl px-4 py-2.5">
          <p className="text-xs text-[#a78bfa]">💡 Coming in V2: Full saved places + itinerary builder</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
