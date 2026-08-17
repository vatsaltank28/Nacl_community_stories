"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Bell } from "lucide-react";
import { addSubscriber } from "@/lib/store";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cityPreference, setCityPreference] = useState("All");
  const [frequency, setFrequency] = useState<"immediate" | "weekly">("immediate");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    addSubscriber({
      email: email.trim(),
      name: name.trim(),
      cityPreference,
      frequency,
      source: "landing",
    });

    try {
      await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          cityPreference,
          frequency,
          source: "landing",
        }),
      });
    } catch (err) {
      console.warn("Backend subscriber sync offline, saved locally:", err);
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="relative py-24 px-6 bg-[#0A0A0A] border-t border-[#f0f2db]/10 overflow-hidden font-body text-[#f0f2db]">
      {/* Background radial glow with Sunset */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(239,84,42,0.08),transparent_65%)] animate-pulse" />

      <div className="relative z-10 max-w-4xl mx-auto bg-gradient-to-br from-[#121212] via-[#0D0D0D] to-[#0A0A0A] border border-[#ef542a]/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="text-[#ffd139] font-body font-bold uppercase tracking-widest text-xs mb-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ef542a]/15 border border-[#ef542a]/30">
            <Sparkles size={13} className="text-[#ffd139]" /> Never Miss A Gathering
          </div>
          <h2 className="text-3xl sm:text-4xl font-header font-extrabold text-[#f0f2db] leading-tight mb-3">
            Get Notified When <span className="font-highlight text-[#ef542a]">New Experiences</span> Drop
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#f0f2db]/80 leading-relaxed">
            Not ready to book today? Subscribe to get instant early alerts or a weekly digest when new steel mace flow, sauna, and movement sessions launch in your city.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-[#ef542a]/15 border border-[#ef542a]/40 text-center max-w-md mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-[#ef542a] text-[#232323] flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Check size={24} />
            </div>
            <h3 className="text-lg font-header font-bold text-[#f0f2db] mb-1">Welcome to the NaCl Loop!</h3>
            <p className="text-xs font-body text-[#f0f2db]/90">
              We&apos;ve registered <span className="text-[#ffd139] font-semibold">{email}</span> for {cityPreference === "All" ? "all cities" : `${cityPreference} hub`} updates ({frequency === "immediate" ? "instant notifications" : "weekly digest"}).
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[48px] bg-[#232323]/90 border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-4 py-3 text-xs text-[#f0f2db] font-body focus:outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[48px] bg-[#232323]/90 border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-4 py-3 text-xs text-[#f0f2db] font-body focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* City Hub & Frequency Preference Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-body font-bold text-[#f0f2db]/70 uppercase tracking-wider mb-1">
                  City Hub Preference
                </label>
                <select
                  value={cityPreference}
                  onChange={(e) => setCityPreference(e.target.value)}
                  className="w-full min-h-[48px] bg-[#232323] border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-3 py-2.5 text-xs text-[#f0f2db] font-body font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#232323] text-[#f0f2db]">All Hubs (Pan-India)</option>
                  <option value="Bangalore" className="bg-[#232323] text-[#f0f2db]">Bangalore</option>
                  <option value="Mumbai" className="bg-[#232323] text-[#f0f2db]">Mumbai</option>
                  <option value="Coimbatore" className="bg-[#232323] text-[#f0f2db]">Coimbatore</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-body font-bold text-[#f0f2db]/70 uppercase tracking-wider mb-1">
                  Alert Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full min-h-[48px] bg-[#232323] border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-3 py-2.5 text-xs text-[#f0f2db] font-body font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="immediate" className="bg-[#232323] text-[#f0f2db]">Notify Me Immediately</option>
                  <option value="weekly" className="bg-[#232323] text-[#f0f2db]">Weekly Digest (Mondays)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3.5 bg-[#ef542a] hover:bg-[#ffd139] text-[#232323] font-header font-black rounded-xl transition-colors text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <Bell size={15} />
              <span>{loading ? "Registering..." : "Get Event Drop Alerts"}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
