"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Mail, Lock, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const user = { name: name.trim(), email: email.trim().toLowerCase() };
      localStorage.setItem("nacl_active_user", JSON.stringify(user));
      onLoginSuccess(user);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-primary/95 border border-accent/40 rounded-3xl p-6 sm:p-8 text-secondary shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> My NaCl Member Access
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center text-additional hover:text-white transition-colors"
                aria-label="Close authentication modal"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
              {step === "credentials" ? "Access Your Dashboard" : "Enter Verification OTP"}
            </h3>
            <p className="text-xs text-additional/80 mb-6 leading-relaxed">
              {step === "credentials"
                ? "Enter your name and email to receive your instant 4-digit security code."
                : `We sent a 4-digit code to ${email}.`}
            </p>

            {step === "credentials" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-additional uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/15 focus:border-accent rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-additional uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-additional/40" />
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/5 border border-secondary/15 focus:border-accent rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-colors text-xs uppercase tracking-widest shadow-lg mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? "Sending OTP..." : "Get Instant Security OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-additional uppercase tracking-wider mb-1.5">
                    4-Digit Verification OTP
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-additional/40" />
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="8821"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-secondary/5 border border-secondary/15 focus:border-accent rounded-xl pl-10 pr-4 py-3 text-center tracking-[0.5em] text-lg font-bold text-accent focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-colors text-xs uppercase tracking-widest shadow-lg mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying..." : "Verify & Access Dashboard"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
