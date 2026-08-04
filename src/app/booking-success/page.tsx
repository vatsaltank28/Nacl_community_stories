"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, QrCode, ArrowLeft, Calendar, MapPin, Download, ShieldCheck } from "lucide-react";
import { getOrderById, OrderRecordType, getEvents, EventType } from "@/lib/store";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderRecordType | null>(null);
  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const ord = getOrderById(orderId);
    if (ord) {
      setOrder(ord);
      const evs = getEvents();
      const match = evs.find((e) => e.id === ord.eventId);
      if (match) setEvent(match);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-primary text-secondary flex items-center justify-center">
      <div className="max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-secondary/5 border border-accent/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* Ambient Glow Header */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/60 text-accent flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,85,0,0.3)]">
            <CheckCircle2 size={36} />
          </div>

          <div className="text-center mb-8">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
              Payment Confirmed · Instant Ticket Issued
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-2 leading-none">
              You&apos;re Booked!
            </h1>
            <p className="text-xs text-additional/80">
              Your official NaCl Gathering Pass has been generated and sent to <span className="text-white font-semibold">{order?.userEmail || "your email"}</span>.
            </p>
          </div>

          {/* Order Receipt Card */}
          <div className="bg-primary/90 border border-secondary/15 rounded-2xl p-5 mb-8 space-y-4">
            <div className="flex justify-between items-start border-b border-secondary/10 pb-3">
              <div>
                <div className="text-xs font-bold text-white">{order?.eventTitle || "NaCl Experience"}</div>
                <div className="text-[10px] text-additional mt-0.5">Order ID: <span className="font-mono text-accent">{order?.orderId || orderId}</span></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-white">₹{order?.amount}</div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                  <ShieldCheck size={12} /> PAID
                </div>
              </div>
            </div>

            {event && (
              <div className="space-y-2 text-xs text-additional/90">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-accent shrink-0" />
                  <span>{event.date} · {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-accent shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
            )}

            {/* QR Code Pass Box */}
            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-primary">
                  <QrCode size={32} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Digital Pass Code</div>
                  <div className="text-[10px] text-additional/70 font-mono mt-0.5">{order?.qrCode || "NACL-PASS-VERIFIED"}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Valid Entry</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="flex-1 py-3.5 bg-accent text-primary font-bold rounded-xl text-center text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
            >
              View In My NaCl Dashboard
            </Link>
            <Link
              href="/events"
              className="px-6 py-3.5 bg-secondary/10 hover:bg-secondary/20 border border-secondary/15 text-white font-bold rounded-xl text-center text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back To Events
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center text-accent font-bold text-xs uppercase tracking-widest">
        Loading Receipt...
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
