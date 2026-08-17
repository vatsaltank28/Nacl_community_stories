"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { getRegistrations, RegistrationType } from "@/lib/store";

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<RegistrationType[]>([]);
  const [activeQrPass, setActiveQrPass] = useState<RegistrationType | null>(null);

  const user = session?.user;

  useEffect(() => {
    if (user?.email) {
      const allRegs = getRegistrations();
      const userRegs = allRegs.filter(
        (r) =>
          r.userEmail?.toLowerCase() === user.email?.toLowerCase() ||
          (r.userName && user.name && r.userName.toLowerCase() === user.name.toLowerCase())
      );
      setBookings(userRegs);
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
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#f0f2db]/10 pb-8">
          <div>
            <div className="text-[#ffd139] font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
              <Sparkles size={13} className="text-[#ef542a]" />
              <span>NaCl Verified Passes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-header font-black text-white tracking-tight leading-tight">
              My Passes & <span className="font-highlight text-[#ef542a]">Bookings</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#f0f2db]/70 mt-2 max-w-lg">
              Manage your confirmed event registrations, Razorpay transaction receipts, and digital entry QR passes.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#181818] border border-[#f0f2db]/15 rounded-2xl p-2.5 px-4 shadow-md">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-xl object-cover border border-[#ef542a]/40 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#ef542a] text-[#0A0A0A] font-header font-black flex items-center justify-center text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
              </div>
            )}
            <div className="text-left">
              <div className="font-header font-bold text-white text-xs sm:text-sm">{user?.name || "Active Mover"}</div>
              <div className="text-[10px] text-[#f0f2db]/60 truncate max-w-[150px]">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((reg) => (
              <div
                key={reg.id}
                className="bg-[#121212] border border-[#f0f2db]/15 hover:border-[#ef542a]/50 rounded-3xl p-6 sm:p-7 transition-all duration-300 space-y-6 shadow-xl relative overflow-hidden"
              >
                {/* Status Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#ffd139] uppercase tracking-wider">
                      {reg.qrCode}
                    </span>
                    <h3 className="text-xl font-header font-black text-white mt-1 leading-tight line-clamp-1">
                      {reg.eventTitle}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {reg.status === "approved" ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 size={12} /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        <Clock size={12} /> Pending Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="bg-[#181818] border border-[#f0f2db]/10 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[#f0f2db]/80">
                    <span className="flex items-center gap-1.5 text-[#f0f2db]/60">
                      <Calendar size={13} className="text-[#ef542a]" /> Booked Date
                    </span>
                    <span className="font-semibold text-white">{reg.date}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#f0f2db]/80">
                    <span className="flex items-center gap-1.5 text-[#f0f2db]/60">
                      <Lock size={13} className="text-[#ffd139]" /> Razorpay Payment
                    </span>
                    <span className="font-mono text-[#aadeef]">{reg.paymentId || "pay_verified"}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#f0f2db]/80">
                    <span className="text-[#f0f2db]/60">Pass Tier & Price</span>
                    <span className="font-header font-bold text-white">₹{reg.price || 1499} ({reg.ticketType || "All Access"})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveQrPass(reg)}
                    className="flex-1 py-3 bg-[#ef542a]/15 hover:bg-[#ef542a] text-[#ef542a] hover:text-[#0A0A0A] border border-[#ef542a]/40 font-header font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <QrCode size={16} /> View Check-In QR Pass
                  </button>

                  <a
                    href="https://chat.whatsapp.com/DfBcTNDUwBcCS1OTY73Qxl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#f0f2db]/10 hover:bg-[#f0f2db]/20 text-[#f0f2db] rounded-xl transition-colors"
                    title="Join Event WhatsApp Hub"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#121212] border border-[#f0f2db]/10 rounded-3xl p-12 text-center space-y-5 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#ef542a]/10 border border-[#ef542a]/30 text-[#ef542a] flex items-center justify-center mx-auto">
              <Calendar size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-header font-black text-white">No Event Bookings Found</h3>
              <p className="text-xs text-[#f0f2db]/70">You haven&apos;t booked any experience passes with this account yet.</p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg"
            >
              <span>Browse Live Experiences</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        )}

        {/* QR CODE FULL PASS MODAL */}
        {activeQrPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setActiveQrPass(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1 }}
              className="relative bg-[#141414] border border-[#ef542a]/40 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 z-10 text-[#f0f2db] shadow-2xl"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#ffd139] tracking-widest">
                  Verified NaCl Digital Pass
                </span>
                <h3 className="text-xl font-header font-black text-white">{activeQrPass.eventTitle}</h3>
                <p className="text-xs text-[#f0f2db]/70 font-semibold">{activeQrPass.userName}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl inline-block shadow-xl">
                <QrCode size={160} className="text-black" />
              </div>

              <div className="space-y-1 text-xs text-[#f0f2db]/80 font-mono">
                <div>Pass Code: <span className="text-[#ffd139] font-bold">{activeQrPass.qrCode}</span></div>
                <div>Payment ID: <span className="text-[#aadeef]">{activeQrPass.paymentId || "pay_verified"}</span></div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>Approved by NaCl Admin · Ready for Check-in</span>
              </div>

              <button
                onClick={() => setActiveQrPass(null)}
                className="w-full py-3 bg-[#f0f2db]/10 hover:bg-[#f0f2db]/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Close Pass
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
