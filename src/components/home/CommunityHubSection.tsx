"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Activity
} from "lucide-react";

const WHATSAPP_LINK = "https://chat.whatsapp.com/DfBcTNDUwBcCS1OTY73Qxl";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export default function CommunityHubSection() {
  const [onlineCount, setOnlineCount] = useState(148);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#0A0A0A] py-24 md:py-32 px-6 border-t border-[#f0f2db]/10 overflow-hidden font-body text-[#f0f2db]">
      {/* Dynamic Background Glows with Brand Palette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(239,84,42,0.08),transparent_65%)]" />
      <div className="absolute -top-24 right-10 w-[500px] h-[500px] bg-[#ffd139]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-[500px] h-[500px] bg-[#aadeef]/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #f0f2db 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <div className="text-[#ffd139] font-body font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef542a] animate-ping" />
              <span>Live Collective Network · Bangalore · Mumbai · Coimbatore</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-header font-extrabold tracking-tight text-[#f0f2db] leading-none">
              The NaCl <span className="font-highlight text-[#ef542a] tracking-normal">Community</span>
            </h2>
            <p className="text-[#f0f2db]/80 font-body text-sm md:text-base leading-relaxed mt-4">
              We are a decentralized community of founders, creators, athletes, and movement design enthusiasts. Connect in person, join regional squads, and sweat together.
            </p>
          </div>

          {/* Quick Header WhatsApp CTA */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(239,84,42,0.3)] hover:shadow-[0_0_40px_rgba(255,209,57,0.4)] hover:scale-105 group shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#0A0A0A]" />
            <span>Join WhatsApp Hub</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#0A0A0A]" />
          </a>
        </div>

        {/* HERO FEATURE: HIGH-ENERGY WHATSAPP INVITE INTERFACE */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef542a]/15 via-[#0A0A0A] to-[#0A0A0A] border border-[#ef542a]/30 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          {/* Subtle Ambient Watermark & Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd139]/10 rounded-full blur-3xl pointer-events-none" />
          <WhatsAppIcon className="absolute -right-6 -bottom-6 w-64 h-64 text-[#f0f2db]/[0.03] pointer-events-none select-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: WhatsApp Callout */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ef542a]/15 border border-[#ef542a]/40 text-[#ef542a] text-xs font-body font-bold uppercase tracking-wider">
                  <Activity size={13} className="animate-pulse text-[#ffd139]" />
                  <span>{onlineCount} active movers online</span>
                </span>
                <span className="text-[11px] font-body text-[#f0f2db]/70 bg-[#f0f2db]/5 px-3 py-1 rounded-full border border-[#f0f2db]/10">
                  Official NaCl Group Invite
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl font-header font-black text-[#f0f2db] tracking-tight leading-tight">
                  Direct Line to Hub Jams, Pop-ups & <span className="font-highlight text-[#ffd139]">Spot Openings</span>
                </h3>
                <p className="text-sm font-body text-[#f0f2db]/85 leading-relaxed max-w-xl">
                  Get first access to limited-capacity steel mace flows, Sunday sauna rituals, city group chats, and real-time announcements across Bangalore, Mumbai, and Coimbatore.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-body">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f0f2db]/90 bg-[#141414] px-3.5 py-2.5 rounded-2xl border border-[#f0f2db]/10">
                  <CheckCircle2 size={16} className="text-[#ffd139] shrink-0" />
                  <span>Zero Spam Policy</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f0f2db]/90 bg-[#141414] px-3.5 py-2.5 rounded-2xl border border-[#f0f2db]/10">
                  <Zap size={16} className="text-[#ef542a] shrink-0" />
                  <span>Instant Spot Alerts</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f0f2db]/90 bg-[#141414] px-3.5 py-2.5 rounded-2xl border border-[#f0f2db]/10">
                  <ShieldCheck size={16} className="text-[#aadeef] shrink-0" />
                  <span>Verified Creators</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive WhatsApp Join Action Box */}
            <div className="lg:col-span-5 flex flex-col items-stretch">
              <div className="bg-[#121212]/95 border border-[#ef542a]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#ef542a]/20 border border-[#ef542a]/40 flex items-center justify-center text-[#ef542a] shadow-[0_0_20px_rgba(239,84,42,0.25)] shrink-0">
                    <WhatsAppIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-header font-extrabold text-[#f0f2db] text-base sm:text-lg">NaCl Active Culture Hub</div>
                    <div className="text-xs text-[#ffd139] font-body font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#ef542a] animate-pulse" />
                      <span>WhatsApp Community Group</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f0f2db]/5 border border-[#f0f2db]/10 text-xs text-[#f0f2db]/80 leading-relaxed font-body">
                  &gt; Join 780+ active founders, athletes & creators sharing movement routines, locations and weekly jams.
                </div>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[52px] py-4 bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(239,84,42,0.35)] hover:shadow-[0_15px_40px_rgba(255,209,57,0.4)] text-sm uppercase tracking-wider group"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#0A0A0A]" />
                  <span>Join Community Group</span>
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

                <div className="text-center text-[10px] text-[#f0f2db]/50 font-body">
                  Free instant invite · Opens directly in WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE CITY HUBS SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl sm:text-3xl font-header font-extrabold text-[#f0f2db] flex items-center gap-2.5">
              <MapPin size={24} className="text-[#ef542a]" />
              <span>Active City <span className="font-highlight text-[#ffd139]">Hubs</span></span>
            </h3>
            <span className="text-xs font-body text-[#f0f2db]/60 uppercase tracking-widest">
              3 Active Chapters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                city: "Bangalore Hub",
                venue: "Fit District, Indiranagar",
                members: "450+ Members",
                vibe: "Steel Mace & JCT",
                link: WHATSAPP_LINK,
                badgeColor: "text-[#ef542a] bg-[#ef542a]/10 border-[#ef542a]/30"
              },
              {
                city: "Mumbai Hub",
                venue: "The Nest Gym, Bandra",
                members: "210+ Members",
                vibe: "Rotational Strength",
                link: WHATSAPP_LINK,
                badgeColor: "text-[#ffd139] bg-[#ffd139]/10 border-[#ffd139]/30"
              },
              {
                city: "Coimbatore Hub",
                venue: "Race Course Walkway",
                members: "120+ Members",
                vibe: "Outdoor Movement",
                link: WHATSAPP_LINK,
                badgeColor: "text-[#aadeef] bg-[#aadeef]/10 border-[#aadeef]/30"
              }
            ].map((hub) => (
              <a
                key={hub.city}
                href={hub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#121212]/80 hover:bg-[#181818] border border-[#f0f2db]/10 hover:border-[#ef542a]/50 rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-lg hover:shadow-[0_10px_30px_rgba(239,84,42,0.15)]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-body uppercase tracking-widest text-[#f0f2db]/60">
                      Regional Chapter
                    </span>
                    <ArrowUpRight size={16} className="text-[#f0f2db]/40 group-hover:text-[#ef542a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <h4 className="text-2xl font-header font-black text-[#f0f2db] group-hover:text-[#ef542a] transition-colors">
                    {hub.city}
                  </h4>
                  <div className="text-xs font-body text-[#f0f2db]/70 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#ef542a] shrink-0" />
                    <span>{hub.venue}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f0f2db]/10 flex items-center justify-between">
                  <span className="text-xs font-header font-bold text-[#f0f2db]">
                    {hub.members}
                  </span>
                  <span className={`text-[10px] uppercase font-body font-extrabold tracking-wider px-2.5 py-1 rounded-full border ${hub.badgeColor}`}>
                    {hub.vibe}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
