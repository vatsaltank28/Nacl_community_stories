"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const error = searchParams?.get("error");

  const getErrorMessage = (errCode: string | null) => {
    if (!errCode) return null;
    switch (errCode) {
      case "OAuthSignin":
      case "OAuthCallback":
        return "Could not complete Google authentication. Please try again.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account.";
      case "AccessDenied":
        return "Access was denied. Please select your Google account to proceed.";
      case "Callback":
        return "Authentication callback failed. Please check your network and retry.";
      default:
        return "An unexpected authentication error occurred. Please try again.";
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center bg-[#0A0A0A] text-[#f0f2db] font-body relative overflow-hidden">
      {/* Background ambient lighting matching NaCl brand palette */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ef542a]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#ffd139]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#f0f2db]/60 hover:text-white transition-colors mb-6 bg-[#141414] px-4 py-2 rounded-full border border-[#f0f2db]/10"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#121212] border border-[#f0f2db]/15 rounded-3xl p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] space-y-8 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle Top glow stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ef542a] via-[#ffd139] to-[#aadeef]" />

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#ef542a]/15 border border-[#ef542a]/30 text-[#ef542a] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,84,42,0.25)]">
              <Sparkles size={24} className="text-[#ffd139]" />
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-header font-black text-white tracking-tight">
                Welcome to <span className="font-highlight text-[#ef542a]">NaCl</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#f0f2db]/70">
                Sign in with Google to access your bookings, active QR passes, and community experiences.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center leading-relaxed"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Google Login Action Button */}
          <div className="space-y-4">
            <GoogleLoginButton callbackUrl={callbackUrl} />

            <div className="pt-2 text-center">
              <span className="text-[11px] text-[#f0f2db]/50">
                By continuing, you agree to the NaCl terms and privacy standards.
              </span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-6 border-t border-[#f0f2db]/10 grid grid-cols-2 gap-3 text-[11px] text-[#f0f2db]/70">
            <div className="flex items-center gap-2 bg-[#181818] p-2.5 rounded-xl border border-[#f0f2db]/5">
              <ShieldCheck size={14} className="text-[#ffd139] shrink-0" />
              <span>Verified Google OAuth</span>
            </div>
            <div className="flex items-center gap-2 bg-[#181818] p-2.5 rounded-xl border border-[#f0f2db]/5">
              <Lock size={14} className="text-[#aadeef] shrink-0" />
              <span>Secure JWT Session</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-[#f0f2db]/50">
          NaCl Active Culture Club · Bangalore · Mumbai · Coimbatore
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#f0f2db]">
          <div className="w-8 h-8 border-2 border-[#ef542a] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
