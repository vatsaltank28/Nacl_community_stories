"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Mail, User } from "lucide-react";
import { EventType, joinWaitlist } from "@/lib/store";

interface WaitlistModalProps {
  event: EventType;
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ event, isOpen, onClose }: WaitlistModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    joinWaitlist(event.id, event.title, name.trim(), email.trim());
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-primary/95 border border-accent/40 rounded-3xl p-6 sm:p-8 text-secondary shadow-2xl overflow-hidden"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> Sold Out · Waitlist Priority
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center text-additional hover:text-white transition-colors"
                aria-label="Close waitlist modal"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
              Join Waitlist for {event.title}
            </h3>
            <p className="text-xs text-additional/80 mb-6 leading-relaxed">
              This experience is currently at 100% capacity. Enter your email below to be instantly notified if a spot opens up due to cancellation.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center bg-accent/15 border border-accent/30 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h4 className="text-base font-bold text-white mb-1">You&apos;re on the Waitlist!</h4>
                <p className="text-xs text-additional">
                  We&apos;ll notify <span className="text-accent font-semibold">{email}</span> immediately if a spot becomes available.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-additional uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-additional/40" />
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-secondary/5 border border-secondary/15 focus:border-accent rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-additional uppercase tracking-wider mb-1.5">
                    Email Address for Notification
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
                  className="w-full py-3.5 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-colors text-xs uppercase tracking-widest shadow-lg mt-2"
                >
                  Confirm Priority Waitlist
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
