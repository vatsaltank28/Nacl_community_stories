"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const mockEvents = [
  {
    id: "rawform-lab",
    title: "NaCl Flow Club: RawForm Lab",
    date: "Sat Jun 27th @ 10:30 AM IST",
    location: "Fit District, Bengaluru",
    category: "Movement",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop",
    price: "From ₹1499"
  },
  {
    id: "creative-pulse",
    title: "Creative Pulse Workshop",
    date: "Sun Jul 5th @ 2:00 PM IST",
    location: "The Design House, Mumbai",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
    price: "From ₹999"
  },
  {
    id: "urban-zen",
    title: "Urban Zen Wellness Retreat",
    date: "Sat Jul 12th @ 8:00 AM IST",
    location: "Eco Center, Delhi",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop",
    price: "From ₹2499"
  }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-32 px-8 max-w-7xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-bold mb-16"
      >
        Discover Experiences
      </motion.h1>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
        {["All", "Movement", "Fitness", "Wellness", "Workshops", "Creative", "Social"].map((cat) => (
          <button key={cat} className="px-6 py-2 rounded-full border border-[#333] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors whitespace-nowrap">
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockEvents.map((event, index) => (
          <motion.a
            href={`/events/${event.id}`}
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block relative rounded-2xl overflow-hidden bg-[#1A1A1A] transform transition-transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF6B35]/20"
          >
            <div className="relative h-64 w-full">
              <Image 
                src={event.image} 
                alt={event.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#0D0D0D]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">
                {event.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">{event.title}</h3>
              <p className="text-[#D9D9D9] mb-1">{event.date}</p>
              <p className="text-[#D9D9D9] text-sm mb-4">{event.location}</p>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#333]">
                <span className="font-medium text-lg">{event.price}</span>
                <span className="text-[#FF6B35] group-hover:translate-x-1 transition-transform inline-block">
                  View Details →
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}