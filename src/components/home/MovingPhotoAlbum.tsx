"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink, Camera, MapPin, ArrowUpRight } from "lucide-react";
import { getEvents, EventType } from "@/lib/store";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface PhotoItem {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
  instagramUrl: string;
  tagline: string;
}

const INSTAGRAM_URL = "https://www.instagram.com/nacl.in?igsh=czB0bGVkdDR6dzN6";

const DEFAULT_PHOTO_ITEMS: PhotoItem[] = [
  {
    id: "photo-1",
    title: "RawForm Movement Lab",
    location: "Bangalore · Indiranagar",
    category: "Steel Mace & JCT",
    image: "https://wwpiutgexsehvoqicydp.supabase.co/storage/v1/object/public/event-images/user_3ELaY1WvidCusp6N022FRw0w6bR/1780583942070-d2297891.png",
    instagramUrl: INSTAGRAM_URL,
    tagline: "Rotational flow & joint control session",
  },
  {
    id: "photo-2",
    title: "Steel Mace Swings & Breath",
    location: "Mumbai · Bandra",
    category: "Rotational Strength",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    instagramUrl: INSTAGRAM_URL,
    tagline: "360 swing conditioning & rhythmic breath loops",
  },
  {
    id: "photo-3",
    title: "Animal Flow Mobility Intensive",
    location: "Coimbatore · Race Course",
    category: "Outdoor Jam",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    instagramUrl: INSTAGRAM_URL,
    tagline: "Grass ground locomotion & dynamic beast transitions",
  },
  {
    id: "photo-4",
    title: "Sunset Somatics & Ice Plunge",
    location: "Bangalore · Cubbon Park",
    category: "Contrast Therapy",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    instagramUrl: INSTAGRAM_URL,
    tagline: "Nervous system resets & guided cold tubs",
  },
  {
    id: "photo-5",
    title: "Community Movement Jam",
    location: "Pan-India · Collective",
    category: "Active Culture",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    instagramUrl: INSTAGRAM_URL,
    tagline: "Zero-pressure human connection through shared sweat",
  },
  {
    id: "photo-6",
    title: "Joint Control & Mobility Loops",
    location: "Mumbai · The Nest",
    category: "Mobility Protocol",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1000&auto=format&fit=crop",
    instagramUrl: INSTAGRAM_URL,
    tagline: "Deliberate range expansion & kinetic stability",
  }
];

