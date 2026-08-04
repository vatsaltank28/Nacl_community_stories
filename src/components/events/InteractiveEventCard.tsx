"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Users, MoveRight } from "lucide-react";
import { EventType } from "@/lib/store";
import WaitlistModal from "@/components/events/WaitlistModal";

interface InteractiveEventCardProps {
  event: EventType;
  index: number;
}

export default function InteractiveEventCard({ event, index }: InteractiveEventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const rafId = useRef<number | null>(null);

  // Target and current rotation/translation states for smooth lerp
  const targetRotation = useRef({ x: 0, y: 0, shadowX: 0, shadowY: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const buttonOffset = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
  }, []);

  // LERP Animation Loop (rAF optimized)
  const animateTilt = useCallback(() => {
    if (reducedMotion || !cardRef.current) return;

    // Smooth LERP (0.1 speed)
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

    buttonOffset.current.x += (buttonOffset.current.targetX - buttonOffset.current.x) * 0.15;
    buttonOffset.current.y += (buttonOffset.current.targetY - buttonOffset.current.y) * 0.15;

    const rx = currentRotation.current.x.toFixed(2);
    const ry = currentRotation.current.y.toFixed(2);

    // Apply 3D transform to card container
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    cardRef.current.style.boxShadow = `${-targetRotation.current.shadowY * 1.5}px ${targetRotation.current.shadowX * 1.5}px 35px rgba(255, 85, 0, 0.22)`;

    // Apply opposite parallax transform to image layer for multi-depth effect
    if (imageRef.current) {
      const px = (-currentRotation.current.y * 1.2).toFixed(2);
      const py = (currentRotation.current.x * 1.2).toFixed(2);
      imageRef.current.style.transform = `scale(1.1) translate(${px}px, ${py}px)`;
    }

    // Apply magnetic offset to View Details button
    if (buttonRef.current) {
      buttonRef.current.style.transform = `translate(${buttonOffset.current.x.toFixed(2)}px, ${buttonOffset.current.y.toFixed(2)}px)`;
    }

    rafId.current = requestAnimationFrame(animateTilt);
  }, [reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-1 to 1)
    const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
    const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

    // Max 8.5 degrees rotation
    const maxRotate = 8.5;
    targetRotation.current = {
      x: -mouseY * maxRotate,
      y: mouseX * maxRotate,
      shadowX: mouseY * 10,
      shadowY: mouseX * 10,
    };

    // Calculate magnetic button attraction
    if (buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const distBtnX = (e.clientX - btnCenterX) * 0.2;
      const distBtnY = (e.clientY - btnCenterY) * 0.2;
      buttonOffset.current.targetX = Math.max(-10, Math.min(10, distBtnX));
      buttonOffset.current.targetY = Math.max(-8, Math.min(8, distBtnY));
    }

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(animateTilt);
    }
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    targetRotation.current = { x: 0, y: 0, shadowX: 0, shadowY: 0 };
    buttonOffset.current.targetX = 0;
    buttonOffset.current.targetY = 0;

    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      cardRef.current.style.boxShadow = "none";
    }
    if (imageRef.current) {
      imageRef.current.style.transform = "scale(1) translate(0px, 0px)";
    }
    if (buttonRef.current) {
      buttonRef.current.style.transform = "translate(0px, 0px)";
    }

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const isLowSpots = event.remainingSeats <= 15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.215, 0.61, 0.355, 1] }}
      className="w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-secondary/5 border border-secondary/15 hover:border-accent/50 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Header & Parallax Image */}
        <div className="relative h-60 w-full overflow-hidden bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out transform-gpu"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />

          {/* Category Badge */}
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-accent border border-accent/30 shadow-lg"
          >
            {event.category}
          </motion.div>

          {/* Price Tag with hover pulse */}
          <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-md text-xs font-bold text-white px-3.5 py-1.5 rounded-xl border border-secondary/20 group-hover:border-accent/40 group-hover:scale-105 transition-all duration-300 shadow-md">
            ₹{event.price} onwards
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-3.5 text-white group-hover:text-accent transition-colors leading-snug">
              {event.title}
            </h3>

            <div className="space-y-2.5 mb-6 text-xs text-additional/90">
              <div className="flex items-center gap-2.5">
                <Calendar size={15} className="text-accent shrink-0" />
                <span>{event.date} · {event.time}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-accent shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>

              {/* Spots Left Indicator */}
              <div className={`flex items-center gap-2 font-bold ${isLowSpots ? "text-accent animate-pulse" : "text-additional"}`}>
                <Users size={15} className="shrink-0" />
                <span>
                  {isLowSpots && "⚡ "}
                  {event.remainingSeats} spots left / {event.seats} cap
                </span>
              </div>
            </div>
          </div>

          {/* View Details / Join Waitlist Button */}
          {event.remainingSeats === 0 ? (
            <>
              <button
                ref={buttonRef as any}
                onClick={() => setShowWaitlistModal(true)}
                className="w-full min-h-[48px] py-3.5 bg-accent/20 border border-accent text-accent hover:bg-accent hover:text-primary font-bold rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-md transform-gpu"
              >
                <span>Join Waitlist</span>
                <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <WaitlistModal
                event={event}
                isOpen={showWaitlistModal}
                onClose={() => setShowWaitlistModal(false)}
              />
            </>
          ) : (
            <Link
              ref={buttonRef}
              href={`/events/${event.id}`}
              className="w-full min-h-[48px] py-3.5 bg-secondary text-primary hover:bg-accent hover:text-primary font-bold rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-md transform-gpu"
            >
              <span>View Details</span>
              <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
