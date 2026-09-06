import React from 'react';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo3D: React.FC<Logo3DProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`relative group flex items-center justify-center ${className}`}>
      {/* Subtle warm amber ambient glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-amber-400/40 to-amber-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Minimalist Professional Matte Black & Gold Emblem */}
      <div
        className={`relative ${sizeClasses[size]} rounded-xl bg-zinc-950 border border-amber-500/30 group-hover:border-amber-400/70 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden`}
      >
        {/* Subtle diagonal sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none" />

        {/* Minimalist Vector Monogram "M" for Mahim (Graphic Designer geometric style) */}
        <svg
          viewBox="0 0 32 32"
          className="w-5/6 h-5/6 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="minimalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Clean architectural Monogram lines */}
          {/* Left vertical pillar */}
          <path
            d="M7 23V9L11 9V23H7Z"
            fill="url(#minimalGoldGrad)"
          />
          {/* Right vertical pillar */}
          <path
            d="M21 23V9L25 9V23H21Z"
            fill="url(#minimalGoldGrad)"
          />
          {/* Central diagonal apex chevron */}
          <path
            d="M11 9L16 16.5L21 9H17.8L16 12L14.2 9H11Z"
            fill="#FFFFFF"
          />
          {/* Precision Pen Tool / Bezier Golden Node */}
          <circle
            cx="16"
            cy="19"
            r="1.75"
            fill="#F59E0B"
          />
        </svg>
      </div>
    </div>
  );
};

