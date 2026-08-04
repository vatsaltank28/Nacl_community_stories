"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-primary text-secondary text-center">
      <div className="w-full max-w-md bg-secondary/5 border border-secondary/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Something went wrong</h2>
          <p className="text-xs text-additional/80 leading-relaxed">
            An unhandled system error occurred. You can retry the operation or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 bg-accent text-primary hover:bg-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Try Again
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-secondary/10 hover:bg-secondary/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-secondary/20"
          >
            <ArrowLeft size={14} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
