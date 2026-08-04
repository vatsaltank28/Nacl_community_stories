"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClickSound: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => { },
  playClickSound: () => { },
});

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Background Audio file (/Background.mp3) and Web Audio API Context
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/Background.mp3");
      audio.loop = true;
      audio.volume = 0.22; // Comfortable low volume: pleasant, non-intrusive
      bgAudioRef.current = audio;

      // Auto-start audio if sound is ON by default
      const startAudio = () => {
        if (bgAudioRef.current && bgAudioRef.current.paused) {
          bgAudioRef.current.play().catch(() => { });
        }
      };

      startAudio();
      window.addEventListener("click", startAudio, { once: true });
    }

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.4, ctx.currentTime);
        masterGain.connect(ctx.destination);

        audioCtxRef.current = ctx;
        masterGainRef.current = masterGain;
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, []);

  // Soothing Click Chime
  const playClickSound = useCallback(() => {
    if (isMuted) return;
    const ctx = ensureAudioContext();
    if (!ctx || !masterGainRef.current) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.3);
  }, [ensureAudioContext, isMuted]);

  // Soothing Scroll Audio Feedback
  const playScrollSound = useCallback(() => {
    if (isMuted) return;
    const ctx = ensureAudioContext();
    if (!ctx || !masterGainRef.current) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    const startFreq = 260 + Math.random() * 120;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 40, now + 0.12);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(500, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.15);
  }, [ensureAudioContext, isMuted]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback(() => {
    ensureAudioContext();

    setIsMuted((prev) => {
      const nextMuted = !prev;
      const bgAudio = bgAudioRef.current;

      if (!nextMuted) {
        if (bgAudio) {
          bgAudio.currentTime = bgAudio.currentTime || 0;
          bgAudio.play().catch((err) => {
            console.log("Audio playback error:", err);
          });
        }
        playClickSound();
      } else {
        if (bgAudio) {
          bgAudio.pause();
        }
      }

      return nextMuted;
    });
  }, [ensureAudioContext, playClickSound]);

  // Event listeners for clicks and scrolling
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended" && !isMuted) {
        audioCtxRef.current.resume();
      }

      if (isMuted) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']")
      ) {
        playClickSound();
      }
    };

    const handleScroll = () => {
      if (isMuted) return;
      if (scrollTimeoutRef.current) return;

      scrollTimeoutRef.current = setTimeout(() => {
        playScrollSound();
        scrollTimeoutRef.current = null;
      }, 160);
    };

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isMuted, playClickSound, playScrollSound]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playClickSound }}>
      {children}
    </SoundContext.Provider>
  );
}