export default function MovingPhotoAlbum() {
  const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTO_ITEMS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    try {
      const events: EventType[] = getEvents();
      if (events && events.length > 0) {
        const dynamicPhotos: PhotoItem[] = events.map((ev, index) => ({
          id: `event-photo-${ev.id || index}`,
          title: ev.title,
          location: ev.venue || `${ev.city || "Bangalore"} Hub`,
          category: ev.category || "Movement",
          image: ev.image || DEFAULT_PHOTO_ITEMS[index % DEFAULT_PHOTO_ITEMS.length].image,
          instagramUrl: INSTAGRAM_URL,
          tagline: ev.description?.slice(0, 75) + "..." || "Live active culture gathering",
        }));

        const merged = [...dynamicPhotos, ...DEFAULT_PHOTO_ITEMS];
        const unique = merged.filter((item, idx, self) => 
          self.findIndex(t => t.image === item.image) === idx
        );
        setPhotos(unique);
      }
    } catch {
      // Keep defaults
    }
  }, []);

  const row1 = useMemo(() => photos.slice(0, Math.ceil(photos.length / 2)), [photos]);
  const row2 = useMemo(() => photos.slice(Math.ceil(photos.length / 2)), [photos]);

  const infiniteRow1 = useMemo(() => [...row1, ...row1, ...row1, ...row1], [row1]);
  const infiniteRow2 = useMemo(() => [...row2, ...row2, ...row2, ...row2], [row2]);

  return (
    <section className="relative bg-[#0A0A0A] py-24 md:py-32 overflow-hidden border-t border-[#f0f2db]/10 font-body text-[#f0f2db]">
      {/* Background Ambience & Lighting Glows with Exact Palette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(239,84,42,0.08),transparent_70%)]" />
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#ffd139]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] bg-[#aadeef]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Grid Dot Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #f0f2db 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <div className="text-[#ffd139] font-body font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <Camera size={14} className="text-[#ef542a]" />
              <span>Captured Moments · Life at NaCl</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-header font-extrabold tracking-tight text-[#f0f2db] leading-none">
              Movement <span className="font-highlight text-[#ef542a] tracking-normal">In Motion</span>
            </h2>
            <p className="text-[#f0f2db]/80 font-body text-sm md:text-base leading-relaxed mt-4">
              Real scenes from our high-vibe jams, steel mace intensives, sauna loops, and active gatherings. Click any moment to explore on Instagram.
            </p>
          </div>

          {/* Instagram Link CTA Button */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#ef542a] hover:bg-[#ffd139] text-[#232323] font-header font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(239,84,42,0.25)] hover:shadow-[0_0_35px_rgba(255,209,57,0.4)] group shrink-0"
          >
            <InstagramIcon className="w-4 h-4 text-[#232323]" />
            <span>Follow @nacl.in</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Moving Photo Album Rows Container */}
      <div 
        className="relative space-y-6 md:space-y-8 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Row 1: Drifts to Left */}
        <div className="flex overflow-hidden">
          <div 
            className={`flex gap-5 md:gap-7 shrink-0 animate-marquee ${isPaused ? "pause-animation" : ""}`}
            style={{
              animationDuration: "38s",
            }}
          >
            {infiniteRow1.map((item, idx) => (
              <PhotoCard key={`r1-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Drifts to Right */}
        <div className="flex overflow-hidden">
          <div 
            className={`flex gap-5 md:gap-7 shrink-0 animate-marquee-reverse ${isPaused ? "pause-animation" : ""}`}
            style={{
              animationDuration: "44s",
            }}
          >
            {infiniteRow2.map((item, idx) => (
              <PhotoCard key={`r2-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Edge Gradient Mask Overlays for Ultra-smooth Fade */}
        <div className="absolute top-0 bottom-0 left-0 w-20 md:w-36 bg-gradient-to-r from-[#232323] via-[#232323]/80 to-transparent pointer-events-none z-20" />
        <div className="absolute top-0 bottom-0 right-0 w-20 md:w-36 bg-gradient-to-l from-[#232323] via-[#232323]/80 to-transparent pointer-events-none z-20" />
      </div>

      {/* Interactive Helper Caption */}
      <div className="mt-8 text-center font-body">
        <p className="text-[11px] uppercase tracking-widest text-[#f0f2db]/50 flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-[#ffd139]" />
          <span>Hover or tap to pause · Click any photo to view @nacl.in on Instagram</span>
        </p>
      </div>

      {/* Custom CSS for Smooth Infinite Continuous Marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 36s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 40s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}

// Individual Photo Album Card Component
function PhotoCard({ item }: { item: PhotoItem }) {
  return (
    <a
      href={item.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-[280px] sm:w-[340px] md:w-[380px] h-[240px] sm:h-[280px] md:h-[300px] rounded-3xl overflow-hidden bg-[#232323]/80 border border-[#f0f2db]/15 hover:border-[#ef542a]/70 transition-all duration-500 shadow-lg hover:shadow-[0_15px_45px_rgba(239,84,42,0.25)] shrink-0 cursor-pointer"
      title={`Open ${item.title} on Instagram`}
    >
      {/* Background Image with Zoom on Hover */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Dynamic Ambient Gradient Shade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#232323]/95 via-[#232323]/40 to-transparent group-hover:via-[#232323]/25 transition-all duration-500" />

      {/* Top Badges (Category & Instagram Pill) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-body font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#232323]/80 backdrop-blur-md text-[#ffd139] border border-[#ffd139]/40 shadow-md">
          {item.category}
        </span>

        <span className="flex items-center gap-1 text-[10px] font-body font-bold px-2.5 py-1 rounded-full bg-[#ef542a] text-[#232323] backdrop-blur-md shadow-md group-hover:scale-105 transition-transform">
          <InstagramIcon className="w-3 h-3 text-[#232323]" />
          <span>@nacl.in</span>
        </span>
      </div>

      {/* Bottom Information Card Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col justify-end">
        <div className="flex items-center gap-1.5 text-[11px] font-body font-semibold text-[#f0f2db]/80 mb-1">
          <MapPin size={12} className="text-[#ef542a] shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-header font-black text-[#f0f2db] group-hover:text-[#ef542a] transition-colors leading-tight line-clamp-1">
          {item.title}
        </h3>

        <p className="text-xs font-body text-[#f0f2db]/75 line-clamp-1 mt-1 font-medium group-hover:text-[#f0f2db] transition-colors">
          {item.tagline}
        </p>

        {/* Hover Action Strip */}
        <div className="mt-3 pt-2.5 border-t border-[#f0f2db]/10 flex items-center justify-between text-[11px] font-header font-bold text-[#ef542a] opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1">
            View on Instagram
          </span>
          <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Card Border Glow on Hover */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#ef542a]/40 transition-colors pointer-events-none" />
    </a>
  );
}
