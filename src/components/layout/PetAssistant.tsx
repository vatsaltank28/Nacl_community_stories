"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, CreditCard, BookOpen, MessageSquare, ChevronDown, Send, Check, Sparkles, Move, Bell } from "lucide-react";
import Link from "next/link";
import { getEvents, EventType, getOrderById, getOrdersByEmail, OrderRecordType, addSubscriber } from "@/lib/store";

export interface PetAssistantProps {
  /** Optional array of events to populate the Find Events search */
  eventsData?: EventType[];
  /** Optional guidelines content override */
  guidelinesContent?: string;
  /** Optional handler when user submits support message escalation */
  supportContactHandler?: (data: { name: string; email: string; message: string }) => Promise<void> | void;
}

const GREETINGS = [
  "Hi! I'm Pip 👋 Need help finding an experience?",
  "Hey there! Pip here ✦ How can I guide your journey today?",
  "Welcome! Exploring steel mace, animal flow, or cold plunges?",
  "Hello! I'm your NaCl buddy ✦ Ask me anything about our gatherings!"
];

const PAYMENT_FAQS = [
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit/debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and major mobile wallets via secure checkout."
  },
  {
    q: "How do I access my entry ticket/QR code?",
    a: "After registering, your booking ticket and QR code are instantly generated and stored in your profile as well as emailed to you."
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "Cancellations up to 48 hours prior to the event are eligible for full credit towards any future NaCl experience. Email support for assistance."
  }
];

const DEFAULT_GUIDELINES = `
✦ **NaCl Experience Etiquette & Essentials**

1. **What to Wear**: Comfortable, stretchable athletic wear suitable for barefoot movement, ground work, and rotational swings.
2. **What to Bring**: Personal water bottle, small sweat towel, and an open mind! Mace equipment and mats are provided on-site.
3. **Arrival Time**: Please arrive 15 minutes before the scheduled start time for check-in and wrist preparation.
4. **Sauna & Cold Plunge**: Bring a dry towel and change of clothes if attending a recovery session.
`;

