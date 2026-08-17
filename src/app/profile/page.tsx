"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User, ShieldCheck, Mail, Calendar, LogOut, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#f0f2db]">
        <div className="w-8 h-8 border-2 border-[#ef542a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session?.user;
  const userRole = (user as any)?.role || "user";

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0A] text-[#f0f2db] font-body px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Navigation back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#f0f2db]/70 hover:text-white transition-colors bg-[#141414] px-4 py-2 rounded-full border border-[#f0f2db]/10"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-[#121212] border border-[#f0f2db]/15 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-5 border-b border-[#f0f2db]/10 pb-6">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#ef542a]/40 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#ef542a] text-[#0A0A0A] font-header font-black flex items-center justify-center text-2xl shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#ef542a]/20 text-[#ef542a] border border-[#ef542a]/30 flex items-center gap-1">
                  <Sparkles size={10} /> {userRole === "admin" ? "NaCl Admin" : "Community Member"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-header font-black text-white tracking-tight mt-1">
                {user?.name || "Mover Profile"}
              </h1>
              <p className="text-xs text-[#f0f2db]/60">Member since 2026</p>
            </div>
          </div>

          {/* Profile fields */}
          <div className="space-y-4 text-xs font-semibold">
            <div className="bg-[#181818] p-4 rounded-2xl border border-[#f0f2db]/5 flex items-center justify-between">
              <span className="text-[#f0f2db]/60 flex items-center gap-2">
                <User size={15} className="text-[#ef542a]" /> Full Name
              </span>
              <span className="text-white font-bold">{user?.name}</span>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-[#f0f2db]/5 flex items-center justify-between">
              <span className="text-[#f0f2db]/60 flex items-center gap-2">
                <Mail size={15} className="text-[#ffd139]" /> Email Address
              </span>
              <span className="text-white font-mono">{user?.email}</span>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-[#f0f2db]/5 flex items-center justify-between">
              <span className="text-[#f0f2db]/60 flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#aadeef]" /> Authentication Provider
              </span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">Google OAuth 2.0</span>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-[#f0f2db]/5 flex items-center justify-between">
              <span className="text-[#f0f2db]/60 flex items-center gap-2">
                <Calendar size={15} className="text-[#ef542a]" /> Access Level
              </span>
              <span className="text-[#ffd139] uppercase tracking-wider font-bold">
                {userRole === "admin" ? "Platform Administrator" : "Standard Mover Access"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-[#f0f2db]/10">
            <Link
              href="/bookings"
              className="py-3 px-5 bg-[#ef542a]/15 hover:bg-[#ef542a] text-[#ef542a] hover:text-[#0A0A0A] font-header font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              View My Passes
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="py-3 px-5 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white font-header font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
