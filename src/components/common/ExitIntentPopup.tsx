"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Bell, Check } from "lucide-react";
import { addSubscriber } from "@/lib/store";

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [cityPreference, setCityPreference] = useState("All");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip on mobile / touch
    if (window.innerWidth < 768 || "ontouchstart" in window) return;

    // Check if dismissed previously
    const dismissed = localStorage.getItem("nacl_exit_intent_dismissed");
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setIsOpen(true);
        // Remove listener once triggered
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    window.addEventListener("mouseleave", handleMouseLeave);
    return () => window.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("nacl_exit_intent_dismissed", "true");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    addSubscriber({
      email: email.trim(),
      cityPreference,
      source: "popup",
    });

    try {
      fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), cityPreference, source: "popup" }),
      });
    } catch (e) {
      console.warn("Backend popup subscriber sync offline:", e);
    }

    setSubmitted(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("nacl_exit_intent_dismissed", "true");
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-primary/95 border border-accent/50 rounded-3xl p-6 sm:p-8 text-secondary shadow-2xl overflow-hidden"
          >
            {/* Top Glow Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center text-additional hover:text-white transition-colors"
              aria-label="Dismiss exit intent popup"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles size={14} /> Before You Go
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2 leading-snug">
              Get Notified When Next Gathering Drops
            </h3>
            <p className="text-xs text-additional/80 mb-6 leading-relaxed">
              Don&apos;t miss out on upcoming movement, steel mace, and sauna sessions in Bangalore, Mumbai, or Coimbatore.
            </p>

            {submitted ? (
              <div className="p-4 rounded-xl bg-accent/15 border border-accent/30 text-center text-xs text-accent font-bold flex items-center justify-center gap-2">
                <Check size={18} /> You&apos;re subscribed! We&apos;ll notify you when events go live.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/5 border border-secondary/15 focus:border-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors"
                />

                <select
                  value={cityPreference}
                  onChange={(e) => setCityPreference(e.target.value)}
                  className="w-full bg-secondary/5 border border-secondary/15 focus:border-accent rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-primary text-white">All Hubs (Pan-India)</option>
                  <option value="Bangalore" className="bg-primary text-white">Bangalore Hub</option>
                  <option value="Mumbai" className="bg-primary text-white">Mumbai Hub</option>
                  <option value="Coimbatore" className="bg-primary text-white">Coimbatore Hub</option>
                </select>

                <button
                  type="submit"
                  className="w-full py-3 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-colors text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                >
                  <Bell size={14} /> Notify Me First
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
