"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Star, Sparkles, Quote } from "lucide-react";

export interface ReviewItem {
  id: string;
  reviewerName: string;
  eventId: string;
  eventName: string;
  city: string;
  rating: number;
  reviewText: string;
  eventImage?: string;
  status?: string;
  createdAt: string;
}

interface ReviewStoryPanelProps {
  city: string | null;
  reviews: ReviewItem[];
  onClose: () => void;
  accentColor?: string;
}

export default function ReviewStoryPanel({
  city,
  reviews,
  onClose,
  accentColor = "#ff6b00"
}: ReviewStoryPanelProps) {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (city && reviews.length > 0) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [city, reviews, onClose]);

  if (!city || reviews.length === 0) return null;

  return (
    <AnimatePresence>
      {city && reviews.length > 0 && (
        <div className="fixed inset-0 z-[100] flex justify-end items-end md:items-stretch pointer-events-none">
          {/* Click-outside backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm pointer-events-auto"
          />

          {/* Panel Drawer (Right Drawer on Desktop, Bottom Sheet on Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 100, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 100, x: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="pointer-events-auto w-full md:w-[460px] max-h-[85vh] md:max-h-full h-auto md:h-full bg-[#05080f]/92 backdrop-blur-2xl border-t md:border-l md:border-t-0 border-white/15 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-[0_0_60px_rgba(0,0,0,0.9)] z-10"
          >
            <div>
              {/* Header bar */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    {city} Hub · Community Stories ({reviews.length})
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
                  aria-label="Close story panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Review Cards List (Clustered Support) */}
              <div className="mt-6 space-y-6">
                {reviews.map((rev) => {
                  const formattedDate = rev.createdAt
                    ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 relative hover:border-white/20 transition-colors space-y-3"
                    >
                      {/* Event Cover Image if available */}
                      {rev.eventImage && (
                        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rev.eventImage}
                            alt={rev.eventName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1">
                              <MapPin size={10} className="text-cyan-400" />
                              {rev.city}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1">
                              <Calendar size={10} className="text-white/70" />
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Anonymous Reviewer Header */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-white tracking-tight">
                            NaCl Community Member
                          </h4>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            Anonymous
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={12} />
                        {rev.eventName}
                      </p>

                      {/* Review Quote */}
                      <div className="relative pt-1">
                        <Quote size={18} className="text-white/10 absolute top-0 right-0" />
                        <p className="text-xs md:text-sm text-white/90 leading-relaxed font-sans italic relative z-10">
                          &ldquo;{rev.reviewText}&rdquo;
                        </p>
                      </div>

                      {!rev.eventImage && (
                        <div className="pt-2 flex items-center gap-3 text-[11px] text-white/50 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-cyan-400" />
                            {rev.city} Hub
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formattedDate}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Verified NaCl Movement Experiences
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
