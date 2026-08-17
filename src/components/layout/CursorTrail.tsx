"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;

    const render = () => {
      // Clear the canvas each frame. Since the canvas is transparent,
      // we only draw particles with their respective opacity, preserving page background underneath.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Apply friction
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Apply slight float up
        p.vy -= 0.02;

        p.life -= 0.02; // fade rate (slightly faster than playground for responsiveness)

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset blur
      }
      ctx.globalAlpha = 1.0; // Reset global alpha

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const addParticles = (x: number, y: number, count = 2) => {
      const dx = x - lastMouseRef.current.x;
      const dy = y - lastMouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      lastMouseRef.current = { x, y };

      const colors = ["#ef542a", "#f0f2db", "#ffd139", "#aadeef"];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const scatter = 1.0;

        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * scatter + dx * 0.08,
          vy: Math.sin(angle) * scatter + dy * 0.08,
          life: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          // Smaller sizes than playground (from 1px to 4px max)
          size: Math.max(1.2, Math.min(4, speed * 0.15 + Math.random() * 2))
        });
      }

      if (particlesRef.current.length > 100) {
        particlesRef.current.splice(0, particlesRef.current.length - 100);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      addParticles(e.clientX, e.clientY, 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] block"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
