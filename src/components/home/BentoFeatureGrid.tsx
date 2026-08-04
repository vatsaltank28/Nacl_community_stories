"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, MoveRight } from "lucide-react";
import Link from "next/link";

interface PillarItem {
  number: string;
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  iconSvg: React.ReactNode;
  gridSpan: string;
  isFeatured?: boolean;
}

const PILLARS: PillarItem[] = [
  {
    number: "01",
    title: "Kinetic Flow",
    subtitle: "Rotational Strength & Joint Mechanics",
    desc: "Unlock natural range, multi-directional joint control, and balance patterns with steel mace and animal movement jams.",
    badge: "Movement Discipline",
    gridSpan: "col-span-1 lg:col-span-2 row-span-1",
    isFeatured: true,
    iconSvg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-accent fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
        <circle cx="50" cy="50" r="38" className="opacity-20" />
        <path d="M 30 50 C 30 30, 70 70, 70 50 C 70 30, 30 70, 30 50 Z" />
        <circle cx="50" cy="50" r="8" className="fill-accent/30" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Authentic Connect",
    subtitle: "Zero-Pressure High Energy Jams",
    desc: "Meet fellow founders, athletes, creators, and professionals in a zero-pitch, high-vibe atmosphere where sweat builds genuine bonds.",
    badge: "Community Engine",
    gridSpan: "col-span-1 row-span-1 lg:row-span-2",
    iconSvg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-accent fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
        <circle cx="35" cy="35" r="14" />
        <circle cx="65" cy="35" r="14" />
        <circle cx="50" cy="70" r="16" />
        <path d="M 35 49 L 50 54 L 65 49" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Hot & Cold Recovery",
    subtitle: "Sauna Loops & Plunge Protocols",
    desc: "Integrate contrast thermal therapy, sauna breath loops, and ice plunge sessions designed to reset physical and mental limits.",
    badge: "Recovery Protocol",
    gridSpan: "col-span-1 row-span-1",
    iconSvg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-accent fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
        <path d="M 30 70 C 30 40, 70 60, 70 30" />
        <path d="M 50 20 L 50 80" />
        <path d="M 25 35 Q 50 15 75 35" />
        <circle cx="50" cy="80" r="6" className="fill-accent" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Hub Exploration",
    subtitle: "Bangalore · Mumbai · Coimbatore",
    desc: "Access localized active gatherings and curated pop-up intensive training spaces across top tier Indian fitness hubs.",
    badge: "Pan-India Network",
    gridSpan: "col-span-1 row-span-1",
    iconSvg: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-accent fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round">
        <circle cx="50" cy="45" r="22" />
        <circle cx="50" cy="45" r="8" className="fill-accent/40" />
        <path d="M 50 67 L 50 85" />
        <path d="M 35 85 L 65 85" />
      </svg>
    ),
  },
];

export default function BentoFeatureGrid() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <section className="relative bg-primary py-28 px-6 overflow-hidden border-t border-secondary/10">
      {/* Background Depth Gradient Mesh & Subtle Drifting Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(255,85,0,0.07),transparent_65%)] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Background Noise Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-accent font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <Sparkles size={14} /> The NaCl Foundation
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
              Why NaCl Exists
            </h2>
            <p className="text-additional/80 text-sm md:text-base leading-relaxed mt-4">
              We replace dull corporate networking with high-vibe physical jams, deliberate movement, and shared sweat.
            </p>
          </div>

          <Link
            href="/community"
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-secondary/10 hover:bg-accent hover:text-primary border border-secondary/15 hover:border-accent font-bold text-xs uppercase tracking-widest text-white transition-all duration-300 group"
          >
            <span>Explore Community</span>
            <MoveRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(240px,auto)]">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.215, 0.61, 0.355, 1] }}
              className={`relative group rounded-3xl p-8 bg-secondary/5 border border-secondary/10 hover:border-accent/40 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:shadow-[0_15px_40px_rgba(255,85,0,0.12)] ${pillar.gridSpan}`}
            >
              {/* Subtle top edge accent glow line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Watermark Index Number */}
              <div className="absolute -right-3 -bottom-6 font-black text-8xl md:text-9xl text-white/[0.03] group-hover:text-accent/[0.08] transition-colors duration-500 pointer-events-none select-none">
                {pillar.number}
              </div>

              {/* Card Header & Badge */}
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="p-3.5 rounded-2xl bg-primary/80 border border-secondary/15 group-hover:border-accent/40 group-hover:scale-105 transition-all duration-300 shadow-md">
                  {pillar.iconSvg}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-secondary/10 text-additional/80 border border-secondary/10 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                  {pillar.badge}
                </span>
              </div>

              {/* Card Content */}
              <div className="relative z-10 mt-auto">
                <div className="text-xs font-bold text-accent tracking-widest uppercase mb-1">
                  {pillar.subtitle}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-accent transition-colors leading-tight mb-3">
                  {pillar.title}
                </h3>
                <p className="text-xs md:text-sm text-additional/80 leading-relaxed max-w-lg">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
