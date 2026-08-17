"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowLeft, Sparkles, Lock, QrCode, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommunityMatch from "@/components/minigame/CommunityMatch";
import RazorpayModal from "@/components/events/RazorpayModal";
import AuthModal from "@/components/auth/AuthModal";
import { getEventById, completeRazorpayRegistration, getUserSession, saveUserSession, getRegistrations, EventType, RegistrationType } from "@/lib/store";

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [event, setEvent] = useState<EventType | null>(null);
  
  // Checkout flow state machine: "idle" | "quiz" | "checkout" | "razorpay" | "ticket"
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "quiz" | "checkout" | "razorpay" | "ticket">("idle");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userArchetype, setUserArchetype] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [registeredTicket, setRegisteredTicket] = useState<RegistrationType | null>(null);
  const [approvedAttendees, setApprovedAttendees] = useState<RegistrationType[]>([]);

  useEffect(() => {
    const refreshData = async () => {
      if (id) {
        const found = getEventById(id);
        if (found) {
          setEvent(found);
        }

        const localRegs = getRegistrations().filter(r => 
          r.eventId === id && 
          r.status === "approved" && 
          r.userName && 
          !r.userName.toLowerCase().includes("guest")
        );

        try {
          const res = await fetch(`/api/registrations?eventId=${id}`);
          const data = await res.json();
          if (data.success && data.registrations) {
            const merged = [...localRegs, ...data.registrations];
            const unique = merged.filter((r, idx, self) => 
              self.findIndex(t => t.id === r.id || (t.userName?.toLowerCase() === r.userName?.toLowerCase() && t.userEmail === r.userEmail)) === idx
            );
            setApprovedAttendees(unique);
            return;
          }
        } catch {
          // Fallback to local
        }
        setApprovedAttendees(localRegs);
      }
    };
    
    refreshData();
    window.addEventListener("nacl_events_update", refreshData);
    return () => window.removeEventListener("nacl_events_update", refreshData);
  }, [id]);

  const handleJoinClick = () => {
    const session = getUserSession();
    if (session.name) {
      setUserName(session.name);
      setUserEmail(session.email || "");
      if (session.archetype) {
        setUserArchetype(session.archetype);
        setCheckoutStep("checkout");
      } else {
        setCheckoutStep("quiz");
      }
    } else {
      setCheckoutStep("quiz");
    }
  };

  const handleQuizComplete = (archetype: string) => {
    setUserArchetype(archetype);
    const session = getUserSession();
    setUserName(session.name || "");
    setUserEmail(session.email || "");
    setCheckoutStep("checkout");
  };

  const handleProceedToRazorpay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;
    setCheckoutStep("razorpay");
  };

  const handlePaymentSuccess = async ({ paymentId, paymentMethod, orderId }: { paymentId: string; paymentMethod: string; orderId: string }) => {
    if (!event) return;

    // 1. Sync to backend API
    try {
      await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          userName: userName.trim(),
          userEmail: userEmail.trim(),
          archetype: userArchetype || "Movement Explorer",
          price: event.price,
          paymentId,
          paymentMethod,
          orderId
        })
      });
    } catch (err) {
      console.warn("Backend registration API offline:", err);
    }

    // 2. Save locally
    const res = completeRazorpayRegistration({
      eventId: event.id,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      archetype: userArchetype || "Movement Explorer",
      paymentId,
      paymentMethod
    });

    if (res.success) {
      const session = getUserSession();
      session.name = userName.trim();
      session.email = userEmail.trim();
      session.archetype = userArchetype;
      session.isLoggedIn = true;
      saveUserSession(session);
      window.dispatchEvent(new Event("nacl_session_update"));

      setRegisteredTicket(res.registration);
      setCheckoutStep("ticket");
      
      const updatedEvent = getEventById(event.id);
      if (updatedEvent) {
        setEvent(updatedEvent);
      }
      
      window.dispatchEvent(new Event("nacl_events_update"));
    } else {
      alert(res.message);
      setCheckoutStep("idle");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-[#0A0A0A] text-[#f0f2db]">
        <div className="text-4xl text-[#ef542a] mb-4">✦</div>
        <h3 className="text-2xl font-header font-bold text-white mb-2">Gathering Not Found</h3>
        <p className="text-xs text-[#f0f2db]/70 mb-8 max-w-xs text-center">The experience directory has no record of this ID.</p>
        <Link href="/events" className="px-6 py-3 bg-[#ef542a] text-[#0A0A0A] font-header font-bold rounded-full text-xs uppercase tracking-wider">
          Return to Experiences
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0A0A0A] text-[#f0f2db] font-body">
      {/* Hero Cover */}
      <div className="relative h-[55vh] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        
        <Link 
          href="/events" 
          className="absolute top-28 left-6 z-10 flex items-center gap-2 text-[#f0f2db]/80 hover:text-white transition-colors text-sm font-semibold bg-[#0A0A0A]/60 px-4 py-2 rounded-full backdrop-blur-md border border-[#f0f2db]/10"
        >
          <ArrowLeft size={16} /> Back to Experiences
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#121212]/95 backdrop-blur-xl border border-[#f0f2db]/15 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content Column */}
            <div className="flex-1">
              <div className="inline-block bg-[#ef542a]/15 border border-[#ef542a]/30 text-[#ef542a] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-header font-extrabold tracking-tight text-white mb-6 leading-tight">
                {event.title}
              </h1>
              
              <div className="whitespace-pre-line text-[#f0f2db]/80 leading-relaxed text-sm mb-12">
                {event.description}
              </div>

              {/* Timeline */}
              <h3 className="text-xl font-header font-bold mb-6 text-white border-b border-[#f0f2db]/10 pb-3">Session Timeline</h3>
              <div className="space-y-6 mb-12">
                {event.timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 text-sm">
                    <div className="text-[#ef542a] font-bold w-20 shrink-0">{item.time}</div>
                    <div className="text-white font-medium">{item.event}</div>
                  </div>
                ))}
              </div>

              {/* Host Card */}
              <h3 className="text-xl font-header font-bold mb-6 text-white border-b border-[#f0f2db]/10 pb-3">Curated By</h3>
              <div className="flex items-center gap-4 bg-[#181818] border border-[#f0f2db]/10 p-4 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={event.host.image} 
                  alt={event.host.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-[#f0f2db]/10" 
                />
                <div>
                  <div className="font-header font-bold text-white text-base">{event.host.name}</div>
                  <div className="text-xs text-[#f0f2db]/70">{event.host.role}</div>
                </div>
              </div>

              {/* Confirmed & Paid Attendees with Admin Approval Badges */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-between border-b border-[#f0f2db]/10 pb-3">
                  <div>
                    <h3 className="text-xl font-header font-bold text-white flex items-center gap-2">
                      <Users size={20} className="text-[#ef542a]" />
                      <span>Registered & Confirmed Movers</span>
                    </h3>
                    <p className="text-[11px] text-[#f0f2db]/60 mt-0.5">
                      Participants verified with Razorpay payment and approved by NaCl Admin.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#ffd139] bg-[#ffd139]/10 border border-[#ffd139]/30 px-3 py-1 rounded-full">
                    {approvedAttendees.length} Confirmed
                  </span>
                </div>

                {approvedAttendees.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {approvedAttendees.map((attendee) => (
                      <div key={attendee.id} className="bg-[#181818] border border-[#f0f2db]/10 hover:border-[#ef542a]/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#ef542a]/15 border border-[#ef542a]/30 text-[#ef542a] font-header font-black text-sm rounded-xl flex items-center justify-center shrink-0">
                            {attendee.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-header font-bold text-white text-sm truncate flex items-center gap-1.5">
                              <span>{attendee.userName}</span>
                            </div>
                            <div className="text-[10px] text-[#ffd139] uppercase tracking-widest font-semibold mt-0.5 truncate">
                              {attendee.archetype || "Movement Explorer"}
                            </div>
                          </div>
                        </div>

                        {/* Status Badges: Paid & Admin Approved */}
                        <div className="pt-2 border-t border-[#f0f2db]/5 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                            <ShieldCheck size={11} /> Approved by Admin
                          </span>
                          <span className="flex items-center gap-1 text-[#3395ff] bg-[#0c2340] border border-[#3395ff]/30 px-2 py-0.5 rounded-md font-semibold">
                            <CheckCircle2 size={11} /> Paid via Razorpay
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#181818] border border-[#f0f2db]/10 rounded-2xl p-6 text-center text-[#f0f2db]/50 text-xs">
                    Be the first attendee to join! Register below.
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-[#181818] rounded-3xl p-6 border border-[#f0f2db]/10 sticky top-28 space-y-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-3.5 text-sm">
                    <Calendar className="text-[#ef542a] shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-header font-bold text-white">{event.date}</div>
                      <div className="text-xs text-[#f0f2db]/70">{event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 text-sm">
                    <MapPin className="text-[#ef542a] shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-header font-bold text-white">{event.venue}</div>
                      {event.address && <div className="text-xs text-[#f0f2db]/70 leading-snug mt-1">{event.address}</div>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 text-sm">
                    <Users className="text-[#ef542a] shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-header font-bold text-white">{event.remainingSeats} Spots Remaining</div>
                      <div className="text-xs text-[#f0f2db]/70">Total capacity: {event.seats}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#f0f2db]/10 pt-5 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-[#f0f2db]/60 font-medium">Pass Price</div>
                    <div className="text-2xl font-header font-black text-white">₹{event.price.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="text-xs text-[#ffd139] bg-[#ffd139]/10 border border-[#ffd139]/30 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                    All Access
                  </div>
                </div>
                
                {event.remainingSeats > 0 ? (
                  <button 
                    onClick={handleJoinClick}
                    className="w-full min-h-[48px] py-4 bg-[#ef542a] text-[#0A0A0A] font-header font-black rounded-2xl hover:bg-[#ffd139] transition-all duration-300 shadow-lg text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} /> Book Experience Pass
                  </button>
                ) : (
                  <div className="w-full min-h-[48px] py-4 bg-[#f0f2db]/10 text-[#f0f2db]/40 text-center font-bold rounded-2xl border border-[#f0f2db]/5 text-sm cursor-not-allowed flex items-center justify-center">
                    Sold Out
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QUIZ STEP OVERLAY */}
      <AnimatePresence>
        {checkoutStep === "quiz" && (
          <CommunityMatch 
            onClose={() => setCheckoutStep("idle")} 
            eventId={event.id}
            onComplete={handleQuizComplete}
          />
        )}
      </AnimatePresence>

      {/* CHECKOUT STEP 1: PARTICIPANT DETAILS OVERLAY */}
      <AnimatePresence>
        {checkoutStep === "checkout" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setCheckoutStep("idle")}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#121212] border border-[#f0f2db]/15 rounded-3xl w-full max-w-md p-8 shadow-2xl z-10 text-[#f0f2db]"
            >
              <button 
                onClick={() => setCheckoutStep("idle")}
                className="absolute top-6 right-6 text-[#f0f2db]/60 hover:text-white transition-colors"
              >
                <XIcon size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#ef542a]/15 border border-[#ef542a]/30 text-[#ef542a] flex items-center justify-center mx-auto mb-3 shadow">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-header font-black text-white tracking-tight">Participant Details</h3>
                <p className="text-xs text-[#f0f2db]/70 mt-1">{event.title}</p>
              </div>

              <form onSubmit={handleProceedToRazorpay} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-widest mb-1">Your Match Archetype</label>
                  <div className="w-full bg-[#ffd139]/10 border border-[#ffd139]/30 rounded-xl px-4 py-3 text-[#ffd139] font-bold text-sm flex items-center gap-2">
                    <Sparkles size={14} /> Unlocked: {userArchetype || "Movement Explorer"}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-widest mb-1.5">Participant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-widest mb-1.5">Email Address (for ticket receipt) *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-[#181818] border border-[#f0f2db]/15 focus:border-[#ef542a] rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="border-t border-[#f0f2db]/10 pt-4 flex justify-between items-center text-sm">
                  <span className="text-[#f0f2db]/70 font-medium">Ticket Amount:</span>
                  <span className="text-xl font-header font-black text-white">₹{event.price.toLocaleString("en-IN")}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-wider shadow-lg"
                >
                  <Lock size={16} /> Proceed to Razorpay Payment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RAZORPAY PAYMENT MODAL */}
      <RazorpayModal
        isOpen={checkoutStep === "razorpay"}
        onClose={() => setCheckoutStep("checkout")}
        eventTitle={event.title}
        amount={event.price}
        userName={userName}
        userEmail={userEmail}
        onSuccess={handlePaymentSuccess}
      />

      {/* CONFIRMED VIP TICKET RECEIPT OVERLAY */}
      <AnimatePresence>
        {checkoutStep === "ticket" && registeredTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setCheckoutStep("idle")}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#121212] border border-[#ef542a]/40 rounded-3xl w-full max-w-lg p-8 shadow-2xl z-10 text-[#f0f2db] text-center space-y-6"
            >
              {/* Success Badge */}
              <div className="w-16 h-16 bg-[#ef542a]/20 border border-[#ef542a]/40 text-[#ef542a] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,84,42,0.35)]">
                <CheckCircle2 size={32} className="text-[#ffd139]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#ef542a]/20 text-[#ef542a] border border-[#ef542a]/30">
                    Payment Verified · Pass Confirmed
                  </span>
                </div>
                <h2 className="text-3xl font-header font-black text-white tracking-tight pt-1">
                  You&apos;re In, {registeredTicket.userName}!
                </h2>
                <p className="text-xs text-[#f0f2db]/70">{event.title}</p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-[#181818] border border-[#f0f2db]/15 rounded-2xl p-6 text-left space-y-4 shadow-inner">
                <div className="flex justify-between items-start border-b border-[#f0f2db]/10 pb-3">
                  <div>
                    <div className="text-[10px] font-bold text-[#ffd139] uppercase tracking-wider">Order & Pass ID</div>
                    <div className="text-sm font-mono font-bold text-white">{registeredTicket.qrCode}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-[#f0f2db]/50 uppercase tracking-wider">Razorpay ID</div>
                    <div className="text-xs font-mono text-[#aadeef]">{registeredTicket.paymentId || "pay_verified"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#f0f2db]/50 text-[10px] block uppercase">Session Date</span>
                    <span className="font-bold text-white">{event.date} · {event.time}</span>
                  </div>
                  <div>
                    <span className="text-[#f0f2db]/50 text-[10px] block uppercase">Venue Location</span>
                    <span className="font-bold text-white truncate block">{event.venue}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between bg-[#121212] p-3 rounded-xl border border-[#f0f2db]/10">
                  <div className="flex items-center gap-2.5">
                    <QrCode size={36} className="text-[#ffd139]" />
                    <div className="text-[11px] text-[#f0f2db]/80 leading-tight">
                      <div>Show QR code at event check-in</div>
                      <div className="text-[9px] text-[#f0f2db]/50">Sent to {registeredTicket.userEmail}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-header font-black text-white">₹{event.price.toLocaleString("en-IN")}</div>
                    <div className="text-[9px] text-[#ef542a] font-bold">PAID</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://chat.whatsapp.com/DfBcTNDUwBcCS1OTY73Qxl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-4 bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Join Event WhatsApp Group</span>
                  <ArrowUpRight size={14} />
                </a>

                <button
                  onClick={() => setCheckoutStep("idle")}
                  className="py-3.5 px-6 bg-[#f0f2db]/10 hover:bg-[#f0f2db]/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors border border-[#f0f2db]/10"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
