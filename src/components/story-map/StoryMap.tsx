"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, RotateCcw } from "lucide-react";

import MapPins from "./MapPins";
import ReviewStoryPanel, { ReviewItem } from "./ReviewStoryPanel";
import AddReviewModal from "./AddReviewModal";

interface StoryMapProps {
  theme?: "dark" | "light";
  accent?: "orange" | "cyan" | "violet";
}

export default function StoryMap({
  accent = "cyan"
}: StoryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State
  const [stage, setStage] = useState<"stage1" | "stage2">("stage1");
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCityReviews, setSelectedCityReviews] = useState<ReviewItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const accentColor = "#ff6b00"; // Orange pins for contrast

  // Fetch reviews on mount
  useEffect(() => {
    async function loadReviews() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch (err) {
        console.warn("Failed to load reviews:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, []);

  // Check prefers-reduced-motion and sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sessionSeen = sessionStorage.getItem("nacl_story_map_intro_seen") === "true";

    if (prefersReducedMotion || sessionSeen) {
      setHasSeenIntro(true);
      setStage("stage2");
    }
  }, []);

  // IntersectionObserver for Stage 1 video trigger
  useEffect(() => {
    if (stage !== "stage1" || hasSeenIntro) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(() => {
              setTimeout(handleVideoEnd, 3000);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [stage, hasSeenIntro]);

  // Video End handoff to Stage 2
  const handleVideoEnd = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nacl_story_map_intro_seen", "true");
    }
    setHasSeenIntro(true);
    setStage("stage2");
  };

  // Group reviews by city
  const groupedReviews = reviews.reduce((acc, rev) => {
    const cityKey = rev.city || "Bangalore";
    if (!acc[cityKey]) {
      acc[cityKey] = [];
    }
    acc[cityKey].push(rev);
    return acc;
  }, {} as Record<string, ReviewItem[]>);

  // New review added
  const handleReviewAdded = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
    setSelectedCity(newReview.city);
    setSelectedCityReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[88vh] md:h-screen min-h-[600px] bg-[#030508] text-white overflow-hidden select-none flex flex-col justify-center items-center"
    >
      {/* Background radial vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.4)_0%,rgba(3,5,8,1)_85%)]" />

      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-black/70 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/90">
            <Sparkles size={13} className="text-cyan-400" />
            <span>NaCl Story Map</span>
          </div>

          {stage === "stage2" && (
            <button
              onClick={() => {
                sessionStorage.removeItem("nacl_story_map_intro_seen");
                setHasSeenIntro(false);
                setStage("stage1");
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/70 transition-colors"
              title="Replay Video Intro"
            >
              <RotateCcw size={12} /> Replay Reveal
            </button>
          )}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-accent hover:bg-white text-primary font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:scale-105"
        >
          <Plus size={15} />
          <span>Add Story Pin</span>
        </button>
      </div>

      {/* STAGE 1: VIDEO INTRO REVEAL (Map_video.mp4) */}
      <AnimatePresence>
        {stage === "stage1" && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black overflow-hidden"
          >
            <video
              ref={videoRef}
              muted
              playsInline
              onEnded={handleVideoEnd}
              onError={() => {
                const timer = setTimeout(handleVideoEnd, 3500);
                return () => clearTimeout(timer);
              }}
              className="w-full h-full object-cover"
            >
              <source src="/videos/Map_video.mp4" type="video/mp4" />
              <source src="/videos/3D_map_of_India.mp4" type="video/mp4" />
              <source src="/Map_image.jpeg" type="image/jpeg" />
            </video>

            {/* High-res Image Reveal Fallback */}
            <motion.div
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.95 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Map_image.jpeg"
                alt="3D India Map Reveal"
                className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(0,229,255,0.3)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/3D_map_of_India.jpeg";
                }}
              />
            </motion.div>

            <button
              onClick={handleVideoEnd}
              className="absolute bottom-8 right-8 z-30 px-4 py-2 rounded-full bg-black/80 border border-white/20 text-xs font-mono uppercase tracking-widest text-white/80 hover:text-white backdrop-blur-md transition-colors"
            >
              Skip Intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: MAP DISPLAY (Map_image.jpeg + Responsive Pin Wrapper) */}
      <motion.div
        initial={{ opacity: stage === "stage2" ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-8"
      >
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 animate-pulse">
              Loading Community Reviews...
            </span>
          </div>
        )}

        {/* Responsive Aspect-Ratio Image & Pin Container (Zero drift across phone, tablet, laptop) */}
        <div className="relative w-full max-w-5xl aspect-[16/9] max-h-[82vh] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center">
          {/* Map Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Map_image.jpeg"
            alt="NaCl 3D India Story Map"
            className="w-full h-full object-cover filter drop-shadow-[0_0_35px_rgba(0,229,255,0.2)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/3D_map_of_India.jpeg";
            }}
          />

          {/* Overlaid Pins Layer (CSS Percentage Coordinates mapped to 16:9 frame) */}
          <MapPins
            groupedReviews={groupedReviews}
            onSelectCity={(city, cityRevs) => {
              setSelectedCity(city);
              setSelectedCityReviews(cityRevs);
            }}
            accentColor={accentColor}
          />
        </div>

        {/* Empty State Overlay */}
        {!isLoading && reviews.length === 0 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-xs font-semibold text-white/80">
            Be the first to share your story on the NaCl Map!
          </div>
        )}
      </motion.div>

      {/* Story Detail Side Panel / Bottom Sheet */}
      <ReviewStoryPanel
        city={selectedCity}
        reviews={selectedCityReviews}
        onClose={() => {
          setSelectedCity(null);
          setSelectedCityReviews([]);
        }}
        accentColor={accentColor}
      />

      {/* Add Review Submission Form Modal */}
      <AddReviewModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  );
}