export default function PetAssistant({
  eventsData,
  guidelinesContent = DEFAULT_GUIDELINES,
  supportContactHandler
}: PetAssistantProps) {
  // Expansion and Active Accordion State
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "payments" | "guidelines" | "support" | null>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);

  // Search & Form States
  const [eventQuery, setEventQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderSearchResult, setOrderSearchResult] = useState<OrderRecordType | null | undefined>(undefined);
  const [petNotifyEmail, setPetNotifyEmail] = useState("");
  const [petNotifyCity, setPetNotifyCity] = useState("All");
  const [petNotifySubmitted, setPetNotifySubmitted] = useState(false);

  const handleCheckOrder = () => {
    const query = orderSearchQuery.trim();
    if (!query) return;
    const match = getOrderById(query);
    if (match) {
      setOrderSearchResult(match);
      return;
    }
    const emailMatches = getOrdersByEmail(query);
    if (emailMatches.length > 0) {
      setOrderSearchResult(emailMatches[0]);
      return;
    }
    setOrderSearchResult(null);
  };

  const handlePetNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petNotifyEmail.trim()) return;

    addSubscriber({
      email: petNotifyEmail.trim(),
      cityPreference: petNotifyCity,
      source: "pet_widget",
    });

    setPetNotifySubmitted(true);
    setTimeout(() => {
      setPetNotifySubmitted(false);
      setPetNotifyEmail("");
      setActiveTab(null);
    }, 2000);
  };

  // Position & Draggable state
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragBounds, setDragBounds] = useState<{ left: number; right: number; top: number; bottom: number }>({
    left: -800,
    right: 0,
    top: -600,
    bottom: 0,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Cursor tracking LERP refs
  const petRef = useRef<HTMLDivElement>(null);
  const pupilLeftRef = useRef<SVGCircleElement>(null);
  const pupilRightRef = useRef<SVGCircleElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const pupilPos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafId = useRef<number | null>(null);

  // Load events from store fallback if not passed as prop
  const activeEvents = useMemo(() => eventsData || getEvents(), [eventsData]);

  // Check device capabilities & localStorage position
  useEffect(() => {
    if (typeof window === "undefined") return;

    setDragBounds({
      left: -window.innerWidth + 80,
      right: 0,
      top: -window.innerHeight + 100,
      bottom: 0,
    });

    // Detect mobile touch
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();

    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    // Load saved position
    const savedPos = localStorage.getItem("nacl_pet_position");
    if (savedPos) {
      try {
        setPosition(JSON.parse(savedPos));
      } catch (e) {
        console.warn("Invalid pet position in localStorage:", e);
      }
    }
  }, []);

  // LERP Cursor Eye Tracking Loop (rAF optimized)
  const updateEyeTracking = useCallback(() => {
    if (isMobile || reducedMotion || !petRef.current) return;

    // Calculate pet center on screen
    const rect = petRef.current.getBoundingClientRect();
    const petCenterX = rect.left + rect.width / 2;
    const petCenterY = rect.top + rect.height / 2;

    // Angle to cursor
    const dx = mousePos.current.x - petCenterX;
    const dy = mousePos.current.y - petCenterY;
    const distance = Math.hypot(dx, dy);

    // Limit pupil offset radius to max 4.5 pixels inside eye
    const maxOffset = 4.5;
    const angle = Math.atan2(dy, dx);
    const targetX = Math.cos(angle) * Math.min(distance * 0.05, maxOffset);
    const targetY = Math.sin(angle) * Math.min(distance * 0.05, maxOffset);

    // LERP smoothing (0.1 speed for organic movement)
    pupilPos.current.x += (targetX - pupilPos.current.x) * 0.12;
    pupilPos.current.y += (targetY - pupilPos.current.y) * 0.12;

    // Update pupil SVG attributes directly without React state re-renders
    if (pupilLeftRef.current && pupilRightRef.current) {
      pupilLeftRef.current.setAttribute("transform", `translate(${pupilPos.current.x.toFixed(2)}, ${pupilPos.current.y.toFixed(2)})`);
      pupilRightRef.current.setAttribute("transform", `translate(${pupilPos.current.x.toFixed(2)}, ${pupilPos.current.y.toFixed(2)})`);
    }

    rafId.current = requestAnimationFrame(updateEyeTracking);
  }, [isMobile, reducedMotion]);

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(updateEyeTracking);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile, reducedMotion, updateEyeTracking]);

  // Toggle Popup open/close
  const toggleOpen = () => {
    if (!isOpen) {
      // Cycle greeting
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }
    setIsOpen((prev) => !prev);
  };

  // Support Submission
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportMsg) return;

    if (supportContactHandler) {
      await supportContactHandler({ name: supportName, email: supportEmail, message: supportMsg });
    }

    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setSupportName("");
      setSupportEmail("");
      setSupportMsg("");
      setActiveTab(null);
    }, 2500);
  };

  const filteredEvents = activeEvents.filter((e) =>
    e.title.toLowerCase().includes(eventQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(eventQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(eventQuery.toLowerCase())
  );

  return (
    <div
      ref={petRef}
      className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end pointer-events-none"
    >
      {/* POPUP ASSISTANT CARD */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="pointer-events-auto mb-4 w-[90vw] sm:w-[380px] rounded-3xl border border-accent/30 bg-primary/95 text-secondary shadow-2xl backdrop-blur-2xl overflow-hidden"
            style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,85,0,0.15)" }}
          >
            {/* Header */}
            <div className="relative p-5 border-b border-secondary/10 bg-gradient-to-r from-accent/15 via-transparent to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-accent text-primary flex items-center justify-center font-bold text-base shadow-md">
                  ✦
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    Pip <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">NACL Companion</span>
                  </h4>
                  <p className="text-[11px] text-additional/80 leading-tight mt-0.5">
                    {GREETINGS[greetingIndex]}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary/20 text-additional hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close Assistant"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content & Options Accordion */}
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Option 1: Find Events */}
              <div className="border border-secondary/10 rounded-2xl overflow-hidden bg-secondary/5">
                <button
                  onClick={() => setActiveTab(activeTab === "events" ? null : "events")}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white hover:text-accent transition-colors"
                  aria-expanded={activeTab === "events"}
                >
                  <span className="flex items-center gap-2.5">
                    <Search size={16} className="text-accent" /> Find Experiences
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeTab === "events" ? "rotate-180 text-accent" : "text-additional/60"}`} />
                </button>

                <AnimatePresence>
                  {activeTab === "events" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3.5 pb-3.5 pt-1 border-t border-secondary/10 space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Search city, mace, flow, sauna..."
                        value={eventQuery}
                        onChange={(e) => setEventQuery(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-primary border border-secondary/15 text-xs text-white focus:outline-none focus:border-accent"
                      />

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {filteredEvents.map((ev) => (
                          <Link
                            key={ev.id}
                            href={`/events/${ev.id}`}
                            onClick={() => setIsOpen(false)}
                            className="block p-2.5 rounded-xl bg-secondary/10 hover:bg-accent/20 border border-secondary/10 hover:border-accent/40 transition-all group"
                          >
                            <div className="font-bold text-xs text-white group-hover:text-accent truncate">{ev.title}</div>
                            <div className="flex justify-between text-[10px] text-additional/70 mt-1">
                              <span>{ev.venue}</span>
                              <span className="text-accent font-semibold">{ev.date}</span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <Link
                        href="/events"
                        onClick={() => setIsOpen(false)}
                        className="block text-center py-2 text-[11px] font-bold text-accent hover:underline uppercase tracking-wider"
                      >
                        View All Gatherings →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Option 2: Payment Help */}
              <div className="border border-secondary/10 rounded-2xl overflow-hidden bg-secondary/5">
                <button
                  onClick={() => setActiveTab(activeTab === "payments" ? null : "payments")}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white hover:text-accent transition-colors"
                  aria-expanded={activeTab === "payments"}
                >
                  <span className="flex items-center gap-2.5">
                    <CreditCard size={16} className="text-accent" /> Payment & Bookings
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeTab === "payments" ? "rotate-180 text-accent" : "text-additional/60"}`} />
                </button>

                <AnimatePresence>
                  {activeTab === "payments" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3.5 pb-3.5 pt-1 border-t border-secondary/10 space-y-2 text-xs"
                    >
                      <div className="mb-3 pt-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-accent mb-1">
                          Check Real Order Status
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter Order ID or Email..."
                            value={orderSearchQuery}
                            onChange={(e) => setOrderSearchQuery(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-primary border border-secondary/15 text-[11px] text-white focus:outline-none focus:border-accent"
                          />
                          <button
                            onClick={handleCheckOrder}
                            className="px-3 py-1.5 bg-accent text-primary font-bold text-[10px] uppercase rounded-xl hover:bg-white transition-colors"
                          >
                            Check
                          </button>
                        </div>
                        {orderSearchResult && (
                          <div className="mt-2 p-2.5 rounded-xl bg-secondary/10 border border-accent/30 text-[11px] space-y-1">
                            <div className="font-bold text-white flex justify-between">
                              <span>{orderSearchResult.eventTitle}</span>
                              <span className="text-accent">₹{orderSearchResult.amount}</span>
                            </div>
                            <div className="text-[10px] text-additional">
                              Status: <span className="text-emerald-400 font-bold">{orderSearchResult.status}</span> · Order #{orderSearchResult.orderId}
                            </div>
                          </div>
                        )}
                        {orderSearchResult === null && orderSearchQuery.trim() !== "" && (
                          <div className="mt-2 text-[10px] text-red-400 font-semibold">
                            No matching order found. Check spelling or view My NaCl dashboard.
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] font-bold uppercase tracking-widest text-additional/60 border-t border-secondary/10 pt-2 mb-1">
                        Payment FAQs
                      </div>

                      {PAYMENT_FAQS.map((faq, idx) => (
                        <div key={idx} className="border-b border-secondary/10 pb-2 last:border-none">
                          <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                            className="w-full text-left font-semibold text-additional/90 hover:text-white py-1 flex justify-between items-center text-[11px]"
                          >
                            <span>{faq.q}</span>
                            <span className="text-accent ml-2">{openFaqIndex === idx ? "-" : "+"}</span>
                          </button>
                          {openFaqIndex === idx && (
                            <p className="text-[10px] text-additional/70 leading-relaxed mt-1 pl-2 border-l border-accent/40">
                              {faq.a}
                            </p>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Option 3: Event Guidelines */}
              <div className="border border-secondary/10 rounded-2xl overflow-hidden bg-secondary/5">
                <button
                  onClick={() => setActiveTab(activeTab === "guidelines" ? null : "guidelines")}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white hover:text-accent transition-colors"
                  aria-expanded={activeTab === "guidelines"}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-accent" /> Gathering Guidelines
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeTab === "guidelines" ? "rotate-180 text-accent" : "text-additional/60"}`} />
                </button>

                <AnimatePresence>
                  {activeTab === "guidelines" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3.5 pb-3.5 pt-1 border-t border-secondary/10 text-[11px] text-additional/80 whitespace-pre-line leading-relaxed"
                    >
                      {guidelinesContent}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Option 5: Get Notified About New Events */}
              <div className="border border-secondary/10 rounded-2xl overflow-hidden bg-secondary/5">
                <button
                  onClick={() => setActiveTab(activeTab === "notify" as any ? null : ("notify" as any))}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white hover:text-accent transition-colors"
                  aria-expanded={activeTab === ("notify" as any)}
                >
                  <span className="flex items-center gap-2.5">
                    <Bell size={16} className="text-accent" /> Get Notified About New Events
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeTab === ("notify" as any) ? "rotate-180 text-accent" : "text-additional/60"}`} />
                </button>

                <AnimatePresence>
                  {activeTab === ("notify" as any) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3.5 pb-3.5 pt-1 border-t border-secondary/10"
                    >
                      {petNotifySubmitted ? (
                        <div className="py-3 text-center text-xs text-accent font-bold flex items-center justify-center gap-2">
                          <Check size={16} /> Subscribed for event drop alerts!
                        </div>
                      ) : (
                        <form onSubmit={handlePetNotifySubmit} className="space-y-2 text-xs">
                          <input
                            type="email"
                            required
                            placeholder="Your Email *"
                            value={petNotifyEmail}
                            onChange={(e) => setPetNotifyEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-primary border border-secondary/15 text-white focus:outline-none focus:border-accent"
                          />
                          <select
                            value={petNotifyCity}
                            onChange={(e) => setPetNotifyCity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-primary border border-secondary/15 text-white font-semibold focus:outline-none"
                          >
                            <option value="All" className="bg-primary text-white">All Hubs (Pan-India)</option>
                            <option value="Bangalore" className="bg-primary text-white">Bangalore Hub</option>
                            <option value="Mumbai" className="bg-primary text-white">Mumbai Hub</option>
                            <option value="Coimbatore" className="bg-primary text-white">Coimbatore Hub</option>
                          </select>
                          <button
                            type="submit"
                            className="w-full py-2 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-[10px]"
                          >
                            <Bell size={12} /> Subscribe For Drop Alerts
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="border border-secondary/10 rounded-2xl overflow-hidden bg-secondary/5">
                <button
                  onClick={() => setActiveTab(activeTab === "support" ? null : "support")}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white hover:text-accent transition-colors"
                  aria-expanded={activeTab === "support"}
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare size={16} className="text-accent" /> Talk to Support
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeTab === "support" ? "rotate-180 text-accent" : "text-additional/60"}`} />
                </button>

                <AnimatePresence>
                  {activeTab === "support" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3.5 pb-3.5 pt-1 border-t border-secondary/10"
                    >
                      {supportSubmitted ? (
                        <div className="py-4 text-center text-xs text-accent font-bold flex items-center justify-center gap-2">
                          <Check size={16} /> Support message sent! Pip will follow up soon.
                        </div>
                      ) : (
                        <form onSubmit={handleSupportSubmit} className="space-y-2.5 text-xs">
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={supportName}
                            onChange={(e) => setSupportName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-primary border border-secondary/15 text-white focus:outline-none focus:border-accent"
                          />
                          <input
                            type="email"
                            placeholder="Your Email (Optional)"
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-primary border border-secondary/15 text-white focus:outline-none focus:border-accent"
                          />
                          <textarea
                            required
                            rows={2}
                            placeholder="How can we assist you?"
                            value={supportMsg}
                            onChange={(e) => setSupportMsg(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-primary border border-secondary/15 text-white focus:outline-none focus:border-accent resize-none"
                          />
                          <button
                            type="submit"
                            className="w-full py-2 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-[10px]"
                          >
                            <Send size={12} /> Send Support Request
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING PET MASCOT BUTTON */}
      <motion.button
        onClick={toggleOpen}
        drag
        dragConstraints={dragBounds}
        onDragEnd={(_, info) => {
          const newPos = { x: position.x + info.offset.x, y: position.y + info.offset.y };
          setPosition(newPos);
          localStorage.setItem("nacl_pet_position", JSON.stringify(newPos));
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto relative group flex items-center justify-center cursor-pointer focus:outline-none"
        aria-label="Open NaCl Pip Companion Assistant"
      >
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-accent/40 blur-xl group-hover:bg-accent/60 transition-all duration-300 animate-pulse" />

        {/* Mascot SVG Creature */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-2 border-accent/60 shadow-2xl flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-12 h-12">
            {/* Blob Body */}
            <motion.path
              d="M 50 15 C 75 15 85 30 85 50 C 85 75 70 85 50 85 C 30 85 15 75 15 50 C 15 30 25 15 50 15 Z"
              fill="url(#petGradient)"
              animate={reducedMotion ? {} : {
                d: [
                  "M 50 15 C 75 15 85 30 85 50 C 85 75 70 85 50 85 C 30 85 15 75 15 50 C 15 30 25 15 50 15 Z",
                  "M 50 12 C 78 16 88 32 84 52 C 82 74 68 88 50 84 C 32 88 18 74 16 52 C 12 32 22 16 50 12 Z",
                  "M 50 15 C 75 15 85 30 85 50 C 85 75 70 85 50 85 C 30 85 15 75 15 50 C 15 30 25 15 50 15 Z",
                ]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="petGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF5500" />
                <stop offset="100%" stopColor="#CC3300" />
              </linearGradient>
            </defs>

            {/* Left Eye Socket */}
            <circle cx="38" cy="42" r="10" fill="#FFFFFF" />
            {/* Right Eye Socket */}
            <circle cx="62" cy="42" r="10" fill="#FFFFFF" />

            {/* Left Pupil (LERP Tracked) */}
            <circle ref={pupilLeftRef} cx="38" cy="42" r="5" fill="#0A0A0A" />
            {/* Right Pupil (LERP Tracked) */}
            <circle ref={pupilRightRef} cx="62" cy="42" r="5" fill="#0A0A0A" />

            {/* Eye Highlight Specs */}
            <circle cx="36" cy="40" r="2" fill="#FFFFFF" />
            <circle cx="60" cy="40" r="2" fill="#FFFFFF" />

            {/* Friendly Smile */}
            <path
              d="M 42 62 Q 50 69 58 62"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Sparkle badge */}
          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent text-primary rounded-full flex items-center justify-center text-[8px] font-bold">
            ✦
          </div>
        </div>
      </motion.button>
    </div>
  );
}
