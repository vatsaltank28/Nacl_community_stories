"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { 
  User, 
  LayoutDashboard, 
  Ticket, 
  LogOut, 
  ChevronDown, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { saveUserSession } from "@/lib/store";

export default function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const userRole = (user as any)?.role || "user";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    // Clear local store session as well
    saveUserSession({ name: "", email: "", isLoggedIn: false });
    window.dispatchEvent(new Event("nacl_session_update"));
    await signOut({ callbackUrl: "/" });
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "M";

  return (
    <div className="relative font-body" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#141414] hover:bg-[#1c1c1c] border border-[#f0f2db]/15 hover:border-[#ffd139]/40 transition-all duration-200 shadow-sm group"
        aria-expanded={isOpen}
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full object-cover border border-[#ef542a]/40"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#ef542a] text-[#0A0A0A] font-header font-black flex items-center justify-center text-xs">
            {initials}
          </div>
        )}

        <div className="text-left hidden lg:block max-w-[110px]">
          <div className="text-xs font-header font-bold text-white truncate group-hover:text-[#ef542a] transition-colors">
            {user.name || "Mover"}
          </div>
          <div className="text-[10px] text-[#ffd139] uppercase tracking-wider font-semibold">
            {userRole === "admin" ? "Admin" : "Member"}
          </div>
        </div>

        <ChevronDown
          size={14}
          className={`text-[#f0f2db]/60 group-hover:text-white transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ffd139]" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 rounded-3xl bg-[#121212] border border-[#f0f2db]/15 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 text-[#f0f2db] overflow-hidden"
          >
            {/* Header info */}
            <div className="p-3 bg-[#181818] rounded-2xl border border-[#f0f2db]/10 mb-2">
              <div className="flex items-center gap-2.5">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-10 h-10 rounded-xl object-cover border border-[#f0f2db]/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#ef542a] text-[#0A0A0A] font-header font-black flex items-center justify-center text-sm">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-header font-bold text-white text-sm truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-[#f0f2db]/60 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#f0f2db]/10 flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#ffd139] bg-[#ffd139]/10 px-2 py-0.5 rounded-full border border-[#ffd139]/30 flex items-center gap-1">
                  <Sparkles size={10} /> {userRole === "admin" ? "NaCl Admin" : "Verified Mover"}
                </span>
                <span className="text-[9px] text-[#f0f2db]/40">Google Auth</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-1 text-xs font-semibold">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#1f1f1f] text-[#f0f2db]/90 hover:text-white transition-colors"
              >
                <LayoutDashboard size={16} className="text-[#ef542a]" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/bookings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#1f1f1f] text-[#f0f2db]/90 hover:text-white transition-colors"
              >
                <Ticket size={16} className="text-[#ffd139]" />
                <span>My Passes & Bookings</span>
              </Link>

              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#1f1f1f] text-[#f0f2db]/90 hover:text-white transition-colors"
              >
                <User size={16} className="text-[#aadeef]" />
                <span>Profile Settings</span>
              </Link>

              {userRole === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#ef542a]/15 text-[#ef542a] font-bold transition-colors"
                >
                  <ShieldCheck size={16} />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>

            {/* Sign Out Button */}
            <div className="mt-2 pt-2 border-t border-[#f0f2db]/10">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-red-500/15 text-red-400 hover:text-red-300 font-semibold text-xs transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
