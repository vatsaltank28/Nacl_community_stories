"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { saveUserSession, UserSession } from "@/lib/store";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"choose" | "google" | "phone">("choose");
  
  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["1", "2", "3", "4"]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Google state
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  const handleGoogleLogin = async (customEmail?: string, customName?: string) => {
    setIsLoading(true);
    setErrorMessage("");

    const emailToUse = customEmail || googleEmail || "mover.athlete@gmail.com";
    const nameToUse = customName || googleName || emailToUse.split("@")[0];

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "google",
          email: emailToUse,
          name: nameToUse
        })
      });

      const data = await res.json();
      if (data.success) {
        const session: UserSession = {
          name: data.user.name,
          email: data.user.email,
          isLoggedIn: true,
          phone: data.user.phone
        };
        saveUserSession(session);
        window.dispatchEvent(new Event("nacl_session_update"));
        setIsLoading(false);
        onSuccess?.(session);
        onClose();
      } else {
        setErrorMessage(data.message || "Google sign in failed");
        setIsLoading(false);
      }
    } catch {
      // Fallback
      const session: UserSession = {
        name: nameToUse,
        email: emailToUse,
        isLoggedIn: true
      };
      saveUserSession(session);
      window.dispatchEvent(new Event("nacl_session_update"));
      setIsLoading(false);
      onSuccess?.(session);
      onClose();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "phone",
          phone: phone.replace(/\D/g, "").slice(-10),
          name: name || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setErrorMessage(data.message || "Failed to send OTP");
      }
    } catch {
      setOtpSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      setErrorMessage("Please enter 4-digit OTP (Demo: 1234)");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    try {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "phone",
          phone: cleanPhone,
          name: name || `Mover ${cleanPhone.slice(-4)}`,
          otp: enteredOtp
        })
      });
      const data = await res.json();
      if (data.success) {
        const session: UserSession = {
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          isLoggedIn: true
        };
        saveUserSession(session);
        window.dispatchEvent(new Event("nacl_session_update"));
        setIsLoading(false);
        onSuccess?.(session);
        onClose();
      } else {
        setErrorMessage(data.message || "Invalid OTP code");
        setIsLoading(false);
      }
    } catch {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const session: UserSession = {
        name: name || `Mover ${cleanPhone.slice(-4)}`,
        email: `${cleanPhone}@phone.nacl.in`,
        phone: cleanPhone,
        isLoggedIn: true
      };
      saveUserSession(session);
      window.dispatchEvent(new Event("nacl_session_update"));
      setIsLoading(false);
      onSuccess?.(session);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Auth Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-[#121212] border border-[#f0f2db]/15 rounded-3xl w-full max-w-md p-8 shadow-2xl z-10 text-[#f0f2db] overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ef542a]/10 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#f0f2db]/10 hover:bg-[#ef542a]/20 hover:text-[#ef542a] transition-colors flex items-center justify-center text-[#f0f2db]/70"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#ef542a]/20 border border-[#ef542a]/40 text-[#ef542a] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,84,42,0.25)]">
              <Sparkles size={22} className="text-[#ffd139]" />
            </div>
            <h3 className="text-2xl font-header font-black text-white tracking-tight">
              Welcome to <span className="font-highlight text-[#ef542a]">NaCl</span>
            </h3>
            <p className="text-xs text-[#f0f2db]/70">
              Sign in to view your bookings, active QR passes, and event approvals.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
              {errorMessage}
            </div>
          )}

          {/* SCREEN 1: CHOOSE AUTH METHOD */}
          {authMode === "choose" && (
            <div className="space-y-4">
              {/* Google Sign-in Action Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleGoogleLogin()}
                className="w-full min-h-[50px] p-3.5 bg-[#181818] hover:bg-[#202020] border border-[#f0f2db]/15 hover:border-white/30 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-sm font-semibold text-white shadow-sm group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-[#f0f2db]/10" />
                <span className="text-[10px] uppercase font-bold text-[#f0f2db]/40">OR</span>
                <div className="flex-1 h-px bg-[#f0f2db]/10" />
              </div>

              {/* Mobile Number Login Action */}
              <button
                type="button"
                onClick={() => setAuthMode("phone")}
                className="w-full min-h-[50px] p-3.5 bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider shadow-[0_8px_25px_rgba(239,84,42,0.3)]"
              >
                <Smartphone size={18} />
                <span>Continue with Mobile OTP</span>
                <ArrowRight size={16} />
              </button>

              <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-[#f0f2db]/50">
                <ShieldCheck size={14} className="text-[#ffd139]" />
                <span>Zero spam · Instant event pass access</span>
              </div>
            </div>
          )}

          {/* SCREEN 2: PHONE NUMBER & OTP FLOW */}
          {authMode === "phone" && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-widest mb-1.5">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Akshay Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-widest mb-1.5">
                      Mobile Number (+91) *
                    </label>
                    <div className="flex gap-2">
                      <span className="bg-[#181818] border border-[#f0f2db]/15 rounded-xl px-3.5 flex items-center text-xs font-bold text-[#ffd139]">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="flex-1 bg-[#181818] border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[48px] py-3.5 bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 text-xs uppercase tracking-wider shadow-lg"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <span>Send 4-Digit OTP</span>}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode("choose")}
                      className="text-xs text-[#f0f2db]/60 hover:text-white underline font-semibold"
                    >
                      ← Back to login options
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center space-y-1">
                    <div className="text-xs text-[#f0f2db]/80 font-medium">
                      Enter 4-digit code sent to <span className="text-[#ffd139] font-mono font-bold">+91 {phone}</span>
                    </div>
                    <div className="text-[11px] text-[#ef542a] font-bold">
                      Demo Test Code: 1234
                    </div>
                  </div>

                  {/* 4 Digit OTP Boxes */}
                  <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={otp[idx] || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const copy = [...otp];
                          copy[idx] = val;
                          setOtp(copy);
                          if (val && idx < 3) {
                            document.getElementById(`otp-${idx + 1}`)?.focus();
                          }
                        }}
                        className="w-12 h-14 bg-[#181818] border border-[#f0f2db]/20 focus:border-[#ef542a] rounded-2xl text-center text-xl font-mono font-bold text-white focus:outline-none transition-colors"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[48px] py-3.5 bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <span>Verify & Access Passes</span>}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#f0f2db]/60 pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="hover:text-white transition-colors"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtp(["1", "2", "3", "4"])}
                      className="text-[#ffd139] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw size={12} /> Auto-fill Demo OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
