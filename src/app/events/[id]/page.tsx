"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowLeft, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommunityMatch from "@/components/minigame/CommunityMatch";
import { getEventById, createRegistration, getUserSession, saveUserSession, getRegistrations, EventType, RegistrationType } from "@/lib/store";

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [event, setEvent] = useState<EventType | null>(null);
  
  // Checkout flow state machine
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "quiz" | "checkout" | "ticket">("idle");
  const [userArchetype, setUserArchetype] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [registeredTicket, setRegisteredTicket] = useState<RegistrationType | null>(null);
  const [approvedAttendees, setApprovedAttendees] = useState<RegistrationType[]>([]);

  useEffect(() => {
    const refreshData = () => {
      if (id) {
        const found = getEventById(id);
        if (found) {
          setEvent(found);
        }
        const allRegs = getRegistrations();
        const approved = allRegs.filter(r => r.eventId === id && r.status === "approved");
        setApprovedAttendees(approved);
      }
    };
    
    refreshData();
    window.addEventListener("nacl_events_update", refreshData);
    return () => window.removeEventListener("nacl_events_update", refreshData);
  }, [id]);

  const handleJoinClick = () => {
    const session = getUserSession();
    if (session.archetype) {
      setUserArchetype(session.archetype);
      setUserName(session.name || "");
      setUserEmail(session.email || "");
      setCheckoutStep("checkout");
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

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !userName || !userEmail || !userArchetype) return;

    const res = createRegistration(event.id, userName, userEmail, userArchetype);
    if (res.success) {
      // Save name, email, and archetype to local user session so they carry over to chat and other pages
      const session = getUserSession();
      session.name = userName;
      session.email = userEmail;
      session.archetype = userArchetype;
      session.isLoggedIn = true;
      saveUserSession(session);
      window.dispatchEvent(new Event("nacl_session_update"));

      setRegisteredTicket(res.registration);
      setCheckoutStep("ticket");
      
      // Update local event seat count state
      const updatedEvent = getEventById(event.id);
      if (updatedEvent) {
        setEvent(updatedEvent);
      }
      
      // Trigger update events
      window.dispatchEvent(new Event("nacl_events_update"));
    } else {
      alert(res.message);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-primary text-secondary">
        <div className="text-4xl text-accent mb-4">✦</div>
        <h3 className="text-2xl font-bold text-white mb-2">Gathering Not Found</h3>
        <p className="text-additional mb-8 max-w-xs text-center">The experience directory has no record of this ID.</p>
        <Link href="/events" className="px-6 py-3 bg-secondary text-primary font-bold rounded-full text-sm">
          Return to Experiences
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-primary text-secondary">
      {/* Hero Cover */}
      <div className="relative h-[55vh] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        
        <Link 
          href="/events" 
          className="absolute top-28 left-6 z-10 flex items-center gap-2 text-additional hover:text-white transition-colors text-sm font-semibold"
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
          className="bg-primary/95 backdrop-blur-xl border border-secondary/15 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content Column */}
            <div className="flex-1">
              <div className="inline-block bg-accent/10 border border-accent/20 text-accent px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                {event.title}
              </h1>
              
              <div className="whitespace-pre-line text-additional/80 leading-relaxed text-sm mb-12">
                {event.description}
              </div>

              {/* Timeline */}
              <h3 className="text-xl font-bold mb-6 text-white border-b border-secondary/10 pb-3">Session Timeline</h3>
              <div className="space-y-6 mb-12">
                {event.timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 text-sm">
                    <div className="text-accent font-bold w-20 shrink-0">{item.time}</div>
                    <div className="text-white font-medium">{item.event}</div>
                  </div>
                ))}
              </div>

              {/* Host Card */}
              <h3 className="text-xl font-bold mb-6 text-white border-b border-secondary/10 pb-3">Curated By</h3>
              <div className="flex items-center gap-4 bg-secondary/5 border border-secondary/5 p-4 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={event.host.image} 
                  alt={event.host.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-secondary/10" 
                />
                <div>
                  <div className="font-bold text-white text-base">{event.host.name}</div>
                  <div className="text-xs text-additional">{event.host.role}</div>
                </div>
              </div>

              {/* Approved Attendees Section */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-secondary/10 pb-3">Movers Joining Us</h3>
                {approvedAttendees.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
                    {approvedAttendees.map((attendee) => (
                      <div key={attendee.id} className="bg-secondary/5 border border-secondary/10 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/15 border border-accent/20 text-accent font-black text-xs rounded-xl flex items-center justify-center shrink-0">
                          {attendee.userName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs truncate">{attendee.userName}</div>
                          <div className="text-[10px] text-accent uppercase tracking-widest font-semibold mt-0.5">{attendee.archetype}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6 text-center text-additional/40 text-xs">
                    Be the first approved attendee to join! Register above.
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-secondary/5 rounded-3xl p-6 border border-secondary/10 sticky top-28 space-y-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-3.5 text-sm">
                    <Calendar className="text-accent shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-bold text-white">{event.date}</div>
                      <div className="text-xs text-additional">{event.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 text-sm">
                    <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-bold text-white">{event.venue}</div>
                      {event.address && <div className="text-xs text-additional leading-snug mt-1">{event.address}</div>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 text-sm">
                    <Users className="text-accent shrink-0 mt-0.5" size={18} />
                    <div>
                      <div className="font-bold text-white">{event.remainingSeats} Spots Remaining</div>
                      <div className="text-xs text-additional">Total capacity: {event.seats}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-secondary/10 pt-5 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-additional font-medium">Ticket Price</div>
                    <div className="text-2xl font-black text-white">₹{event.price}</div>
                  </div>
                  <div className="text-xs text-accent bg-accent/15 border border-accent/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                    All Access
                  </div>
                </div>
                
                {event.remainingSeats > 0 ? (
                  <button 
                    onClick={handleJoinClick}
                    className="w-full min-h-[48px] py-4 bg-accent text-primary font-extrabold rounded-2xl hover:bg-white hover:text-primary transition-all duration-300 shadow-lg text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} /> Register for Experience
                  </button>
                ) : (
                  <div className="w-full min-h-[48px] py-4 bg-secondary/10 text-additional/50 text-center font-bold rounded-2xl border border-secondary/5 text-sm cursor-not-allowed flex items-center justify-center">
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

      {/* CHECKOUT STEP OVERLAY */}
      <AnimatePresence>
        {checkoutStep === "checkout" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/85 backdrop-blur-md"
              onClick={() => setCheckoutStep("idle")}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-primary border border-secondary/15 rounded-3xl w-full max-w-md p-8 shadow-2xl z-10 text-secondary"
            >
              <button 
                onClick={() => setCheckoutStep("idle")}
                className="absolute top-6 right-6 text-additional hover:text-white transition-colors"
              >
                <XIcon size={20} className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <Users className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white tracking-tight">Register for Event</h3>
                <p className="text-xs text-additional mt-1">{event.title}</p>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-additional uppercase tracking-widest mb-1">Your Match Archetype</label>
                  <div className="w-full bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 text-accent font-bold text-sm flex items-center gap-2">
                    <Sparkles size={14} /> Unlocked: {userArchetype}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-additional uppercase tracking-widest mb-1.5">Participant Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-additional uppercase tracking-widest mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-secondary/5 border border-secondary/10 focus:border-accent hover:border-secondary/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="border-t border-secondary/10 pt-4 flex justify-between items-center text-sm">
                  <span className="text-additional font-medium">Ticket Amount:</span>
                  <span className="text-lg font-black text-white">₹{event.price}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-accent text-primary hover:bg-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 text-sm"
                >
                  <Check size={16} /> Submit Registration Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION OVERLAY */}
      <AnimatePresence>
        {checkoutStep === "ticket" && registeredTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/90 backdrop-blur-xl"
              onClick={() => setCheckoutStep("idle")}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-primary border border-secondary/15 rounded-3xl w-full max-w-md p-8 shadow-2xl z-10 text-secondary text-center space-y-6"
            >
              <div className="w-16 h-16 bg-accent/15 border border-accent/30 text-accent rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Sparkles size={28} className="animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Request Submitted!</h2>
                <p className="text-xs text-accent uppercase tracking-widest font-bold">Awaiting Verification</p>
              </div>

              <div className="bg-secondary/5 border border-secondary/5 p-6 rounded-2xl text-additional/80 text-sm leading-relaxed space-y-4">
                <p>
                  Thank you for registering, <strong className="text-white">{registeredTicket.userName}</strong>.
                </p>
                <p>
                  Our team will connect with you through your email (<span className="text-white font-mono">{registeredTicket.userEmail}</span>) shortly to finalize your event placement.
                </p>
                <div className="border-t border-secondary/10 pt-4 text-xs font-bold italic text-accent">
                  Please complete the registration for the event through the link provided in the mail.
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep("idle")}
                className="w-full py-4 bg-accent text-primary hover:bg-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent/15 text-sm uppercase tracking-wider"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple fallback X icon replacement to resolve local lint or import warnings
function XIcon({ className, size = 20 }: { className?: string; size?: number }) {
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
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
