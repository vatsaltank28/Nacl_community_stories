"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import CommunityHubSection from "@/components/home/CommunityHubSection";
import MovingPhotoAlbum from "@/components/home/MovingPhotoAlbum";
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
  const { scrollYProgress: globalScrollProgress } = useScroll();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
            className="mb-4 px-4 py-1.5 rounded-full bg-[var(--sunset)]/10 border border-[var(--sunset)]/30 text-[var(--sunset)] text-xs font-body font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles size={12} className="animate-spin-slow text-[var(--sand)]" />
            <span>Bangalore · Mumbai · Coimbatore</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-header font-extrabold tracking-tight mb-6 text-balance text-[var(--foam)] leading-none"
          >
            Movement is <span className="font-highlight text-[var(--sunset)] tracking-normal italic">Play</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-[var(--foam)]/80 font-body max-w-xl text-balance mb-12 leading-relaxed"
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
                className="block px-8 py-4 bg-[var(--sunset)] text-[var(--deep)] font-header font-bold rounded-full hover:bg-[var(--foam)] transition-all duration-300 text-center shadow-lg hover:shadow-[var(--sunset)]/30"
              >
                Explore Experiences
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <a 
                href="https://chat.whatsapp.com/DfBcTNDUwBcCS1OTY73Qxl"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-8 py-4 border border-[var(--tide)]/40 text-[var(--tide)] font-header font-bold rounded-full hover:bg-[var(--tide)]/10 hover:border-[var(--tide)] transition-all duration-300 text-center shadow-lg"
              >
                Join WhatsApp Community
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-additional/40 animate-bounce text-xs font-semibold tracking-widest uppercase">
          <span>Scroll Down</span>
          <span className="text-accent font-bold">↓</span>
        </div>
      </section>

      {/* SECTION 2: THE COMMUNITY HUB & WHATSAPP NETWORK */}
      <CommunityHubSection />

      {/* SECTION 3: MOVING PHOTO ALBUM (INSTAGRAM LINKED) */}
      <MovingPhotoAlbum />

      {/* SECTION 4: NEWSLETTER LEAD CAPTURE */}
      <NewsletterSection />
    </main>
  );
}
