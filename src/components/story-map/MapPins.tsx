"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewItem } from "./ReviewStoryPanel";

// Calibrated CSS percentage coordinates relative to Map_image.jpeg (3D isometric map)
export const CITY_PERCENTAGE_COORDINATES: Record<string, { top: string; left: string }> = {
  Mumbai: { top: "52.5%", left: "35%" },
  Bangalore: { top: "70.5%", left: "44%" },
  Bengaluru: { top: "70.5%", left: "44%" },
  Coimbatore: { top: "76.5%", left: "42.5%" },
  Delhi: { top: "35%", left: "40.5%" },
  Goa: { top: "60.5%", left: "36%" },
};

interface MapPinsProps {
  groupedReviews: Record<string, ReviewItem[]>;
  onSelectCity: (city: string, reviews: ReviewItem[]) => void;
  accentColor?: string;
  glowColor?: string;
}

export default function MapPins({
  groupedReviews,
  onSelectCity,
  accentColor = "#ff6b00", // NaCl brand orange for contrast
  glowColor = "#00e5ff"
}: MapPinsProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }
  }, []);

  const cities = Object.keys(groupedReviews);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 select-none">
      {cities.map((city, index) => {
        const coords = CITY_PERCENTAGE_COORDINATES[city];
        if (!coords) return null;

        const cityReviews = groupedReviews[city];
        const mainReview = cityReviews[0];
        const count = cityReviews.length;
        const isHovered = hoveredCity === city;

        return (
          <div
            key={`pin-${city}`}
            style={{ top: coords.top, left: coords.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
            onClick={() => onSelectCity(city, cityReviews)}
            onMouseEnter={() => setHoveredCity(city)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            {/* Soft Pulsing Ring */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-0 -m-3 rounded-full border-2 animate-ping opacity-60 pointer-events-none"
                style={{
                  borderColor: accentColor,
                  animationDuration: "2.8s",
                }}
              />
            )}

            {/* Ambient Halo */}
            <div
              className="absolute inset-0 -m-3.5 rounded-full blur-md opacity-30 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            {/* Staggered Wave Reveal Wrapper */}
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 0.3, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: prefersReducedMotion ? 0 : index * 0.15,
                ease: "easeOut",
              }}
              className="relative flex items-center justify-center"
            >
              {/* Core Orange Pin Dot */}
              <div
                className={`rounded-full border-2 border-black flex items-center justify-center transition-transform duration-300 group-hover:scale-125 ${
                  count > 1 ? "w-6 h-6" : "w-4.5 h-4.5"
                }`}
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 12px ${accentColor}`,
                }}
              >
                {count > 1 && (
                  <span className="text-[10px] font-black text-white leading-none">
                    {count}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Hover Tooltip Card */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none z-50 whitespace-nowrap px-3.5 py-2 rounded-xl bg-[#050810]/95 border border-cyan-400/50 shadow-[0_4px_25px_rgba(0,0,0,0.9)] text-left"
                >
                  <div className="text-xs font-extrabold text-white">
                    {city} · NaCl Community Member
                  </div>
                  <div className="text-[11px] font-bold text-accent">
                    ★ {mainReview.rating}.0 — {mainReview.eventName.slice(0, 22)}...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
