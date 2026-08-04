"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, MapPin } from "lucide-react";
import { getRegistrations, RegistrationType } from "@/lib/store";

export default function CommunityPage() {
  const [registrations, setRegistrations] = useState<RegistrationType[]>([]);

  useEffect(() => {
    // Only display approved members in the directory
    const approved = getRegistrations().filter(reg => reg.status === "approved");
    setRegistrations(approved);

    // Sync on new registrations
    const syncRegistrations = () => {
      const updatedApproved = getRegistrations().filter(reg => reg.status === "approved");
      setRegistrations(updatedApproved);
    };
    window.addEventListener("nacl_events_update", syncRegistrations);

    return () => {
      window.removeEventListener("nacl_events_update", syncRegistrations);
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-primary text-secondary">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Community details */}
        <div className="space-y-4">
          <div className="text-accent font-bold uppercase tracking-widest text-xs">NaCl Club</div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-white leading-none">The Culture Collective</h1>
          <p className="text-additional/80 max-w-2xl text-sm leading-relaxed">
            We are a decentralized community of founders, creators, athletes, and movement design enthusiasts. Meet in person, explore joint control paths, and recover together.
          </p>
        </div>

        {/* Local Hubs */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin size={22} className="text-accent" /> Active City Hubs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Bangalore Hub", loc: "Fit District, Indiranagar", count: "450+ Members", vibe: "Mace & Mobility" },
              { name: "Mumbai Hub", loc: "The Nest, Bandra", count: "210+ Members", vibe: "Rotational Strength" },
              { name: "Coimbatore Hub", loc: "Race Course Walkway", count: "120+ Members", vibe: "Outdoor Calisthenics" }
            ].map((hub) => (
              <div key={hub.name} className="bg-secondary/5 border border-secondary/10 hover:border-accent/20 rounded-3xl p-6 transition-all duration-300">
                <div className="font-bold text-lg text-white mb-1">{hub.name}</div>
                <div className="text-xs text-additional/60 mb-4">{hub.loc}</div>
                <div className="flex justify-between items-center text-xs text-accent font-bold">
                  <span>{hub.count}</span>
                  <span className="bg-accent/10 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-widest">{hub.vibe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Members Directory */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-accent" /> Active Members Register
          </h3>

          {registrations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {registrations.map((member) => (
                <div key={member.id} className="bg-secondary/5 border border-secondary/10 rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-accent/10 border border-accent/20 text-accent font-black text-sm rounded-xl flex items-center justify-center shrink-0">
                    {member.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{member.userName}</div>
                    <div className="flex gap-1.5 items-center mt-0.5">
                      <span className="text-[9px] bg-secondary/10 text-additional/70 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                        {member.archetype}
                      </span>
                      <span className="text-[8px] text-additional/40 truncate">{member.eventTitle.split(":")[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/5 border border-secondary/10 rounded-3xl p-8 text-center text-additional/50 text-xs">
              No approved member registrations in storage yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
