"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const StoryMap = dynamic(
  () => import("@/components/story-map/StoryMap"),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-screen bg-[#070b12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 animate-pulse">
            Initializing NaCl Story Map...
          </span>
        </div>
      </div>
    ),
  }
);

export default function StoryPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#070b12] overflow-hidden pt-20">
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest border border-white/20 backdrop-blur-md transition-all"
        >
          <ArrowLeft size={16} /> Back to NaCl
        </Link>
      </div>

      <StoryMap theme="dark" accent="cyan" />
    </main>
  );
}
