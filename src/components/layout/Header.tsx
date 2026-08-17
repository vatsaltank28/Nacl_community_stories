"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX, User, Ticket } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSound } from "./SoundContext";
import CitySelector from "@/components/layout/CitySelector";
import UserDropdown from "@/components/auth/UserDropdown";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const { isMuted, toggleMute } = useSound();

  const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <header className="fixed top-0 left-0 w-full z-50 text-[#f0f2db] bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#f0f2db]/10 px-6 py-4 font-body">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/logo.png"
            alt="NACL Logo"
            className="w-7 h-7 rounded-full object-cover border border-[#f0f2db]/10 group-hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2.5xl font-header font-black tracking-tight text-[#f0f2db] group-hover:text-[#ef542a] transition-colors"
          >
            NACL
          </motion.div>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex gap-6 items-center font-medium font-header text-sm">
            <Link href="/events" className="text-[#f0f2db]/80 hover:text-[#ef542a] transition-colors">
              Experiences
            </Link>
            
            <Link href="/bookings" className="text-[#f0f2db]/80 hover:text-[#ffd139] transition-colors flex items-center gap-1.5">
              <Ticket size={14} className="text-[#ffd139]" />
              <span>My Passes</span>
            </Link>
          </div>

          {/* City Hub Selector */}
          <CitySelector />

          {/* User Auth Profile Dropdown or Login Button */}
          {isLoggedIn ? (
            <UserDropdown />
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181818] hover:bg-[#ef542a] hover:text-[#0A0A0A] border border-[#f0f2db]/20 hover:border-[#ef542a] text-xs font-header font-bold transition-all shadow-sm group"
            >
              <User size={13} className="text-[#ef542a] group-hover:text-[#0A0A0A] transition-colors" />
              <span>Login</span>
            </Link>
          )}

          {/* Top Right Sound Toggle Button (Desktop Only) */}
          <button 
            onClick={toggleMute}
            className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold font-body border transition-all duration-300 min-h-[40px] ${
              isMuted 
                ? "bg-[#232323]/80 hover:bg-[#ef542a]/20 border-[#f0f2db]/20 hover:border-[#ef542a] text-[#f0f2db]/80 hover:text-[#ef542a] shadow-sm"
                : "bg-[#ef542a]/20 border-[#ef542a]/60 text-[#ef542a] shadow-[0_0_15px_rgba(239,84,42,0.25)]"
            }`}
            title={isMuted ? "Turn Peaceful Sound On" : "Mute Peaceful Sound"}
          >
            {isMuted ? (
              <>
                <VolumeX size={16} className="text-[#f0f2db]/80" />
                <span className="hidden xl:inline">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-[#ef542a] animate-pulse" />
                <span className="hidden xl:inline text-[#ef542a]">Sound On</span>
              </>
            )}
          </button>

          {/* Mobile Hamburger Toggle (Phones & Tablets) */}
          <button 
            className="md:hidden z-50 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-[#f0f2db]/10 text-[#f0f2db] transition-colors"
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
            className="fixed inset-0 bg-[#0A0A0A]/98 backdrop-blur-2xl z-40 flex flex-col justify-between p-8 pt-28 text-[#f0f2db] overflow-y-auto font-body"
          >
            {/* Drawer Top Branding */}
            <div className="space-y-6 max-w-sm mx-auto w-full text-center">
              <span className="text-[10px] font-header font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#ef542a]/20 text-[#ef542a] border border-[#ef542a]/30">
                NACL Navigation Drawer
              </span>
              
              <div className="flex flex-col gap-3 w-full">
                <Link 
                  href="/" 
                  className="w-full min-h-[50px] flex items-center justify-center rounded-2xl bg-[#f0f2db]/5 hover:bg-[#ef542a]/20 border border-[#f0f2db]/10 text-base font-header font-bold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>

                <Link 
                  href="/events" 
                  className="w-full min-h-[50px] flex items-center justify-center rounded-2xl bg-[#f0f2db]/5 hover:bg-[#ef542a]/20 border border-[#f0f2db]/10 text-base font-header font-bold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Experiences
                </Link>

                <Link 
                  href="/bookings" 
                  className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-[#ffd139]/10 hover:bg-[#ffd139]/20 border border-[#ffd139]/30 text-[#ffd139] text-base font-header font-bold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Ticket size={18} /> My Passes & Bookings
                </Link>

                {!isLoggedIn ? (
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-[#ef542a] text-[#0A0A0A] font-header font-black text-sm uppercase tracking-wider transition-all"
                  >
                    <User size={18} /> Continue with Google
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-[#181818] border border-[#f0f2db]/20 text-white font-header font-bold text-sm transition-all"
                  >
                    <span>Dashboard & Profile</span>
                  </Link>
                )}

                <button 
                  onClick={toggleMute}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl border border-[#f0f2db]/15 text-[#f0f2db]/80 hover:text-[#f0f2db] text-xs font-body font-bold transition-colors mt-2"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-[#ef542a] animate-pulse" />}
                  <span>{isMuted ? "Enable Ambient Sound" : "Mute Ambient Sound"}</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Footer Info */}
            <div className="text-center pt-8 border-t border-[#f0f2db]/10 text-xs text-[#f0f2db]/60 space-y-2 max-w-sm mx-auto w-full font-body">
              <p className="font-header font-semibold text-[#f0f2db]">NaCl Active Culture Club</p>
              <p className="text-[10px]">Bangalore · Mumbai · Coimbatore</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
