"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Calendar, Users, Search, ArrowUpDown } from "lucide-react";
import { getEvents, EventType } from "@/lib/store";

import InteractiveEventCard from "@/components/events/InteractiveEventCard";

const CATEGORIES = ["All", "Movement", "Fitness", "Wellness", "Workshops", "Social"];

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  useEffect(() => {
    // Load events from store
    setEvents(getEvents());
    
    // Sync store on events update (useful if added via Admin panel)
    const handleSync = () => {
      setEvents(getEvents());
    };
    window.addEventListener("nacl_events_update", handleSync);
    return () => window.removeEventListener("nacl_events_update", handleSync);
  }, []);

  const filteredEvents = events
    .filter(event => {
      const matchCategory = activeCategory === "All" || event.category.toLowerCase() === activeCategory.toLowerCase();
      const matchQuery = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return a.price - b.price;
      }
      return a.id.localeCompare(b.id);
    });

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-primary text-secondary relative overflow-hidden">
      {/* Background depth radial gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_15%,rgba(255,85,0,0.05),transparent_65%)] animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Experiences</div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-8 text-white leading-none">Discover Gatherings</h1>
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-secondary/5 border border-secondary/15 rounded-3xl p-6 mb-12">
            {/* Category Filters */}
            <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 custom-scrollbar max-w-full snap-x shrink-0 sm:flex-wrap w-full lg:w-auto">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 snap-start whitespace-nowrap px-4 py-2.5 min-h-[44px] flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeCategory === category 
                      ? "bg-accent text-primary" 
                      : "bg-secondary/10 text-additional hover:bg-secondary/20 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search and Sort controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-additional/40" size={16} />
                <input 
                  type="text" 
                  placeholder="Find experiences..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-primary border border-secondary/10 focus:border-accent rounded-full pl-10 pr-4 min-h-[48px] py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 w-full sm:w-auto bg-primary border border-secondary/10 rounded-full px-4 min-h-[48px] py-2.5">
                <ArrowUpDown size={14} className="text-additional/40" />
                <span className="text-xs text-additional font-medium mr-2">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-xs text-white font-bold focus:outline-none cursor-pointer h-full py-1"
                >
                  <option value="date" className="bg-primary text-white">Date</option>
                  <option value="price" className="bg-primary text-white">Price</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event, i) => (
              <InteractiveEventCard key={event.id} event={event} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-secondary/5 rounded-3xl border border-secondary/10">
            <div className="text-4xl text-accent mb-4">✦</div>
            <h3 className="text-xl font-bold text-white mb-2">No Experiences Found</h3>
            <p className="text-additional max-w-sm mx-auto text-sm">
              We couldn't find any gatherings matching your criteria. Try adjusting your search query or filters!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
