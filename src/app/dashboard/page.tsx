"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  Calendar,
  QrCode,
  Flame,
  Award,
  LogOut,
  MapPin,
  Clock,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { getOrdersByEmail, OrderRecordType, getEvents, EventType, notifyWaitlistUsers } from "@/lib/store";
import AuthModal from "@/components/auth/AuthModal";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [orders, setOrders] = useState<OrderRecordType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setEvents(getEvents());

    const savedUser = localStorage.getItem("nacl_active_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        const userOrds = getOrdersByEmail(parsed.email);
        setOrders(userOrds);
      } catch (e) {
        console.warn("Invalid user in localStorage:", e);
      }
    } else {
      setShowAuthModal(true);
    }

    const handleOrdersUpdate = () => {
      if (user) setOrders(getOrdersByEmail(user.email));
    };
    window.addEventListener("nacl_orders_update", handleOrdersUpdate);
    return () => window.removeEventListener("nacl_orders_update", handleOrdersUpdate);
  }, [user?.email]);

  const handleLogout = () => {
    localStorage.removeItem("nacl_active_user");
    setUser(null);
    setOrders([]);
    setShowAuthModal(true);
  };

  const handleCancelBooking = (orderId: string, eventId: string) => {
    if (confirm("Are you sure you want to cancel this booking pass?")) {
      const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: "REFUNDED" as const } : o));
      setOrders(updated);
      localStorage.setItem("nacl_orders", JSON.stringify(updated));
      notifyWaitlistUsers(eventId);
    }
  };

  const activeBookings = orders.filter((o) => o.status === "PAID");
  const pastBookings = orders.filter((o) => o.status === "REFUNDED");
  const streakCount = activeBookings.length + 3; // Base member streak

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-primary text-secondary">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setOrders(getOrdersByEmail(loggedUser.email));
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-secondary/5 border border-secondary/15 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-orange-700 text-primary flex items-center justify-center font-black text-2xl shadow-xl">
              {user ? user.name.charAt(0).toUpperCase() : <User size={28} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user ? user.name : "NaCl Member"}
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-additional mt-1">
                {user ? user.email : "Log in to view active tickets & session history"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-additional hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-secondary/10"
              >
                <LogOut size={14} /> Log Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
              >
                Log In / Register
              </button>
            )}
          </div>
        </div>

        {/* Member Stats & Streak Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-3 bg-accent/15 border border-accent/30 text-accent rounded-xl">
              <Flame size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{streakCount} Sessions</div>
              <div className="text-[11px] font-bold text-additional uppercase tracking-wider">Annual Movement Streak</div>
            </div>
          </div>

          <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{activeBookings.length} Active</div>
              <div className="text-[11px] font-bold text-additional uppercase tracking-wider">Upcoming Booked Passes</div>
            </div>
          </div>

          <div className="bg-secondary/5 border border-secondary/15 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">NaCl Active Tier</div>
              <div className="text-[11px] font-bold text-additional uppercase tracking-wider">Priority Gathering Access</div>
            </div>
          </div>
        </div>

        {/* Section: Upcoming Bookings */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="text-accent" size={20} /> Upcoming Booked Experiences
            </h2>
            <Link href="/events" className="text-xs font-bold text-accent hover:underline flex items-center gap-1 uppercase tracking-wider">
              <PlusCircle size={14} /> Book New Gathering
            </Link>
          </div>

          {activeBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBookings.map((ord) => {
                const evMatch = events.find((e) => e.id === ord.eventId);
                return (
                  <motion.div
                    key={ord.orderId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-secondary/5 border border-secondary/15 hover:border-accent/40 rounded-3xl p-6 transition-all shadow-xl relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30">
                          Confirmed Ticket
                        </span>
                        <h3 className="text-xl font-bold text-white mt-2 leading-tight">{ord.eventTitle}</h3>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl text-primary shrink-0 shadow-md">
                        <QrCode size={36} />
                      </div>
                    </div>

                    {evMatch && (
                      <div className="space-y-2 text-xs text-additional/80 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-accent shrink-0" />
                          <span>{evMatch.date} · {evMatch.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-accent shrink-0" />
                          <span className="truncate">{evMatch.venue}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-secondary/10 text-xs">
                      <div>
                        <div className="text-[10px] text-additional">Pass Code</div>
                        <div className="font-mono font-bold text-white text-[11px]">{ord.qrCode}</div>
                      </div>

                      <button
                        onClick={() => handleCancelBooking(ord.orderId, ord.eventId)}
                        className="px-3.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-[11px] font-bold uppercase transition-colors"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-secondary/5 border border-secondary/10 rounded-3xl p-8">
              <Calendar size={36} className="text-additional/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Upcoming Bookings Found</h3>
              <p className="text-xs text-additional/80 max-w-md mx-auto mb-6">
                You haven&apos;t reserved any active NaCl experiences yet. Explore our upcoming gatherings in Bangalore, Mumbai, or Coimbatore!
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
              >
                <span>Browse Gatherings</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
