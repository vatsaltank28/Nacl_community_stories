"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Zap, MapPin, Flame } from "lucide-react";

interface StatItem {
  numericValue: number;
  prefix?: string;
  suffix: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  isPrimary?: boolean;
}

const STATS: StatItem[] = [
  {
    numericValue: 1200,
    suffix: "+",
    label: "Active Members",
    sublabel: "Founders, Athletes & Creators",
    icon: <Users size={22} className="text-[#232323]" />,
    isPrimary: true,
  },
  {
    numericValue: 85,
    suffix: "+",
    label: "Intensive Sessions",
    sublabel: "Mace, Flow & Plunge Jams",
    icon: <Zap size={22} className="text-[#232323]" />,
  },
  {
    numericValue: 3,
    suffix: " Hubs",
    label: "Active Cities",
    sublabel: "BLR · BOM · CJB",
    icon: <MapPin size={22} className="text-[#232323]" />,
  },
  {
    numericValue: 100,
    suffix: "%",
    label: "Pure Energy",
    sublabel: "Zero Pitch · High Vibe",
    icon: <Flame size={22} className="text-[#232323]" />,
  },
];

function CountUpNumber({ target, suffix, isPrimary, reducedMotion }: { target: number; suffix: string; isPrimary?: boolean; reducedMotion: boolean }) {
  const [count, setCount] = useState(reducedMotion ? target : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (reducedMotion || !isInView) return;

    let startTime: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, reducedMotion]);

  const formatted = count >= 1000 ? count.toLocaleString("en-US") : count;

  return (
    <span ref={ref} className={`font-header ${isPrimary ? "text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter" : "text-4xl md:text-5xl font-extrabold tracking-tight"}`}>
      {formatted}
      {suffix}
    </span>
  );
}

export default function AnimatedStatsBar() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <section className="relative py-20 bg-[#0A0A0A] overflow-hidden font-body">
      {/* Angle-Skewed Brand Gradient Sunset -> Sand Container */}
      <div 
        className="relative max-w-7xl mx-auto bg-gradient-to-r from-[#ef542a] via-[#ffd139] to-[#ef542a] text-[#232323] shadow-2xl overflow-hidden py-12 md:py-16 px-6 md:px-12"
        style={{
          clipPath: "polygon(0 4%, 100% 0%, 100% 96%, 0 100%)",
        }}
      >
        {/* Fine Diagonal Pattern Texture Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #232323 0, #232323 2px, transparent 0, transparent 12px)`,
          }}
        />

        {/* Ambient Glow Soft Reflection */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#f0f2db]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Grid layout with vertical dark dividers */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#232323]/20">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col justify-between items-center text-center p-4 lg:px-8 ${stat.isPrimary ? "lg:scale-105" : ""}`}
            >
              {/* Top Icon Badge */}
              <div className="w-10 h-10 rounded-xl bg-[#232323]/10 border border-[#232323]/20 flex items-center justify-center mb-3 shadow-inner">
                {stat.icon}
              </div>

              {/* Animated Count-up Value */}
              <div className="text-[#232323] mb-1">
                <CountUpNumber
                  target={stat.numericValue}
                  suffix={stat.suffix}
                  isPrimary={stat.isPrimary}
                  reducedMotion={reducedMotion}
                />
              </div>

              {/* Label & Sublabel */}
              <div>
                <div className="text-xs font-header font-black uppercase tracking-widest text-[#232323]/95">
                  {stat.label}
                </div>
                <div className="text-[10px] font-body font-bold tracking-wider text-[#232323]/70 mt-0.5 uppercase">
                  {stat.sublabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
