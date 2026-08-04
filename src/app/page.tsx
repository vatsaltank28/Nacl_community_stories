"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getEvents, EventType } from "@/lib/store";
import { MapPin, Calendar, Sparkles, MoveRight, Users } from "lucide-react";
import InteractiveEventCard from "@/components/events/InteractiveEventCard";
import BentoFeatureGrid from "@/components/home/BentoFeatureGrid";
import AnimatedStatsBar from "@/components/home/AnimatedStatsBar";
import NewsletterSection from "@/components/common/NewsletterSection";

const Hero3D = dynamic(() => import("@/components/3d/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  const containerRef = useRef(null);
  const [featuredEvents, setFeaturedEvents] = useState<EventType[]>([]);
  const { scrollYProgress: globalScrollProgress } = useScroll();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [selectedHub, setSelectedHub] = useState<string>("All");

  useEffect(() => {
    const loadEvents = () => {
      const allEvs = getEvents();
      const hub = localStorage.getItem("nacl_selected_hub") || "All";
      setSelectedHub(hub);

      const filtered = hub === "All"
        ? allEvs
        : allEvs.filter((e) => e.city?.toLowerCase() === hub.toLowerCase() || e.venue.toLowerCase().includes(hub.toLowerCase()));

      setFeaturedEvents(filtered.slice(0, 3));
    };

    loadEvents();

    const handleHubChange = (e: any) => {
      const newHub = e.detail || localStorage.getItem("nacl_selected_hub") || "All";
      setSelectedHub(newHub);
      const allEvs = getEvents();
      const filtered = newHub === "All"
        ? allEvs
        : allEvs.filter((ev) => ev.city?.toLowerCase() === newHub.toLowerCase() || ev.venue.toLowerCase().includes(newHub.toLowerCase()));
      setFeaturedEvents(filtered.slice(0, 3));
    };

    window.addEventListener("nacl_hub_change", handleHubChange);
    return () => window.removeEventListener("nacl_hub_change", handleHubChange);
  }, []);

  return (
    <main className="relative min-h-screen bg-primary text-secondary overflow-x-hidden" ref={containerRef}>
      {/* Scroll Progress Bar for Premium Mobile UI */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[9999] origin-left"
        style={{ scaleX: globalScrollProgress }}
      />

      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        <Hero3D />
        
        <motion.div 
          className="relative z-10 text-center flex flex-col items-center px-4 max-w-4xl"
          style={{ y, opacity } as any}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
          >
            <Sparkles size={12} className="animate-spin-slow" />
            <span>Bangalore · Mumbai · Coimbatore</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 text-balance text-white font-sans leading-none"
          >
            Movement is <span className="text-accent">Play</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-additional max-w-xl text-balance mb-12 leading-relaxed"
          >
            Curated experiences for steel mace flow, joint control, animal movements, sauna, and genuine human connection.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-20"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href="/events"
                className="block px-8 py-4 bg-accent text-primary font-bold rounded-full hover:bg-white transition-all duration-300 text-center shadow-lg hover:shadow-accent/20"
              >
                Explore Experiences
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href="/community"
                className="block px-8 py-4 border border-secondary/20 text-white font-bold rounded-full hover:bg-secondary/10 hover:border-white transition-all duration-300 text-center"
              >
                Join Community
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-additional/40 animate-bounce text-xs font-semibold tracking-widest uppercase">
          <span>Scroll Down</span>
          <span className="text-accent font-bold">↓</span>
        </div>
      </section>

      {/* SECTION 2: FEATURED EXPERIENCES */}
      <section className="relative bg-primary py-24 px-6 border-t border-secondary/5 overflow-hidden">
        {/* Ambient background depth mesh & subtle particle glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(255,85,0,0.06),transparent_60%)] animate-pulse" />
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <div className="text-accent font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-1.5">
                <Sparkles size={14} /> Curated Gatherings
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Featured Experiences
              </h2>
            </div>
            <Link 
              href="/events" 
              className="flex items-center gap-2.5 text-additional hover:text-accent font-bold text-sm transition-colors group"
            >
              <span>View All Events</span>
              <MoveRight size={18} className="group-hover:translate-x-2 transition-transform duration-300 text-accent" />
            </Link>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, i) => (
              <InteractiveEventCard key={event.id} event={event} index={i} />
            ))}
          </div>

          {/* Mobile Snap-Swipe Carousel */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-5 pb-6 custom-scrollbar -mx-6 px-6">
            {featuredEvents.map((event, i) => (
              <div key={event.id} className="snap-center shrink-0 w-[85vw]">
                <InteractiveEventCard event={event} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: BENTO FEATURE GRID */}
      <BentoFeatureGrid />

      {/* SECTION 5: ANIMATED SKEWED STATS BAR */}
      <AnimatedStatsBar />

      {/* SECTION 6: NEWSLETTER LEAD CAPTURE */}
      <NewsletterSection />
    </main>
  );
}
