import React from 'react';

interface PeacockFeatherSvgProps {
  className?: string;
}

export function PeacockFeatherSvg({ className = "w-6 h-6" }: PeacockFeatherSvgProps) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="ময়ূরের পাখা"
    >
      {/* Quill stem */}
      <path 
        d="M10 58C22 46 36 30 52 8" 
        stroke="#92400e" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      {/* Feather vanes - outer emerald green */}
      <path 
        d="M48 12C36 15 26 26 20 40C27 36 38 31 48 12Z" 
        fill="#059669" 
        opacity="0.9" 
      />
      <path 
        d="M52 8C48 22 42 34 28 46C35 39 46 30 52 8Z" 
        fill="#047857" 
        opacity="0.9" 
      />
      {/* Soft feather barb strokes */}
      <path d="M42 16L32 20M46 20L36 26M50 24L40 32" stroke="#10b981" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      {/* Outer Golden / Amber Eye halo */}
      <ellipse 
        cx="41" 
        cy="21" 
        rx="11" 
        ry="13" 
        transform="rotate(32 41 21)" 
        fill="#f59e0b" 
        opacity="0.9"
      />
      {/* Vibrant Cyan / Turquoise ring */}
      <ellipse 
        cx="41" 
        cy="21" 
        rx="8.5" 
        ry="10.5" 
        transform="rotate(32 41 21)" 
        fill="#06b6d4" 
      />
      {/* Deep Royal Midnight Blue / Indigo center */}
      <ellipse 
        cx="41" 
        cy="21" 
        rx="5.5" 
        ry="7" 
        transform="rotate(32 41 21)" 
        fill="#1e3a8a" 
      />
      {/* Golden center shimmer pupil */}
      <ellipse 
        cx="41" 
        cy="21" 
        rx="2.5" 
        ry="3.2" 
        transform="rotate(32 41 21)" 
        fill="#fbbf24" 
      />
    </svg>
  );
}
