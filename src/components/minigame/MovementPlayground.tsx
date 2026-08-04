"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sparkles, RefreshCw, Layers } from "lucide-react";

type FlowMode = "mace" | "animal" | "free";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export default function MovementPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<FlowMode>("mace");
  const [isDrawing, setIsDrawing] = useState(false);
  const [clearHovered, setClearHovered] = useState(false);
  const pointsRef = useRef<Point[]>([]);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Update canvas sizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight || 450;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = "rgba(13, 13, 13, 0.15)"; // Soft trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;

      // Update and draw particles
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Mode-specific physics
        if (mode === "mace") {
          // Circular orbits around initial click or mouse position
          const dx = p.x - lastMouseRef.current.x;
          const dy = p.y - lastMouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.vx += (-dy / dist) * 0.15 - dx * 0.002;
          p.vy += (dx / dist) * 0.15 - dy * 0.002;
          p.vx *= 0.98;
          p.vy *= 0.98;
        } else if (mode === "animal") {
          // Low gravity + bounding rebound
          p.vy += 0.05; // Gravity
          p.vx *= 0.99;
          p.vy *= 0.99;
        } else {
          // Free flow friction
          p.vx *= 0.96;
          p.vy *= 0.96;
        }

        p.life -= 0.008;

        if (p.life <= 0) {
          points.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // Draw orbit trails
      if (mode === "mace" && points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 107, 53, 0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < points.length; i++) {
          if (i === 0) ctx.moveTo(points[i].x, points[i].y);
          else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  const addParticles = (x: number, y: number, count = 2) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dx = x - lastMouseRef.current.x;
    const dy = y - lastMouseRef.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    lastMouseRef.current = { x, y };

    let colors = ["#FF6B35", "#F7F5F2", "#FFA382"]; // Accent, Secondary, Lighter accent
    if (mode === "animal") {
      colors = ["#4E6B4E", "#8CA68C", "#F7F5F2"]; // Earthy greens
    } else if (mode === "free") {
      colors = ["#3B82F6", "#818CF8", "#F7F5F2"]; // Flowing blues
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const scatter = mode === "mace" ? 4 : 2;
      const velocityMultiplier = mode === "animal" ? 3 : 1.5;

      pointsRef.current.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.cos(angle) * scatter + dx * 0.1) * velocityMultiplier,
        vy: (Math.sin(angle) * scatter + dy * 0.1) * velocityMultiplier,
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.max(3, Math.min(12, speed * 0.4 + Math.random() * 4))
      });
    }

    // Limit particles density
    if (pointsRef.current.length > 300) {
      pointsRef.current.splice(0, pointsRef.current.length - 300);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing || mode === "mace") {
      addParticles(x, y, mode === "mace" ? 1 : 3);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    addParticles(x, y, 3);
  };

  const clearCanvas = () => {
    pointsRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="relative border border-secondary/10 bg-secondary/5 rounded-3xl overflow-hidden p-6 md:p-8 backdrop-blur-xl flex flex-col h-[500px]" ref={containerRef}>
      {/* Canvas Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 z-10">
        <div>
          <div className="flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-widest mb-1">
            <Activity size={16} className="animate-pulse" />
            <span>Interactive Flow Zone</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Movement Playground</h3>
        </div>

        {/* Style Switches */}
        <div className="flex flex-wrap gap-2 bg-primary/40 p-1 border border-secondary/10 rounded-xl">
          <button
            onClick={() => setMode("mace")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "mace" ? "bg-accent text-primary" : "text-additional hover:text-secondary"
            }`}
          >
            <Sparkles size={12} /> Mace Orbits
          </button>
          <button
            onClick={() => setMode("animal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "animal" ? "bg-accent text-primary" : "text-additional hover:text-secondary"
            }`}
          >
            <Layers size={12} /> Animal Springs
          </button>
          <button
            onClick={() => setMode("free")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "free" ? "bg-accent text-primary" : "text-additional hover:text-secondary"
            }`}
          >
            <Activity size={12} /> Free Flow
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-primary border border-secondary/5 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Interactive Helper Text */}
        <div className="absolute bottom-4 left-4 pointer-events-none text-xs text-additional/40 select-none font-medium">
          {mode === "mace"
            ? "✦ Hover cursor to swing and spin orbits"
            : "✦ Click & drag to project elastic kinetic trails"}
        </div>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          onMouseEnter={() => setClearHovered(true)}
          onMouseLeave={() => setClearHovered(false)}
          className="absolute bottom-4 right-4 bg-primary/80 border border-secondary/10 hover:border-accent p-2 rounded-xl text-additional hover:text-accent transition-colors backdrop-blur-md"
          title="Clear Sandbox"
        >
          <RefreshCw size={16} className={clearHovered ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}
