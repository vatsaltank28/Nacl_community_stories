"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX, MapPin } from "lucide-react";
import { useState } from "react";
import { useSound } from "./SoundContext";
import CitySelector from "@/components/layout/CitySelector";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMuted, toggleMute } = useSound();

  return (
    <header className="fixed top-0 left-0 w-full z-50 text-secondary bg-primary/40 backdrop-blur-md border-b border-secondary/5 px-6 py-4">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/logo.png"
            alt="NACL Logo"
            className="w-7 h-7 rounded-full object-cover border border-secondary/10 group-hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2.5xl font-black tracking-tighter text-white group-hover:text-accent transition-colors"
          >
            NACL
          </motion.div>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex gap-6 items-center font-medium">
            <Link href="/events" className="text-additional hover:text-accent transition-colors">
              Experiences
            </Link>
            <Link href="/community" className="text-additional hover:text-accent transition-colors">
              Community
            </Link>
            <Link href="/story-map" className="text-additional hover:text-accent transition-colors flex items-center gap-1.5 font-bold">
              <MapPin size={14} className="text-cyan-400" />
              <span>Story Map</span>
            </Link>
          </div>

          {/* City Hub Selector */}
          <CitySelector />

          {/* Top Right Sound Toggle Button (Desktop Only) */}
          <button 
            onClick={toggleMute}
            className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-300 min-h-[40px] ${
              isMuted 
                ? "bg-secondary/10 hover:bg-accent/20 border-secondary/20 hover:border-accent text-secondary hover:text-accent shadow-sm"
                : "bg-accent/20 border-accent/60 text-accent shadow-[0_0_15px_rgba(255,107,0,0.2)]"
            }`}
            title={isMuted ? "Turn Peaceful Sound On" : "Mute Peaceful Sound"}
          >
            {isMuted ? (
              <>
                <VolumeX size={16} className="text-additional/80" />
                <span className="hidden lg:inline">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-accent animate-pulse" />
                <span className="hidden lg:inline text-accent">Sound On</span>
              </>
            )}
          </button>

          {/* Mobile Hamburger Toggle (Phones & Tablets) */}
          <button 
            className="md:hidden z-50 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-secondary/10 text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Slide-Out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-primary/98 backdrop-blur-2xl z-40 flex flex-col justify-between p-8 pt-28 text-white overflow-y-auto"
          >
            {/* Drawer Top Branding */}
            <div className="space-y-6 max-w-sm mx-auto w-full text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                NACL Navigation Drawer
              </span>
              
              <div className="flex flex-col gap-4 w-full">
                <Link 
                  href="/" 
                  className="w-full min-h-[52px] flex items-center justify-center rounded-2xl bg-secondary/5 hover:bg-accent/20 border border-secondary/10 hover:border-accent/40 text-lg font-bold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>

                <Link 
                  href="/events" 
                  className="w-full min-h-[52px] flex items-center justify-center rounded-2xl bg-secondary/5 hover:bg-accent/20 border border-secondary/10 hover:border-accent/40 text-lg font-bold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Experiences
                </Link>

                <Link 
                  href="/community" 
                  className="w-full min-h-[52px] flex items-center justify-center rounded-2xl bg-secondary/5 hover:bg-accent/20 border border-secondary/10 hover:border-accent/40 text-lg font-bold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Community
                </Link>

                <Link 
                  href="/story-map" 
                  className="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 font-extrabold text-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin size={20} /> Story Map
                </Link>

                <button 
                  onClick={toggleMute}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl border border-secondary/15 text-additional hover:text-white text-xs font-bold transition-colors"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-accent animate-pulse" />}
                  <span>{isMuted ? "Enable Ambient Sound" : "Mute Ambient Sound"}</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Footer Info */}
            <div className="text-center pt-8 border-t border-secondary/10 text-xs text-additional/60 space-y-2 max-w-sm mx-auto w-full">
              <p className="font-semibold text-white">NaCl Active Culture Club</p>
              <p className="text-[10px]">Bangalore · Mumbai · Coimbatore</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
