"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  User, 
  Ticket, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  LogOut, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import Link from "next/link";
import { getRegistrations, RegistrationType } from "@/lib/store";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userBookings, setUserBookings] = useState<RegistrationType[]>([]);

  const user = session?.user;
  const userRole = (user as any)?.role || "user";

  useEffect(() => {
    if (user?.email) {
      const all = getRegistrations();
      const filtered = all.filter(
        (r) =>
          r.userEmail?.toLowerCase() === user.email?.toLowerCase() ||
          (r.userName && user.name && r.userName.toLowerCase() === user.name.toLowerCase())
      );
      setUserBookings(filtered);
    }
  }, [user]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#f0f2db]">
        <div className="w-8 h-8 border-2 border-[#ef542a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0A] text-[#f0f2db] font-body px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Welcome Header */}
        <div className="bg-[#121212] border border-[#f0f2db]/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ef542a]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#ef542a]/40 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#ef542a] text-[#0A0A0A] font-header font-black flex items-center justify-center text-2xl shadow-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#ef542a]/20 text-[#ef542a] border border-[#ef542a]/30 flex items-center gap-1">
                    <Sparkles size={10} /> {userRole === "admin" ? "NaCl Admin" : "Verified Mover"}
                  </span>
                  <span className="text-[10px] text-[#f0f2db]/50">Google Authenticated</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-header font-black text-white tracking-tight">
                  Welcome back, {user?.name || "Mover"}!
                </h1>
                <p className="text-xs text-[#f0f2db]/70">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/bookings"
                className="px-5 py-3 rounded-xl bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <Ticket size={16} />
                <span>My Active Passes ({userBookings.length})</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-3 rounded-xl bg-[#181818] hover:bg-red-500/20 text-[#f0f2db]/70 hover:text-red-400 border border-[#f0f2db]/10 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stat 1 */}
          <div className="bg-[#141414] border border-[#f0f2db]/10 rounded-3xl p-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#f0f2db]/60 font-semibold">
              <span>Experience Passes</span>
              <Ticket size={18} className="text-[#ef542a]" />
            </div>
            <div className="text-3xl font-header font-black text-white">{userBookings.length}</div>
            <div className="text-[11px] text-[#ffd139]">All access passes & verified tickets</div>
          </div>

          {/* Quick Stat 2 */}
          <div className="bg-[#141414] border border-[#f0f2db]/10 rounded-3xl p-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#f0f2db]/60 font-semibold">
              <span>Community Status</span>
              <ShieldCheck size={18} className="text-[#ffd139]" />
            </div>
            <div className="text-3xl font-header font-black text-white">Active</div>
            <div className="text-[11px] text-emerald-400">Verified Google OAuth Profile</div>
          </div>

          {/* Quick Stat 3 */}
          <div className="bg-[#141414] border border-[#f0f2db]/10 rounded-3xl p-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#f0f2db]/60 font-semibold">
              <span>Active Hub Cities</span>
              <Calendar size={18} className="text-[#aadeef]" />
            </div>
            <div className="text-3xl font-header font-black text-white">3 Hubs</div>
            <div className="text-[11px] text-[#f0f2db]/60">Bangalore · Mumbai · Coimbatore</div>
          </div>
        </div>

        {/* Recent Experience Passes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-header font-black text-white flex items-center gap-2">
              <Ticket size={22} className="text-[#ef542a]" />
              <span>Your Registered Experiences</span>
            </h2>
            <Link
              href="/events"
              className="text-xs font-header font-bold text-[#ef542a] hover:text-[#ffd139] flex items-center gap-1 transition-colors"
            >
              <span>Explore More Experiences</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {userBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-[#121212] border border-[#f0f2db]/15 hover:border-[#ef542a]/50 rounded-3xl p-6 transition-all duration-300 space-y-4 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#ffd139]">
                        {reg.qrCode}
                      </span>
                      <h3 className="text-lg font-header font-black text-white mt-1 line-clamp-1">
                        {reg.eventTitle}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Confirmed
                    </span>
                  </div>

                  <div className="bg-[#181818] p-3.5 rounded-2xl text-xs space-y-2 border border-[#f0f2db]/5">
                    <div className="flex justify-between text-[#f0f2db]/70">
                      <span>Date:</span>
                      <span className="font-semibold text-white">{reg.date}</span>
                    </div>
                    <div className="flex justify-between text-[#f0f2db]/70">
                      <span>Razorpay ID:</span>
                      <span className="font-mono text-[#aadeef]">{reg.paymentId || "pay_verified"}</span>
                    </div>
                  </div>

                  <Link
                    href="/bookings"
                    className="w-full py-2.5 bg-[#ef542a]/15 hover:bg-[#ef542a] text-[#ef542a] hover:text-[#0A0A0A] font-header font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    View Digital Check-In QR Pass
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#121212] border border-[#f0f2db]/10 rounded-3xl p-10 text-center space-y-4">
              <p className="text-xs text-[#f0f2db]/70">You don&apos;t have any active event passes registered yet.</p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ef542a] text-[#0A0A0A] font-header font-bold text-xs uppercase tracking-wider hover:bg-[#ffd139] transition-all"
              >
                Browse Upcoming Experiences
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
