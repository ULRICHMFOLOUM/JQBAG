"use client";

import React, { useEffect, useState, useRef } from "react";

export function LuxuryCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Raw mouse coordinates
  const mousePos = useRef({ x: -100, y: -100 });
  // Interpolated coordinates for smooth trailing
  const ringPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer")
        );
        setHovered(isInteractive);
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Ultra-smooth 60-120fps RAF lerp loop
    let rafId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      // Smooth interpolation for the follower ring (factor: 0.16)
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.16);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.16);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Outer Golden Aura Ring with Spring Lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <div
          className={`rounded-full border transition-all duration-300 ease-out flex items-center justify-center ${
            hovered
              ? "w-14 h-14 border-gold-400 bg-gold-500/15 backdrop-blur-[1px] shadow-lg shadow-gold-500/25 scale-110"
              : clicked
              ? "w-8 h-8 border-gold-300/80 bg-gold-400/20 scale-90"
              : "w-9 h-9 border-gold-400/50 bg-gold-500/5 shadow-sm shadow-gold-500/10"
          }`}
        >
          {/* Subtle spinning diamond star when hovered */}
          {hovered && (
            <div className="w-1.5 h-1.5 bg-gold-300 rotate-45 rounded-[1px] animate-ping" />
          )}
        </div>
      </div>

      {/* Central Sharp Golden Pearl Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <div
          className={`rounded-full bg-gradient-to-br from-white via-gold-300 to-gold-500 shadow-md shadow-gold-500/60 transition-transform duration-150 ${
            hovered ? "w-1.5 h-1.5 scale-75 opacity-70" : clicked ? "w-2.5 h-2.5 scale-125" : "w-2 h-2"
          }`}
        />
      </div>
    </div>
  );
}

