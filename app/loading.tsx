"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-obsidian-950">
      {/* Ambient warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-500/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo container with spinning ring */}
      <div className="relative mb-8">
        {/* Pulsing outer ring */}
        <div className="absolute inset-[-12px] rounded-full border-2 border-gold-500/20 animate-pulse-ring" />
        
        {/* Spinning gold ring */}
        <div className="absolute inset-[-8px] rounded-full animate-logo-spin">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#f2e4bf" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="120 170"
            />
          </svg>
        </div>

        {/* Logo circle */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-obsidian-800 to-obsidian-900 border border-gold-500/30 flex items-center justify-center shadow-lg shadow-gold-500/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="JQ BAGS"
            className="w-14 h-14 object-contain rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement("span");
                fallback.className = "font-serif text-xl font-bold text-gold-400";
                fallback.textContent = "JQ";
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
      </div>

      {/* Brand name */}
      <h1
        className="font-serif text-3xl font-bold tracking-[0.3em] mb-2 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
        <span className="gold-shimmer-text">JQ BAGS</span>
      </h1>

      {/* Tagline */}
      <p
        className="text-xs uppercase tracking-[0.35em] text-gold-400/70 font-sans font-light mb-10 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
      >
        Haute Maroquinerie Perlée
      </p>

      {/* Progress bar */}
      <div
        className="w-40 h-[2px] bg-obsidian-800 rounded-full overflow-hidden opacity-0 animate-fade-in-up"
        style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
      >
        <div className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 rounded-full animate-progress-bar" />
      </div>
    </div>
  );
}

