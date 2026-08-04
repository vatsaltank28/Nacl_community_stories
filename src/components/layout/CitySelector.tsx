"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export type CityHub = "All" | "Bangalore" | "Mumbai" | "Coimbatore";

const CITIES: { id: CityHub; label: string }[] = [
  { id: "All", label: "All Hubs" },
  { id: "Bangalore", label: "Bangalore" },
  { id: "Mumbai", label: "Mumbai" },
  { id: "Coimbatore", label: "Coimbatore" },
];

interface CitySelectorProps {
  className?: string;
  onCityChange?: (city: CityHub) => void;
}

export default function CitySelector({ className = "", onCityChange }: CitySelectorProps) {
  const [selectedCity, setSelectedCity] = useState<CityHub>("All");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("nacl_selected_hub") as CityHub;
    if (saved && CITIES.some((c) => c.id === saved)) {
      setSelectedCity(saved);
    }
  }, []);

  const handleSelect = (city: CityHub) => {
    setSelectedCity(city);
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("nacl_selected_hub", city);
      window.dispatchEvent(new CustomEvent("nacl_hub_change", { detail: city }));
    }
    if (onCityChange) onCityChange(city);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-secondary/10 hover:bg-secondary/20 border border-secondary/15 hover:border-accent/40 text-white transition-all"
        aria-label="Select City Hub"
      >
        <MapPin size={13} className="text-accent" />
        <span>{selectedCity === "All" ? "All Hubs" : selectedCity}</span>
        <ChevronDown size={13} className={`transition-transform ${isOpen ? "rotate-180 text-accent" : "text-additional/60"}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-36 bg-primary/95 border border-secondary/15 rounded-2xl shadow-xl backdrop-blur-xl z-50 py-1 overflow-hidden">
          {CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                selectedCity === c.id
                  ? "bg-accent/20 text-accent font-bold"
                  : "text-additional hover:text-white hover:bg-secondary/10"
              }`}
            >
              <span>{c.label}</span>
              {selectedCity === c.id && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
